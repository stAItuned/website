# Theme Mode (Light / Dark / System)

## Scope
- Global site theme now supports three preferences: `system`, `light`, `dark`.
- The header theme toggle cycles across all three modes.

## Behavior
- Default behavior is `system` when no stored preference exists.
- `system` resolves to the active OS preference (`prefers-color-scheme`).
- On OS theme changes, UI updates live only when preference is `system`.
- The resolved mode is mirrored on `<html>` through:
  - `class="dark"` when dark is active
  - `data-theme="light|dark"`
  - `data-theme-preference="system|light|dark"`
  - `style.colorScheme`

## UX & Accessibility
- Toggle labels are localized (`it/en`) and announce:
  - current mode
  - next mode on click
- Focus-visible styling is explicit on `.stai-icon-button`.
- Reduced motion users get minimized transitions for theme-related controls.

## Integration Notes
- Pre-hydration theme script in `app/layout.tsx` now supports `system` to reduce visual flicker.
- Persistent key remains `localStorage['theme']` with accepted values:
  - `system`
  - `light`
  - `dark`

## Verification
- Unit coverage added in `components/ThemeProvider.test.tsx` for:
  - default system resolution
  - mode cycle persistence
  - live update on OS preference changes
