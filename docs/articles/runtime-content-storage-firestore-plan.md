# Piano: Articoli con contenuto runtime (Storage) + indice metadata (Firestore)

Obiettivo: pubblicare nuovi articoli **senza** fare deploy del sito ogni volta, mantenendo **SEO/GEO ottime**, **costi contenuti**, **pieno controllo**, e rispettando il limite **1MB** per documento Firestore.

Questo piano sposta il *body* degli articoli fuori dal build (oggi: Contentlayer su `public/content/articles/**`) e lo rende disponibile a runtime:
- **Cloud Storage**: source-of-truth del contenuto (Markdown; render lato server).
- **Firestore**: indice leggero e query-friendly dei metadata (sempre << 1MB).

> Nota contesto repo: attualmente `/learn/[target]/[slug]` genera params da `allPosts` (Contentlayer) e usa `dynamicParams = false`. Questo impedisce l’esistenza di nuovi slug senza rebuild+deploy.

---

## 1) Requisiti & Non-obiettivi

### Requisiti
- Pubblicazione articolo = **upload contenuto + update metadata**, nessun deploy del sito.
- Performance e costi: minimizzare reads Firestore e latenza (cache lato server + cache HTTP/CDN dove possibile).
- SEO/GEO: metadata server-side stabili (title/description/canonical/OG) + JSON-LD accurato (Article/FAQ se presente).
- Bilingual parity: ogni articolo deve avere copertura coerente `it/en` quando previsto (schema e regole).
- Compatibile con deploy su Firebase Hosting (Next.js App Router via `frameworksBackend`).

### Non-obiettivi (per la V1)
- Editor WYSIWYG completo dentro al sito.
- Ricerca full-text avanzata.
- Versioning sofisticato (basta “last published” + storico opzionale).

---

## 2) Data model (Firestore: indice metadata)

### Collezione proposta: `articles`
- **Doc ID**: `slug` (kebab-case, stabile, immutabile).
- Campi suggeriti (tutti piccoli, query-friendly):
  - `slug: string`
  - `target: 'newbie' | 'midway' | 'expert' | 'general'`
  - `language: 'it' | 'en'`
  - `title: string`
  - `seoTitle?: string`
  - `seoDescription?: string`
  - `meta?: string` (descrizione breve/summary)
  - `author?: string`
  - `datePublished?: string (ISO)`
  - `dateModified?: string (ISO)`
  - `topics?: string[]` (tag)
  - `primaryTopic?: string`
  - `published: boolean`
  - `cover?: { kind: 'storage' | 'external'; urlOrPath: string; mime?: string }`
  - `content: { bucket: string; path: string; format: 'md'; sha256?: string; bytes?: number }`
  - `geo?: { ... }` (se vuoi mantenere i blocchi GEO come oggi)
  - `faq?: { question: string; answer: string; questionEn?: string; answerEn?: string }[]` (se serve per JSON-LD)

### Bilingual parity (linee guida pratiche)
Reco V1: **doc separati per lingua** con un campo di collegamento per la traduzione:
- `translationOf?: string` (id comune, es. lo slug “canonico” del cluster)

Esempio:
- `articles/cos-e-un-computer-it` (`language: 'it'`, `translationOf: 'cos-e-un-computer'`)
- `articles/what-is-a-computer-en` (`language: 'en'`, `translationOf: 'cos-e-un-computer'`)

Se invece vuoi **stesso slug** per IT/EN, devi includere la lingua nella route (non è l’attuale struttura) oppure usare una chiave composta (non ottimale con docID).

---

## 3) Cloud Storage: contenuto e asset

### Path consigliati
- Contenuto (Markdown): `articles/{slug}/{language}/article.md`
- Asset (immagini): `articles/{slug}/{language}/assets/<file>`
- Cover: `articles/{slug}/{language}/cover.<ext>`

### Accesso pubblico vs signed URLs
- **V1 consigliata**: lettura pubblica dei file articolo+asset (contenuto è pubblico e cacheabile).
- Alternative: signed URLs (più privacy, ma peggiora caching e complica `next/image` e SEO nel tempo).

---

## 4) Boundaries applicative (Next.js App Router)

### Lettura server-side (SEO/GEO)
La pagina articolo deve essere server-rendered e data-driven:
- Legge metadata da Firestore (cached).
- Legge markdown da Storage (cached).
- Render markdown→HTML sul server (il repo già ha `renderMarkdownToHtml`).

### Routing (nuovi slug senza deploy)
Cambiare la logica attuale basata su Contentlayer:
- Rimuovere dipendenza da `generateStaticParams()` basato su `allPosts` per la creazione delle rotte articolo.
- Impostare `dynamicParams = true` (o rimuoverlo) per consentire nuovi slug.
- Usare caching controllata (vedi sezione 6) per evitare costi/latency.

