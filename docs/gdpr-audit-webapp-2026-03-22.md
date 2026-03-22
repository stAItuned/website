# GDPR Audit Webapp stAItuned

Data analisi: 2026-03-22

Ambito: audit applicativo del repository web Next.js/Firebase, con focus su trattamenti di dati personali, basi giuridiche, trasparenza, conservazione, esercizio dei diritti, trasferimenti verso terzi e controlli tecnici rilevanti ai fini GDPR.

Metodo:
- review statica del codice applicativo, delle route API, delle pagine legali e della documentazione in repo;
- confronto tra quanto dichiarato nelle informative e quanto implementato realmente;
- classificazione dei rilievi per rischio e impatto operativo;
- evidenze ancorate a file e linee del repository.

Limiti:
- analisi svolta su codice e documentazione locale, non su configurazioni runtime reali, log di produzione, DPA firmati, SCC, TIA, registro trattamenti o policy operative esterne al repo;
- il giudizio e tecnico-organizzativo, non sostituisce una consulenza legale formale.

Nota storica (aggiornamento operativo 2026-03-22):
- i riferimenti al flusso newsletter presenti in questo audit descrivono lo stato pre-remediation;
- nel Workstream 2 la newsletter e stata dismessa (endpoint tombstone `410`, CTA sostituite con `/topics`, componenti e servizio email legacy rimossi);
- usare `plan.md` e `docs/gdpr-feature-checklist.md` come fonte aggiornata per lo stato di conformita implementativa.

## Executive Summary

Lo stato GDPR della webapp e eterogeneo. Esistono alcuni flussi ben progettati, in particolare il `Career OS waitlist`, che conserva versioni dei consensi, timestamp, retention e double opt-in. Tuttavia il quadro complessivo presenta gap significativi in aree ad alta esposizione:

1. il consenso analytics e di fatto bypassato lato client;
2. alcuni trattamenti marketing e lead generation non conservano una prova robusta del consenso lato server;
3. il flusso `Role Fit Audit` tratta dati di profilazione e genera output personalizzati con AI senza una catena completa di accountability privacy;
4. le informative non descrivono in modo accurato tutti i trattamenti e tutti i fornitori effettivi;
5. retention, cancellazione e gestione dei diritti degli interessati non sono uniformi tra i vari dataset;
6. dati personali vengono replicati in canali terzi operativi come Telegram, Slack e mailbox interne con minimizzazione limitata.

In termini di priorita, la criticita maggiore non e solo la presenza di dati personali, ma la combinazione di:
- consenso non enforceato;
- documentazione non aderente al codice;
- moltiplicazione delle copie dei dati su piu fornitori/canali;
- assenza di policy consistenti di retention e DSAR.

Valutazione sintetica:
- livello di rischio privacy complessivo: Alto;
- rischio normativo immediato: Alto;
- rischio reputazionale in caso di contestazione o reclamo: Alto;
- maturita di accountability GDPR: Media-bassa.

## Inventario sintetico dei trattamenti rilevati

| Area | Dati trattati | Finalita | Base giuridica presumibile | Terzi coinvolti | Stato GDPR |
| --- | --- | --- | --- | --- | --- |
| Navigazione pubblica e analytics | IP/telemetria tecnica, browser data, analytics events | erogazione sito, misurazione traffico | legittimo interesse per tecnico; consenso per analytics | Firebase, Google Analytics | Critico per consenso analytics |
| Auth e account | email, nome, foto, uid | autenticazione, personalizzazione | esecuzione del servizio | Firebase Auth | Parziale |
| Newsletter | email, referrer, user agent | invio aggiornamenti email | consenso | Firestore, Resend, Telegram | Alto |
| Contact/feedback/business lead | nome, email, azienda, messaggi, preferenze marketing | risposta commerciale e supporto | precontrattuale o legittimo interesse; consenso per marketing | Firestore, Telegram, Slack, Resend | Medio-alto |
| Role Fit Audit | email, nome, profilo LinkedIn, risposte questionario, risultati AI, user agent, paypal order id | generazione report personalizzato e follow-up | consenso/contratto da chiarire; profiling | Firestore, Gemini, Resend, Telegram, PayPal | Alto |
| AI EU Act lead magnet | nome, email, company, ruolo, consensi, token accesso, IP hash | lead generation e accesso risorse | consenso / precontrattuale | Firestore, Telegram | Medio |
| Career OS waitlist | email, intent, consensi, ip, ua | waitlist e marketing opzionale | consenso e precontrattuale | Firestore, Resend, Telegram | Buono rispetto al resto |
| Contributor/editoriale | account info, bozze, interviste, accordi legali, usage logs AI | gestione workflow editoriale | contratto/legittimo interesse | Firestore, Gemini, Perplexity | Medio-alto |
| Push notifications | FCM token, topics, timestamps | notifiche web push | consenso browser + legittimo interesse operativo | Firebase Cloud Messaging | Medio |

