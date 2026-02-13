# Piano Di Azione: Migrazione A Firebase App Hosting (Next.js Full-Stack)

Obiettivo: migrare l'app Next.js full-stack (SSR/RSC + Route Handlers `/app/api`) dall'attuale deploy via Firebase Hosting `frameworksBackend` (preview) a Firebase App Hosting, per rendere build/runtime e packaging piu' prevedibili e robusti.

Contesto attuale (repo):
- Deploy staging/prod via `scripts/deploy-hosting-target.sh` con `firebase deploy --only hosting` e due config (`firebase.json`, `firebase.development.json`).
- Next build con Turbopack (`npm run build` -> `next build --turbopack`).
- `output: 'standalone'` in `next.config.js` per ridurre bundle e migliorare portabilita'.
- Backend "server" oggi gestito da Hosting `frameworksBackend`.

## Decisioni Confermate
- Topologia: 1 Firebase project con 2 backend App Hosting (`test` e `prod`).
- Branch mapping: `pre_release` -> test, `master` -> prod.
- Runtime baseline: `region=europe-west4`, `memory=1GiB`, `minInstances=0`, `maxInstances=10`, `concurrency=100`.
- Build engine: Turbopack attivo.
- Runbook operativo: `docs/app-hosting-runbook.md`.

## Principi (non negoziabili)
- 2 ambienti sempre disponibili: `test/staging` e `prod`.
- Segreti e integrazioni esterne separati per ambiente (mai "prod secrets" in test).
- Parita' funzionale: SSR/RSC, `/app/api/*`, PWA `/learn` (manifest + SW) devono rimanere stabili.
- Rollback semplice: tornare a una revisione precedente deve essere un'azione standard.
- Librerie robuste: dipendenze, bundling e native modules devono essere deterministici e ripetibili in build e runtime.

## Strategia Librerie & Packaging (robusta)
Obiettivo: eliminare classi di errori tipo "works locally, fails in deploy" dovuti a build non deterministiche, side effects a import-time, o mismatch tra bundling e runtime.

Regole pratiche:
- Lockfile come sorgente di verita': `package-lock.json` sempre aggiornato, deploy sempre con `npm ci`.
- Node runtime allineato tra local/CI/runtime: una versione supportata e documentata (evitare drift).
- Zero side effects a import-time per SDK che richiedono segreti o network:
  - pattern preferito: lazy init (creare client solo dentro la funzione che lo usa) + fallback sicuro se env mancante.
- Native deps (es. `sharp`): costruire e testare in un ambiente Linux compatibile con Cloud Run (App Hosting), non solo su macOS.
- Externalization/bundling espliciti: minimizzare pacchetti "externalizzati" sul server se storicamente fragili (es. SDK admin) e validare in staging.
- Dipendenze "preview/alpha" solo se isolate e giustificate; preferire SDK stabili e adapter ufficiali.

Checklist packaging:
- `npm ci && npm run typecheck && npm run build` produce output ripetibile.
- Route critiche importano SDK in modo lazy e non crashano per env mancanti.
- `sharp` e altre native deps funzionano in runtime (smoke su staging).
- Nessun artifact di build (es. `.next`, `.firebase`) entra nella suite di test.

## Fase 0: Decisioni Di Prodotto (30-60 min)
1. Configurare 2 backend App Hosting nello stesso Firebase project:
   - backend test collegato a branch `pre_release`
   - backend prod collegato a branch `master`
2. Definire domini:
   - prod: `staituned.com` (o attuale)
   - test: `staging.staituned.com` / `dev.staituned.com`

Deliverable:
- Nota in `spec_dev.md` per la migrazione (deploy targets + rollback).

## Fase 1: Inventario Tecnico (mezza giornata)
1. Catalogare le integrazioni runtime/build che richiedono segreti:
   - `firebase-admin` (service account / ADC)
   - Google APIs / Gemini / OpenAI
   - Resend
   - Stripe/PayPal (se presenti)
   - Slack webhook, Telegram bot
2. Catalogare dipendenze "native" e requisiti runtime:
   - `sharp` (native bindings)
3. Catalogare i punti critici di packaging gia' emersi:
   - moduli esterni hashati / resolution fragile (es. `firebase-admin-<hash>`)
   - file tracing/standalone behavior
4. Definire smoke test minimi (vedi Fase 6) da usare identici in test e prod.

Deliverable:
- Lista segreti per ambiente (TBD values) + owners.
- Lista "route critiche" (SSR + API) per smoke.

## Fase 2: Preparazione Repo Per App Hosting (mezza giornata)
1. Stabilizzare build deterministica in CI:
   - garantire `npm ci` + `npm run typecheck` + `npm run build` funzionino senza dipendere da file locali.
