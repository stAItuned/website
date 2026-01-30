# Project Specification: [Feature Name]

## 1. Context & Goal
* **Objective:** Create a [specific component/feature].
* **User Story:** As a user, I want to [action] so that [benefit].
* **Current State:** The system currently [describe existing state].

## 2. Technical Requirements
* **Stack:**
    *   **Framework:** Next.js 16 (App Router)
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS (Use project theme: `primary`, `secondary`, `accent`)
    *   **Icons:** `lucide-react`
    *   **Responsiveness:** Mobile-first, fully responsive (xs to xl).
* **Files to Touch:**
    *   `src/components/[ComponentName].tsx`
    *   `app/[route]/page.tsx`
* **Data Structure:**
    *   Ensure strict typing with TypeScript interfaces.


## 3. Detailed Acceptance Criteria (The "Definition of Done")
* [ ] The button must be blue (#0055FF) and change to dark blue on hover.
* [ ] It must call the API endpoint `/api/v1/submit` via POST.
* [ ] If the API fails, show a toast notification (do not alert()).
* [ ] Must pass all existing linting rules defined in `.agent/skills/style-check`.
* [ ] **Responsiveness:** UI is fully responsive (tested on Mobile 375px and Desktop 1440px).
* [ ] **Documentation:** code is well-documented (JSDoc for functions, logic explained).
* [ ] **Unit Tests Passed:** `npm run test` (Vitest) passes.

## 4. Constraints & Non-Goals
* **DO NOT** use any third-party UI libraries; use existing CSS modules.
* **DO NOT** implement authentication yet; assume the user is logged in.
* **Mobile experience must be as feature-complete as desktop.**
