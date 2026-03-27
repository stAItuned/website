# Admin First-Party Analytics (`/admin/analytics`)

UpdatedAt: 2026-03-27

## Purpose and Scope

Questa pagina admin espone un ranking interno dei contenuti pubblicati usando esclusivamente i contatori `pageViewsFirstParty` gia persistiti in Firestore.
La superficie e interna, non indexabile e protetta sia dal gating server-side di `/admin/*` sia dall'API admin con `verifyAdmin`.

## Data Source

- Dataset primario: `articles/{sanitizedSlug}`
- Campo canonico: `pageViewsFirstParty`
- Metadata mostrati in tabella/card:
  - `title`
  - `author`
  - `language`
  - `target`
  - `updatedAt`
  - route pubblica derivata (`/learn/{target}/{slug}`)

La pagina non usa Google Analytics e non miscela snapshot esterni o metriche consenso-gated.
Se un contenuto non ha un contatore first-party persistito, viene mostrato con `0` views oppure escluso solo da eventuali filtri client, ma non da logiche speciali server-side.

## UX States

- Loading:
  - skeleton cards + skeleton table
- Success:
  - summary cards (`tracked pages`, `pages with views`, `total first-party views`)
  - filtro testuale per `title`, `slug`, `author`
  - ranking di default in ordine decrescente per views
- Empty:
  - messaggio chiaro quando il filtro non trova righe
- Error:
  - errore admin-visible senza leak di dettagli sensibili

## Responsive and Accessibility Notes

- Mobile (`xs` -> `md`):
  - card stack con rank, views e metadati essenziali
- Desktop (`md+`):
  - tabella con rank, metadata e link rapido alla pagina pubblica
- Il filtro e utilizzabile da tastiera e ha label esplicita.
- I link verso i contenuti pubblici restano visibili anche su mobile.

## Privacy / GDPR Notes

- La pagina e una superficie di sola lettura su metriche aggregate gia governate in `docs/privacy-processing-inventory.md`.
- Nessun identificatore utente viene esposto nel payload UI.
- Nessuna nuova raccolta dati, nessun nuovo vendor, nessuna nuova retention rule.

## Extension Points

- Per estendere la copertura a nuove route servono contatori first-party persistiti nello stesso modello o un nuovo brainstorming + GDPR gate.
- La logica di ranking server-side e centralizzata in `lib/admin/firstPartyPageViews.ts`.
- L'endpoint protetto per la UI e `GET /api/admin/analytics/pages`.
