# Piano di regolarizzazione GDPR

Data: 2026-03-22

Fonte: [docs/gdpr-audit-webapp-2026-03-22.md](docs/gdpr-audit-webapp-2026-03-22.md)

Obiettivo: regolarizzare tutti i rilievi classificati `Critico` o `Alto` nell'audit GDPR della webapp, con priorita a blocco del rischio, riallineamento codice-policy e introduzione di controlli strutturali riusabili.

## Tracking operativo

Ultimo aggiornamento: 2026-03-22

### Workstream 1 - Analytics e consenso cookie

Stato: `Chiuso (implementazione tecnica completata)`

Fatto:
- rimosso il bypass del consenso in Google Analytics (`FORCE_ANALYTICS_ENABLED`);
- mantenuto GA solo opt-in;
- aggiornato il tracker pageview per inviare GA pageview su navigazione solo con consenso;
- introdotto tracking first-party delle views per articoli `/learn/*` via `sendBeacon`/`keepalive`;
- introdotto endpoint server first-party dedicato che incrementa `articles.pageViews` su Firestore;
- aggiunti filtri base lato server per `prefetch` e user-agent bot;
- esclusi slug non pubblicati/non validi dal conteggio.
- aggiunta deduplica breve lato server (finestra 30s) su coppia `ip+slug` per ridurre spam/replay;
- aggiunti test automatici su tracker client e route server first-party;
- aggiornate privacy/cookie policy `it/en` con modello "GA solo dopo consenso + page view counter first-party separato".
- avviata transizione metrica view:
  - campo canonico: `pageViewsFirstParty`
  - fallback legacy dismesso nei resolver;
  - job GA non scrive piu page view articolo nei documenti `articles/*`.
- lettori analytics aggiornati per usare solo `pageViewsFirstParty`.
- endpoint `/api/analytics` (lista articoli) aggiornato per leggere le view da `articles/*` first-party invece di dipendere da `analytics/daily.articlesStats.pageViews`.
- backfill iniziale `pageViewsFirstParty` eseguito su produzione:
  - dry-run pre-apply: `scanned 201`, `to_update 129`
  - apply: `committed updates 129`
  - dry-run post-apply: `to_update 0`, `already_aligned 129`.
- guardrail ambiente applicato:
  - incremento view first-party consentito solo su host di produzione;
  - richieste da localhost/non-prod scartate con `non_production_origin`.
  - host consentiti configurabili via env `PAGE_VIEW_ALLOWED_HOSTS` (CSV), con fallback a dominio produzione.
- hardening operativo rollout App Hosting:
  - `scripts/apphosting-rollout.sh` ora gestisce automaticamente `HTTP 409 unable to queue the operation` con retry/backoff configurabile (`APPHOSTING_ROLLOUT_MAX_RETRIES`, `APPHOSTING_ROLLOUT_RETRY_DELAY_SECONDS`).

Follow-up post-chiusura (non bloccanti):
- monitorare 7-14 giorni la stabilita di `pageViewsFirstParty` come unico contatore operativo;
- completare rollout App Hosting su target `test` e poi `prod` dopo coda libera del backend;
- validazione finale Legal del testo policy (governance/documentazione, non blocco tecnico);
- valutare hardening successivo della deduplica (rate limit distribuito) solo se emergono segnali di abuso in produzione.

Decisione di chiusura:
- requisito critico GDPR del workstream (`analytics non essenziali solo opt-in`) soddisfatto;
- conteggio views articolo mantenuto con modello first-party separato da GA;
- transizione metrica completata su `pageViewsFirstParty` con backfill eseguito;
- test automatici su tracker/route presenti e passati durante la lavorazione.

### Workstream 2 - Dismissione newsletter e CTA topics

Stato: `In corso (implementazione tecnica quasi completata)`

Decisione:
- rimuovere completamente la newsletter (raccolta email marketing dismessa);
- sostituire la CTA newsletter con CTA di navigazione verso hub topics articoli: `/topics`.

Fatto:
- scelta strategica confermata: eliminazione del trattamento newsletter invece di hardening consenso/revoca.
- sostituita CTA newsletter con CTA verso `/topics` su superfici principali:
  - home mid-section (`components/home/HomePageClient.tsx`);
  - footer (`components/layout/Footer.tsx`);
  - fallback CTA in pagina demo (`app/(public)/demo/page.tsx`).
