# How to Award Badges

## 1. Manual Awarding (CLI)
Use the provided script to award a specific badge to an author.

**Usage:**
```bash
npx tsx scripts/award-badge.ts <author-slug> <badge-id>
```

**Example:**
```bash
npx tsx scripts/award-badge.ts Daniele-Moltisanti editor-approved
```

## 2. Automatic Calculation (API/Cron)
Trigger the automatic calculation rule engine for all authors or a specific one.

**Endpoint:** `POST /api/badges/calculate`
**Headers:** `Authorization: Bearer <Firebase ID token of admin user>`
**Body:** `{"author":"<author-slug>"}` (optional, omitted = all authors)

**Example (Local):**
```bash
curl "http://localhost:3000/api/badges/calculate" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_FIREBASE_ID_TOKEN>" \
  -d '{"author":"daniele-moltisanti"}'
```

Notes:
- Article source for badge eligibility is now Firestore-first (`articles` collection), with filesystem fallback (`public/content/articles`) for legacy content.
- Author slug mapping is aligned with writer profile slugs in Firestore to avoid mismatches between display name and slug.

## 3. Configuration
Badges are defined in `lib/config/badge-config.ts`. To add new badges, update this file first.
