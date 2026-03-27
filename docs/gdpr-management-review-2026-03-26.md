# GDPR Management Review

UpdatedAt: 2026-03-26

## Review Metadata

- Review mode: `full_mode`
- Reviewer skill: `gdpr-privacy-reviewer`
- Scope: governance GDPR del repository `website`, artefatti repo-driven, baseline condivisa, hub `/admin/compliance`
- Goal: verificare copertura documentale, posture di accountability e qualita operativa della gestione GDPR

## Shared Files Reviewed

- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/README.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/privacy-baseline.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/gdpr-control-matrix.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/gdpr-reference-guide.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/data-inventory.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/lawful-basis-matrix.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/retention-policy.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/data-subject-rights.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/end-of-contract-data-handling.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/subprocessors.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/transfer-assessment.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/dpa-checklist.md`
- `/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr/ropa-processor.md`

## Repo Files Reviewed

- `docs/gdpr-review-source-stack.md`
- `docs/privacy-lawful-basis-matrix.md`
- `docs/gdpr-feature-checklist.md`
- `docs/gdpr-audit-webapp-2026-03-22.md`
- `docs/privacy-processing-inventory.md`
- `docs/compliance-changelog.md`
- `docs/privacy-retention-schedule.md`
- `docs/runbooks/dsar-account-deletion.md`
- `docs/admin-compliance-hub.md`
- `lib/admin/compliance-docs.ts`
- `components/admin/AdminComplianceDocs.tsx`

## Executive Summary

La gestione GDPR del repo e oggi sostanzialmente piu matura sia sul piano operativo sia su quello di formalizzazione documentale core.
I punti forti sono evidenti:

- esiste un gate privacy strutturato (`docs/gdpr-feature-checklist.md`)
- esiste un inventario trattamenti repo-driven allineato ai flow reali (`docs/privacy-processing-inventory.md`)
- esiste una schedule retention con lifecycle operativo (`docs/privacy-retention-schedule.md`, `docs/runbooks/retention-lifecycle.md`)
- esiste una matrice DSAR/delete che distingue bene tra self-service e assisted path (`docs/runbooks/dsar-account-deletion.md`)
- esiste una baseline condivisa esterna ora integrata nella review stack (`docs/gdpr-review-source-stack.md`)

Il quadro resta pero `amber / needs changes` perche, pur avendo chiuso la formalizzazione repo-local delle basi giuridiche, del registro vendor/subprocessor, della transfer assessment scenario-based, dell'end-of-contract handling, del breach escalation path e dell'indice DPIA centrale, manca ancora almeno un artifact repo-local esplicito che la baseline condivisa considera utile quando il prodotto tratta dati personali in modo continuativo.

## Accountability Findings

### Strengths

- Il repo ha una governance review-driven concreta, non solo policy-level.
- I principali flussi pubblici a rischio hanno un inventario dati, vendor, retention e notice.
- La retention non e piu solo dichiarata: esistono anche schedule e runbook tecnici.
- Il coverage DSAR e descritto in modo operativo, con distinzione tra dataset account-bound e dataset assistiti.
- L'hub `/admin/compliance` e protetto lato server e adatto come punto unico di consultazione interna.
- L'hub `/admin/compliance` espone ora in modo coerente baseline condivisa, governance repo, operations ed evidence GDPR.

### Weaknesses

- La postura controller/processor e implicita in piu punti, ma non formalizzata come documento centrale.

## Lawful Basis And Rights-Handling Findings

- Per i flow principali la base giuridica e ora formalizzata in `docs/privacy-lawful-basis-matrix.md` con split per finalita.
- La copertura DSAR e buona per i dataset piu importanti, grazie a `docs/runbooks/dsar-account-deletion.md`.
- La rights-handling note e forte sul deletion/export operativo, ma meno forte su rettifica, opposizione e restriction workflow.

Valutazione:
- stato: `improved`
- rischio principale: la lawful basis e ora leggibile in un artifact unico, ma la rights-handling note resta distribuita e meno esplicita su rettifica/opposizione/restriction

## Retention, End-Of-Contract, Subprocessor, And Transfer Findings

- Retention: copertura buona per il perimetro attuale grazie a schedule + lifecycle runbook.
- End-of-contract: esiste ora un documento repo-local dedicato (`docs/privacy-end-of-contract-data-handling.md`) che raccorda retention, DSAR, unsubscribe/offboarding e legal exception.
- Subprocessors: esiste ora un registro centralizzato repo-local (`docs/privacy-subprocessors-register.md`), ma il suo `DPA status` resta in parte `TBD` e deve alimentare la successiva transfer assessment.
- Transfers: esiste ora una transfer assessment dedicata (`docs/privacy-transfer-assessment.md`), ma molti scenari restano `TBD` su meccanismo e regione effettiva e richiedono follow-up legal/ops.

Valutazione:
- retention: `good`
- end-of-contract handling: `improved`
- subprocessors register: `improved`
- transfer assessment: `improved`

## Third-Party Data Leakage Findings

- I workstream recenti hanno ridotto l'esposizione verso Telegram e canali operativi spostandoli verso `metadata-only`.
- Questa e una remediation strutturale corretta.
- Resta comunque necessario un documento centralizzato che descriva vendor, tipologia dati, regione e cleartext-access implication.

Valutazione:
- stato attuale: `improved but not fully formalized`

## DPIA Trigger Assessment

- Esiste uno screening DPIA dedicato per Role Fit Audit.
- Esiste ora un indice centrale (`docs/privacy-dpia-index.md`) che elenca flow, stato screening e trigger di riapertura.

Valutazione:
- stato: `improved`
- raccomandazione: usare l'indice come source-of-truth e aggiungere screening dedicati solo quando un flow supera i trigger definiti

## Repo-Specific Deviations From Shared Baseline

Le deviazioni principali rispetto alla baseline condivisa non sono tecniche ma documentali:

- il repo usa `privacy-processing-inventory` come istanza flow-level e `privacy-lawful-basis-matrix` come istanza purpose-level del tema lawful basis
- il repo usa `privacy-subprocessors-register.md` come istanza repo-local del tema vendor/subprocessors e `privacy-transfer-assessment.md` come assessment separato scenario-based
- il repo usa `privacy-transfer-assessment.md` come assessment scenario-based, ma con diversi `TBD` ancora aperti sul piano contrattuale/regionale
- il repo usa `privacy-end-of-contract-data-handling.md` come raccordo repo-local tra retention, DSAR, unsubscribe/offboarding e legal exception
- il repo usa `privacy-breach-escalation.md` come runbook repo-local per breach candidate e incidenti privacy
- il repo usa `privacy-dpia-index.md` come indice centrale degli screening e dei re-open trigger, lasciando il dettaglio ai singoli artifact dedicati

Queste deviazioni sono gestibili solo se restano esplicite e temporanee.
Se rimangono implicite, indeboliscono l'auditability.

## GDPR Artifact Gaps

Gap prioritari da chiudere:

1. valutare se formalizzare la postura controller/processor in un artifact centrale separato

## Required Documentation Updates Applied In This Change

- aggiunta matrice repo-specifica purpose-level delle basi giuridiche (`docs/privacy-lawful-basis-matrix.md`)
- aggiunto registro repo-specifico vendor/subprocessors (`docs/privacy-subprocessors-register.md`)
- aggiunta transfer assessment scenario-based (`docs/privacy-transfer-assessment.md`)
- aggiunto documento repo-specifico di end-of-contract/offboarding data handling (`docs/privacy-end-of-contract-data-handling.md`)
- aggiunto runbook repo-specifico per breach escalation e incident path privacy (`docs/privacy-breach-escalation.md`)
- aggiunto indice repo-specifico degli screening DPIA e dei trigger di riapertura (`docs/privacy-dpia-index.md`)
- aggiunto questo review doc
- ampliato l'hub `/admin/compliance` per includere baseline condivisa + repo docs GDPR necessari
- aggiunti `focus` e `objective` per ogni documento mostrato nell'hub
- aggiornato `docs/admin-compliance-hub.md`
- consolidato `/admin/compliance` come source-of-truth interno a livelli per il source stack GDPR

## Gate Status

- Status: `needs changes`
- Rationale: la governance operativa e piu forte dopo la chiusura di WS1, WS2, WS3, WS4, WS5 e WS6, ma manca ancora la formalizzazione centralizzata della postura controller/processor

## Next Recommended Actions

1. Chiudere i gap documentali repo-local prioritari rimanenti.
2. Tenere l'hub `/admin/compliance` come source-of-truth consultabile per baseline condivisa + istanziazione repo-specifica.
3. Usare questo review doc come checkpoint iniziale per il prossimo wave GDPR/documentation hardening.
