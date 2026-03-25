---
name: ai-act-checker
description: Review a planned or implemented AI feature in this repository for EU AI Act impact. Use when a change introduces or modifies AI systems, GenAI features, model integrations, scoring, recommendations, automated outputs, AI-assisted decisions, agentic workflows, model vendors, or user-facing AI claims. The skill identifies likely AI Act posture, required transparency and human-oversight checks, operational gaps, and documentation that must be updated before release.
---

# AI Act Checker

Use this skill whenever a feature may qualify as an AI system or may change the compliance posture of an existing AI-enabled flow.

## Inputs
- feature request, brainstorming doc, spec, or diff
- affected routes, APIs, model vendors, prompts, workflows, and outputs
- existing AI-related docs and legal text when relevant

## Workflow
1. Identify whether the feature includes an AI system, a GPAI-backed capability, or an AI-assisted workflow with user or internal impact.
2. Describe the concrete use case: who uses it, what input it takes, what output it produces, and what action the output influences.
3. Classify the likely posture at a practical level: `prohibited-risk concern | high-risk concern | transparency-limited-risk concern | minimal-risk/internal tooling concern | unclear-needs-review`.
4. Check required controls for the likely posture, including transparency to users, human oversight, escalation paths, logging/auditability, accuracy limitations, fallback behavior, and claims discipline.
5. Check whether vendor dependencies, model changes, prompt behavior, or generated outputs create new documentation or operational obligations.
6. List the docs, product copy, runbooks, and internal controls that must change before release.
7. If the feature also processes personal data, require `gdpr-feature-gate` in parallel rather than treating AI Act review as a substitute.
8. Use `docs/ai-act-feature-checklist.md` as the standard review artifact and fill the relevant sections before implementation or release.

## Required Checks
- State clearly whether the feature is AI-enabled or not.
- State what business or user decision the AI output influences.
- State whether users need a transparency notice or labeling.
- State whether human review/override is needed.
- State whether the feature creates a potential high-risk or prohibited-use concern that requires deeper legal review.
- State which product/legal/docs artifacts must be updated.

## Repo References
Read only what is needed:
- `docs/ai-eu-act-landing.md` for repo framing of AI Act messaging and scope
- `docs/ai-act-feature-checklist.md` for the standard implementation/release review artifact
- `lib/i18n/ai-eu-act-translations.ts` for existing user-facing AI Act language
- `public/content/articles/gdpr-ai-rework-costs/article.md` when GDPR/AI Act boundaries need clarification

## Output
- AI Act review summary
- likely posture classification with reasoning
- blocking gaps or open questions
- required documentation and UX disclosure updates
