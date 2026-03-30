# Learn Articles Page (`/learn/articles`)

UpdatedAt: 2026-03-30

## Purpose and Scope

Questa pagina raccoglie tutti gli articoli pubblicati di `Learn` e supporta discovery tramite ricerca, filtro per livello e ordinamento.
La lista usa metriche aggregate solo per ranking e proof signals leggeri sulle card, senza cambiare il routing o il contenuto editoriale degli articoli.

## Data Sources

- Content source:
  - `allPosts` da Contentlayer per titolo, slug, metadata editoriali, livello, lingua, topic e date.
- Analytics source per la lista:
  - `GET /api/analytics`
  - `pageViews` da `articles/{slug}.pageViewsFirstParty` nel main db `eu-primary`
  - `users` da snapshot GA4 sincronizzato in Firestore con resolver canonico:
    - priorita a `analytics/daily.articlesStats` in `eu-primary`
    - fallback al mirror `articles/{slug}` in `eu-primary`
    - fallback di compatibilita read-only al legacy db `(default)` durante la migrazione analytics

## Analytics Contract on Cards

- La card articolo nella lista puo mostrare:
  - badge views se `pageViews >= 10`
  - badge unique visitors se `users >= 5`
- `pageViews` resta il contatore first-party canonico.
- `users` resta una metrica GA4 consenso-gated e non realtime; la lista la usa solo come segnale secondario di lettura.
- L'ordinamento `Trending` continua a usare solo `pageViews`, non `users`.

## UX States

- Loading:
  - rendering statico iniziale con contenuto editoriale; analytics della lista arrivano client-side
- Success:
  - ricerca, filtro livello, topic shelf, paginazione
  - card con eventuali badge analytics se le soglie minime sono soddisfatte
- Empty:
  - messaggio no-results con reset filtri
- Error:
  - se `/api/analytics` fallisce, la pagina resta navigabile e le card degradano senza badge analytics

## Responsive and Accessibility Notes

- Mobile-first:
  - badge analytics compatti e stacked nell'angolo alto sinistro della card
  - nessuna azione critica dipende dai badge
- Desktop:
  - stesso contenuto funzionale, con maggiore densita visiva
- I badge analytics restano decorativi: la CTA primaria continua a essere l'intera card-link.

## SEO / GEO Notes

- Metadata e canonical della route restano invariati.
- Le metriche analytics sulle card non cambiano heading hierarchy, structured data o contenuto indicizzabile.
- Il ranking `Trending` e guidato da first-party views per evitare dipendenza SEO da GA consenso-gated.

## Bilingual Notes

- La route `/learn/articles` e condivisa tra utenti `it/en`.
- Questa modifica non introduce nuovo copy localizzato: aggiunge soltanto badge numerici con icone.
- Il comportamento della lista resta allineato per entrambe le lingue.

## Privacy / GDPR Notes

- `pageViewsFirstParty` resta separato da Google Analytics.
- `users` resta un aggregato GA4 gia consenso-gated e non espone identificatori individuali.
- Nessuna nuova raccolta dati, retention rule o vendor integration introdotta da questa modifica.
- Il dual-read `eu-primary` -> `(default)` e solo di lettura e serve a mantenere continuita di visualizzazione durante la migrazione del dato analytics tra database Firestore.