2. Verificare che `next.config.js` non faccia assunzioni "Hosting frameworks preview":
   - confermare che `output: 'standalone'` sia compatibile con App Hosting (TBD).
   - mantenere Turbopack attivo e validare packaging su backend test.
3. Separare chiaramente config per ambiente:
   - evitare che `.env*` serva a produzione.
   - documentare quali variabili sono `BUILD` vs `RUNTIME`.
4. Hardening librerie:
   - applicare le regole della sezione "Strategia Librerie & Packaging (robusta)".
   - isolare i client di terze parti (Resend/Stripe/OpenAI/Slack/Telegram) con lazy init e mocking nei test.
   - validare native deps (es. `sharp`) in un ambiente Linux.

Deliverable:
- Checklist "build green" in pipeline.

## Fase 3: Bootstrap App Hosting (1 giornata)
1. Creare backend App Hosting per `test` e `prod` (vedi Fase 0).
2. Collegare repo GitHub e abilitare deploy automatico per branch.
3. Impostare runtime config iniziale prendendo come baseline `frameworksBackend`:
   - region: `europe-west4`
   - concurrency: `100`
   - memory: `1GiB`
   - timeoutSeconds: `60`
   - minInstances: `0`
   - maxInstances: `10`
4. Definire regole di rollout e rollback:
   - promozione in prod solo se smoke test passa su test.

Deliverable:
- App Hosting live su URL di test.

## Fase 4: Segreti E Variabili (1 giornata)
1. Spostare segreti in Secret Manager (per backend/environment).
2. Dichiarare variabili con scope:
   - `BUILD` se influisce sul build (es. `NEXT_PUBLIC_*` non deve essere secret).
   - `RUNTIME` per token e credenziali server.
3. Verificare che le route che usano segreti falliscano in modo sicuro quando mancano:
   - nessun crash "import-time" per client esterni (pattern lazy init).

Deliverable:
- Matrice segreti per ambiente + procedura di rotazione.

## Fase 5: Networking, Headers, PWA (mezza giornata)
1. Verificare che i requisiti PWA `/learn` rimangano:
   - service worker scope e update behavior
   - manifest learn-scoped
2. Replicare comportamento headers/caching:
   - oggi una parte e' in `firebase*.json` e una in `next.config.js` (`headers()`).
   - in App Hosting, rendere esplicito quali headers restano gestiti da Next vs piattaforma.
3. Validare che `/sw.js` e `/sw-learn.js` funzionino come prima (no cache, scope corretto).

Deliverable:
- Checklist PWA superata su test.

## Fase 6: Test & Smoke (mezza giornata)
1. Aggiungere/standardizzare test backend su route critiche:
   - `/app/api/feedbacks`
   - `/app/api/user/writer-profile`
   - altre route con segreti (Resend, admin, analytics) con mocking/guards.
2. Definire smoke test manuale (5-10 min) post-deploy:
   - homepage SSR + una pagina `/learn`
   - una route `/app/api/*` pubblica e una autenticata (se possibile)
   - verifica cache headers principali e SW.

Deliverable:
- Documento "Smoke Checklist" (puo' vivere in `docs/deployments.md`).

## Fase 7: Cutover Progressivo (1-2 giorni)
1. Eseguire deploy App Hosting su `test` e confrontare comportamento vs hosting preview:
   - routing, SSR, API, immagini, upload, streaming
2. Sistemare differenze (solo regressioni, niente refactor estetici).
3. Cutover prod:
   - finestra di rilascio
   - rollback pronto (tornare a hosting preview o revision precedente App Hosting)
4. Monitor (prime 24h):
   - error rate, cold start, timeouts, memory.

Deliverable:
- Prod su App Hosting con rollback testato.

## Fase 8: Pulizia & Hardening (mezza giornata)
1. Decommission vecchio deploy:
   - rimuovere dipendenza da `frameworksBackend` in `firebase*.json` quando non serve piu'.
   - aggiornare `scripts/deploy-hosting-target.sh` o sostituirlo con script App Hosting.
2. Aggiornare docs:
   - `docs/deployments.md`
   - `AGENTS.md` (se cambia runbook)
3. Budget & scaling tuning:
   - definire `minInstances` per ridurre cold start solo dove serve (prod).

## Rischi Noti (da tracciare esplicitamente)
- Differenze di caching/headers tra Hosting e App Hosting.
- Dipendenze native (`sharp`) e compatibilita' build/runtime.
- Variabili `NEXT_PUBLIC_*` che finiscono client-side: non devono contenere segreti.
- Qualsiasi integrazione che fallisce per mancanza segreti deve degradare in modo sicuro.

## "Definition Of Done" Migrazione
- Test e prod deployabili con branch mapping chiaro.
- Route SSR/RSC e `/app/api/*` senza regressioni.
- Segreti isolati e documentati (build vs runtime).
- Smoke checklist ripetibile e rollback documentato.
