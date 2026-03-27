# Privacy Breach Escalation Runbook

UpdatedAt: 2026-03-26

## Purpose

Questo runbook definisce il percorso operativo minimo da seguire quando un incidente nel repo `website` puo avere impatto GDPR, anche se la qualificazione finale come personal-data breach non e ancora confermata.

Obiettivo:

- evitare che un incidente privacy resti solo un problema tecnico locale
- chiarire chi apre l'escalation
- chiarire dove si registra il caso
- chiarire quando serve review privacy/legal

## Scope

Questo runbook si applica a:

- accessi non autorizzati reali o sospetti a dataset con dati personali
- esposizione accidentale di PII in log, canali operativi, analytics o output AI
- invio errato di dati personali a vendor, recipienti o admin/operatori non autorizzati
- cancellazioni fallite o retention purge non eseguite quando il rischio diventa materiale
- dataset trattenuti oltre il perimetro previsto o oltre il trigger di delete documentato
- leak o misconfigurazioni che coinvolgono auth, sessioni admin, email delivery, push token registry o datastore applicativo

Non copre:

- incidenti puramente di availability senza impatto plausibile su riservatezza, integrita o disponibilita dei dati personali
- bug generici senza relazione con dati personali o diritti degli interessati

## Trigger To Open Escalation

Aprire l'escalation immediatamente se si verifica almeno uno di questi trigger:

- un dataset con dati personali e stato letto, esportato, condiviso o loggato da un soggetto non autorizzato
- una route/API/admin surface ha esposto dati personali a utenti non autorizzati o anonimi
- un vendor o canale operativo ha ricevuto piu dati del previsto rispetto alla documentazione corrente
- un bug impedisce la cancellazione o mantiene dati oltre `retentionUntil` in modo non isolato
- un agreement retained in `legal_exception` contiene piu dati del necessario o perde la minimizzazione prevista
- esiste dubbio ragionevole che il caso possa richiedere notifica o valutazione breach, anche se la root cause non e ancora chiara

## Owners And Responsibilities

| Role | Responsibility |
|---|---|
| First responder | identifica il problema, limita ulteriori esposizioni, apre l'escalation |
| Engineering owner | guida il triage tecnico, raccoglie evidenze, coordina containment e remediation |
| Privacy/legal reviewer | valuta se il caso ricade nel perimetro GDPR breach e se serve ulteriore escalation |
| Product/ops owner | supporta impact assessment, comunicazioni operative e verifica sui flow coinvolti |

Default owner per questo repo:

- first responder: chi scopre il problema
- engineering owner: stAItuned engineering
- privacy/legal reviewer: reviewer privacy/GDPR interno o referente legale coinvolto

## Incident Record

Ogni caso aperto con questo runbook deve essere registrato subito in un record interno minimo. Finche non esiste un sistema strutturato dedicato, usare un documento/versioned note nel repo o in workspace operativo con almeno:

- `incident_id`
- data/ora scoperta
- first responder
- dataset/flow coinvolti
- sistemi/vendor coinvolti
- impatto noto o sospetto
- stato iniziale: `suspected`, `confirmed`, `contained`, `closed`
- decisioni prese
- follow-up richiesti

Se il caso nasce da un fallimento delete/retention, collegare anche:

- dataset coinvolti
- `retentionUntil` atteso
- output o errore del job/runbook rilevante

## Response Flow

### 1. Containment immediato

Entro la prima risposta operativa:

- bloccare o limitare il flusso che continua a esporre dati
- rimuovere payload PII dai canali operativi se ancora presenti
- sospendere job, route o integrazione se la propagazione continua
- preservare evidenze minime senza amplificare l'esposizione

Esempi di containment:

- disabilitare endpoint o feature flag
- ruotare chiavi/token se l'incidente coinvolge auth o integrazioni
- ridurre payload verso Telegram/vendor
- fermare temporaneamente job retention o notifiche se inviano dati errati

### 2. Triage iniziale

Raccogliere rapidamente:

- quali dati personali sono coinvolti
- quanti record o utenti sono plausibilmente impattati
- quali sistemi o vendor hanno toccato il dato
- se il dato e stato solo potenzialmente esposto o certamente esfiltrato/divulgato
- se il caso e ancora attivo

Mappare i riferimenti documentali:

- `docs/privacy-processing-inventory.md`
- `docs/privacy-subprocessors-register.md`
- `docs/privacy-transfer-assessment.md`
- `docs/privacy-end-of-contract-data-handling.md`
- `docs/runbooks/dsar-account-deletion.md`

### 3. Privacy / Legal Assessment

Coinvolgere review privacy/legal senza attendere la root cause completa se almeno una di queste condizioni e vera:

- accesso non autorizzato confermato o plausibile
- trasferimento o disclosure verso recipient non previsti
- dataset sensibili dal punto di vista reputazionale o contrattuale
- failure sistemico di delete/retention
- dubbio sul fatto che il caso possa richiedere notifica verso interessati, clienti o autorita

Decisioni da registrare:

- `gdpr_breach_assessment_required`: `yes/no`
- `external_notification_review_required`: `yes/no`
- `processor_or_vendor_follow_up_required`: `yes/no`
- `data_subject_impact_high`: `yes/no`

### 4. Containment verification and remediation

Prima di chiudere il caso:

- confermare che l'esposizione non sia piu attiva
- applicare fix alla root cause nel layer corretto
- verificare eventuali dati residui in log, datastore, vendor o canali operativi
- decidere se servono delete/backfill/revoca token/additional minimization
- aggiornare documenti o runbook se l'incidente mostra un gap strutturale

### 5. Closure

Un caso puo essere chiuso solo quando:

- containment confermato
- assessment privacy/legal registrato
- remediation eseguita o con follow-up assegnato
- eventuali artifact GDPR aggiornati

## Severity Guidance

| Level | Examples | Required escalation |
|---|---|---|
| `L1 - privacy near miss` | payload interno errato bloccato prima dell'invio, log PII rilevato e sanificato senza evidenza di accesso improprio | engineering owner + record interno |
| `L2 - confirmed limited exposure` | invio a canale/vendor non previsto, accesso admin improprio limitato, delete failure non massiva ma reale | engineering owner + privacy/legal review |
| `L3 - material breach candidate` | esposizione multi-record, vendor/recipient non autorizzato, route pubblica che ha esposto PII, retention failure ampia o prolungata | engineering owner + privacy/legal review immediata + valutazione notifiche/follow-up esterno |

Se il livello non e chiaro, trattare il caso almeno come `L2`.

## Evidence Checklist

Per ogni incidente privacy registrare almeno:

- timestamp scoperta
- sistemi e dataset coinvolti
- query/log/errori o screenshot minimizzati
- containment applicato
- decisione privacy/legal
- stato remediation
- documenti aggiornati

Non copiare in evidenza piu PII del necessario.

## Links To Existing Repo Artifacts

- `docs/privacy-processing-inventory.md`
- `docs/privacy-subprocessors-register.md`
- `docs/privacy-transfer-assessment.md`
- `docs/privacy-end-of-contract-data-handling.md`
- `docs/privacy-retention-schedule.md`
- `docs/runbooks/dsar-account-deletion.md`
- `docs/gdpr-feature-checklist.md`

## Current Limitations

- Il repo non ha ancora un incident register strutturato come sistema dedicato; questo runbook definisce il minimo obbligatorio da registrare.
- La postura controller/processor enterprise resta da formalizzare in un artifact separato, quindi alcuni casi contrattuali dovranno essere valutati manualmente.
- La decisione finale su notifiche esterne non va automatizzata: serve review privacy/legal esplicita.
