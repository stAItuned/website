# DPIA Screening - Role Fit Audit (WS3 Strategy A)

Data: 2026-03-22  
Owner: stAItuned engineering  
Ambito: `POST /api/role-fit-audit/submit` + persistenza `role_fit_audit_submissions` + invio report email

## 1) Descrizione trattamento

Il flusso Role Fit Audit raccoglie dati forniti dall'utente (email, nome opzionale, link social opzionale, risposte al questionario) per generare un report personalizzato con supporto AI e inviarlo via email.

Controlli Strategy A applicati:
- consenso privacy obbligatorio client+server (`acceptedPrivacy`);
- persistenza `consent.*`, `privacyVersion`, `retentionUntil`, `status`;
- notifica interna su Telegram ridotta a metadata-only;
- rimozione CC interno completo dal report email utente.

## 2) Criteri di screening DPIA

Valutazione sintetica (EDPB/WP29 criteria oriented):
- valutazione/profilazione individuale: **sì** (report personalizzato);
- decisione automatizzata con effetti legali/similari: **no**;
- monitoraggio sistematico: **no**;
- dati sensibili art. 9: **no**;
- larga scala: **non dimostrata**;
- combinazione dataset: **limitata**;
- soggetti vulnerabili: **non specifico**;
- uso innovativo/tecnologia AI: **sì**;
- impedimento esercizio diritti: **no** (contatto privacy disponibile).

## 3) Esito screening

Esito: **DPIA formale completa non obbligatoria in questa wave**, con monitoraggio rafforzato.

Razionale:
- il trattamento include profilazione non automatica con effetti legali nulli;
- sono stati introdotti controlli di minimizzazione e consenso robusto;
- la retention e limitata a 12 mesi e resa esplicita nei record;
- i canali interni sono stati ridotti a metadati operativi.

## 4) Rischi residui

- persistenza `answers` raw (scelta prodotto) richiede governance accessi rigorosa;
- record legacy possono non avere tutti i nuovi campi compliance;
- lifecycle automatico di cancellazione su `retentionUntil` non ancora attivo (delegato a WS5).

## 5) Azioni richieste / follow-up

1. Implementare job lifecycle WS5 per delete/anonymize dei record scaduti.  
2. Verificare periodicamente che i messaggi interni restino metadata-only.  
3. Rieseguire screening in caso di:
   - aumento significativo volume trattato,
   - nuovi dataset combinati,
   - nuovi use case con decisioni automatizzate rilevanti.

## 6) Decisione interna

Decisione: **approved with monitoring**  
Reviewer: privacy/compliance gate interno (`gdpr-feature-gate`)  
Data decisione: 2026-03-22
