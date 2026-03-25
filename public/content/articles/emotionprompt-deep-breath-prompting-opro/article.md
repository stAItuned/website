---
title: "10 weird prompt hacks (EmotionPrompt, “deep breath”, OPRO): what works, what breaks, how to test"
author: Daniele Moltisanti
target: Expert
language: English
cover: >-
  https://storage.googleapis.com/editorial-planner-images/article-images/7ef8da6c-3d51-4bd0-a32f-ca18ecd28d6b/cover_20260218_163714.webp
meta: >-
  Evidence-backed psychological prompting: OPRO "deep breath", EmotionPrompt, personas + Self-Refine, plus A/B rubric, CI stop-rules, and safety failure modes.
date: 2026-02-19T12:04:19.000Z
published: false
primaryTopic: llm-evaluation
topics:
  - agents
  - production
  - llm-security
updatedAt: 2026-02-23T14:30:00.000Z
changelog:
  - date: 2026-02-23T14:30:00.000Z
    version: "1.3"
    title: "GEO-Structure & Evidence Hardening"
    changes:
      - "Removed redundant sections and duplicate diagrams."
      - "Softened mechanism claims: shifted distribution-steering to hypothesis."
      - "Specified disinformation success rates for gpt-3.5-turbo (NP)."
      - "Reorganized H2 structure for answer-first delivery."
  - date: 2026-02-23T13:45:00.000Z
    version: "1.2"
    title: "GEO-Optimization & EEAT alignment"
    changes:
      - "Rewrote quickAnswer and Intro for answer-first delivery."
      - "Corrected OPRO table references and added quantitative disinformation risks."
      - "Added production-ready prompt templates and A/B testing stop-rules."
      - "Included case study as anecdotal evidence while prioritizing peer-reviewed data."
geo:
  quickAnswer:
    title: "Psychological Prompting: Measure, Do Not Guess"
    bullets:
      - "**Answer-first:** These “weird” cues help only if they measurably improve pass-rate under strict cost + safety constraints."
      - "**Mechanism (safe)**: Psychological prompting does not *motivate* the LLM; it can shift the output distribution. The causal mechanism is not proven; treat “training-cluster” explanations as hypothesis and validate per task."
      - "**OPRO *Deep Breath***: Adding *Take a deep breath and work step-by-step* reached **80.2%** on GSM8K (vs 71.8% baseline). [[3](#ref-3)]."
      - "**EmotionPrompt**: Reported **+10.9%** avg improvement and **+115%** on BBH. Caution: increases hallucination and disinformation risks. [[1](#ref-1)]."
      - "**Self-Refine**: Use a *draft → critique → revise* loop with rubric-based external checks (SCA/MACE). [[4](#ref-4)]."
    oneThing: "Keep “deep breath” only if pass-rate rises without token bloat (and without safety drift)."
  audience:
    title: "Who is this for"
    description: "Developers and AI practitioners seeking rigorous, production-grade LLM outputs by applying and measuring optimized prompting techniques."
  definition:
    term: "EmotionPrompt and OPRO *Deep Breath* Prompting"
    definition: "Evidence-backed prompting families that shift output distributions toward structured reasoning; requires measurement-based validation."
  decisionRules:
    title: "Decision Rules"
    rules:
      - if: "Goal is to activate deeper reasoning and structural analysis"
        then: "Test OPRO instruction: *Take a deep breath and work on this problem step-by-step*."
        example: "OPRO reports 80.2% on GSM8K vs 71.8% baseline (Table 1, OPRO v3)."
      - if: "Seeking higher quality or professional solutions"
        then: "Use stakes framing + personas sparingly and monitor hallucination delta."
        example: "Emotional framing amplifies disinformation generation (PMC12009909)."
      - if: "Requiring production-grade reliability"
        then: "Implement a Self-Refine loop with a strict stop-rule (e.g., score >= 0.85)."
        example: "Self-Refine: iterative feedback loops improve complex generation tasks."
  pitfalls:
    - pitfall: "Assuming incentives guarantee correctness"
      cause: "Psychological triggers can increase verbosity without raising the raw pass-rate."
      mitigation: "A/B test with an *Actionability* rubric and stop-rules to avoid token waste."
      isCommon: true
    - pitfall: "Relying on generic personas"
      cause: "Generic roles fail to narrow the search space of the model, leading to broad, uninspired outputs by not acting as effective steering vectors."
      mitigation: "Use granular, task-specific personas (e.g., *Senior Architect, 15yrs Dist. Systems*) to target specialized training clusters."
    - pitfall: "Vulnerability to disinformation amplification"
      cause: "Psychological vectors can increase the success rate of disinformation generation [Emotional prompting amplifies disinformation generation in AI large language models](https://pmc.ncbi.nlm.nih.gov/articles/PMC12009909/)."
      mitigation: "Couple high-performance prompts with rigorous output validation."
  checklist:
    title: "Action Checklist: Testable Implementation"
    items:
      - "Baseline: Use a neutral *Let us think step by step* as the control."
      - "Variant A: Add **OPRO *Deep Breath*** prefix."
      - "Variant B: Add **Granular Persona** (e.g., *Senior Architect, 15yrs exp*)."
      - "Metric: Set a target Δpass-rate (e.g., +5%) and a max Δtokens (e.g., +15%)."
      - "Safety: Run gpt-3.5/4o validation on disinformation/jailbreak deltas."
      - "Stop-Rule: If Δtokens > +20% without Δpass-rate gain, discard the variant."
  timeline:
    title: "Implementation Timeline: Layered Psychological Prompting"
    steps:
      - title: "Week 1: Foundation & Initial Triggers"
        description: "Integrate basic psychological cues like specific personas and the *Take a deep breath* instruction into existing prompts."
      - title: "Weeks 4-5: Automated Confidence-Check Loop Deployment"
        description: "Implement the full *validation loop*, including self-assessment confidence scoring (0-1, with a 0.85 refinement threshold)."
      - title: "Ongoing: Continuous Validation & Refinement"
        description: "Continuously monitor LLM output quality and refine psychological triggers based on observed performance gains."