- aggiornati copy bilingui `it/en` per CTA e messaggi collegati (`lib/i18n/home-translations.ts`).
- endpoint newsletter dismesso con risposta esplicita `410` (`app/api/newsletter/subscribe/route.ts`).
- rimossi componenti UI newsletter non piu utilizzati:
  - `components/ui/NewsletterModal.tsx`
  - `components/ui/NewsletterSignup.tsx`
- rimosso servizio email newsletter legacy (`lib/email/newsletterEmail.ts`).
- rimosse funzioni analytics dedicate alla newsletter (`lib/analytics/trackEvent.ts`, `lib/analytics/index.ts`).
- allineati testi legali `it/en` per assenza newsletter marketing attiva (`lib/i18n/legal-translations.ts`).
- allineati testi editoriali di distribuzione verso `topics hub` (learn/contribute).
- gate GDPR formale aggiornato a `approved` con checklist compilata (`docs/gdpr-feature-checklist.md`).
- creato runbook operativo di decommission (`docs/runbooks/newsletter-decommission.md`).
- introdotto script operativo con safeguard per dry-run/apply hard delete + evidenza minima:
  - `scripts/decommission-newsletter-subscribers.ts`
- test route newsletter aggiunto (`app/api/newsletter/subscribe/route.test.ts`) per contratto `410 newsletter_dismissed`.
- documentazione audit marcata con nota storica per riferimenti newsletter pre-remediation (`docs/gdpr-audit-webapp-2026-03-22.md`).
- script newsletter legacy dismessi/deprecati dal flusso operativo (`scripts/debug-newsletter.ts`, `scripts/debug-newsletter.js`, `scripts/check-firestore.js`, `scripts/debug_subs.js` rimosso).

Rimane da fare:
- eseguire in produzione lo script `--apply` per hard delete dataset `newsletter_subscribers`;
- verificare post-delete `documentsFound = 0` con dry-run e controllare evidenza minima salvata;
- completare test regressione end-to-end sulle pagine pubbliche principali (assenza CTA/form newsletter residui).

### Workstream 3 - Role Fit Audit conforme e ridotto nel rischio

Stato: `In corso (hardening implementato, in attesa rollout e monitoraggio)`

Decisione:
- adottata `Strategia A` (hardening completo mantenendo il prodotto live).

Fatto:
- enforcement consenso privacy lato server su submit audit (`acceptedPrivacy` obbligatorio);
- payload client submit allineato con `acceptedPrivacy`;
- persistenza Firestore estesa con campi compliance:
  - `status`
  - `retentionUntil` (12 mesi)
  - `consent.privacy.*`
  - `consent.marketing.requested`
  - `privacyVersion`
  - `dataMinimizationVersion`
- notifiche Telegram ridotte a metadata-only (niente email/nome/link/risposte/paypal);
- invio report email senza CC interno completo;
- introdotto alert interno separato metadata-only per tracking operativo;
- admin API/UI estesi con campi compliance e filtro base `expiring soon`.
- checklist GDPR WS3 aggiornata a `approved` (`docs/gdpr-feature-checklist.md`);
- screening DPIA interno creato (`docs/dpia-screening-role-fit-audit.md`);
- test WS3 aggiunti/aggiornati:
  - API submit: enforcement `acceptedPrivacy` + campi compliance + telegram metadata-only;
  - email report: assenza `cc` interno + alert metadata-only separato.
- verifiche tecniche eseguite con esito positivo:
  - `npm run lint`
  - `npm run typecheck`
  - `pnpm exec vitest run app/api/role-fit-audit/submit/route.test.ts lib/email/roleFitAuditEmail.test.ts`

Rimane da fare:
- eseguire rollout + monitoraggio 7 giorni.

### Workstream 4 - Trasparenza e documentazione

Stato: `Chiuso (Strategia A + C completate)`

Decisione:
- adottata combinazione `Strategia A` (repo-driven) + `Strategia C` (layered notices sui form a rischio).

Fatto:
- creato inventario trattamenti repo-driven: `docs/privacy-processing-inventory.md`;
- creato changelog compliance: `docs/compliance-changelog.md`;
- estesa skill unica GDPR `gdpr-feature-gate` con workflow WS4 repo-driven, output standard ed enforcement bloccante su PR privacy-related;
- aggiornato legal copy `it/en` per provider pagamenti reali (`Stripe, PayPal`);
- aggiunto notice contestuale privacy nel flusso waitlist Career OS (`it/en`);
- pubblicati artefatti compliance nel nuovo hub admin `/admin/compliance`.
- evidenza commit WS4: `4ffbc99` (`chore(gdpr): close ws4 transparency gate and repo-driven governance`).

