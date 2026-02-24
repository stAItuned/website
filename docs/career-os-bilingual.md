# Career OS bilingue (`it/en`)

## Scopo
Questo aggiornamento rende `/career-os` bilingue end-to-end con strategia allineata a `/role-fit-audit`:
- lingua determinata da query param `?lang=it|en`;
- fallback sicuro su `it`;
- UI, API, metadata e JSON-LD localizzati.

## Architettura
- Dizionario centralizzato: `lib/i18n/career-os-translations.ts`
- Toggle locale: `app/(public)/career-os/components/CareerOSLocaleToggle.tsx`
- Pagina server-first con locale da URL: `app/(public)/career-os/page.tsx`
- SEO schema localizzati: `lib/seo/career-os-seo.ts`
- Modali localizzati:
  - `app/(public)/career-os/components/modals/ApplicationModal.tsx`
  - `app/(public)/career-os/components/modals/AuditModal.tsx`
- API localizzate:
  - `app/api/career-os/apply/route.ts`
  - `app/api/career-os/audit/route.ts`
  - `app/api/career-os/waitlist/route.ts`

## Contratti aggiornati
- `POST /api/career-os/apply`
  - nuovo input opzionale: `locale: 'it' | 'en'`
  - fallback server: `it`
- `POST /api/career-os/audit`
  - nuovo input opzionale: `locale: 'it' | 'en'`
  - fallback server: `it`
- `POST /api/career-os/waitlist`
  - input: `email`, `acceptedPrivacy`, `acceptedTerms`, `marketingConsent` (opzionale), `intent` (`pricingTier`, `pricingMode`, `objective` opzionale), `locale` opzionale
  - comportamento: persistenza su Firestore + notifica Telegram + notifica email interna a `info@staituned.com`
  - fallback server locale: `it`

## Compliance
- Modal pricing aggiornata con checkbox obbligatoria per Privacy/Termini e checkbox marketing opzionale.
- Tracciamento consenso salvato lato backend nel record waitlist.
- `marketingConsent` gestito con double opt-in via email (`/api/career-os/waitlist/confirm`): consenso marketing attivo solo dopo conferma esplicita.
- Versioning consenso tracciato lato backend (`termsVersion` / `privacyVersion`) con timestamp di accettazione.
- Retention waitlist esplicita lato backend (`retentionUntil`, 12 mesi).
- Privacy/Terms (`lib/i18n/legal-translations.ts`) aggiornati con sezione esplicita su trattamento dati waitlist Career OS.

## SEO/GEO
- Canonical unico: `/career-os`
- Alternates lingua:
  - `it -> /career-os?lang=it`
  - `en -> /career-os?lang=en`
- Metadata localizzati (`title`, `description`, OG/Twitter)
- JSON-LD localizzato per `Course`, `FAQPage`, `BreadcrumbList`

## Qualità e gate
- Script parity: `scripts/verify-career-os-i18n.ts`
- Test parity: `lib/i18n/career-os-i18n.test.ts`
- Comando bloccante: `npm run check:career-os-i18n`

## Test aggiunti
- `lib/i18n/career-os-i18n.test.ts`
- `app/api/career-os/apply/route.test.ts`
- `app/api/career-os/audit/route.test.ts`
- `app/api/career-os/waitlist/route.test.ts`
- `app/(public)/career-os/components/CareerOSLocaleToggle.test.tsx`

## Note di compatibilità
- I client che non inviano `locale` mantengono comportamento esistente con risposta in italiano.
- Gli eventi analytics esistenti non sono stati rinominati.
