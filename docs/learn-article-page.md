# Learn Article Page (`/learn/[target]/[slug]`)

UpdatedAt: 2026-03-30

## Purpose and Scope

Questa pagina mostra il contenuto editoriale dell'articolo e i KPI floating gia esistenti nella rail sinistra.
Le metriche non devono introdurre UI parallele o badge aggiuntivi nel hero: la source of truth analytics deve alimentare il `FloatingShareBar`.

## Analytics Source of Truth

- SSR:
  - `app/(public)/learn/[target]/[slug]/page.tsx`
  - usa `fetchArticleAnalytics(slug)` da `lib/analytics-server.ts`
- Client refresh:
  - `ArticlePageClient` rinfresca via `GET /api/analytics/fast?slug=...`
  - la route usa lo stesso resolver canonico server-side

## Canonical Metric Resolution

- `pageViews`
  - solo da `articles/{slug}.pageViewsFirstParty` nel main db `eu-primary`
- `users`, `sessions`, `avgTimeOnPage`, `bounceRate`
  - priorita a `analytics/daily.articlesStats[slug]` nel main db `eu-primary`
  - fallback al mirror `articles/{slug}` nel main db
  - fallback read-only al legacy db `(default)` se il main db non ha ancora il dato GA sincronizzato
- `likes`
  - da `articles/{slug}.likes` nel main db

## Floating KPI Behavior

- La rail floating di sinistra mostra:
  - views se `pageViews >= 10`
  - unique visitors se `users >= 5`
  - like count secondo la logica gia esistente
- Nessun badge analytics aggiuntivo nel hero.

## Operational Notes

- La console Firestore puo mostrare dati in `(default)` anche quando l'app legge principalmente `eu-primary`.
- Il dual-read evita regressioni di visualizzazione durante la migrazione analytics, ma `eu-primary` resta il database canonico.

## Privacy / GDPR Notes

- Nessuna nuova raccolta o nuova finalita di trattamento introdotta.
- Il cambio riguarda solo la risoluzione di lettura di metriche aggregate gia esistenti nello stesso progetto Firebase.