Rimane da fare:
- nessun task WS4 aperto.
- i temi di standardizzazione tecnica retention rimasti sono formalmente delegati a WS5.

### Workstream 5 - Retention, cancellazione e lifecycle dei dataset

Stato: `In corso (Strategia A MVP avviata)`

Decisione:
- adottata `Strategia A` in modalita MVP strutturale con purge default `hard_delete`.

Fatto:
- introdotto contratto retention condiviso:
  - `lib/privacy/retention.ts`
- introdotta policy map dataset:
  - `lib/privacy/retention-policies.ts`
- creato job lifecycle retention:
  - `scripts/retention-lifecycle.ts` (`--dry-run`, `--apply`, `--dataset`, `--batch-size`, `--env`, `--project`)
- introdotto script operativo backfill metadata legacy:
  - `scripts/backfill-retention-metadata.ts`
  - evidenza commit: `c8b814e` (`chore(gdpr): add ws5 retention metadata backfill script`)
- standardizzata metadata retention (`retentionUntil`, lifecycle fields) nei dataset MVP:
  - `role_fit_audit_submissions`
  - `career_os_waitlist`
  - `business_demo_requests`
  - `contact_requests`
  - `feedback_submissions`
  - `contributor_applications`
- creati artefatti WS5:
  - `docs/privacy-retention-schedule.md`
  - `docs/runbooks/retention-lifecycle.md`
  - review WS5 `in-review` su `docs/gdpr-feature-checklist.md`.
- esecuzioni operative completate:
  - dry-run retention test/prod: `expiredCount=0`
  - backfill legacy metadata in test: `role_fit_audit_submissions=20`, `career_os_waitlist=1`, `contributor_applications=1`
  - dry-run post-backfill: `missingRetentionCount=0` su tutti i dataset

Rimane da fare:
- pianificare run prod controllata + monitor 7 giorni;
- eseguire prima run `apply` retention quando esistono record `expired` (attualmente nessuno);
- chiudere review WS5 (`in-review -> approved`) dopo esecuzioni operative.

### Workstream 6 - Minimizzazione dei dati verso canali terzi e interni

Stato: `Non avviato`

Ambito di questo piano:
- P1 `Critico`: consenso analytics
- P2 `Alto`: newsletter
- P3 `Alto`: Role Fit Audit
- P4 `Alto`: informative non aderenti al codice
- P5 `Alto`: retention e cancellazione non uniformi
- P6 `Alto`: dati personali replicati su Telegram, Slack e inbox interne

Fuori ambito di questo piano:
- rischi `Medio` e `Basso`, da trattare in una wave successiva;
- revisione legale formale del testo policy, che resta comunque raccomandata a valle delle modifiche.

## Principi di esecuzione

1. Bloccare prima i trattamenti non difendibili.
2. Usare come baseline il pattern migliore gia presente nel repo: `Career OS waitlist`.
3. Non correggere solo i testi legali: codice, dati persistiti, notifiche e policy devono convergere.
4. Ogni remediation deve chiudersi con:
   - modifica tecnica;
   - aggiornamento documentale;
   - test o verifica ripetibile;
   - criterio di done esplicito.

## Come scegliere la strategia

Per ogni workstream sono indicate piu strategie di mitigazione:
- `Strategia A`: intervento strutturale, piu robusto, piu costoso;
- `Strategia B`: compromesso intermedio, utile se serve ridurre rischio in tempi rapidi;
- `Strategia C`: misura conservativa o temporanea, utile per containment o se il team non puo intervenire subito in profondita.

Quando indicato, la strategia raccomandata e quella che porta il rapporto migliore tra rischio residuo, difendibilita GDPR e sforzo tecnico.

## Sequenza consigliata

### Fase 0. Containment immediato

Tempo: 1-3 giorni

Obiettivo: interrompere i trattamenti con rischio normativo immediato e ridurre la replica non necessaria dei dati.

Azioni:
- rimuovere il forcing di Google Analytics e renderlo realmente opt-in;
- sospendere temporaneamente eventuali invii superflui di dati personali a Telegram, Slack, CC/BCC interni dove non indispensabili;
- chiudere in produzione eventuali endpoint/debug path che aumentano l'esposizione;
- congelare nuove feature che introducono form, tracking o log personal data finche non adottano il modello di consenso/retention.