## Ranking dei rilievi per rischio e impatto

Scala usata:
- Rischio: Critico / Alto / Medio / Basso
- Impatto business/privacy: Molto alto / Alto / Medio / Basso

| Priorita | Rischio | Impatto | Area | Rilievo |
| --- | --- | --- | --- | --- |
| P1 | Critico | Molto alto | Analytics | Google Analytics attivabile anche senza consenso |
| P2 | Alto | Molto alto | Newsletter | Consenso non provato lato server, assenza di double opt-in robusto e unsubscribe strutturato |
| P3 | Alto | Molto alto | Role Fit Audit | Profilazione/analisi AI con evidenza privacy incompleta e disclosure insufficiente |
| P4 | Alto | Alto | Trasparenza | Privacy/Cookie Policy non aderenti ai trattamenti e ai fornitori effettivi |
| P5 | Alto | Alto | Retention | Conservazione e cancellazione non uniformi per la maggior parte dei dataset |
| P6 | Alto | Alto | Third-party sharing | Dati personali replicati su Telegram, Slack e mailbox interne con minimizzazione debole |
| P7 | Medio-alto | Alto | Diritti interessati | Gestione DSAR parziale e non industrializzata |
| P8 | Medio | Medio-alto | Push notifications | Token FCM trattati come identificatori persistenti senza retention esplicita |
| P9 | Medio | Medio-alto | Lead magnet AI EU Act | Token di accesso in query string, senza scadenza lato verifica |
| P10 | Medio | Medio | Debug/public endpoints | Endpoint e pagine debug aumentano la superficie di esposizione di dati e meta-dati |
| P11 | Medio | Medio | Minimizzazione | Raccolta non uniforme di IP, user agent, referrer e dati liberi |
| P12 | Medio | Medio | AI governance | Uso di Gemini/Perplexity e logging AI senza piena copertura informativa e documentale |

## Analisi dettagliata dei rilievi

### 1. Analytics attivabile anche senza consenso

Rischio: Critico
Impatto: Molto alto

Evidenza:
- `components/GoogleAnalytics.tsx:11` imposta `const FORCE_ANALYTICS_ENABLED = true`
- `components/GoogleAnalytics.tsx:14` calcola `shouldTrack` come vero anche in assenza di consenso se `FORCE_ANALYTICS_ENABLED` e true
- `components/GoogleAnalytics.tsx:28-45` carica gli script GA quando `shouldTrack` e vero

Perche e critico:
- il banner cookie e la policy dichiarano che i cookie non essenziali e le misurazioni analytics si attivano solo dopo consenso;
- il codice implementa l'opposto, quindi il problema non e teorico ma strutturale;
- se l'istanza di produzione carica GA senza consenso, il trattamento analytics potrebbe risultare privo di base giuridica valida.

Disallineamento documentale:
- `lib/i18n/legal-translations.ts:239` dichiara che Google Analytics e metriche client si attivano solo dopo consenso;
- `lib/i18n/legal-translations.ts:329-340` presenta il banner come meccanismo che blocca i cookie non essenziali fino ad opt-in.

Rischi GDPR:
- art. 5(1)(a) liceita, correttezza, trasparenza;
- art. 6 base giuridica;
- art. 7 condizioni del consenso;
- ePrivacy/cookie compliance, con impatto diretto anche se formalmente distinta dal GDPR.

Remediation:
- rimuovere immediatamente il forcing;
- bloccare script, event collection e pageview fino a consenso esplicito;
- registrare in modo verificabile lo stato del consenso;
- testare il comportamento con banner rifiutato, banner accettato e first load.

