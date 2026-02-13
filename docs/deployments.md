# Deployments (Test vs Prod)

This repository deploys via Firebase Hosting with two environment configs.

## Targets
- `development` (test/staging) -> Hosting site `staituned-dev-42883`
- `production` -> Hosting site `staituned-production`

The configuration lives in:
- `.firebaserc` (project aliases/targets)
- `firebase.json` (default production hosting config)
- `firebase.development.json` (development hosting config)

## Commands
Using npm scripts:
- `npm run deploy:test` (deploy `development`)
- `npm run deploy:prod` (deploy `production`)

Using Firebase CLI directly:
- `firebase deploy --only hosting` (deploys production from `firebase.json`)
- `firebase deploy --only hosting --config firebase.development.json` (deploys development)

## Recommended Flow (Good Prod Proxy)
1) Deploy `development` (staging): `npm run deploy:test`
2) Run smoke checks against `staituned-dev-42883`
3) Deploy `production`: `npm run deploy:prod`

## Environment/Secrets Notes
- Keep test/staging integrations isolated from production (tokens, webhooks, analytics IDs).
- If full data isolation is required, create a separate Firebase project and map a new project alias + targets in `.firebaserc`.

## Build-Time Firestore Note
`next build` can prerender Server Components for static routes. If your build environment has restricted DNS/egress, Firestore (Admin SDK) calls can fail with `14 UNAVAILABLE` (name resolution).

This repo defaults to skipping Firestore network calls during build-time prerender. To allow them (when the build environment has egress), set `NEXT_BUILD_ALLOW_FIRESTORE=1`.

## Smoke Checklist (Minimal)
- Verify homepage renders and static assets are cached as expected.
- Verify `/learn` PWA behavior (manifest + service worker registration) is unchanged.
- Verify critical API routes respond (e.g. `/api/feedbacks`, `/api/user/writer-profile`).

## Roadmap: Firebase App Hosting
Action plan for migrating from Hosting `frameworksBackend` to App Hosting lives in `docs/app-hosting-action-plan.md`.

## Stability Notes
- The deploy script enforces Node `>=20.9.0` and allows Node 20/22+.
- Hosting deploy uses webpack build path (`NEXT_PRIVATE_TURBOPACK=false`) for Firebase stability.
