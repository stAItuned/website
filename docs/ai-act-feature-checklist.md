# AI Act Feature Checklist

Use this checklist before implementing or releasing any feature that introduces or changes AI systems, GenAI capabilities, model integrations, recommendation/scoring logic, agentic workflows, synthetic content generation, or user-facing AI claims.

## Latest Completed Review (Role Fit Audit - Strategy A Hardening)

### 1. Review Snapshot
- Feature/change: Workstream 3 Strategy A hardening on `role_fit_audit` flow
- Date: 2026-03-22
- Owner: stAItuned engineering
- Status: `approved`
- Related brainstorming/spec: `plan.md` -> "Workstream 3 - Role Fit Audit conforme e ridotto nel rischio"

### 2. AI System Description
- Is this feature AI-enabled? `yes`
- Concrete use case: generate a personalized career-fit report with AI support after questionnaire submission
- Primary users: individual users requesting the Role Fit Audit report
- Inputs consumed by the AI capability: questionnaire answers, optional name, optional social link, operational prompt instructions
- Outputs produced: structured personalized report, summary, scores, and recommendations sent to the user
- What decision, workflow, or user action do the outputs influence? user interpretation of strengths/gaps and follow-up guidance; internal service follow-up prioritization

### 3. Practical AI Act Posture
- Initial classification: `transparency-limited-risk concern`
- Reasoning for classification: the flow generates personalized AI-assisted content and profiling-like guidance, but does not automate legal or similarly significant decisions in the current scope
- Is deeper legal review required? `yes`

### 4. Transparency and User Notice
- Does the user need to know AI is involved? `yes`
- Required labels/notices: clear disclosure that the report is AI-assisted and should be interpreted as guidance, not a binding assessment
- User-facing limitations or caveats to disclose: possible inaccuracies, non-deterministic output quality, need for user judgment
- Content authenticity/synthetic-output disclosure needed: `yes`
- Marketing/product claim updates required: avoid overstating objectivity, precision, or career outcome certainty

### 5. Human Oversight and Escalation
- Is human review required before actioning the AI output? `no` for current self-service delivery; `yes` for any future use in ranking, screening, or employment-like decisions
- Override/fallback path: support contact and internal review if a user disputes or questions the generated output
- Escalation path for incorrect/harmful outputs: route to internal product/privacy review, update prompt/guardrails, and issue corrected communication if needed
- Who is accountable for reviewing the output in practice? stAItuned product/operations owners for the flow

### 6. Risk and Safety Controls
- Main failure modes: hallucinated recommendations, overconfident framing, unfair or misleading career suggestions
- Accuracy/reliability constraints: output is advisory and depends on user-provided inputs plus model variability
- Abuse or misuse scenarios: using the report as a hiring or exclusion decision artifact outside intended scope
- Guardrails in place: privacy consent enforcement, minimized internal notifications, product/legal wording hardening, operational review path
- Logging/auditability requirements: retain enough submission metadata and versioning to reconstruct review context without expanding exposure unnecessarily
- Monitoring/incident response needs: periodic review of complaints, output quality issues, and any drift in internal use

### 7. Vendor and Model Dependencies
- Model/vendor/provider involved: Google Gemini
- Hosted or external API: external API
- Model/version variability risk: `yes`
- Prompt/system-instruction sensitivity: `yes`
- Additional contractual or operational review required: monitor provider changes and re-run review if model behavior or intended use changes materially

### 8. Data and Privacy Interaction
- Personal data involved: `yes`
- If yes, does `docs/gdpr-feature-checklist.md` also need completion? `yes` (completed)
- Sensitive or high-risk inferred attributes involved: `potentially yes` at the level of career profiling-like inference
- Dataset provenance concerns: outputs are derived from user-provided questionnaire data plus model inference

### 9. Documentation and Operational Updates
- Product/page docs to update:
  - `docs/role-fit-audit-bilingual.md`
  - `plan.md`
- Legal/compliance docs to update:
  - `docs/dpia-screening-role-fit-audit.md`
  - `docs/gdpr-feature-checklist.md`
- Internal runbooks to update:
  - future AI governance/runbook notes when escalation flow is formalized
- Support/training enablement needed: support should know the report is AI-assisted and non-binding
- Bilingual `it/en` updates required: `yes`

### 10. Release Gate
- Blocking gaps: no release blocker for current Strategy A scope; re-review required if the report starts influencing employment-like decisions or automated prioritization materially
- Required actions before release: keep disclosure accurate, maintain support escalation path, and re-run review on major model/use-case changes
- Reviewer: AI Act implementation gate (`ai-act-checker`) + privacy gate (`gdpr-feature-gate`)
- Decision: `approved`
- Notes: approved for current advisory/self-service scope with monitoring

## 1. Review Snapshot
- Feature/change:
- Date:
- Owner:
- Status: `draft | in-review | approved | blocked`
- Related brainstorming/spec:

## 2. AI System Description
- Is this feature AI-enabled? `yes/no`
- Concrete use case:
- Primary users:
- Inputs consumed by the AI capability:
- Outputs produced:
- What decision, workflow, or user action do the outputs influence?

## 3. Practical AI Act Posture
- Initial classification:
  - `prohibited-risk concern`
  - `high-risk concern`
  - `transparency-limited-risk concern`
  - `minimal-risk/internal tooling concern`
  - `unclear-needs-review`
- Reasoning for classification:
- Is deeper legal review required? `yes/no`

## 4. Transparency and User Notice
- Does the user need to know AI is involved? `yes/no`
- Required labels/notices:
- User-facing limitations or caveats to disclose:
- Content authenticity/synthetic-output disclosure needed: `yes/no`
- Marketing/product claim updates required:

## 5. Human Oversight and Escalation
- Is human review required before actioning the AI output? `yes/no`
- Override/fallback path:
- Escalation path for incorrect/harmful outputs:
- Who is accountable for reviewing the output in practice?

## 6. Risk and Safety Controls
- Main failure modes:
- Accuracy/reliability constraints:
- Abuse or misuse scenarios:
- Guardrails in place:
- Logging/auditability requirements:
- Monitoring/incident response needs:

## 7. Vendor and Model Dependencies
- Model/vendor/provider involved:
- Hosted or external API:
- Model/version variability risk:
- Prompt/system-instruction sensitivity:
- Additional contractual or operational review required:

## 8. Data and Privacy Interaction
- Personal data involved: `yes/no`
- If yes, does `docs/gdpr-feature-checklist.md` also need completion? `yes/no`
- Sensitive or high-risk inferred attributes involved: `yes/no`
- Dataset provenance concerns:

## 9. Documentation and Operational Updates
- Product/page docs to update:
- Legal/compliance docs to update:
- Internal runbooks to update:
- Support/training enablement needed:
- Bilingual `it/en` updates required:

## 10. Release Gate
- Blocking gaps:
- Required actions before release:
- Reviewer:
- Decision: `approved | needs changes | blocked`
- Notes:
