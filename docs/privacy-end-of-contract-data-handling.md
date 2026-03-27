# Privacy End-Of-Contract Data Handling

UpdatedAt: 2026-03-26

## Purpose

Questo documento formalizza cosa succede ai dati personali quando termina il rapporto con l'interessato, il purpose originario o uno specifico canale di servizio nel repository `website`.

Nel perimetro attuale non esiste un modello multi-tenant B2B con `data return to customer` come default operativo. Per questo repo, l'end-of-contract/end-of-purpose handling assume di norma:

- `return path`: non previsto come default applicativo; export disponibile via DSAR dove applicabile
- `delete path`: `hard_delete` o pseudonimizzazione con eccezione legale documentata
- `backup handling`: nessun restore applicativo usato per riattivare record cancellati; i backup non ridefiniscono la retention applicativa
- `subprocessor follow-up`: allineato ai TTL e alle delete path del repo, con follow-up contrattuale/documentale dove il vendor non e gestito solo dal runtime applicativo

## Scope

Questo artifact copre:

- chiusura account o richiesta di cancellazione dati
- fine purpose per lead, richieste inbound e waitlist
- revoca/cancellazione di canali push
- contributor offboarding e gestione degli agreement firmati
- follow-up verso subprocessors coerente con retention, DSAR e transfer assessment

Riferimenti principali:

- `docs/privacy-retention-schedule.md`
- `docs/runbooks/dsar-account-deletion.md`
- `docs/runbooks/retention-lifecycle.md`
- `docs/privacy-subprocessors-register.md`
- `docs/privacy-transfer-assessment.md`

## End-State Model

| Scenario | Trigger event | Return path | Delete path | Deletion deadline | Residual retained data | Backup and archive treatment | Subprocessor follow-up | Owner |
|---|---|---|---|---|---|---|---|---|
| Account-bound datasets | `POST /api/account/delete` oppure chiusura account autenticata | export assisted su richiesta, non automatico | self-service automatic per dataset `uid`-bound e email-bound coperti | immediato lato applicazione, salvo errori tracciati in `summary.datasetCoverage` | nessuno, salvo agreement firmati in eccezione legale | nessun restore applicativo dei dataset cancellati; eventuali copie tecniche non riattivano il record nel prodotto | vendors applicativi coinvolti ricevono effetto delete via cancellazione/upsert nel datastore governato dal repo | Engineering |
| Public lead / request datasets | retention expiry o assisted DSAR con matching affidabile | export assisted su richiesta | `hard_delete` via retention lifecycle o cleanup DSAR | entro `retentionUntil` oppure al completamento del DSAR | nessuno per dataset standard | stessi principi del retention lifecycle; nessun rollback dati dopo `hard_delete` | nessuna istruzione separata per vendor puramente infrastrutturali oltre al delete nel datastore primario | Engineering |
| Push notification subscriptions (`fcm_tokens`, `fcm_admin_tokens`) | `unsubscribe`, `unregister`, account deletion admin o retention expiry | non previsto; eventuale export assisted | disattivazione immediata e purge entro lifecycle TTL | immediato per unsubscribe/unregister logico; hard delete entro 90 giorni | nessuno | token tecnici non vengono ripristinati da backup come subscription attiva | Firebase Cloud Messaging/Firebase restano allineati al token registry locale | Engineering |
| Contributor applications (unsigned) | retention expiry, assisted DSAR o account deletion con matching email | export assisted su richiesta | `hard_delete` | entro 540 giorni o prima se DSAR valido | nessuno | nessun restore applicativo previsto dopo purge | delete nel datastore principale; nessun return path separato | Engineering + Editorial ops |
| Contributor agreements (signed) | account deletion, rapporto terminato, richiesta DSAR o review periodica eccezione | export assisted, con redazioni se richieste da accountability legale | pseudonimizzazione + minimizzazione; non `hard_delete` immediato | review entro `legal_retention_review_due_at`; retention fino a 10 anni salvo hold ulteriore documentato | sola evidenza probatoria minima dell agreement e metadata audit | backup non devono reintrodurre campi non essenziali rimossi dalla minimizzazione applicativa | verificare coerenza con eventuali vendor che hanno ricevuto l agreement o i relativi metadati probatori | Engineering + Privacy/legal reviewer |
| AI EU Act gated-resource leads | expiry del purpose, DSAR assisted, consenso revocato per marketing | export assisted su richiesta | `hard_delete` dataset lead; token accesso con expiry breve separato | lead entro 365 giorni; token entro `accessTokenExpiresAt` | nessuno, salvo evidenze aggregate prive di PII | nessun restore applicativo del token scaduto | follow-up documentale verso vendor esterni solo se la cancellazione non e gia riflessa dal datastore principale | Engineering |

## Trigger Families

### 1. Account Deletion

