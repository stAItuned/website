# Privacy DPIA Index

UpdatedAt: 2026-03-26

## Purpose

Questo documento centralizza gli screening DPIA e i trigger di riapertura per i principali flow del repository `website`.

Serve a:

- evitare che gli screening DPIA restino dispersi tra checklist, audit storici e note specifiche di singole feature
- chiarire quali flow hanno gia uno screening esplicito
- indicare quando uno screening va riaperto o rivalutato

Questo indice non sostituisce gli screening dedicati. Li collega e li rende consultabili da un punto unico.

## Scope And Method

Fonti usate per costruire questo indice:

- `docs/dpia-screening-role-fit-audit.md`
- `docs/gdpr-feature-checklist.md`
- `docs/privacy-processing-inventory.md`
- `docs/privacy-lawful-basis-matrix.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/dpia-template.md`

Valori usati nella colonna `Screening status`:

- `screened`: esiste uno screening repo-local dedicato
- `not_required_current_scope`: screening effettuato nel gate/review e concluso come non necessario nello scope attuale
- `monitor`: non esiste uno screening dedicato, ma il flow richiede monitoraggio per eventuale riapertura
- `candidate_if_scope_expands`: il flow non richiede oggi screening dedicato, ma ha caratteristiche che potrebbero far scattare una rivalutazione

## DPIA Index