### 2. Newsletter senza prova robusta del consenso e senza ciclo di revoca strutturato

Rischio: Alto
Impatto: Molto alto

Evidenza:
- `app/api/newsletter/subscribe/route.ts:25` legge solo `email` e `source`;
- `app/api/newsletter/subscribe/route.ts:53-60` salva email, timestamp, source, status, userAgent, referrer;
- non vengono salvati `acceptedPrivacy`, versione policy, checkbox marketing, testo consenso o double opt-in state;
- `app/api/newsletter/subscribe/route.ts:76` invia subito welcome email;
- `lib/email/newsletterEmail.ts:78-80` usa un link `mailto:` per la disiscrizione, non un unsubscribe endpoint;
- `lib/email/newsletterEmail.ts:10` e `:126` inoltrano in BCC l'email a `info@staituned.com`.

Osservazione chiave:
- il frontend puo anche mostrare una checkbox, ma il backend non conserva la prova del consenso. In audit o reclamo, il repository non dimostra chi ha accettato cosa, quando e contro quale versione della policy.

Rischi GDPR:
- art. 5 accountability;
- art. 6 e 7 per validita e prova del consenso marketing;
- art. 17 e 21 per facilita di revoca/opposizione;
- art. 25 privacy by design insufficiente.

Remediation:
- introdurre double opt-in obbligatorio per newsletter;
- salvare `consent.version`, `consent.textScope`, `consent.acceptedAt`, `sourcePage`, `ip/ip_hash` secondo policy interna di minimizzazione;
- implementare unsubscribe endpoint e stato `revoked/unsubscribed`;
- eliminare o giustificare il BCC interno automatico.

### 3. Role Fit Audit tratta dati di profilazione con garanzie privacy incomplete

Rischio: Alto
Impatto: Molto alto

Evidenza:
- `app/(public)/role-fit-audit/components/RoleFitAuditForm.tsx:162-165` blocca submit se `acceptedPrivacy` non e spuntato;
- `app/(public)/role-fit-audit/components/RoleFitAuditForm.tsx:177-189` invia al backend `answers`, `email`, `name`, `linkedinUrl`, `marketingConsent`, `website`, `paypalOrderId`, `locale`, ma non `acceptedPrivacy`;
- `app/api/role-fit-audit/submit/route.ts:29` non riceve ne valida `acceptedPrivacy`;
- `app/api/role-fit-audit/submit/route.ts:52-60` passa `userEmail` al generatore AI;
- `app/api/role-fit-audit/submit/route.ts:67-96` salva email, nome, LinkedIn, risposte, risposte testuali, output AI, userAgent, timestamp;
- `app/api/role-fit-audit/submit/route.ts:133-139` inoltra i dati a Telegram;
- `app/api/role-fit-audit/submit/route.ts:149-154` invia report via Resend;
- `lib/email/roleFitAuditEmail.ts:17` e `:188` aggiungono CC a `info@staituned.com`.

Perche e un rischio elevato:
- il flusso elabora dati che descrivono competenze, readiness, gap, archetipi e raccomandazioni professionali;
- si tratta di una forma di profiling/assessment personalizzato, anche se non necessariamente decisione automatizzata ai sensi dell'art. 22;
- il sistema combina dati dichiarativi, output AI, invio email, notifica Telegram e potenziale follow-up marketing.

Gap principali:
- nessuna prova server-side dell'accettazione privacy;
- informativa non sufficientemente granulare su AI providers, logiche del trattamento, retention, canali interni di accesso;
- assenza di evidenza di DPIA o almeno di DPIA screening per un flusso con profiling career-oriented.

Rischi GDPR:
- art. 5, 6, 13, 14, 25;
- potenziale screening su art. 22 e linee guida EDPB su profiling;
- accountability su trattamenti ad alto impatto percepito.

Remediation:
- rendere `acceptedPrivacy` obbligatorio anche lato server e salvarne versione/timestamp;
- documentare chiaramente finalita, logica generale del report AI, destinatari interni, retention e possibilita di opt-out dal follow-up;
- fare almeno un DPIA screening formale; se emergono criteri di rischio elevato, aprire DPIA completa;
- ridurre i dati inviati a Telegram e via email interna.

### 4. Informative privacy/cookie non aderenti ai trattamenti reali