- Trigger principale: `POST /api/account/delete`.
- Copertura automatica: dataset `uid`-bound e dataset `email`-bound con matching affidabile sull'email autenticata.
- Fonte operativa canonica: `docs/runbooks/dsar-account-deletion.md`.
- Se il cleanup fallisce su un dataset specifico, l'esito resta tracciato in `summary.datasetCoverage` e richiede follow-up manuale.

### 2. End-Of-Purpose / Retention Expiry

- Trigger principale: superamento di `retentionUntil`.
- Esecuzione tecnica: `scripts/retention-lifecycle.ts`.
- Fonte operativa canonica: `docs/runbooks/retention-lifecycle.md`.
- Per i dataset standard il comportamento atteso e `hard_delete`, senza residual retention applicativa.

### 3. Consent Withdrawal / Channel Offboarding

- Per i canali push, il trigger e `unsubscribe` o `unregister`.
- Per marketing opzionale o follow-up non richiesti, la revoca del consenso non comporta sempre cancellazione immediata dell'intero record sorgente, ma blocca il riuso per quel purpose e rimanda alla retention/DSAR path appropriata.
- Dove il purpose resta attivo per altra base giuridica, prevale la matrice purpose-level in `docs/privacy-lawful-basis-matrix.md`.

### 4. Contractual / Legal Exception Review

- Caso principale nel repo: `contributions.agreement` con agreement firmati.
- In questo scenario non si applica `hard_delete` immediato, ma:
  - pseudonimizzazione dell'account
  - minimizzazione del record alla sola evidenza probatoria
  - review entro `legal_retention_review_due_at`
- Base documentale collegata:
  - `docs/privacy-retention-schedule.md`
  - `docs/runbooks/dsar-account-deletion.md`

## Dataset-Level Handling Notes

### Standard hard-delete datasets

I seguenti dataset seguono `hard_delete` come stato finale ordinario:

- `role_fit_audit_submissions`
- `career_os_waitlist`
- `career_os_applications`
- `career_os_audit`
- `leads_ai_act_tools`
- `business_demo_requests`
- `contact_requests`
- `feedback_submissions`
- `contributor_applications`
- `fcm_tokens`
- `fcm_admin_tokens`

Per questi dataset:

- non esiste `return-to-customer` applicativo
- l'export e disponibile via path DSAR dove applicabile
- il trigger principale e retention expiry o DSAR/account deletion

### Legal-exception dataset

`contributions.agreement` e l'eccezione principale nel repo.

Stato finale atteso:

- evidenza contrattuale minima retained
- campi non essenziali rimossi
- account identity non piu trattata come profilo attivo del prodotto
- review periodica dell'eccezione legale prima della scadenza lunga

## Backup And Archival Position

- Il repo documenta solo retention applicativa e purge operativa, non un sistema di restore privacy-aware per singolo record.
- Dopo `hard_delete`, il dato non deve riapparire come record attivo nel prodotto.
- Eventuali backup o repliche tecniche non estendono di per se la retention dichiarata nel layer applicativo.
- Se una capability futura introducesse restore selettivo o archival accessibile, il presente documento dovra essere riaperto insieme a retention policy e transfer assessment.

## Subprocessor Follow-Up Expectations

- I vendor governati principalmente dal datastore applicativo ereditano la cancellazione dal sistema sorgente e non richiedono, in condizioni normali, una procedura manuale separata per ogni record.
- Dove il vendor puo trattenere copie autonome, evidenze contrattuali o log non pienamente controllati dal datastore primario, il follow-up deve essere verificato contro:
  - `docs/privacy-subprocessors-register.md`
  - `docs/privacy-transfer-assessment.md`
  - `DPA status` del vendor interessato
- Le aree con potenziale follow-up non ancora pienamente chiuso restano quelle gia marcate `TBD` nel subprocessors register e nella transfer assessment.

## Verification Evidence

Le evidenze operative minime per dimostrare questo lifecycle sono:

- `docs/runbooks/dsar-account-deletion.md`
- `docs/runbooks/retention-lifecycle.md`
- `docs/privacy-retention-schedule.md`
- `docs/privacy-subprocessors-register.md`
- `docs/privacy-transfer-assessment.md`
- test e smoke package gia registrati in `docs/runbooks/gdpr-ws1-ws7-test-report-2026-03-23.md`

## Current Gaps And Follow-Up

- La postura controller/processor enterprise non e ancora formalizzata in un artifact centrale separato.
- Alcuni vendor mantengono `DPA status` o dettagli transfer ancora `TBD`; questo puo richiedere follow-up legale/ops ulteriore.
- Il repo non ha ancora un runbook GDPR dedicato agli incident/breach, che resta rilevante quando una delete path fallisce o un dataset retained eccede il perimetro atteso.
