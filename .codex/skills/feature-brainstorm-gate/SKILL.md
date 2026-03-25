---
name: feature-brainstorm-gate
description: Create the mandatory brainstorming markdown before implementing any new feature or new page in this repository. Use when the user asks for a new feature, a new page, a new flow, or a significant product addition. The skill creates or updates docs/brainstorms/YYYY-MM-DD-<slug>.md, captures scope, affected surfaces, SEO/GEO, bilingual impact, testing, and privacy screening, then stops to request explicit user confirmation before implementation.
---

# Feature Brainstorm Gate

Use this skill for every new feature request and every new page request in this repo.

## Inputs
- user request
- current date
- affected routes/components if already known
- related docs/specs if they already exist

## Workflow
1. Create or update `docs/brainstorms/YYYY-MM-DD-<slug>.md` using `docs/brainstorms/TEMPLATE.md`.
2. Fill in the minimum required sections: goal, non-goals, assumptions, open questions, affected surfaces, UX direction, SEO/GEO, `it/en` scope, technical direction, validation plan, and documentation plan.
3. If the request may touch analytics, auth, forms, tracking, storage, vendors, or personal data, add an initial privacy screening and note that `gdpr-feature-gate` must be used before implementation.
4. Share a concise summary with the user and ask for explicit confirmation.
5. Do not implement the feature until confirmation is received.

## Required Checks
- The file path follows `docs/brainstorms/YYYY-MM-DD-<slug>.md`.
- The brainstorming notes identify every affected page and feature doc that will need updates.
- The notes explicitly state whether the request is indexable and whether `it/en` parity is required.

## Output
- brainstorming markdown file created or updated
- concise summary for user review
- explicit confirmation gate before coding