### Listing / sitemap / RSS
Oggi molte cose derivano da `allPosts` (home ticker, `/learn/articles`, `sitemap.xml`, `rss.xml`).
Con runtime content:
- diventano query su Firestore (indice) con cache e ordinamento per data.
- la sitemap e l’RSS devono essere rigenerate da indice, non da filesystem.

---

## 5) Publish flow (senza deploy)

Reco: publish via backend (Cloud Function o endpoint autenticato in Next con Admin SDK):
1) Validazione (Zod) di frontmatter/metadata.
2) Upload `article.md` e asset su Storage.
3) Upsert `articles/{id}` su Firestore con `published=true` e puntatore `content.path`.
4) Invalidazione cache (server/cache/CDN) dove possibile.

### Opzione “GitHub PR come authoring”
Il repo ha già `lib/github/publish.ts` che crea PR su un repo contenuti.
Se vuoi tenere quel workflow:
- GitHub (merge) → job che carica su Storage + aggiorna Firestore.
- Il sito continua a leggere solo da Firestore/Storage (GitHub resta “editoriale”, non runtime).

---

## 6) Caching strategy (costi + performance)

Obiettivo: evitare che ogni request legga Firestore + Storage.

### Livello A — Cache server-side (Next)
Usare cache server-side per:
- `getArticleIndexBySlug(target, slug, lang)`
- `getArticleMarkdown(storagePath)`

Parametri consigliati:
- `revalidate: 300` (5 minuti) per l’articolo (dettaglio)
- `revalidate: 300–900` per listing (dipende dal traffico)

Invalidazione:
- sul publish, invalidare il tag dell’articolo e il tag della lista (se supportato nel tuo setup).

### Livello B — Cache HTTP/CDN (Storage + API pubbliche)
- Storage: asset statici cacheabili a lungo (con versioning o path immutabili).
- API pubbliche (se esistono): `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`.

### Livello C — Denormalizzazione minima (se serve)
Se listing diventa molto hot:
- salvare una “vista materializzata” (es. `public_cache/articles_list_v1`) aggiornata al publish.
Così 1 read per listing invece di query con più reads.

---

## 7) SEO/GEO: garanzie operative

- **Metadata** da Firestore:
  - `title`, `description`, `canonical`, OpenGraph/Twitter con cover stabile.
- **Structured data**:
  - `Article` sempre (server-generated).
  - `FAQPage` se `faq` è presente.
- **Trust signals**:
  - `datePublished` / `dateModified` coerenti.
  - autore e sezione (`target`) coerenti.
- **Bilingual**:
  - se una traduzione esiste, impostare `alternates.languages` (hreflang) e canonical corretti.

---

## 8) PWA `/learn` (offline e caching)

Lato PWA, la differenza è che i contenuti non vivono più già nel bundle statico.
Reco V1:
- Cache di **HTML della pagina** via Next/SSR cache (Livello A).
- Cache di **asset (immagini)** tramite Storage caching.
- Offline “best effort”: mostrare fallback se markdown non disponibile (non bloccare la navigazione).

---

## 9) Migrazione (zero downtime)

### Fase 0 — Preparazione
- Definire schema `articles` + naming bucket/path.
- Definire standard slug e regole bilingual (quando serve traduzione).

### Fase 1 — Backfill iniziale (da `public/content/articles/**`)
Script one-shot:
- per ogni articolo in `public/content/articles/<slug>/*.md`:
  - carica markdown e asset su Storage
  - crea doc Firestore con metadata (frontmatter) e puntatore `content.path`

### Fase 2 — Dual-read (temporaneo)
- La route articolo prova prima runtime (Firestore/Storage), fallback a Contentlayer se non trovato.
- Utile per migrazione progressiva e rollback semplice.

### Fase 3 — Switch definitivo
- Listing + sitemap + RSS leggono solo da Firestore.
- Rimuovere `generateStaticParams` basato su `allPosts` per le rotte articolo.

### Fase 4 — Cleanup
- Deprecare/limitare Contentlayer per `Post` (tenerlo solo per `Topic/Team` se utile).
- Spostare definitivamente asset articolo fuori da `public/content/articles/**`.

---

## 10) Checklist di accettazione (V1)

- [ ] Pubblicare un nuovo articolo non richiede deploy del sito.
- [ ] `/learn/[target]/[slug]` risponde server-side con metadata corretti e HTML completo.
- [ ] Sitemap e RSS includono i nuovi articoli senza deploy.
- [ ] Costi sotto controllo (cache attiva, niente letture ripetute inutili).
- [ ] Bilingual parity rispettata per gli articoli che hanno traduzione.
- [ ] PWA `/learn` non regredisce (install/update flow invariato; fallback offline sensato).

