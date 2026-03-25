---
name: page-feature-doc-sync
description: Enforce documentation parity for this repository after a feature or page change. Use when code, content, routes, APIs, or UX behavior changed and the repo must identify every affected page doc, feature doc, spec, legal note, runbook, or README update required in the same change.
---

# Page Feature Doc Sync

Use this skill whenever implementation work changes behavior that future contributors or users need documented.

## Inputs
- diff or touched files
- affected routes, components, APIs, content, and docs
- existing documentation under `docs/`

## Workflow
1. Map changed files to affected pages, features, flows, and operational surfaces.
2. Identify all documentation artifacts that must change, not just the primary spec.
3. Check for page-specific docs, feature docs, deployment/runbook docs, legal/privacy docs, and localization notes.
4. Update the relevant docs or produce a concrete missing-doc list if implementation is still in progress.
5. Verify that `it/en`, SEO/GEO, and privacy notes are reflected where applicable.

## Required Checks
- Every affected page has a documentation target.
- Every affected feature has a documentation target.
- Shared behavior changes update every impacted document, not only one summary file.
- If user-facing data handling changed, include the privacy/legal documentation updates.

## Output
- documentation update map
- changed or missing doc file list
- concise summary of stale-doc risk if updates are skipped