Deliverable:
- fix applicativo sul gating analytics;
- config o patch di riduzione notifiche personali;
- decisione scritta su quali canali interni possono ricevere dati personali e quali no.

Done:
- nessuno script analytics si carica senza consenso;
- i payload operativi inviati a terzi sono minimizzati o disattivati;
- non restano endpoint debug pubblici utili a esporre meta-dati.

### Fase 1. Riallineamento legale-tecnico

Tempo: 3-7 giorni

Obiettivo: fare in modo che cio che il sito dichiara sia vero nel codice e nei flussi reali.

Azioni:
- aggiornare Privacy Policy e Cookie Policy in base ai trattamenti effettivi;
- mappare tutti i fornitori terzi effettivamente presenti nel codice:
  - Firebase / Firestore / Auth / FCM
  - Google Analytics
  - Google Gemini
  - Perplexity
  - Resend
  - Telegram
  - Slack
  - Calendly
  - PayPal
  - Google Fonts
- distinguere per ciascun flusso:
  - dati raccolti
  - finalita
  - base giuridica
  - retention
  - destinatari
  - canali di revoca/opposizione
- allineare testi bilingui `it/en`.

Deliverable:
- policy aggiornate;
- tabella trattamenti sintetica interna;
- changelog policy con data di aggiornamento.

Done:
- nessun trattamento `Critico` o `Alto` resta non descritto o descritto in modo errato;
- i testi legali corrispondono ai flussi realmente implementati.

## Workstream 1. Analytics e consenso cookie

Priorita: Massima
Rischio coperto: P1 `Critico`

### Obiettivo

Garantire che analytics e tracking non essenziali siano bloccati fino a consenso esplicito, con stato di consenso verificabile e coerente con la policy.

### Strategie di mitigazione

#### Strategia A. Opt-in forte e centralizzato

- blocco totale di GA e di ogni telemetria non essenziale fino a consenso;
- una sola sorgente di verita per lo stato del consenso;
- test automatici sul gating.

Pro:
- e la soluzione piu difendibile;
- elimina il mismatch tra banner, policy e runtime.

Contro:
- richiede revisione completa di tutti i punti che emettono tracking.

#### Strategia B. Spegnimento temporaneo analytics

- rimuovere del tutto GA finche il modello di consenso non e corretto;
- lasciare solo log tecnici strettamente necessari.

Pro:
- containment immediato;
- rischio normativo quasi azzerato nell'immediato.

Contro:
- perdita di osservabilita marketing/prodotto;
- non costruisce il modello definitivo.

#### Strategia C. Sostituzione con misurazione aggregata privacy-first

- rimuovere GA e passare a misurazioni aggregate senza cookie o con fingerprinting escluso;
- raccogliere solo metriche minime aggregate.

Pro:
- riduce la dipendenza da consenso per analytics invasivi;
- semplifica la compliance.

Contro:
- richiede redesign dell'analytics stack;
- potrebbe non coprire i casi d'uso esistenti.

Raccomandazione:
- adottare subito `Strategia B` come containment se serve rapidita assoluta;
- eseguire poi `Strategia A` come soluzione target;
- valutare `Strategia C` se l'obiettivo prodotto richiede il conteggio delle view anche senza consenso, ma senza usare Google Analytics.

### Interventi tecnici

- rimuovere `FORCE_ANALYTICS_ENABLED` da `components/GoogleAnalytics.tsx`;
- centralizzare la logica `canTrackAnalytics()` in un solo punto applicativo;
- verificare che:
  - script `gtag.js` non venga caricato senza consenso;
  - `window['ga-disable-...']` resti coerente in ogni stato;
  - page view ed eventi custom non partano prima del consenso;
- separare in modo netto:
  - cookie strettamente necessari
  - analytics
  - eventuali performance metrics client-side
- se serve contare le page view anche senza consenso, introdurre un `first-party page counter` separato da GA:
  - endpoint dedicato, ad esempio `POST /api/page-views`
  - invio client con `navigator.sendBeacon()` o `fetch(..., { keepalive: true })`
  - payload minimale: `slug` o `path`
  - nessun cookie
  - nessun localStorage
  - nessun user ID
  - nessuna correlazione con marketing analytics o profili utente
  - filtraggio bot/prefetch lato server
  - persistenza aggregata su Firestore, ad esempio in `articles.pageViews` o in una collection giornaliera da materializzare
- se presenti altre telemetrie client, assoggettarle alla stessa matrice di consenso.

