# Brand Kit

## Scopo
Documento unico di riferimento per il brand kit del sito `stAItuned`.

Questo file serve a chiarire:
- quali elementi di brand sono canonici nel repository;
- dove si trovano i token visivi e i metadati di brand;
- quali file derivano da tali token;
- quali aree oggi risultano duplicate o parzialmente disallineate.

## Stato Attuale
Al momento il brand kit non vive in un solo file sorgente. Il sistema reale e distribuito tra configurazione, token Tailwind, variabili CSS globali e alcuni file feature-specific.

Questo documento e quindi la fonte unica di verita documentale, anche se la fonte unica di verita implementativa non e ancora stata completata.

## Identita Di Brand
Riferimento principale: [lib/brand.ts](/Users/moltisantid/Personal/website/lib/brand.ts)

Elementi definiti:
- Nome brand: `stAItuned`
- Tagline: `AI e GenAI concreta per tutti`
- Descrizione breve sito
- URL canonico: `https://staituned.com`
- Asset logo e immagini base
- Contatti e social ufficiali

Uso previsto:
- metadata SEO;
- email brandizzate;
- schema.org e structured data;
- riferimenti testuali condivisi del brand.

## Palette E Gradienti
Riferimento principale: [config/brand-palette.json](/Users/moltisantid/Personal/website/config/brand-palette.json)

Token definiti:
- `colors.primary`
- `colors.secondary`
- `colors.accent`
- `colors.brand`
- `gradients.brand`
- `gradients.brandSubtle`
- `gradients.hero`
- `gradients.text`
- `gradients.lab`

Ruolo del file:
- contiene la palette cromatica base usata dal tema;
- alimenta `tailwind.config.cjs`;
- viene riesposta tramite `lib/brand.ts`.

Limite attuale:
- non rappresenta da sola il brand kit reale del sito, perche molte decisioni visive finali vivono in CSS globale e in token locali a specifiche feature.

## Tema Tailwind
Riferimento principale: [tailwind.config.cjs](/Users/moltisantid/Personal/website/tailwind.config.cjs)

Qui la palette viene mappata nei token Tailwind:
- `primary`
- `secondary`
- `accent`
- `brand`

Inoltre definisce:
- font di base `font-sans` su Montserrat;
- breakpoint responsivi (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`);
- animazioni condivise.

Uso previsto:
- tutte le nuove UI devono preferire i token Tailwind derivati da questa configurazione, non colori hardcoded.

## Variabili CSS Globali
Riferimento principale: [app/globals.css](/Users/moltisantid/Personal/website/app/globals.css)

Questo file descrive gran parte del look reale del sito.

Elementi definiti:
- superfici globali (`--stai-bg`, `--stai-bg-secondary`);
- testo e testo secondario (`--stai-text`, `--stai-text-muted`);
- bordi e ombre (`--stai-border`, `--stai-card-shadow-rgb`);
- accenti (`--stai-accent`, `--stai-accent-strong`);
- background atmosferici e glow (`--stai-gradient`, `--stai-glow-layer`);
- varianti light e dark mode.

Uso previsto:
- shell applicativa;
- pannelli glass;
- link, drawer, selezioni, pulsanti iconici;
- atmosfera visiva globale del sito.

Nota importante:
- questa e una delle vere fonti del brand percepito, anche se non e la fonte canonica dei token base.

## Font
Riferimenti principali:
- [tailwind.config.cjs](/Users/moltisantid/Personal/website/tailwind.config.cjs)
- [app/layout.tsx](/Users/moltisantid/Personal/website/app/layout.tsx)

Font brand di base:
- `Montserrat` tramite `next/font/google`

Uso previsto:
- `font-sans` per l'interfaccia;
- varianti Montserrat anche nei PDF generati lato app.

## Asset Brand
Riferimento principale: [lib/brand.ts](/Users/moltisantid/Personal/website/lib/brand.ts)

Asset attualmente registrati:
- logo simbolo: `/assets/general/logo.svg`
- logo testuale chiaro: `/assets/general/logo-text.png`
- logo testuale scuro: `/assets/general/logo-text-dark.png`
- immagine hero base: `/assets/general/home_bg.webp`

## Aree Con Duplicazione O Disallineamento
### Token feature-specific
Riferimento: [app/(public)/contribute/brand-tokens.css](/Users/moltisantid/Personal/website/app/(public)/contribute/brand-tokens.css)

Problema:
- replica token gia presenti nella palette centrale;
- introduce gradienti e variabili locali che possono divergere dal tema globale.

### Look reale oltre la palette
Riferimento: [app/globals.css](/Users/moltisantid/Personal/website/app/globals.css)

Problema:
- molte scelte visive finali non sono espresse in `config/brand-palette.json`;
- quindi la palette base non basta a descrivere il brand kit effettivo.

## Gerarchia Consigliata
Ad oggi, per leggere correttamente il brand kit del progetto, la gerarchia pratica e:

1. [docs/brand-kit.md](/Users/moltisantid/Personal/website/docs/brand-kit.md) come riferimento documentale unico.
2. [lib/brand.ts](/Users/moltisantid/Personal/website/lib/brand.ts) per identita, asset e costanti condivise.
3. [config/brand-palette.json](/Users/moltisantid/Personal/website/config/brand-palette.json) per palette e gradienti base.
4. [tailwind.config.cjs](/Users/moltisantid/Personal/website/tailwind.config.cjs) per i token di tema consumati dai componenti.
5. [app/globals.css](/Users/moltisantid/Personal/website/app/globals.css) per l'espressione visiva finale del sito.

## Regole Operative
- Per cambiare nome, tagline, asset o URL del brand, aggiornare `lib/brand.ts`.
- Per cambiare palette e gradienti base, aggiornare `config/brand-palette.json`.
- Per cambiare i token disponibili in Tailwind, aggiornare `tailwind.config.cjs`.
- Per cambiare atmosfera visiva globale, superfici, glow, dark mode e semantic CSS variables, aggiornare `app/globals.css`.
- Evitare nuovi file di token locali se i valori possono essere derivati dai token globali esistenti.

## Prossimo Passo Consigliato
Per avere una vera single source of truth implementativa, il refactor corretto sarebbe:
- ridurre o eliminare i token duplicati in `app/(public)/contribute/brand-tokens.css`;
- spostare i semantic token globali in una struttura piu esplicita;
- fare derivare il piu possibile `globals.css` e le feature locali da una sorgente unica di token.