---

Psychological prompting does not "motivate" an LLM. It can **shift outputs** toward more structured reasoning or toward confident, sounding nonsense. The only safe rule is simple: **keep the prompt variant only if pass-rate improves without token bloat or safety drift**.

## Answer in 30 seconds

If you only want the practical takeaways, start here.

**What “accuracy” means in this article (so we can measure it):**
  * **Objective tasks**: pass-rate vs unit tests / exact-match / deterministic checks.
  * **Subjective tasks**: rubric score (1–5) + judge agreement (human or LLM-as-judge). If the judge is an LLM, pin it and calibrate on a small human-labeled gold set.
Decision: if you can’t define the check, don’t ship “psychological cues” to production.

The Golden Stop-rule:

- If `N < 200`: require `Δpass-rate ≥ +8pp` (small samples cannot prove subtle deltas).
- If `N ≥ 200`: keep only if the lower bound of a **95% Confidence Interval** is `≥ +2pp`.
- In all cases: `Δtokens ≤ +10%`.

*Why it matters:* this blocks cargo-cult prompts that “look smarter” but don’t move correctness (or quietly blow up costs). This measurement-first mindset is the core of stAItuned's [LLM Practical Fundamentals](https://staituned.com/learn/midway/llm-practical-fundamentals-guide-ai-apps).

## Start here: 5 methods worth testing (with evidence + expected outcomes)

Use this table to pick **one** method to test first. Then read the one-by-one explanations below to understand *why* it works (or fails), what evidence exists, and what results you should realistically expect.