| Flow | Current posture | Screening status | Source artifact | Re-open triggers | Owner | Notes |
|---|---|---|---|---|---|---|
| Role Fit Audit | AI-assisted personalized career assessment con profiling non decisionale | `screened` | `docs/dpia-screening-role-fit-audit.md` | aumento significativo del volume; nuovi dataset combinati; uso dell output AI per ranking o decisioni rilevanti; introduzione di decisioni automatizzate con impatto significativo | stAItuned engineering | caso piu sensibile del repo; screening formale gia eseguito |
| Contributor agreement signatures | raccolta e retention di evidenza contrattuale con eccezione legale | `monitor` | `docs/privacy-end-of-contract-data-handling.md`, `docs/gdpr-feature-checklist.md` | nuove categorie di dati; arricchimento del record retained oltre l evidenza minima; automazione di valutazioni su contributor; scala o durata retention ulteriormente estese | stAItuned engineering | rischio piu legato a retention/accountability che a profiling |
| AI EU Act leads | lead magnet con token accesso, gating risorse e follow-up opzionale | `not_required_current_scope` | `docs/gdpr-feature-checklist.md` | scoring lead strutturato; combinazione con nuovi dataset comportamento/CRM; profiling marketing avanzato; uso del flow per decisioni su accesso o eligibility | stAItuned engineering | nello scope attuale prevalgono fulfillment + anti-fraud + marketing opzionale |
| Career OS applications | intake candidatura/orientamento verso possibile servizio | `candidate_if_scope_expands` | `docs/privacy-lawful-basis-matrix.md`, `docs/privacy-processing-inventory.md` | scoring sistematico di candidati; ranking automatizzato; combinazione con dataset esterni; uso di AI per valutazioni ad impatto significativo | stAItuned engineering | oggi flusso pre-contrattuale senza decisione automatizzata significativa |
| Career OS audit requests | richiesta di audit/contact su percorso Career OS | `not_required_current_scope` | `docs/privacy-processing-inventory.md`, `docs/gdpr-feature-checklist.md` | uso di scoring o classificazione automatica; combinazione con cronologia account o dataset terzi; monitoraggio sistematico di utenti | stAItuned engineering | flow di contatto/pre-contract a rischio moderato |
| Career OS waitlist | waitlist service-oriented con consensi e metadata sorgente | `not_required_current_scope` | `docs/privacy-processing-inventory.md`, `docs/gdpr-feature-checklist.md` | profiling commerciale strutturato; segmentazione automatica avanzata; combinazione con dati comportamentali o fonti terze | stAItuned engineering | attualmente waitlist con finalita limitata e notice esplicita |
| Business request | inbound commercial request | `not_required_current_scope` | `docs/privacy-processing-inventory.md`, `docs/gdpr-feature-checklist.md` | scoring lead automatizzato; enrichment esterno sistematico; uso del messaggio free-text per classificazioni ad alto impatto | stAItuned engineering | oggi flusso pre-contrattuale standard |
| Contact / feedback forms | support handling e risposta a richieste inbound | `not_required_current_scope` | `docs/privacy-processing-inventory.md`, `docs/gdpr-feature-checklist.md` | analisi sistematica del free-text; sentiment/risk scoring automatizzato; combinazione con dataset utente per decisioni significative | stAItuned engineering | flusso support-driven; monitorare eventuale AI triage futuro |
| Contributor applications | valutazione candidature collaborazione | `candidate_if_scope_expands` | `docs/privacy-processing-inventory.md`, `docs/privacy-lawful-basis-matrix.md` | ranking automatizzato; profiling collaboratori; incrocio con fonti esterne o storico produttivita; decisioni automatizzate con effetti sostanziali | stAItuned engineering | oggi valutazione umana/pre-contrattuale ordinaria |
| Account auth and admin session gating | autenticazione tecnica e enforcement accessi admin | `not_required_current_scope` | `docs/gdpr-feature-checklist.md`, `docs/privacy-processing-inventory.md` | monitoraggio comportamentale esteso; risk scoring utenti/admin; nuove metriche invasive o correlazioni cross-system | stAItuned engineering | processing di sicurezza limitato e tecnico |
| Article views first-party | metriche aggregate senza profilo utente persistente | `not_required_current_scope` | `docs/privacy-processing-inventory.md` | introduzione di identificatori persistenti, profiling utente o combinazione con analytics individuali | stAItuned engineering | oggi aggregato e a basso rischio |
| Google Analytics (consent-gated) | analytics marketing standard basato su consenso | `candidate_if_scope_expands` | `docs/privacy-processing-inventory.md`, `docs/privacy-transfer-assessment.md` | attivazione di funzioni advertising/profiling piu invasive; unione con CRM/lead data; audience building piu aggressivo | stAItuned engineering | attenzione piu forte su transfer e consenso che su DPIA nello scope attuale |
| Editorial push notifications | token tecnici per notifiche editoriali | `not_required_current_scope` | `docs/privacy-processing-inventory.md` | tracking comportamentale dei destinatari, segmentazione individuale o combinazione con altri dataset | stAItuned engineering | oggi token tecnico + topic editoriale |
| Admin operational push notifications | token tecnici admin-only e metadata operativi | `not_required_current_scope` | `docs/privacy-processing-inventory.md`, `docs/privacy-breach-escalation.md` | monitoraggio personale degli admin, ranking o analisi comportamentale sugli operatori | stAItuned engineering | canale interno tecnico, non HR monitoring |

## Re-Open Rule

Riaprire o avviare uno screening DPIA quando un flow esistente introduce uno o piu di questi elementi:

- large-scale processing o aumento materiale del volume trattato
- special category data o dati significativamente piu sensibili del perimetro attuale
- profiling sistematico o scoring piu strutturato
- automated decision-making con effetti legali o similmente significativi
- combinazione di dataset che aumenta materialmente il rischio per l interessato
- uso di AI o modelli in modo piu invasivo rispetto allo scope attuale
- trasferimenti o vendor che cambiano la postura di rischio in modo sostanziale

## Current Coverage Summary

- screening dedicato esistente: `1`
- flow con `not_required_current_scope`: documentati ma senza artifact dedicato separato
- flow con `candidate_if_scope_expands` o `monitor`: da rivalutare se il prodotto introduce scoring, profiling, enrichment o decisioni automatizzate piu forti

## Maintenance Rules

- Ogni nuovo flow con AI, profiling, ranking, monitoring o combinazione dataset deve essere aggiunto qui nella stessa PR.
- Se nasce uno screening dedicato nuovo, questo indice va aggiornato con:
  - stato
  - link al documento
  - trigger di riapertura
- Se un flow cambia natura ma non viene aggiornato qui, il gate GDPR va considerato incompleto.
