# AI EU Act Landing

## Scopo
Landing page pubblica su `/ai-eu-act` per spiegare:
- cosa comporta in pratica l'AI Act;
- quali passi operativi servono per mettersi in regola;
- come ottenere toolkit pratici (playbook, roadmap, template inventory).

## Architettura
- Pagina: `app/(public)/ai-eu-act/page.tsx`
- Form client: `app/(public)/ai-eu-act/components/AiEuActLeadForm.tsx`
- Viewer preview risorse a tab: `app/(public)/ai-eu-act/components/ToolkitPreviewTabs.tsx`
- API lead: `POST /api/leads/ai-act`
- Pagina risorse: `app/(public)/ai-eu-act/risorse/page.tsx`
- Traduzioni: `lib/i18n/ai-eu-act-translations.ts`

## Contratto Dati Lead
Collection Firestore: `leads_ai_act_tools`

Campi principali:
- `created_at` (ISO string)
- `name`, `email`, `company`, `role`
- `privacy_consent`
- `marketing_consent`
- `privacy_policy_version`
- `ip_hash` (SHA256)
- `source`
- `access_token`
- `locale`

## UX States
- `idle`: form pronto
- `loading`: submit in corso
- `success`: messaggio e redirect a `/ai-eu-act/risorse?token=...`
- `error`: errore API mostrato in pagina
- `preview_locked`: viewer unico con tab (`Playbook`, `Roadmap`, `Template`), preview pagina-per-pagina orizzontale + slide lock
- `resources_locked`: pagina `/risorse` senza token valido mostra warning e CTA di sblocco

## Accessibilita e Mobile
- Form con `label` associati e checkbox obbligatorie separate.
- Layout responsive con breakpoints `xs/md/xl`.
- CTA principali sempre visibili su mobile (nessuna azione critica nascosta).
- Viewer preview con tab keyboard/click, navigazione pagina orizzontale snap (`Prev/Next` + indicatori) e stato lock leggibile.
- Palette allineata alla home: base `slate-900` con accento `amber-*` (stesso giallo CTA della home) e superfici scure semitrasparenti.
- Palette centralizzata: token colore e gradienti condivisi in `config/brand-palette.json`, consumati da `tailwind.config.cjs` e `lib/brand.ts`; `app/globals.css` usa i token Tailwind via `theme('colors.*')` per le variabili globali.

## SEO/GEO
- Metadata locali (`it/en`) con canonical e alternates.
- FAQ in JSON-LD (`FAQPage`) per supporto SEO/GEO.
- Struttura heading semantica `h1 -> h2 -> h3`.

## Bilingual Parity
- Contenuti e copy principali mantenuti in italiano e inglese con struttura equivalente.
- Cambio lingua via query param `?lang=it|en`.
- Sezione unificata `whyNow`, viewer preview a tab e messaggi lock/sblocco mantenuti in parita `it/en`.
