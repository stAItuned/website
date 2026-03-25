---
name: localized-page-change-check
description: Validate bilingual parity for this repository when a page, route, metadata, article, legal copy, CTA, or user-facing string changes. Use when implementation affects Italian and English content or UX and the change must confirm it/en parity across functionality, copy, metadata, SEO/GEO signals, and update markers such as updatedAt or changelog when relevant.
---

# Localized Page Change Check

Use this skill whenever a user-facing change may affect Italian and English parity.

## Inputs
- diff or changed files
- affected routes, content files, metadata generators, and i18n dictionaries
- existing localized docs or legal text when relevant

## Workflow
1. Identify whether the affected surface exists in one or both locales.
2. Map all changed copy, CTAs, metadata, structured data, and legal strings that require parity.
3. Check that functionality and UX remain aligned across `it` and `en`, including empty/error/success states.
4. For content or article updates, verify `updatedAt`, changelog, `asOf`, and structured data parity when applicable.
5. Flag any placeholder, untranslated, or meaning-shifted text as blocking.
6. Update or list the localized files and docs that must change before completion.

## Required Checks
- Locale-specific metadata is aligned for both languages when the route is localized.
- CTA intent and legal/privacy meaning are preserved in translation.
- No one-language-only regression is introduced for shared features.
- SEO/GEO answer-first summaries and trust signals remain coherent across locales.

## Output
- bilingual parity review summary
- list of localized files or docs to update
- blocking translation or parity gaps
