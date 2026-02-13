# App Hosting Environment Matrix

This document defines how environment variables are managed for Firebase App Hosting.

## Rules
- Do not rely on local `.env` during App Hosting deploy/build.
- `NEXT_PUBLIC_*` variables must be available at `BUILD` (and usually `RUNTIME`).
- Server-side secrets must be provided via Secret Manager and exposed with `secret:` bindings.
- Keep one source of truth: `apphosting.test.yaml` and `apphosting.prod.yaml`.

## Config Files
- `apphosting.test.yaml`: test backend (`pre_release`)
- `apphosting.prod.yaml`: prod backend (`master`)

Both files already include:
- required public vars for Next client/runtime
- required server vars
- secret bindings for backend integrations

## Secret Provisioning
Set one secret:

```bash
npm run apphosting:secrets:set -- SECRET_NAME
```

Sync core secrets from your current shell env:

```bash
set -a; source .env; set +a
npm run apphosting:secrets:sync -- core
```

Sync full secret set from your current shell env:

```bash
set -a; source .env; set +a
npm run apphosting:secrets:sync -- all
```

## Minimum Required Before Rollout
- `RESEND_API_KEY`
- `FB_SERVICE_ACCOUNT_KEY_B64`
- `GOOGLE_AI_API_KEY`
- `PERPLEXITY_API_KEY`
- `PREVIEW_SECRET`
- `GOOGLE_ANALYTICS_CLIENT_EMAIL`
- `GOOGLE_ANALYTICS_PRIVATE_KEY`
- `GOOGLE_ANALYTICS_PROJECT_ID`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Firebase Admin Alignment Rule
- `FB_SERVICE_ACCOUNT_KEY` and `FB_SERVICE_ACCOUNT_KEY_B64` (if both set) must refer to the same Firebase project.
- Expected project is read from `GCP_PROJECT_ID` (or fallback `NEXT_PUBLIC_FIREBASE_PROJECT_ID`).
- Runtime now fails fast on mismatch to prevent `verifyIdToken` audience drift (`aud` mismatch).

## Rollout Order
1. Update secrets.
2. Confirm backend config in Firebase Console matches repo yaml.
3. Run `npm run apphosting:rollout:test`.
4. Smoke-test.
5. Run `npm run apphosting:rollout:prod`.
