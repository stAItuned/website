# Firebase App Hosting Runbook (Test then Prod)

This runbook executes App Hosting migration using one Firebase project and two backends:
- test backend, branch `pre_release`
- prod backend, branch `master`

## Prerequisites
- Firebase CLI authenticated (`firebase login`)
- Access to project `staituned-production-163f4`
- Repo on branch `pre_release` with latest changes
- Local quality gate passed (`npm ci`, `npm test -- --run`, `npm run build`)

## 1) Create backends (one-time)
Run:

```bash
npm run apphosting:backends:create
```

Defaults used by script:
- test backend id: `staituned-test`
- prod backend id: `staituned-prod`
- region: `europe-west4`

Optional overrides:
- `APPHOSTING_TEST_BACKEND_ID`
- `APPHOSTING_PROD_BACKEND_ID`
- `APPHOSTING_REGION`
- `APPHOSTING_WEB_APP_ID`
- `FIREBASE_PROJECT_ID`

## 2) Connect branches in Firebase Console (one-time)
- Connect backend `staituned-test` to branch `pre_release`
- Connect backend `staituned-prod` to branch `master`

## 3) Apply backend config
- Base config in `apphosting.yaml`
- Optional backend-specific variants:
  - `apphosting.test.yaml`
  - `apphosting.prod.yaml`

Set runtime baseline:
- `memoryMiB: 1024`
- `minInstances: 0`
- `maxInstances: 10`
- `concurrency: 100`
- `cpu: 1`

## 4) Set secrets
Interactive:

```bash
npm run apphosting:secrets:set -- SECRET_NAME
```

Non-interactive:

```bash
npm run apphosting:secrets:set -- SECRET_NAME secret_value
```

Recommended separate secrets for test/prod integrations:
- `*_TEST` and `*_PROD` naming, then wire backend env accordingly.

## 5) Test rollout
Create rollout from branch `pre_release`:

```bash
npm run apphosting:rollout:test
```

Smoke checklist:
- Homepage SSR response
- `/learn` PWA behavior (`/sw-learn.js`, manifest)
- `/api/feedbacks`
- `/api/user/writer-profile`

## 6) Production rollout
After test smoke passes:

```bash
npm run apphosting:rollout:prod
```

## 7) Rollback
- Use Firebase Console rollback to previous App Hosting rollout revision.
- Keep current Hosting deploy scripts as fallback until App Hosting has stable releases in prod.
