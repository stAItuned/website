# Admin Dashboard Mobile Navigation

## Purpose and Scope
This update improves the mobile UX of `/admin` by providing full route navigation parity with desktop sidebar behavior.

Implemented in `components/admin/AdminSidebar.tsx`.

## What Changed
- Added a mobile sticky admin header (visible below `lg`) with:
  - quick horizontal navigation tabs
  - an expandable navigation menu (overlay drawer)
- Preserved desktop sidebar behavior (`lg` and above).
- Extended navigation map with `Reviews` (`/admin/reviews`) so review flows are reachable directly.
- Consolidated admin operations inside the admin dashboard:
  - removed admin tools from `/account/settings`
  - badge email approval/sending queue is now managed from `/admin/badges`
- Reused one shared navigation source for desktop and mobile to avoid divergence.
- Added mobile-optimized data cards in:
  - `app/admin/page.tsx` for "Usage by Model" and "Daily Cost"
  - `app/admin/users/page.tsx` for users, writer status, agreement status, and quick agreement action

## UX States
- Default mobile state:
  - sticky header + horizontally scrollable quick tabs
- Expanded mobile menu:
  - full list of admin routes
  - dismiss via close button or overlay click
- Active route state:
  - current route visually highlighted in quick tabs and full menu

## Accessibility Notes
- Mobile menu trigger includes `aria-expanded`, `aria-controls`, and `aria-label`.
- Overlay menu uses `role="dialog"` + `aria-modal="true"`.
- All actions remain keyboard reachable.
- Navigation labels remain descriptive and route-specific.

## Responsive Behavior
- Mobile/tablet (`xs` to `md`): sticky top navigation + drawer menu.
- Desktop (`lg` to `xl`): fixed left sidebar unchanged in layout.
- Mobile/tablet (`xs` to `md`) in data-heavy views:
  - cards and stacked key-value metrics replace wide tables
  - agreement action remains visible without horizontal scrolling
- Desktop (`md` and above in these views): original table layout is preserved.

## PWA / SEO / GEO Impact
- No impact on `/learn` PWA scope.
- No impact on indexable metadata or structured data.

## Bilingual Impact
- No locale-specific content contracts changed.
- Admin route labels remain consistent with current admin UX language.

## Extension Points
- Add/remove admin sections by editing the shared `navigation` array in `components/admin/AdminSidebar.tsx`.
- Route matching logic is centralized in `isRouteActive`.
