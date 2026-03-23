# Runbook: Admin PWA Operational Notifications (WS6)

Data: 2026-03-23  
Owner: stAItuned engineering

## Scopo

Gestire in sicurezza il canale notifiche operative admin-only via PWA:
- topic FCM dedicato `admin-ops`;
- payload metadata-only (nessuna PII utente finale);
- dettaglio eventi consultabile solo in dashboard `/admin`.

## Componenti coinvolti

- UI admin opt-in:
  - `components/admin/AdminPushNotificationsCard.tsx`
- API protette:
  - `POST /api/admin/notifications/register`
  - `POST /api/admin/notifications/unregister`
  - `POST /api/admin/notifications/subscribe`
  - `POST /api/admin/notifications/unsubscribe`
- Dispatcher eventi:
  - `lib/notifications/adminOpsPush.ts`
- Dataset token:
  - `fcm_admin_tokens` (retention 90 giorni, hard delete via WS5 lifecycle)

## Prerequisiti

- Account admin autenticato e in allowlist `ADMIN_EMAILS`.
- Variabili Firebase Messaging disponibili lato client/server:
  - `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
  - configurazione Firebase app valida.
- Browser/PWA con supporto Notification + Service Worker.

## Attivazione notifiche (admin)

1. Accedere a `/admin` con account in allowlist.
2. Nella card “Notifiche Operative Admin (PWA)” premere `Attiva notifiche operative`.
3. Accettare il permesso browser.
4. Verificare risposta `200` su `POST /api/admin/notifications/register`.

Esito atteso:
- token salvato in `fcm_admin_tokens/{token}`;
- topic include `admin-ops`;
- `active: true`, `subscriptionStatus: active`.

## Smoke test post-deploy

1. Verifica API sicurezza:
   - senza bearer su register -> `401`
   - bearer non-admin -> `403`
2. Verifica register admin:
   - `POST /api/admin/notifications/register` con token valido -> `200`
3. Verifica evento form:
   - inviare un submit test su una route in scope (es. `POST /api/contact`)
   - ricevere push su dispositivo admin con testo metadata-only.
4. Verifica deep link:
   - click sulla notifica apre route admin prevista (`/admin`, `/admin/role-fit`, `/admin/contributions`).
5. Verifica payload:
   - nessuna email/nome/messaggio libero nel payload push.

## Disattivazione notifiche

Da UI admin:
- premere `Disattiva`.

Esito atteso:
- chiamata `POST /api/admin/notifications/unregister` -> `200`
- token marcato `active: false`, `subscriptionStatus: inactive`, `topics: []`.

## Troubleshooting rapido

### 1) Permesso browser negato
- Stato card: `permission_denied`.
- Azione: riabilitare notifiche dalle impostazioni browser/PWA.

### 2) Errore register/unregister (`4xx/5xx`)
- Controllare token Firebase ID admin nel bearer.
- Verificare presenza email in allowlist `ADMIN_EMAILS`.
- Verificare configurazione VAPID e service worker `/firebase-messaging-sw.js`.

### 3) Notifica non ricevuta
- Confermare token `active=true` e topic `admin-ops` in Firestore.
- Verificare che evento submit abbia log di dispatch senza errori.
- Controllare stato permission browser (`granted`).

## Rollback operativo

Rollback senza perdita dati applicativi:
1. Disattivare uso UI card (feature-flag o rimozione temporanea dal deploy).
2. Eseguire `unregister` per token admin attivi.
3. Sospendere dispatch push (comment/flag in `sendAdminOpsNotification` call sites).

Note:
- Nessun rollback necessario su dati utente finale (payload sono metadata-only).
- Token admin residui vengono comunque ripuliti dal lifecycle WS5 (`fcm_admin_tokens`).

## Monitoraggio 7 giorni (post-rollout)

- Error rate endpoint admin notifications (`register/unregister/subscribe/unsubscribe`).
- Delivery rate notifiche push admin su eventi principali.
- Verifica periodica assenza PII nei payload/log dei canali notifiche.
- Drift retention su `fcm_admin_tokens` (dry-run lifecycle).
