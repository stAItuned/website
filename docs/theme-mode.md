# Theme Mode (Light / Dark)

## Scope
- Global site theme supports two explicit preferences: `light`, `dark`.
- The header theme toggle cycles across the two modes.

## Behavior
- Default behavior is `light` when no stored preference exists.
- The resolved mode is mirrored on `<html>` through:
  - `class="dark"` when dark is active
  - `data-theme="light|dark"`
  - `data-theme-preference="light|dark"`
  - `style.colorScheme`

## UX & Accessibility
- Toggle labels are localized (`it/en`) and announce:
  - current mode
  - next mode on click
- Focus-visible styling is explicit on `.stai-icon-button`.
- Reduced motion users get minimized transitions for theme-related controls.

## Integration Notes
- Pre-hydration theme script in `app/layout.tsx` reads only explicit `light|dark` preferences to reduce visual flicker.
- Persistent key remains `localStorage['theme']` with accepted values:
  - `light`
  - `dark`

## Verification
- Unit coverage added in `components/ThemeProvider.test.tsx` for:
  - default light resolution
  - mode cycle persistence
