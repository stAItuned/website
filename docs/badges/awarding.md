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

**Endpoint:** `GET /api/badges/calculate`
**Headers:** `Authorization: Bearer <CRON_SECRET>`

**Example (Local):**
```bash
curl "http://localhost:3000/api/badges/calculate?author=Daniele-Moltisanti" \
  -H "Authorization: Bearer dev-secret-key"
```

## 3. Configuration
Badges are defined in `lib/config/badge-config.ts`. To add new badges, update this file first.