Rischio: Alto
Impatto: Alto

Evidenza:
- `lib/i18n/legal-translations.ts:239` dichiara analytics attivi solo dopo consenso, ma il codice analytics li puo forzare;
- `lib/i18n/legal-translations.ts:293-305` elenca i destinatari, ma la lista e incompleta o imprecisa rispetto al codice;
- `lib/i18n/legal-translations.ts:303` menziona `Payments (Stripe)`, mentre il flusso `Role Fit Audit` usa riferimenti a `paypalOrderId`;
- dal codice risultano presenti anche Telegram, Slack, Gemini, Perplexity, Firebase/FCM, Resend, Google Fonts, Calendly e PayPal.

Perche conta:
- una policy parzialmente corretta non basta: la trasparenza GDPR richiede che l'interessato capisca chi tratta cosa, perche, con quali basi e verso quali destinatari;
- l'inaccuratezza documentale amplifica il rischio normativo anche se parte del trattamento fosse tecnicamente legittimo.

Remediation:
- riallineare privacy policy, cookie policy e terms al codice reale;
- distinguere per ciascun flusso: finalita, base giuridica, dati trattati, retention, destinatari, trasferimenti extra SEE, modalita di revoca;
- aggiungere disclosure esplicita su AI providers effettivi e sui canali di notifica interna.

### 5. Retention e cancellazione non uniformi nella maggior parte dei dataset

Rischio: Alto
Impatto: Alto

Controllo positivo rilevato:
- `app/api/career-os/waitlist/route.ts:62` definisce `retentionUntil`;
- `app/api/career-os/waitlist/route.ts:87-106` salva consenso con versioni e timestamp;
- `lib/security/waitlistDoubleOptIn.ts:32-46` genera token con expiry;
- `lib/security/waitlistDoubleOptIn.ts:48-66` verifica token con scadenza.

Problema generale:
- questo standard non e replicato altrove. Non risultano retention enforceate o lifecycle chiari per:
  - `newsletter_subscribers`
  - `role_fit_audit_submissions`
  - `contributor_applications`
  - `business_demo_requests`
  - `career_os_applications`
  - `leads_ai_act_tools`
  - `fcm_tokens`
  - `api_usage` / `ai_usage`

Disallineamento documentale:
- `lib/i18n/legal-translations.ts:310-311` dichiara finestre di conservazione per piu categorie, ma il codice non mostra enforcement coerente.

Rischi GDPR:
- art. 5(1)(e) limitazione della conservazione;
- accountability insufficiente nel dimostrare cancellazione/anonimizzazione a fine ciclo.

Remediation:
- definire un retention schedule centralizzato per collezione;
- aggiungere `retentionUntil`, `reviewAt`, `deletedAt`, `status` dove rilevante;
- implementare job di purge/anonymization e logging di esecuzione.

### 6. Copie dei dati personali su Telegram, Slack e mailbox interne con minimizzazione debole

Rischio: Alto
Impatto: Alto

Evidenza:
- `lib/telegram.ts:15-66` invia `message`, `email`, `page`, `userAgent` a Telegram;
- `app/api/feedbacks/route.ts:37-55` inoltra a Slack `message`, `email`, `page`, `userAgent`;
- `lib/email/newsletterEmail.ts:10` e `:126` inviano BCC interno;
- `lib/email/roleFitAuditEmail.ts:17` e `:188` inviano CC interno.

Osservazione:
- il repository usa canali operativi rapidi per notificare lead, feedback e report;
- questo aumenta drasticamente il numero di copie dei dati, il numero di contesti di accesso e la complessita di cancellazione/diritti;
- non emerge una policy di minimizzazione differenziata per categoria di dato.

Rischi GDPR:
- art. 5(1)(c) minimizzazione;
- art. 28 e 44+ se mancano DPA/SCC/TIA per i fornitori coinvolti;
- difficolta nel rispettare diritto di cancellazione se i dati restano in chat, inbox o canali non governati.

Remediation:
- inviare a Telegram/Slack solo identificativi interni o payload minimizzati;
- evitare CC/BCC automatici salvo effettiva necessita operativa documentata;
- formalizzare inventory dei subprocessors, policy di accesso e retention dei canali di supporto.

