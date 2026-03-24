# WS7 Smoke Test (Test Environment) — 2026-03-23

## Scope
- Environment URL: `https://staituned-test--staituned-production-163f4.europe-west4.hosted.app/`
- Focus: WS7-A, WS7-B, WS7-D, WS7-C critical routes in deployed test
- Method: live HTTP smoke checks with `curl`

## Results Summary
- Passed: `POST /api/leads/ai-act`, `POST /api/career-os/apply`, `POST /api/career-os/audit`, `POST /api/notifications/register`, `POST /api/notifications/unsubscribe`, `DELETE /api/notifications/register`
- Passed (auth gate): `POST /api/account/delete` returns `401` without auth, `POST /api/contributor/save-progress` returns `401` without auth
- Passed (token-gate behavior): `/ai-eu-act/risorse` shows unlocked resources with valid token and locked state with invalid token
- Blocked/Needs real device token: `POST /api/notifications/subscribe` topic subscription success path (fake FCM token returns failure)

## Detailed Checks

| Area | Endpoint / Flow | Input | Expected | Actual |
|---|---|---|---|---|
| WS7-A | `POST /api/leads/ai-act` | valid payload (`source: "landing"`) | `200` + lead accepted | `200`, body `{"ok":true,"redirectUrl":"..."}` |
| WS7-A | `POST /api/career-os/apply` | valid payload | `200` | `200`, body `{"ok":true}` |
| WS7-A | `POST /api/career-os/audit` | valid payload | `200` | `200`, body `{"ok":true}` |
| WS7-A | `/ai-eu-act/risorse?token=valid` | token from lead redirect | resources unlocked | HTML contains direct `/assets/ai-eu-act/*` download links and `Download` CTA |
| WS7-A | `/ai-eu-act/risorse?token=invalid` | fake token | access blocked | HTML contains `Token non valido` and `Sblocca con il form di accesso` |
| WS7-B | `POST /api/notifications/register` | fake token registration | endpoint alive + validation path | `200`, body `{"success":true}` |
| WS7-B | `POST /api/notifications/subscribe` | fake token + `topic: "editorial"` | reject invalid topic | `400`, body `{"error":"Invalid topic"}` |
| WS7-B | `POST /api/notifications/subscribe` | fake token + `topic: "new-articles"` | success only with valid FCM token | `500`, body `{"error":"Failed to subscribe to topic"}` |
| WS7-B | `POST /api/notifications/unsubscribe` | fake token + topic | endpoint alive + graceful behavior | `200`, body `{"success":true}` |
| WS7-B | `DELETE /api/notifications/register` | fake token | endpoint alive + unregister path | `200`, body `{"success":true}` |
| WS7-D | `POST /api/account/delete` | no auth | unauthorized | `401`, body `{"success":false,"error":"Unauthorized"}` |
| WS7-C | `POST /api/contributor/save-progress` | no auth | unauthorized | `401`, body `{"success":false,"error":"Unauthorized"}` |

## Notes / Constraints
- `subscribe` success path cannot be validated with a fake token; a real browser/device FCM token is required.
- Authenticated success paths for `account/delete` and `contributor/save-progress` require a real Firebase ID token from a test user session.

## Next Test Actions (to close remaining runtime gaps)
1. Re-run `POST /api/notifications/subscribe` with a real token captured from test PWA/browser and topic `new-articles`.
2. Re-run `POST /api/account/delete` with authenticated bearer token and confirm dataset summary response.
3. Re-run `POST /api/contributor/save-progress` authenticated and verify expected persisted state.