### Artefatti/documenti da creare o aggiornare

- Cookie Policy
- Privacy Policy
- nota tecnica sul modello di consenso cookie

### Test/verifiche

- test client: primo load senza consenso -> nessuno script analytics;
- test client: accettazione analytics -> script caricato ed eventi abilitati;
- test client: rifiuto analytics -> tracking sempre disabilitato;
- test page counter first-party: page load senza consenso -> beacon inviato solo all'endpoint first-party, nessuna chiamata GA;
- test caching: il beacon non altera la cache della pagina e l'endpoint risponde `no-store`;
- test bot/prefetch filtering sull'endpoint di conteggio;
- verifica manuale con DevTools network e storage.

### Criterio di chiusura

- analytics e davvero opt-in;
- il comportamento del banner coincide con il testo di policy;
- esiste una prova tecnica ripetibile del blocco pre-consenso.

## Workstream 2. Dismissione newsletter e CTA topics

Priorita: Massima
Rischio coperto: P2 `Alto`

### Obiettivo

Eliminare il trattamento newsletter marketing e sostituire la conversione con una CTA editoriale privacy-light verso l'indice degli argomenti.

### Strategie di mitigazione

#### Strategia A. Hardening newsletter (double opt-in completo)

- introdurre stato `pending_confirmation`;
- conferma email obbligatoria prima dell'attivazione;
- prova del consenso con versione policy, timestamp e source;
- unsubscribe strutturato e retention definita.

Pro:
- e lo standard piu solido lato accountability;
- riduce contestazioni su iscrizioni non volute.

Contro:
- richiede redesign del flusso e template email aggiuntivi.

#### Strategia B. Hardening newsletter (single opt-in rinforzato)

- mantenere l'iscrizione immediata;
- salvare prova del consenso server-side;
- aggiungere unsubscribe endpoint e retention;
- inviare email di benvenuto con audit trail, senza conferma separata.

Pro:
- piu veloce da implementare;
- migliora molto lo stato attuale.

Contro:
- meno robusto del double opt-in in caso di reclamo.

#### Strategia C. Dismissione newsletter + CTA alternativa (Scelta)

- rimuovere la raccolta newsletter dal sito;
- eliminare i punti di ingresso (form, endpoint, automazioni);
- sostituire le CTA newsletter con CTA a valore contenuto: `Esplora i topic` verso `/topics`;
- mantenere conversione su navigazione contenuti senza nuovo trattamento dati personali marketing.

Pro:
- massima riduzione del rischio GDPR (si elimina il trattamento);
- implementazione piu rapida e con meno superficie operativa;
- mantiene utilita prodotto tramite discovery dei contenuti.

Contro:
- perdita del canale newsletter come leva CRM;
- richiede riallineare KPI da lead capture a engagement contenuti.

Raccomandazione:
- adottare `Strategia C` come scelta definitiva per questo ciclo.

### Interventi tecnici

- sostituire in UI ogni CTA newsletter con CTA topics (`/topics`) in entrambi i locali `it/en`;
- aggiornare copy e tracking event associati alla nuova CTA (niente eventi marketing basati su email);
- disattivare/rimuovere endpoint newsletter e relative integrazioni terze;
- verificare che non esistano cron/job o funzioni che processano liste newsletter;
- valutare cleanup controllato del dataset `newsletter_subscribers` secondo policy retention/cancellazione.

### Artefatti/documenti da creare o aggiornare

- privacy policy: rimozione sezione newsletter (o marcatura come dismessa);
- eventuale changelog prodotto: sostituzione CTA newsletter con hub topics;
- runbook operativo per dismissione dataset newsletter (se presente storico).

### Test/verifiche

- test UI: CTA `Esplora i topic` / `Explore topics` porta correttamente a `/topics`;
- test regressione: assenza di form newsletter su pagine pubbliche previste;
- test API: endpoint newsletter non raggiungibile o dismesso in modo esplicito;
- verifica contenuti legali `it/en` coerenti con assenza del trattamento newsletter.

### Criterio di chiusura

- nessuna nuova iscrizione newsletter possibile dal frontend;
- nessun endpoint/automazione newsletter attivo in produzione;
- CTA sostitutiva verso `/topics` attiva e bilingue;
- policy aggiornata coerente con la rimozione del trattamento.

## Workstream 3. Role Fit Audit conforme e ridotto nel rischio

Priorita: Massima
Rischio coperto: P3 `Alto`

### Obiettivo

