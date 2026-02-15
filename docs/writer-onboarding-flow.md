# Writer Onboarding Flow

## Scope
- Single entrypoint for writer activation: `/become-writer`.
- Complete onboarding in one guided path:
  1. value proposition
  2. process overview
  3. writer profile creation
  4. contributor agreement signature

## Current Implementation
- Public entrypoint:
  - `app/(public)/become-writer/page.tsx`
- Main onboarding UI + agreement step:
  - `app/(public)/contribute/become-writer/page.tsx`
- Agreement persistence:
  - `app/api/contributor/save-progress/route.ts`
- Writer profile persistence:
  - `app/api/user/writer-profile/route.ts`
- Writer/agreement status source:
  - `app/api/user/writer-status/route.ts`
- Onboarding state model:
  - `lib/writer/onboarding-state.ts`

## Backend State Machine
- `profile_missing`: writer profile not available.
- `profile_completed`: profile exists, agreement not signed yet.
- `agreement_signed`: profile exists and agreement is signed.

State updates happen in:
- profile completion:
  - `app/api/user/writer-profile/route.ts`
- agreement signature:
  - `app/api/contributor/save-progress/route.ts`

Derived capability:
- `writerPublishEnabled = true` only when state is `agreement_signed`.

## Guardrails
- Publishing actions are blocked when agreement is missing:
  - `app/api/user/draft/route.ts`
  - `app/api/user/draft-image/route.ts`
  - `components/contribute/draft/DraftEditor.tsx`
- Wizard access for non-writers is redirected to `/become-writer`:
  - `app/(public)/contribute/wizard/WizardClient.tsx`

## Post-Agreement Behavior
- After successful agreement signature, user is redirected to `/contribute`.
- This is enforced in:
  - `app/(public)/contribute/wizard/hooks/useWizardNavigation.ts`
  - `app/(public)/contribute/become-writer/page.tsx`