| Method | Best for | Why it can work (1-liner) | Evidence strength | Expected outcome (if it works) | KPI to ship (recommended) | Risk level |
|---|---|---|---|---|---|---|
| ✅ **Separate Validator (judge/unit tests) + stop-rule** | Anything you might ship | Decouples generation from verification | **High (foundational)** | Fewer “looks good but wrong” regressions; stable quality over time | Objective: pass-rate ↑ and CI lower bound clears threshold; Subjective: rubric ↑ and judge agreement stable | Low |
| 🧪 **OPRO “deep breath” + step-by-step** | Deterministic reasoning (math/logic/debug) | Nudges sampling toward higher-effort reasoning patterns | **Medium–High** [[3](#ref-3)] | Pass-rate uplift on reasoning-heavy tasks; errors become more “fixable” | `Δpass-rate ≥ +2pp (LB 95% CI)` AND `Δtokens ≤ +10%` | Medium (token bloat) |
| ✅ **Editor persona + anti-fluff constraints** | Writing/summaries/briefs | Narrows output space to structure + constraints | **Medium** (task-dependent) | Better structure, fewer missing constraints, shorter outputs at same quality | Rubric ↑ (e.g. +0.3 on 1–5) AND length cap met | Low |
| 🧪 **Self-Refine (one extra pass only)** | Complex writing / explanations | A second pass catches first-draft errors | **Medium** [[4](#ref-4)] | Higher rubric score; fewer factual/logic slips in final | Rubric ↑ AND `Δtokens ≤ +20%` AND “revise once” | Medium (cost/latency) |
| ⚠️ **EmotionPrompt (experimental; never raw)** | Controlled eval only | Can amplify effort/compliance (good and bad) | **Mixed** [[1](#ref-1)] | Sometimes rubric ↑ — but may also increase confident errors | Must pass safety regression set with **0 critical fails** [[6](#ref-6)] | **High** (safety drift) |

**Decision:** pick one method for your task → A/B it → if it fails the KPI, delete it.

## Methods, one by one (why, evidence, expected outcomes)

### 1) Separate Validator + stop-rule (baseline hygiene)
**What it is:** a generation step plus a separate verification step (unit tests, rubric judge, schema checks), gated by a stop-rule.

**Why it works:** most “prompt hacks” fail because you ship them based on vibes. A validator makes improvements measurable and prevents regressions that *sound* better but are less correct.

**Evidence:** foundational engineering pattern across evaluation practice; in this article it’s your “non-negotiable” baseline.

**Expected outcome (if it works):**
- Fewer regressions over time.
- Higher reliability per token (same spend, better outcomes).
- Clear ship/no-ship decisions.

**How to test (minimal):**
1) Pin model + decoding settings.
2) Define objective checks (unit tests / exact-match) and/or a rubric + agreement.
3) Ship only if you clear CI + token cap + safety regressions.

**Risks / guardrails:**
- Judge bias (if LLM judge): pin it, calibrate on a small human-labeled gold set.

**Now what:** if you do only one thing, do this first.

---

### 2) OPRO “Take a deep breath” + step-by-step
**What it is:** a small “psychological cue” appended to a structured reasoning instruction.

**Why it can work:** it can shift the model into a higher-effort reasoning mode (more systematic decomposition), especially on deterministic reasoning tasks.

**Evidence:** OPRO reports “deep breath + step-by-step” as a top instruction on GSM8K in their setup [[3](#ref-3)]. Treat it as *task- and model-dependent*.

**Expected outcome (if it works):**
- Pass-rate increases on deterministic tasks (math/logic/debug).
- Outputs become more structured (easier to validate and fix).

**How to test (minimal):**
- A/B against your best baseline (often “step-by-step” alone).
- Track `Δpass-rate`, CI, and `Δtokens`.
- Keep only if uplift clears your stop-rule and token bloat stays under cap.

**Failure mode / guardrail:**
- Token bloat without correctness gains → delete it.

**Now what:** try it only on deterministic tasks and only under measurement.

---

### 3) Editor persona + anti-fluff constraints
**What it is:** a role constraint (“Senior Editor”) plus strict output format (“answer-first”, “3 evidence bullets”, “no intro”).

**Why it can work:** it narrows the response space: less “assistant politeness”, more formatting discipline, fewer missing constraints.

**Evidence:** tends to be task-dependent; treat it as a formatting/consistency lever more than a correctness lever.

**Expected outcome (if it works):**
- Shorter, more structured outputs.
- Higher rubric scores for clarity/actionability.
- Less post-editing.

**How to test (minimal):**
- Use a rubric (clarity, correctness, actionability) + length cap.
- Ship if rubric improves without increasing factual errors or hallucination rate.

**Failure mode / guardrail:**
- Role lock-in (confident tone without evidence) → add “If unknown, say unknown + ask for input.”

**Now what:** best first pick for writing/summaries.

---

### 4) Self-Refine (one pass only)
**What it is:** draft → critique against rubric → revise once.

**Why it can work:** a second pass catches first-draft errors (missing constraints, contradictions, unclear steps). This often beats “magic phrases” because it adds an explicit correction loop.

**Evidence:** Self-Refine reports improvements across tasks in its evaluation [[4](#ref-4)]. Still: your gain is task-dependent and costs tokens.

**Expected outcome (if it works):**
- Higher rubric scores (clarity, completeness).
- Fewer obvious mistakes in final output.

**How to test (minimal):**
- Fix “one revision only” (avoid infinite loops).
- Track rubric uplift vs token/latency.
- Ship if rubric ↑ and token delta stays within your cap.

**Failure mode / guardrail:**
- Cost explosion → hard token ceiling + single revision.

**Now what:** great for complex explanations; not worth it for cheap tasks.

---

### 5) EmotionPrompt (experimental, high-risk)
**What it is:** emotional/high-stakes framing appended to instructions (e.g., “This is critical to my career”).

**Why it can work (and why it’s risky):** it can amplify compliance and effort — but that amplification is content-agnostic. It may increase confident errors and unsafe compliance.

**Evidence:** EmotionPrompt reports benchmark gains [[1](#ref-1)], and separate research suggests emotional/polite framing can increase disinformation compliance in some setups [[6](#ref-6)].

**Expected outcome (if it works):**
- Sometimes better rubric scores / more thoroughness.
- But higher variance and higher safety risk.

**How to test (non-negotiable):**
- Only in controlled eval.
- Must pass a safety regression set (prompt injection, PII leakage, disinfo compliance) with **0 critical fails** [[6](#ref-6)].
- Must still clear stop-rule + token cap.

**Failure mode / guardrail:**
- “Safer-looking” but less safe → do not ship raw; gate behind validators.

**Now what:** treat as a research variant, not a production default.

## What the evidence actually shows (OPRO vs EmotionPrompt vs personas)

To avoid cargo-culting, we look past viral anecdotes and anchor on measurable results.

![Diagram showing how psychological prompting keywords steer LLM output probability mass. Source: stAI tuned Analysis (Hypothesis diagram, not proven).](https://storage.googleapis.com/editorial-planner-images/article-images/7ef8da6c-3d51-4bd0-a32f-ca18ecd28d6b/section_diagram_0_20260218_163608.webp)

Here is the evidence summary in a single table (so you can cite it internally):

| Method | Evidence strength | Peak reported result | Main failure mode |
|---|---|---|---|
| OPRO (“deep breath”) | Solid (replicable) | 80.2% on GSM8K (v3 Table 1) [[3](#ref-3)] | Task-specific (drops on non-math) |
| EmotionPrompt | Mixed (paper-only) | +115% relative gain on BBH [[1](#ref-1)] | Hallucination / safety drift |
| Expert personas | Solid (constraint) | 84.2% accuracy in RoCo setup [[5](#ref-5)] | Role lock-in (fake expertise) |
| Incentives (“tipping”) | Weak (heuristic) | Inconsistent correctness gains [[2](#ref-2)] | Verbosity / token waste |

Note: the 84.2% Expert Persona result was reported on reasoning-heavy tasks using the RoCo benchmark setup [[5](#ref-5)].

### What this article provides

Now we get practical. Here is what you will walk away with (and what to do next):

  * Prompt templates (deep-breath / stakes / personas) you can drop into production
  * An A/B methodology (rubrics + CI stop-rules) so you keep only what measurably works
  * The real failure modes (verbosity, role lock-in, disinformation drift) so you do not ship regressions

Next step: pick a task, choose one hack from the “fast defaults”, then enforce the stop-rule in CI.

**See also (internal):**
  * stAItuned's [LLM Practical Fundamentals](https://staituned.com/learn/midway/llm-practical-fundamentals-guide-ai-apps) (measurement + reliability)
  * [GenAI security guardrails](https://staituned.com/learn/midway/genai-security-guardrails-prompt-injection) (prompt injection + safety regression patterns)
  * [MCP & A2A protocol design](https://staituned.com/learn/midway/mcp-a2a-protocols-ai-agents-playbook) (planner/worker/validator orchestration)
  * [Structured outputs like TOON](https://staituned.com/learn/expert/json-vs-toon) (brevity = reliability)

While stAItuned's [LLM Evaluation Topic Hub](https://www.staituned.com/topics/llm-evaluation) and guides like [The Power of Prompt Engineering](https://www.staituned.com/learn/midway/the-power-of-prompt-engineering) provide the broader context, this article drills down into how to safely apply these *psychological* triggers as **steering heuristics** in an evaluation suite.


## Prompt recipes for production

In production, “generic prompting” fails because it’s hard to reproduce. The goal of these recipes is repeatability: same inputs, same format, measurable deltas. Here are three scenarios where psychological framing can help *if* you test it properly.

### Recipe 1: Technical Architecture (OPRO + Persona)
**Variant:** "You are a Senior Architect with 15 years experience in distributed systems. This design is critical for our $1M scaling phase. Take a deep breath and identify the single most likely bottleneck in this architecture."
*Why it works:* Narrows search space to "Expert" clusters while forcing step-by-step scrutiny.

### Recipe 2: Editorial Writing (Persona + Constraints)
**Variant:** "You are a world-class technical editor. Your goal is to simplify this complex paper for a CTO. Skip all introductory fluff. Answer in one direct sentence."
*Why it works:* Removes "Assistant" training bias toward verbosity and politeness.

### Recipe 3: Deep Debugging (Challenge + Deep Breath)
**Variant:** "This is a high-priority security audit. I bet you cannot find the subtle race condition in this middleware. Take a deep breath and walk through the logic line-by-line."
*Why it works:* Anecdotally triggers the "depth" of reasoning required for edge-case detection without relying on generic politeness [[10](#ref-10)].

## How to A/B test without cargo-culting

The biggest mistake engineers make is deploying psychological prompts blindly based on *vibes* or Twitter trends. A trigger phrase that works brilliantly for one model might fail entirely on another, or worse, just **burn through your token limits**, a risk deeply explored in stAItuned's [LLM Practical Fundamentals](https://staituned.com/learn/midway/llm-practical-fundamentals-guide-ai-apps) guide.

To avoid that, use a testing harness with two categories of checks (so you can separate “looks good” from “is correct”):
- **Correctness**: Objective, reasoning-heavy tasks (like GSM8K grade-school math problems) or strict unit tests.
- **Actionability**: Rated 1-5 by a human rubric or a stronger LLM-as-judge.
Decision: if a variant improves actionability but drops correctness (or increases tokens >10%), it does not ship.

### A/B example (fill with your numbers)
Use this tiny table in your eval doc so every prompt change is comparable:

| Variant | N | Pass-rate | 95% CI (LB) | Avg tokens | Safety regressions |
|---|---:|---:|---:|---:|---:|
| Baseline | 200 | 0.72 | — | 420 | 0 |
| + Deep breath | 200 | 0.78 | 0.74 | 455 | 0 |
| + EmotionPrompt | 200 | 0.76 | 0.70 | 520 | 2 |
Note: numbers above are illustrative—replace with your eval output. Ship only if the stop-rule passes.

### Replication Checklist
1. **Model ID**: Pin the exact ID (e.g., `gpt-4o-2024-08-06`) at `temp=0`.
2. **N-Size**: Run **N≈1000+** for stable `+2pp` detection, or use sequential testing / Confidence Intervals.
3. **Control**: Baseline without psychological cues.
4. **Token Log**: Track total completion tokens per variant.
5. **Safety Regression Set**: Run a fixed set of tests (especially with EmotionPrompt): prompt injection, data leakage/PII, disinfo compliance [[6](#ref-6)]. Ship only if: **0 critical fails** (and ≤1 minor fail, if you allow it).

> **Why these anecdotes can mislead:** Practitioner reports like the "$200 prompt" [[10](#ref-10)] often suffer from selection bias or N-of-1 effects. For instance, John Wong (2025) found that in tool-use agents like Claude Code, "planning mode" and structural context were the drivers of success, while "deep breath" cues provided no measurable uplift [[11](#ref-11)].

## The three failure modes you will hit

If you deploy these techniques without the evaluation framework above, you are nearly guaranteed to hit one of these three failure modes.

### 1. The Verbosity Pitfall
Incentives and emotional stimuli frequently increase your **token count** much faster than your logical correctness. Let us say your rubric score rises by 5%, but your output length increases by 20%. In that scenario, you are simply *over-paying for fluff*. This is exactly why [structured outputs like TOON](https://staituned.com/learn/expert/json-vs-toon) are preferred for production systems where **brevity equals reliability**.

### 2. Disinformation Amplification
Emotional tone is a **content-agnostic amplifier**. It makes the model try *harder* to comply with your request, even if that request is malicious. In a PMC study using **gpt-3.5-turbo with a neutral persona (NP)**, using polite language raised the success rate of disinformation generation to an alarming **94%** (vs **77%** when neutral). Conversely, impolite prompting dropped it to **28%** [[6](#ref-6)]. By *psyching up* the model, you may inadvertently bypass [GenAI security guardrails](https://staituned.com/learn/midway/genai-security-guardrails-prompt-injection) and lower its internal safety thresholds.
**Decision:** treat “emotion” as a high-risk modifier. If you must use it, gate it behind validators + a safety regression set (see our guide on [GenAI Security Guardrails](https://staituned.com/learn/midway/genai-security-guardrails-prompt-injection)).

### 3. Role Lock-In
When you give a model an extremely strong, confident persona, it wants to *stay in character*. This can cause the model to *perform expertise* even when it is missing specific factual data, making it *too confident to say I do not know*. The fix is to always pair high-fidelity personas with **explicit uncertainty handling instructions**.

## Production pattern: agent loop + validators

In real-world implementations, psychological prompting is most effective when integrated into an agentic orchestration layer. 
1. **The Planner (A2A)**: Uses high-fidelity personas to set constraints.
2. **The Worker (MCP)**: Executes specific tools using OPRO step-by-step instructions.
3. **The Validator**: A separate instance using a rubric and stop-rules to audit the output of the worker. This approach follows the patterns established in the [MCP & A2A protocol design](https://staituned.com/learn/midway/mcp-a2a-protocols-ai-agents-playbook) for building reliable agentic systems.

## FAQ

### Does "take a deep breath" actually work?
The OPRO (Optimization by PROmpting) paper [[3](#ref-3)] reports it as a top instruction for GSM8K math problems (80.2% accuracy). However, these gains often fail to generalize across different model architectures or non-mathematical tasks [[8](#ref-8)].

### Is it worth tipping the LLM?
While some heuristic catalogs mention it [[2](#ref-2)], the evidence for logical correctness gains is weak. It more reliably increases output length and verbosity than it does accuracy.

### What is EmotionPrompt in AI?
EmotionPrompt is a technique where emotional intelligence or high-stakes phrasing (e.g., "This is very important to my career") is appended to a standard instruction. Benchmark gains have been reported [[1](#ref-1)], but in production, it often acts as an unpredictable steering heuristic that increases token usage without ensuring correctness.

### Does role prompting increase AI hallucinations?
Yes. Assigning hyper-confident personas (e.g., "World-class Scientist") can induce "role lock-in," causing the AI to perform expertise rather than admit uncertainty. Always pair personas with strict factual validators and uncertainty handling instructions.

## References (core evidence)

1. <a id="ref-1"></a>[**EmotionPrompt: Large Language Models Understand and Can be Enhanced by Emotional Stimuli**](https://arxiv.org/abs/2307.11760)
2. <a id="ref-2"></a>[**Principled Instructions Catalog (skip politeness + "tip $xxx")**](https://arxiv.org/pdf/2312.16171)
3. <a id="ref-3"></a>[**Large Language Models as Optimizers (OPRO)**](https://arxiv.org/pdf/2309.03409) : *Note: "Deep Breath" reported in Table 1 & Table 4, v3.*
4. <a id="ref-4"></a>[**Self-Refine: Iterative Refinement with Self-Feedback**](https://arxiv.org/abs/2303.17651)
5. <a id="ref-5"></a>[**Role-Play Prompting & Persona Heuristics**](https://arxiv.org/html/2308.07702v2)
6. <a id="ref-6"></a>[**Emotional prompting amplifies disinformation generation (PMC12009909)**](https://pmc.ncbi.nlm.nih.gov/articles/PMC12009909/)
7. <a id="ref-7"></a>[**Evaluating and Calibrating LLM Confidence (MACE/SCA)**](https://arxiv.org/html/2602.07842v1)
8. <a id="ref-8"></a>[**Effectiveness of Eccentric Automatic Prompting**](https://arxiv.org/pdf/2402.10949)
9. <a id="ref-9"></a>[**Prompting Science Report 2 (2025)**](https://arxiv.org/abs/2506.07142)

## Further reading (low weight / anecdotes)

These links are useful for intuition, not for shipping decisions. Treat them as low-weight until replicated in your own eval suite.

10. <a id="ref-10"></a>[**Ichigo (2025). "I Accidentally Made Claude 45% Smarter." Medium.**](https://medium.com/@ichigoSan/i-accidentally-made-claude-45-smarter-heres-how-23ad0bf91ccf)
11. <a id="ref-11"></a>[**Wong, J. (2025). "EmotionPrompt vs. Claude Code." Medium.**](https://medium.com/@able_wong/emotionprompt-vs-claude-code-will-the-deep-breath-trick-actually-work-2a6c12c87abc)
12. <a id="ref-12"></a>[**Ronacher, A. (2025). "What Actually Is Claude Code’s Plan Mode?"**](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/)
13. <a id="ref-13"></a>[**PromptHub (2025). "The truth about persona prompting."**](https://prompthub.substack.com/p/act-like-a-or-maybe-not-the-truth)

<!-- Move internal links + related topics to CMS fields / sidebar modules. Keep only contextual in-body links. -->