Mantenere il prodotto, ma renderlo privacy-defendable: consenso valido, disclosure chiara, minimizzazione dei canali interni, retention definita e screening DPIA.

### Strategie di mitigazione

#### Strategia A. Hardening completo mantenendo il prodotto live

- consenso privacy valido client + server;
- dataset persistito minimizzato;
- retention e cancellazione;
- disclosure AI completa;
- screening DPIA;
- notifiche interne ridotte al minimo.

Pro:
- mantiene il prodotto e lo rende molto piu difendibile;
- crea uno standard riutilizzabile per futuri assessment AI.

Contro:
- e il workstream piu costoso e trasversale.

#### Strategia B. Modalita ridotta senza persistenza forte

- il report viene generato e inviato all'utente;
- si evita o si riduce drasticamente la persistenza di `answers` e risultati;
- niente Telegram/CC con dati personali;
- si conserva solo audit trail minimo.

Pro:
- riduce molto il rischio privacy e il perimetro dati;
- puo essere implementata senza bloccare del tutto il prodotto.

Contro:
- riduce valore analitico interno e possibilita di follow-up data-driven.

#### Strategia C. Sospensione temporanea del servizio

- mettere offline il Role Fit Audit finche consenso, policy e screening DPIA non sono pronti.

Pro:
- azzera il rischio operativo di un flusso oggi sensibile;
- evita accumulo di dati ad alto impatto.

Contro:
- impatto business e prodotto molto alto;
- blocca acquisizione lead e reportistica.

Raccomandazione:
- `Strategia B` se vuoi abbassare subito il rischio senza spegnere il prodotto;
- `Strategia A` come stato target;
- `Strategia C` solo se emerge che non c'e tempo per una messa in sicurezza minima.

### Interventi tecnici

- includere `acceptedPrivacy` nel payload frontend e validarlo lato server;
- salvare anche per questo flusso:
  - versione policy
  - timestamp accettazione
  - retention
  - stato marketing separato
- rivedere il dataset persistito:
  - valutare se serva davvero salvare tutte le `answers` raw;
  - valutare se bastino `answersText` o una forma ridotta;
  - ridurre i dati trasmessi a Telegram;
- rimuovere il CC automatico a `info@staituned.com` oppure limitarlo a eventi interni senza dati completi;
- chiarire il ruolo del `paypalOrderId` e la base giuridica del flusso;
- aggiungere flag di cancellazione/anonymization a fine retention;
- definire se il report AI e solo supportivo o se genera effetti rilevanti sull'utente; da qui discende la profondita della valutazione art. 22.

### Artefatti/documenti da creare o aggiornare

- DPIA screening per Role Fit Audit
- privacy policy con sezione dedicata al trattamento e ai provider AI
- schema dati e retention del flusso
- nota interna su accesso amministrativo al risultato audit

### Test/verifiche

- test UI/API: submit senza privacy -> bloccato sia client sia server;
- test API: record creato con `consent`, `retentionUntil`, `status`;
- test integrazione: nessun dato extra finisce nei canali interni oltre il minimo definito;
- test regressione su invio email report.

### Criterio di chiusura

- il flusso ha una base giuridica documentata e una prova del consenso;
- esiste uno screening DPIA firmabile internamente;
- il dato persistito e inviato a terzi e ridotto al minimo necessario.

## Workstream 4. Trasparenza e documentazione

Priorita: Alta
Rischio coperto: P4 `Alto`

### Obiettivo

Fare in modo che le informative siano un derivato del sistema reale, non un testo separato dal codice.

### Strategie di mitigazione

#### Strategia A. Modello repo-driven

- costruire un inventario trattamenti interno nel repo;
- usare quell'inventario come base per aggiornare policy e note operative;
- introdurre review periodica codice vs policy.

Pro:
- riduce il rischio che la documentazione torni a divergere;
- migliora l'accountability nel tempo.

Contro:
- richiede disciplina di manutenzione.

#### Strategia B. Quick legal alignment

- correggere subito policy e cookie policy limitandosi ai punti oggi errati o mancanti;
- rimandare l'inventario trattamenti a una fase successiva.

Pro:
- rapida;
- utile per chiudere mismatch evidenti.

Contro:
- rischio di nuova divergenza elevato;
- soluzione poco strutturale.

#### Strategia C. Layered notices per flusso

- oltre alla policy generale, aggiungere notice contestuali nei form ad alto rischio;
- spiegare localmente finalita, provider, retention e revoca.