### 7. Gestione dei diritti degli interessati solo parziale

Rischio: Medio-alto
Impatto: Alto

Controlli positivi:
- esiste un flusso di cancellazione account;
- l'area account espone azioni di privacy/cancellazione.

Gap:
- non risultano flussi self-service di access/export/rectification per newsletter, leads, role-fit, business requests, AI EU Act, contributor applications;
- l'operativita sembra basata principalmente su richiesta email;
- non sono stati trovati artefatti di SOP DSAR, registro richieste o playbook di evasione.

Valutazione:
- per una piccola organizzazione l'esercizio via email puo essere sufficiente in astratto, ma solo se supportato da procedura interna, mapping dei dataset e tempi di esecuzione verificabili;
- il repo non rende evidente questa maturita operativa.

Remediation:
- definire un playbook DSAR con mapping per dataset/fornitore/canale;
- predisporre export strutturato almeno per account, newsletter, role-fit e lead forms;
- prevedere cancellazione o anonimizzazione sincronizzata anche sui canali terzi.

### 8. Token FCM trattati come identificatori persistenti senza retention chiara

Rischio: Medio
Impatto: Medio-alto

Evidenza:
- `app/api/notifications/register/route.ts:23-33` salva il token FCM come `doc(token)` con metadata;
- `app/api/notifications/register/route.ts:66-69` in fase di unregister lo marca solo `active: false`, senza eliminazione;
- la policy (`lib/i18n/legal-translations.ts:260-262`) minimizza il tema affermando che il token non e associato all'identita personale.

Valutazione:
- un token push e un identificatore univoco del device/browser e quindi dato personale almeno indiretto, soprattutto se correlabile a comportamenti o altri eventi;
- la semplice disattivazione senza retention dichiarata lascia accumulare identificatori tecnici senza evidente necessita.

Remediation:
- qualificare correttamente i token come identificatori personali indiretti;
- introdurre retention breve e purge automatico dei token inattivi;
- documentare base giuridica, scopo e revoca.

### 9. Lead magnet AI EU Act con token in query string e validazione senza scadenza

Rischio: Medio
Impatto: Medio-alto

Evidenza:
- `app/api/leads/ai-act/route.ts:32` genera `accessToken` con `randomUUID()`;
- `app/api/leads/ai-act/route.ts:52` salva `access_token`;
- `app/api/leads/ai-act/route.ts:70` costruisce redirect `/ai-eu-act/risorse?token=...`;
- `app/(public)/ai-eu-act/risorse/page.tsx:54-65` considera valido il token se trovato in collection, senza controllo di expiry.

Rischi:
- query string esposta in cronologia browser, screenshot, inoltri manuali, log reverse proxy e potenziali referrer;
- token riutilizzabile salvo revoca manuale;
- access control di fatto basato su secret URL persistente.

Remediation:
- aggiungere scadenza, one-time use o rotating token;
- spostare l'access grant su meccanismo piu robusto, ad esempio sessione firmata breve o token POST-to-session;
- definire retention anche per lead magnet token.

### 10. Endpoint/pagine debug pubbliche aumentano la superficie privacy

Rischio: Medio
Impatto: Medio

Evidenza:
- `app/api/debug/filesystem/route.ts:47-64` espone path, listing directory, cwd ed environment;
- `app/api/account/articles/route.ts:6-131` accetta un `email` in query e restituisce analytics articoli per autore senza auth evidente.

Valutazione:
- non e un rilievo GDPR puro quanto un rischio di esposizione non necessaria;
- tuttavia ogni endpoint pubblico che accetta email o restituisce metadati associati a persone aumenta rischio di enumerazione e abuso.

Remediation:
- chiudere o rimuovere endpoint debug in produzione;
- proteggere endpoint basati su email con autenticazione e autorizzazione;
- minimizzare i metadati pubblicamente esposti.

### 11. Minimizzazione non uniforme su IP, user agent, referrer e campi liberi

Rischio: Medio
Impatto: Medio

Evidenza comparativa:
- `app/api/leads/ai-act/route.ts:7-12` hash dell'IP con SHA-256;
- `app/api/career-os/waitlist/route.ts:40-41` salva invece IP raw;
- `app/api/newsletter/subscribe/route.ts:58-59` salva `userAgent` e `referrer`;
- `lib/telegram.ts:39-42` invia email, page e userAgent.

