# Admin First-Party Analytics (`/admin/analytics`)

UpdatedAt: 2026-03-30

## Purpose and Scope

Questa pagina admin espone un ranking interno delle pagine pubbliche tracciate usando esclusivamente contatori `pageViewsFirstParty` persistiti in Firestore.
La superficie e interna, non indexabile e protetta sia dal gating server-side di `/admin/*` sia dall'API admin con `verifyAdmin`.

## Data Source

- Dataset misto:
  - articoli `/learn/*` da `articles/{sanitizedSlug}`
  - altre pagine pubbliche da `page_views_first_party/{pageDocId}`
- Campo canonico: `pageViewsFirstParty`
- Metadata mostrati in tabella/card:
  - `title`
  - `pageType`
  - `author` quando disponibile
  - `language`
  - `target` per gli articoli `/learn/*`
  - `updatedAt`
  - route pubblica canonica (`path`)

La pagina non usa Google Analytics e non miscela snapshot esterni o metriche consenso-gated.
Per gli articoli, il ranking continua a leggere il contatore legacy su `articles/*` per preservare lo storico gia accumulato.
Per le altre pagine pubbliche, il ranking legge i contatori first-party sul dataset page-level dedicato.
Se una pagina pubblica tracciabile non ha ancora ricevuto views, viene mostrata con `0` oppure entra nel ranking dopo la prima osservazione se il path non appartiene alla registry statica del sito.

## UX States

- Loading:
  - skeleton cards + skeleton table
- Success:
  - summary cards (`tracked pages`, `pages with views`, `total first-party views`)
  - filtro testuale per `title`, `path`, `pageType`, `author`
  - ranking di default in ordine decrescente per views
- Empty:
  - messaggio chiaro quando il filtro non trova righe
- Error:
  - errore admin-visible senza leak di dettagli sensibili

## Responsive and Accessibility Notes

- Mobile (`xs` -> `md`):
  - card stack con rank, views, tipo pagina e metadati essenziali
- Desktop (`md+`):
  - tabella con rank, tipo pagina, metadata e link rapido alla pagina pubblica
- Il filtro e utilizzabile da tastiera e ha label esplicita.
- I link verso i contenuti pubblici restano visibili anche su mobile.

## Privacy / GDPR Notes

- La pagina e una superficie di sola lettura su metriche aggregate gia governate in `docs/privacy-processing-inventory.md`.
- Nessun identificatore utente viene esposto nel payload UI.
- Nessun nuovo vendor, nessuna nuova retention o DSAR branch.
- L'estensione di scope rispetto ai soli articoli e limitata a pagine pubbliche aggregate, senza raw events o profili utente.

## Extension Points

- La canonicalizzazione delle pagine pubbliche tracciabili e centralizzata in `lib/analytics/publicPageTracking.ts`.
- La logica di ranking server-side e centralizzata in `lib/admin/firstPartyPageViews.ts`.
- L'endpoint protetto per la UI e `GET /api/admin/analytics/pages`.