Pro:
- aumenta trasparenza dove serve davvero;
- migliora esperienza utente e qualita del consenso.

Contro:
- introduce piu punti di manutenzione contenutistica.

Raccomandazione:
- combinare `Strategia A` e `Strategia C`;
- usare `Strategia B` solo come hotfix documentale iniziale.

### Interventi tecnici/documentali

- allineare `lib/i18n/legal-translations.ts` ai fornitori e flussi effettivi;
- correggere i riferimenti errati, ad esempio Stripe vs PayPal;
- introdurre un inventario interno dei trattamenti nel repo, con tabella per dataset;
- esplicitare per ogni flusso ad alto rischio:
  - finalita primaria
  - base giuridica
  - destinatari
  - trasferimenti
  - retention
  - diritti e revoca
- aggiungere `updatedAt` e changelog anche ai documenti legali, con parita `it/en`.

### Artefatti

- documento inventario trattamenti
- aggiornamento policy bilingui
- changelog compliance

### Test/verifiche

- review incrociata codice vs policy;
- checklist manuale per ogni fornitore presente nel codice.

### Criterio di chiusura

- ogni fornitore e ogni trattamento `Critico`/`Alto` e descritto correttamente;
- non restano affermazioni smentite dal codice.

## Workstream 5. Retention, cancellazione e lifecycle dei dataset

Priorita: Alta
Rischio coperto: P5 `Alto`

### Obiettivo

Uniformare la gestione del ciclo di vita dei dati personali nelle collection applicative.

### Strategie di mitigazione

#### Strategia A. Framework centralizzato di retention

- contratto dati condiviso;
- utility comuni;
- job schedulato di purge/anonymization;
- reporting minimo sulle esecuzioni.

Pro:
- e il modello piu pulito e scalabile;
- riduce errori e comportamenti incoerenti tra collection.

Contro:
- richiede lavoro architetturale iniziale.

#### Strategia B. Retention per-collection, progressiva

- definire retention e cancellazione collection per collection;
- partire da newsletter e role-fit;
- introdurre job o script dedicati solo per i dataset piu rischiosi.

Pro:
- piu veloce da avviare;
- utile se il team ha poca banda.

Contro:
- maggiore rischio di frammentazione;
- piu debito tecnico nel medio periodo.

#### Strategia C. Riduzione della persistenza

- non salvare piu alcuni dati non essenziali;
- trasformare alcuni flussi in elaborazione volatile o quasi volatile;
- usare aggregati o metadati minimi al posto dei record completi dove possibile.

Pro:
- il miglior dato da gestire e quello che non viene conservato;
- riduce il problema a monte.

Contro:
- puo impattare analytics interni, supporto e follow-up.

Raccomandazione:
- `Strategia B` per partire subito;
- convergere verso `Strategia A`;
- applicare `Strategia C` dove il dato non serve davvero al prodotto.

Creare un modello condiviso, da applicare prima ai dataset ad alto rischio:
- `newsletter_subscribers`
- `role_fit_audit_submissions`
- `leads_ai_act_tools`
- `business_demo_requests`
- `contributor_applications`
- `career_os_applications`
- `fcm_tokens`
- `api_usage` / `ai_usage`

### Interventi tecnici

- definire un contratto dati minimo:
  - `createdAt`
  - `updatedAt`
  - `retentionUntil`
  - `status`
  - `deletedAt`
  - `anonymizedAt`
- implementare utility condivise per calcolo retention;
- creare job schedulato o admin task per purge/anonymization;
- definire per ogni dataset:
  - retention attiva
  - criterio di cancellazione
  - eventuale eccezione operativa o legale.

### Artefatti/documenti

- retention schedule centrale
- runbook purge/anonymization
- mapping dataset -> retention rationale

### Test/verifiche

- test unit su calcolo retention;
- test integrazione su stato `expired`/`deleted`;
- verifica manuale su dataset esistenti e migrazione dove necessaria.

### Criterio di chiusura

- tutti i dataset ad alto rischio hanno retention esplicita;
- esiste un processo reale di rimozione o anonimizzazione.

## Workstream 6. Minimizzazione dei dati verso canali terzi e interni

Priorita: Alta
Rischio coperto: P6 `Alto`

### Obiettivo

Ridurre il numero di copie dei dati personali e la loro diffusione in canali non progettati per la gestione dei diritti privacy.

### Strategie di mitigazione

#### Strategia A. Metadata-only notifications

