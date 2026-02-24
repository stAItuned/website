# Role Fit Audit bilingue (`it/en`)

## Scopo
Questo aggiornamento rende `/role-fit-audit` bilingue con strategia single-source:
- logica e scoring condivisi;
- copy/UI/output localizzati via dictionary;
- gate bloccante di parità linguistica.

## Architettura
- Dizionario: `lib/i18n/role-fit-audit-translations.ts`
- Domande localizzate: `app/(public)/role-fit-audit/lib/questions.ts`
- Scoring invariato: `app/(public)/role-fit-audit/lib/scoring.ts`
- Submit/API: `app/api/role-fit-audit/submit/route.ts`
- AI generation: `lib/ai/roleFitAuditAI.ts`
- Email/PDF: `lib/email/roleFitAuditEmail.ts`, `lib/pdf/RoleFitAuditPDF.tsx`

## Contratti aggiornati
- `POST /api/role-fit-audit/submit`
  - nuovo input: `locale: 'it' | 'en'`
  - fallback: `it`
- `sendRoleFitAuditReportEmail`
  - nuova firma con `locale`
- `generateAIAuditResult`
  - nuova firma con `locale`

## Qualità e gate
- Script bloccante: `npm run check:role-fit-i18n`
- Verifica:
  - chiavi presenti in entrambe le lingue;
  - stringhe vuote;
  - placeholder/testi incompleti.

## Test
- `lib/i18n/role-fit-audit-i18n.test.ts`
  - parità domande `it/en`;
  - invarianza scoring/archetipo;
  - validazione parity script.