Valutazione:
- il repo mostra sensibilita alla minimizzazione in alcuni punti, ma non come standard architetturale;
- l'assenza di una policy unica genera trattamenti eccedenti o incoerenti.

Remediation:
- creare standard interno: quando salvare IP raw, quando hasharlo, quando non salvarlo affatto;
- limitare user agent/referrer ai casi realmente necessari;
- introdurre utility condivise per normalizzare raccolta e mascheramento.

### 12. Governance AI incompleta per contributor tooling e usage logging

Rischio: Medio
Impatto: Medio

Osservazioni:
- il repo usa Gemini e Perplexity in piu flussi editoriali/contributor;
- i log di utilizzo AI includono identificativi utente/email;
- l'informativa cita Gemini, ma non emerge copertura chiara e completa per Perplexity, per le categorie dati inviate e per le logiche di logging.

Valutazione:
- non e necessariamente illecito usare provider AI esterni, ma occorre trasparenza, base giuridica, processor assessment e limiti di retention;
- il rischio aumenta se contenuti editoriali o dati di contributor includono informazioni personali o contrattuali.

Remediation:
- completare la disclosure AI provider-specific;
- definire quali dati possono essere inviati a ciascun provider;
- aggiungere retention e access control ai log `api_usage/ai_usage`;
- verificare DPA, transfer tool e controlli contrattuali.

## Controlli positivi gia presenti

Il repository non parte da zero. I segnali migliori sono:

1. `Career OS waitlist` e il riferimento piu maturo del repo:
   - validazione server-side;
   - consensi separati privacy/terms/marketing;
   - versionamento consensi;
   - timestamp;
   - `retentionUntil`;
   - double opt-in con token firmato e scadenza.

2. Esistono pagine legali bilingui e un framework di consenso cookie.

3. Esiste un flusso di cancellazione account e una sezione utente dedicata alla privacy.

4. Alcuni endpoint usano Zod o validazioni strutturate, segnale positivo per data quality.

5. L'AI EU Act lead route mostra gia una pratica di pseudonimizzazione sull'IP, anche se non riusata in tutto il repo.

Conclusione operativa: conviene standardizzare i pattern virtuosi gia esistenti invece di inventare nuove soluzioni per ogni form.

## Gap documentali e di accountability

Nel repository non risultano evidenti, o non sono stati trovati, i seguenti artefatti chiave:

- registro dei trattamenti (RoPA);
- inventory dei subprocessors;
- DPA/SCC/TIA per fornitori extra SEE o ad alto impatto;
- retention schedule centralizzata per collection;
- SOP DSAR per accesso, rettifica, cancellazione, opposizione, portabilita;
- DPIA o DPIA screening per `Role Fit Audit` e per altri flussi di profiling;
- policy unificata di minimizzazione e logging;
- evidenza di review periodiche dei dataset e purge jobs.

L'assenza di questi artefatti non implica automaticamente non conformita, ma riduce drasticamente la capacita di dimostrare conformita.

## Valutazione per principi GDPR

### Liceita, correttezza, trasparenza

Giudizio: Debole

Motivi:
- analytics non allineato al consenso;
- informative non aderenti al codice reale;
- basi giuridiche non sempre differenziate per singolo flusso.

### Limitazione della finalita

Giudizio: Medio

Motivi:
- le finalita principali sono riconoscibili, ma in alcuni flussi i dati vengono riutilizzati per notifiche interne, follow-up o logging senza una descrizione sufficientemente granulare.

### Minimizzazione

Giudizio: Debole

Motivi:
- duplicazione su Telegram/Slack/inbox;
- uso non uniforme di IP raw, hash, user agent, referrer;
- raccolta di dati non sempre strettamente necessari rispetto alla singola finalita operativa.

### Esattezza

Giudizio: Medio

Motivi:
- diverse route validano bene i payload, ma l'esattezza non compensa i gap di consenso e retention.

### Limitazione della conservazione

Giudizio: Debole

Motivi:
- buona implementazione solo su `Career OS waitlist`;
- retention non enforceata per molti dataset.

### Integrita e riservatezza

Giudizio: Medio