- Telegram, Slack e email interne ricevono solo:
  - ID record
  - categoria
  - link admin
  - severita o stato

Pro:
- forte riduzione del rischio senza eliminare operativita;
- piu facile gestire DSAR e minimizzazione.

Contro:
- richiede accesso a dashboard/admin per vedere il dettaglio.

#### Strategia B. Dashboard interna come unico punto di lettura

- canali terzi notificano solo che esiste un nuovo evento;
- il dettaglio resta solo in Firestore/admin UI protetta.

Pro:
- soluzione piu ordinata;
- separa notifiche da trattamento dei dati.

Contro:
- richiede UI interna o workflow admin migliore.

#### Strategia C. Stop ai canali terzi per i flussi sensibili

- niente Telegram/Slack/CC per newsletter, role-fit e altri flussi sensibili;
- solo storage applicativo e email all'utente interessato.

Pro:
- massima minimizzazione;
- semplice da difendere lato privacy.

Contro:
- riduce velocita operativa del team;
- puo peggiorare il monitoraggio eventi.

Raccomandazione:
- `Strategia A` subito;
- `Strategia B` come evoluzione corretta;
- `Strategia C` se un flusso resta troppo sensibile o ingestibile sui canali esterni.

### Interventi tecnici

- introdurre una policy comune per `Telegram`, `Slack`, `email interne`;
- sostituire i payload completi con payload minimizzati:
  - ID record
  - categoria evento
  - link a console/admin
  - nessun messaggio libero o user agent salvo stretta necessita
- classificare i canali:
  - `allowed personal data`
  - `metadata only`
  - `no personal data`
- rimuovere CC/BCC automatici di default;
- verificare accessi, retention e governance dei canali esterni.

### Artefatti/documenti

- policy interna su notifiche operative
- subprocessors/register per i canali usati
- runbook DSAR che includa le copie nei canali di notifica

### Test/verifiche

- review payload inviati da tutte le route ad alto rischio;
- test snapshot o unit su formatter Telegram/Slack;
- verifica manuale che non escano email, UA, free text non necessari.

### Criterio di chiusura

- i canali operativi non diventano archivi paralleli di dati personali;
- il team puo censire e rimuovere le copie in caso di DSAR.

## Dipendenze e ordine reale di esecuzione

Ordine consigliato:

1. `Analytics consent`
2. `Riduzione notifiche terze`
3. `Newsletter`
4. `Role Fit Audit`
5. `Policy/documentazione`
6. `Retention standard`

Motivo:
- il primo blocca il rischio normativo immediato;
- il secondo riduce la superficie privacy mentre gli altri flussi restano in lavorazione;
- newsletter e role-fit sono i due trattamenti lead/profiling piu delicati;
- policy e retention vanno chiuse dopo che il comportamento tecnico e stabilizzato.

## Ownership consigliata

- Engineering:
  - fix codice, schema dati, lifecycle, test, payload minimization
- Product/Founder:
  - decisioni su finalita, dati strettamente necessari, contenuto operativo delle notifiche
- Legal/Compliance:
  - review finale di policy, base giuridica, trasferimenti, DPIA screening

Se il team e piccolo, la sequenza pratica puo essere:
- founder/compliance definisce finalita e policy target;
- engineering implementa i pattern comuni;
- review finale incrociata su codice e documenti.

## Definition of Done del piano

Il piano puo dirsi chiuso solo quando sono vere tutte le condizioni seguenti:

- nessun tracking non essenziale parte senza consenso;
- newsletter e role-fit conservano prova del consenso e retention;
- informative `it/en` sono aderenti ai fornitori e ai flussi reali;
- Telegram, Slack e inbox interne non ricevono piu payload eccessivi;
- i dataset ad alto rischio hanno lifecycle esplicito e meccanismo di purge/anonymization;
- esistono artefatti minimi di accountability:
  - inventario trattamenti
  - retention schedule
  - DPIA screening Role Fit Audit
  - runbook unsubscribe/DSAR.

## Primo sprint raccomandato

Se l'obiettivo e partire subito con il minor numero di mosse ad alto valore:

1. fix `GoogleAnalytics.tsx`
2. taglio payload Telegram/Slack/CC/BCC
3. design del modello consenso/retention riusabile
4. migrazione newsletter al modello double opt-in
5. hardening `Role Fit Audit`
6. update policy e inventario trattamenti

Questo e il percorso piu corto per passare da "audit con gap seri" a "stato difendibile con remediation in corso e prove concrete".