Motivi:
- Firestore/Admin sembrano usati in modo ordinato;
- ma i canali operativi terzi e gli endpoint debug indeboliscono il controllo effettivo.

### Accountability

Giudizio: Debole

Motivi:
- mancano artefatti e standard trasversali che consentano di dimostrare conformita in modo rapido e coerente.

## Piano di remediation raccomandato

### Entro 7 giorni

1. Disattivare `FORCE_ANALYTICS_ENABLED` e rendere GA realmente opt-in.
2. Aggiornare urgentemente privacy/cookie policy per allinearle allo stato reale, oppure sospendere i trattamenti/document claims non coerenti.
3. Bloccare in produzione endpoint debug e verificare eventuali route pubbliche basate su email.
4. Ridurre i payload inviati a Telegram/Slack ai soli dati indispensabili.

### Entro 30 giorni

1. Portare newsletter al modello `Career OS waitlist`:
   - consensi versionati;
   - double opt-in;
   - unsubscribe endpoint;
   - retention.
2. Rifattorizzare `Role Fit Audit` con:
   - consenso privacy server-side;
   - retention;
   - disclosure AI;
   - DPIA screening.
3. Definire un data retention standard per tutte le collection con job di purge.
4. Formalizzare inventory dei subprocessors e mappa dei flussi dati verso terzi.

### Entro 60 giorni

1. Scrivere RoPA e SOP DSAR.
2. Uniformare minimizzazione di IP, user agent, referrer e internal notifications.
3. Mettere sotto autenticazione/autorizzazione tutti gli endpoint che espongono dati o analytics associabili a persone.
4. Revisionare i flussi contributor/AI con disclosure completa su provider e logging.

### Entro 90 giorni

1. Eseguire review completa di privacy by design su tutti i form lead-oriented.
2. Introdurre controlli automatici:
   - test per gating del consenso analytics;
   - test di presenza campi consenso e retention nei payload salvati;
   - checklist di review GDPR per nuove route.
3. Valutare audit legale formale con verifica DPA/SCC/TIA e testo finale delle informative.

## Priorita architetturale raccomandata

La via piu efficace non e correggere ogni route singolarmente, ma estrarre uno standard comune per i trattamenti:

- `consent model` condiviso: `accepted`, `acceptedAt`, `version`, `source`, `scope`;
- `retention model` condiviso: `createdAt`, `updatedAt`, `retentionUntil`, `deletedAt`, `status`;
- `notification model` condiviso: payload minimizzato verso Telegram/Slack/email interna;
- `subject-rights model` condiviso: localizzazione del dato, export, cancellazione, revoca;
- `privacy review checklist` obbligatoria per ogni nuova API route o lead form.

Il flusso `Career OS waitlist` puo essere usato come baseline tecnica del repository.

## Conclusione

La webapp mostra una buona intenzione progettuale sul tema privacy, ma oggi la conformita GDPR non e omogenea ne dimostrabile in modo robusto sull'intero perimetro. Il rischio piu urgente e la discrepanza tra consenso dichiarato e consenso realmente enforceato, seguita da prova del consenso, trasparenza documentale e governance dei dati replicati su canali terzi.

Se l'obiettivo e arrivare a uno stato difendibile in audit o in caso di reclamo, la priorita non deve essere solo "scrivere meglio la policy", ma allineare codice, informative, retention e processi operativi a un unico modello di trattamento verificabile.

## Evidenze principali usate nell'analisi

- `components/GoogleAnalytics.tsx`
- `components/cookies/CookieConsentProvider.tsx`
- `app/api/newsletter/subscribe/route.ts`
- `lib/email/newsletterEmail.ts`
- `app/(public)/role-fit-audit/components/RoleFitAuditForm.tsx`
- `app/api/role-fit-audit/submit/route.ts`
- `lib/email/roleFitAuditEmail.ts`
- `app/api/career-os/waitlist/route.ts`
- `lib/security/waitlistDoubleOptIn.ts`
- `app/api/leads/ai-act/route.ts`
- `app/(public)/ai-eu-act/risorse/page.tsx`
- `app/api/notifications/register/route.ts`
- `app/api/feedbacks/route.ts`
- `lib/telegram.ts`
- `app/api/debug/filesystem/route.ts`
- `app/api/account/articles/route.ts`
- `lib/i18n/legal-translations.ts`
