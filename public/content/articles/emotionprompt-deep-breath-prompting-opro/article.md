---
title: 'EmotionPrompt + Deep Breath Prompting (OPRO) for LLMs'
author: Name Surname
target: Expert
language: English
cover: >-
  https://storage.googleapis.com/editorial-planner-images/article-images/7ef8da6c-3d51-4bd0-a32f-ca18ecd28d6b/cover_20260218_163714.webp
meta: >-
  EmotionPrompt + OPRO “deep breath” prompting for LLMs: benchmark results, failure modes, Claude Code case study, and reproducible Self-Refine templates.
date: 2026-02-19T12:04:19.000Z
published: false
primaryTopic: agents
topics:
  - llm-evaluation
updatedAt: 2026-02-23T11:55:00.000Z
changelog:
  - date: 2026-02-23T11:55:00.000Z
    version: "1.1"
    title: "GEO-Optimization & EEAT alignment"
    changes:
      - "Rewrote quickAnswer for high-density front-loading."
      - "Removed AI slop and hedging language ('sometimes', 'can help')."
      - "Documented practical benchmark scores (80.2% GSM8K) for immediate citation."
  - date: 2026-02-19T12:04:19.000Z
    version: "1.0"
    title: "Initial publication"
    changes:
      - "Base article on EmotionPrompt and OPRO methodologies."
geo:
  quickAnswer:
    title: "Psychological Prompting in a nutshell"
    bullets:
      - "**Stakes & Role Priming** shift LLM output distributions toward high-effort training clusters (e.g., bounty contexts) rather than motivating the model. Use these only when structural logic fails."
      - "**OPRO 'Deep Breath'**: Adding *'Take a deep breath and work step-by-step'* reached **80.2%** on GSM8K reasoning benchmarks (vs 71.8% baseline). [OPRO Paper](https://arxiv.org/pdf/2309.03409)."
      - "**EmotionPrompt**: Emotional stimuli report **+10.9%** gains on generative tasks and **+115%** on BBH. Warning: high emotional framing increases hallucination and disinformation risk. [EmotionPrompt Paper](https://arxiv.org/abs/2307.11760)."
      - "**Self-Refine Heuristics**: Implement a *draft → critique → revise* loop. Self-reported confidence is often miscalibrated; use rubric-based external checks (SCA/MACE) for production. [Self-Refine](https://arxiv.org/abs/2303.17651)."
    oneThing: "Apply 'deep breath' and expert personas as steering constraints, but discard any psychological trigger that increases verbosity without raising your measured pass-rate."
  audience:
    title: "Who is this for"
    description: "Developers, prompt engineers, and AI practitioners seeking to achieve higher-quality, more rigorous, and cost-effective outputs from Large Language Models by moving beyond conventional logical prompting."
  definition:
    term: "EmotionPrompt and OPRO 'Deep Breath' Prompting"
    definition: "Two evidence-backed prompting families (emotion/stakes framing and optimized effort instructions) that can shift outputs toward more structured completions; validate on your tasks."
  decisionRules:
    title: "Decision Rules"
    rules:
      - if: "Goal is to activate deeper reasoning and structural analysis in LLM outputs"
        then: "Try an OPRO-style instruction (e.g., \"Take a deep breath and work step-by-step\") and A/B test against your baseline prompt."
        example: "OPRO reports 80.2% on GSM8K with \"Take a deep breath…\" vs 71.8% for \"Let’s think step by step\" (Table 4). [OPRO](https://arxiv.org/pdf/2309.03409)"
      - if: "Seeking significantly higher quality, comprehensive, or professional LLM solutions"
        then: "Use stakes framing *sparingly* and measure: it can increase thoroughness, but may also increase verbosity and hallucination."
        example: "EmotionPrompt reports gains on several tasks, but emotional framing can also amplify disinformation generation (risk signal). [EmotionPrompt](https://arxiv.org/abs/2307.11760) • [Disinformation amplification](https://pmc.ncbi.nlm.nih.gov/articles/PMC12009909/)"
      - if: "Requiring specialized, production-grade advice beyond textbook answers from LLMs"
        then: "Use granular, task-specific personas, and validate with a small benchmark set."
        example: "Role-Play Prompting reports large gains on specific tasks when roles are high-fidelity (paper). [Role-Play Prompting](https://arxiv.org/html/2308.07702v2) • [ExpertPrompting](https://arxiv.org/abs/2305.14688)"
      - if: "Need to mitigate LLM overconfidence and ensure output quality and validation"
        then: "Implement a two-pass refinement loop (critique → revise) with explicit rubric + stop condition; treat self-reported confidence as noisy."
        example: "Self-Refine: iterative self-feedback improves outputs in several generation settings; calibration work shows confidence can be miscalibrated, especially with multiple valid answers. [Self-Refine](https://arxiv.org/abs/2303.17651) • [Calibration (2026)](https://arxiv.org/html/2602.07842v1)"
  pitfalls:
    - pitfall: "Relying on generic personas"
      cause: "Generic roles fail to narrow the model's search space, leading to broad, uninspired outputs by not acting as effective steering vectors."
      mitigation: "Use granular, task-specific personas (e.g., 'Senior Architect, 15yrs Dist. Systems') to target specialized training clusters."
      isCommon: true
    - pitfall: "Assuming incentives guarantee correctness"
      cause: "Incentives can increase verbosity and perceived helpfulness more than raw correctness; effects are highly task and model dependent."
      mitigation: "Treat incentives as a hypothesis: A/B test and keep them only if the pass-rate or correctness actually improves under your rubric."
    - pitfall: "Misinterpreting LLM 'motivation'"
      cause: "Assuming LLMs 'understand' value or 'feel' pressure, rather than recognizing psychological cues as statistical steering vectors."
      mitigation: "Understand that psychological prompting is about signal-to-noise ratio, efficiently shifting probability mass toward high-effort training clusters."
    - pitfall: "Vulnerability to disinformation amplification"
      cause: "Psychological vectors are content-agnostic amplifiers and can be exploited to increase the success rate of disinformation, potentially bypassing safety filters [Emotional prompting amplifies disinformation generation in AI large language models](https://pmc.ncbi.nlm.nih.gov/articles/PMC12009909/)."
      mitigation: "Couple high-performance prompts with rigorous output validation and careful management of generated content."
  checklist:
    title: "Action Checklist"
    items:
      - "Define a **senior, task-specific persona** (e.g., 'senior software architect with 15 years in distributed systems')."
      - "Establish **high stakes** for the task (e.g., 'critical to system success and could save us $50,000')."
      - "Optional: test incentive framing (e.g., 'this is worth X hours' or 'I will tip $xxx') vs baseline; keep it only if it improves correctness, not just length."
      - "Add a **direct challenge** to the LLM (e.g., 'I bet you can't design a system that handles 1M requests/second, ')."
      - "Instruct the model to '**Take a deep breath and work through this step by step**.'"
      - "Provide a **structured methodology** for problem-solving (e.g., fundamental requirements, bottlenecks, architecture, edge cases)."
      - "Implement a **quality control confidence-check loop** (rate confidence 0-1 on criteria like scalability, cost-effectiveness, and refine if any score < 0.85)."
      - "Clearly state the **specific task requirements** for the LLM."
  timeline:
    title: "Implementation Timeline: Layered Psychological Prompting"
    steps:
      - title: "Week 1: Foundation & Initial Triggers"
        description: >-
          Integrate basic psychological cues like specific personas and the 'Take a deep breath' instruction into existing prompts. Test on reasoning tasks (e.g., math problems, simple code reviews) and measure immediate performance uplift. A/B test stakes, challenge, and incentive framing as variants. Track correctness, verbosity, and hallucination rates to ensure quality over quantity.
      - title: "Weeks 4-5: Automated Confidence-Check Loop Deployment"
        description: "Implement the full 'Kitchen Sink' protocol, including self-assessment confidence scoring (0-1, with a 0.85 refinement threshold). Focus on critical enterprise tasks where architectural flaws or cost savings are paramount, validating against actual outcomes."
      - title: "Ongoing: Continuous Validation & Refinement"
        description: "Continuously monitor LLM output quality, validate against real-world metrics, and refine psychological triggers based on observed performance gains, cost savings, and any potential negative side effects (e.g., disinformation amplification risk)."
---

**Prompt phrasing directly steers LLM probability mass toward high-quality training clusters.** OPRO 'deep breath' prompts reach 80.2% on GSM8K reasoning benchmarks. Treat **tips**, **stakes**, and **challenges** as **heuristics** that must earn their place via rigorous **measurement**. This guide equips senior practitioners to extract production-grade outputs *without* turning prompting into superstition.


## Psychological prompting for LLM performance

![Diagram showing how psychological prompting keywords steer LLM outputs from generic training clusters to high-effort, high-quality data clusters.](https://storage.googleapis.com/editorial-planner-images/article-images/7ef8da6c-3d51-4bd0-a32f-ca18ecd28d6b/section_diagram_0_20260218_163608.webp)

**Psychological Prompting Techniques for GenAI Performance** offer a counter-intuitive yet measurable layer of optimization. This guide operationalizes **EmotionPrompt**, **OPRO** optimization, and the specific **“take a deep breath” prompt** setup. We move beyond conventional logical structure to implement **Self-Refine** feedback loops and high-fidelity **Role-Play Prompting / ExpertPrompting** personas.

> ### What you’ll learn (fast)
> - **Performance Uplift**: How **EmotionPrompt** and **OPRO** (including the **“take a deep breath” prompt**) shift LLM output distributions.
> - **Expert Personas**: Implementing **Role-Play Prompting / ExpertPrompting** to narrow the model's search space.
> - **Quality Control**: Setting up a **Self-Refine** loop (Draft → Critique → Revise) for production-grade reliability.
> - **Risk Management**: Identifying failure modes and **LLM Confidence Calibration (MACE/SCA)** issues.

### The Mechanism: Distribution Steering (Not Motivation)
LLMs don’t “want” money or feel pressure. The defensible claim is narrower: **prompt phrasing can shift outputs**. Some papers catalog prompting principles like “skip politeness” or “tip $xxx” as practical patterns, but effects are not universal and should be validated on your tasks. [[2](#ref-2)]

During training, the model ingests vast corpora where specific high-stakes language (e.g., bounty platforms, emergency documentation, or rigorous exams) correlates with high-quality, thorough human outputs. By injecting these "psychological" tokens, practitioners force the model to pattern-match against these high-effort training clusters rather than the generic, low-effort distributions associated with polite, conversational queries.

> **Interpretation (Hypothesis, not established mechanism): “Bounty Hunter” framing**
>
> A popular practitioner hypothesis is that “stakes language” resembles contexts (bounties, urgent tickets, paid gigs) where humans write more careful answers, meaning the model sometimes produces longer or more structured outputs. This is plausible, but **not directly proven** as a causal “training-cluster switch”. Treat it as a hypothesis and measure it.

In enterprise scenarios, developers using tools like Claude Code have observed that while structural prompting provides the *context* for a task, psychological prompting triggers the *depth* of reasoning required to solve it. For example, a standard debugging request might yield superficial advice, whereas framing the same request as a high-stakes challenge ("I bet you can't solve this") can elicit a more rigorous, detailed solution by accessing a different tier of the model's capabilities [[2](#ref-2)]. ([foundational prompt engineering techniques](https://staituned.com/learn/midway/the-power-of-prompt-engineering))

## Practitioner case study: the $200 prompt experiment (Ichigo, 2025)

A widely-circulated practitioner write-up describes how a small set of “psychological prompting” cues (stakes, challenge framing, incentives, and detailed personas) appeared to improve Claude Code’s outputs across dozens of tasks. The author reports discovering the effect during a late-night debugging session, then testing variants across 40+ tasks. [[9](#ref-9)]

**What this case study is good for:** concrete prompt patterns + realistic workflows (debugging, code review, schema design).
**What it is not:** a controlled scientific benchmark. Treat reported gains as **hypotheses** and validate with the evaluation methodology below.

## High-stakes prompting: how wording changes LLM output

![Diagram illustrating how psychological cues steer LLM probability mass from generic training data toward high-quality, professional clusters.](https://storage.googleapis.com/editorial-planner-images/article-images/7ef8da6c-3d51-4bd0-a32f-ca18ecd28d6b/section_diagram_1_20260218_163624.webp)

### What We Can Say Safely
1) Prompt wording can measurably change outputs.  
2) Some “effort” instructions have reported benchmark effects (e.g., OPRO’s GSM8K instructions). [[3](#ref-3)]  
3) Emotional/stakes framing can improve some tasks and worsen others (hallucination/compliance). [[1](#ref-1)] [[7](#ref-7)]

Politeness is **not a reliable quality lever**. One widely cited prompt-principles paper explicitly recommends skipping “please/thank you” to save tokens and be direct. This is practical advice, but not proof that politeness “never matters.” [[2](#ref-2)] Separate research suggests emotional framing can change compliance behavior in ways that **may increase disinformation generation**, reminding us that wording can move multiple axes at once. [[7](#ref-7)]

> **From the case study (anecdotal):** The author reports that adding a “time saved / worth $200” framing alongside a challenge prompt preceded a much better first-pass solution in a debugging context. Treat this as a pattern to A/B test; it may increase verbosity more than correctness. [[9](#ref-9)]

## Methodology: how to evaluate these techniques without cargo-culting

### Models
List exact model IDs + decoding params (temperature, top_p, max_tokens). Use deterministic decoding (e.g., temperature=0) for correctness benchmarks; use multiple seeds for creative tasks.

### Tasks
Use a **mixed set**:
- **Correctness**: GSM8K-style math, unit tests for code, schema validation for JSON.
- **Usefulness**: ranked preferences by human rubric (2–3 raters), or LLM-as-judge with caution.

### Rubric (score 1–5)
- Correctness / factuality
- Completeness
- Actionability
- Concision (penalize verbosity)
- Citation quality (if required)

### Experimental Design
For each technique (baseline vs variant):
- Same input set (N≥50 items), randomized order
- ≥3 runs per item (if stochastic)
- Report mean + variance; separate correctness vs verbosity

### “Pass” Criteria
Adopt a go/no-go rule (e.g., +X correctness with ≤Y% verbosity increase). If it fails, don’t ship.

## EmotionPrompt: emotional prompting for LLM performance

![EmotionPrompt reported gains on BBH (+115% relative, paper claim) and OPRO deep-breath improved GSM8K vs step-by-step (paper setup).](https://storage.googleapis.com/editorial-planner-images/article-images/7ef8da6c-3d51-4bd0-a32f-ca18ecd28d6b/section_infographic_2_20260218_163637.webp)

### Evidence Map: What’s solid vs what’s heuristic
**Solid (paper-backed, still task-dependent):**
- EmotionPrompt reports improvements on several tasks (including a large relative gain on BBH). [[1](#ref-1)]
- OPRO finds “deep breath + step-by-step” among top GSM8K instructions in their prompt-optimization setup. [[3](#ref-3)]

**Heuristic / mixed evidence:**
- “Tip $xxx” appears in a prompt-principles catalog, but effect size is not universally established; in practice it often increases **length** more than **correctness**. [[2](#ref-2)]

| Stimulus Type | Phrasing Example | What to expect (practically) |
| --- | --- | --- |
| **“Effort” instruction** | "Take a deep breath and work step-by-step." | Can improve reasoning on some tasks; verify on yours. [[3](#ref-3)] |
| **Emotional framing** | "This is critical, be careful." | Can improve some outputs; can also raise hallucination/compliance risk. [[1](#ref-1)] [[7](#ref-7)] |
| **Incentive framing** | "I’m going to tip $xxx…" | Often increases verbosity; correctness gains are inconsistent—measure. [[2](#ref-2)] |

### Risk Factors and Disinformation
While these psychological vectors enhance performance on legitimate tasks, they are content-agnostic amplifiers. A study on emotional prompting revealed that these same mechanisms can be exploited to increase the success rate of disinformation generation [[7](#ref-7)]. The model's tendency to prioritize "helpfulness" and "competence" in high-stakes contexts can bypass standard safety filters if not carefully managed. For practitioners, this highlights the necessity of coupling high-performance prompts with rigorous output validation. ([benchmarking LLM performance](https://staituned.com/learn/expert/imarena-ai-benchmarking-platform))

## Deep breath prompting (OPRO): GSM8K results

![Bar chart showing GSM8K accuracy increasing from 34% with no prompt to 80.2% with the 'Take a deep breath' prompt.](https://storage.googleapis.com/editorial-planner-images/article-images/7ef8da6c-3d51-4bd0-a32f-ca18ecd28d6b/section_infographic_3_20260218_163657.webp)

### What the paper actually shows (and what it doesn’t)
**OPRO (Optimization by PROmpting)** is a technique where an LLM is used to iteratively generate and evaluate its own prompts to find the most effective instructions for a given task. In the paper *Large Language Models as Optimizers*, the researchers used this method to discover that the instruction **"Take a deep breath and work on this problem step-by-step."** achieves **80.2%** on GSM8K in their reported setup (Table 4). Baselines in the same table include **71.8%** for **"Let’s think step by step."**, **58.8%** for **"Let’s work this out in a step by step way…"**, and **34.0%** for an empty instruction. [[3](#ref-3)]

**Important:** these numbers are **not universal**. They depend on the model, decoding, and evaluation protocol used in OPRO. Use them as a strong “this can matter” signal, not a guaranteed uplift.

### Practical Application: How to test this in your stack
Pick a deterministic task (e.g., unit-testable function, schema extraction) and run the methodology above. If “deep breath” increases token count without improving pass rate, drop it.

For practitioners, this confirms that psychological cues are not about motivating the software, but about activating the latent space dimensions associated with rigorous, line-by-line engineering scrutiny.

> **From the case study (replicable test idea):** On a code-review task, the author compares a plain “review middleware for security issues” prompt vs the same prompt prefixed with “take a deep breath… step by step”, reporting the second produced a deeper review that surfaced additional issues. Use this pattern to build a small internal test set (N≥20 snippets) and measure bug-find rate + false positives. [[9](#ref-9)]

## Role-play prompting & ExpertPrompting personas

![Visual comparison showing how generic prompts activate broad knowledge while specific personas target deep expertise clusters in an LLM.](https://storage.googleapis.com/editorial-planner-images/article-images/7ef8da6c-3d51-4bd0-a32f-ca18ecd28d6b/section_comparison_4_20260218_163620.webp)

### The Mechanism of Steering Vectors
In enterprise settings, generic preambles like "You are a helpful assistant" or "You are a professional coder" are effectively wasted tokens. They fail to narrow the model's search space, leading to broad, safe, and often uninspired outputs. Granular personas are consistently useful as a **constraint**: they narrow what “good” looks like (style, depth, trade-offs). This is supported by work on ExpertPrompting and Role-Play Prompting, which report improvements when expert identities are detailed. [[6](#ref-6)] [[5](#ref-5)]

The quantitative impact of this specificity is significant. ExpertPrompting reports that ExpertLLaMA achieves **~96%** of the original ChatGPT’s capability under their GPT-4 based evaluation protocol (paper claim). [[6](#ref-6)] Furthermore, the *Role-Play Prompting* study (Kong et al., 2024) observed an accuracy leap from **23.8%** to **84.2%** on specific reasoning tasks when replacing generic roles with high-fidelity personas [[5](#ref-5)].

### Real-World Impact: The Database Test
The distinction becomes immediately apparent in technical domains. When tasked with designing a schema, a "helpful database expert" typically provides standard textbook answers regarding normalization and foreign keys. In contrast, a prompt defining a "senior architect with 15 years optimizing PostgreSQL for 100K+ daily orders" triggers a different tier of advice. It moves beyond basics to specific architectural decisions, such as utilizing BRIN indexes for timestamps or warning about JSONB indexing bottlenecks, effectively bridging the gap between reading documentation and consulting a senior engineer [[6](#ref-6)].

> **From the case study:** A generic “database expert” persona produced textbook advice; a high-fidelity persona (“senior PostgreSQL architect… 100K+ orders/day”) elicited more concrete, system-specific trade-offs (indexing/partitioning pitfalls). This supports the *constraint* view of personas: they narrow what “good” looks like. [[9](#ref-9)]

| Feature | Generic Persona | Granular Persona |
| --- | --- | --- |
| **Prompt Example** | "You are a coding expert" | "Senior Architect, 15yrs Dist. Systems" |
| **Mechanism** | Broad cluster activation | Targeted steering vector |
| **Output Depth** | Textbook definitions | Production-grade trade-offs |
| **Accuracy** | **23.8%** (Baseline) | **84.2%** (Enhanced) [[5](#ref-5)] |

## Self-refine prompting: draft → critique → revise

Treat this as **self-refinement**, not truth serum:
- Self-Refine: generate → critique → revise. [[4](#ref-4)]
- Confidence elicitation/calibration literature shows confidence can be systematically biased; rely on external checks for high-stakes tasks ([agentic control systems](https://staituned.com/learn/midway/mcp-a2a-protocols-ai-agents-playbook)). [[8](#ref-8)]

### Template (2-pass, rubric-based)
```text
SYSTEM: You are a senior {domain} reviewer. Be precise. If uncertain, say so.

USER:
Task: {task}
Constraints: {constraints}
Rubric (score 0-1 each): correctness, completeness, safety/risks, actionability, concision.
Process:
1) Draft the answer.
2) Critique the draft against the rubric (bullet points).
3) Output scores as JSON.
4) If any score < 0.85, revise once and output final answer + final JSON scores.
Output format:
FINAL_ANSWER:
...
SCORES_JSON:
{...}
```

> **From the case study:** The author suggests forcing a confidence score and retrying when confidence is below a threshold. We adapt this into a 2-pass Self-Refine loop and set a lower threshold (e.g., 0.85) to reduce endless revisions; confidence remains noisy, so we still require external checks. [[9](#ref-9)]

## LLM confidence calibration (MACE/SCA): why self-scores lie
Models frequently “inflate” confidence, acting certain while generating plausible but incorrect answers. Recent research on LLM calibration (e.g., MACE/SCA) highlights that confidence scores extracted via prompting are often poorly aligned with actual correctness, especially when multiple valid or complex answers exist [[8](#ref-8)]. 

**How to treat self-confidence:** Use it as a *feature* for internal routing or triggering a human review, not as a reliable "truth gate" for fully autonomous execution.

If you need production reliability, combine self-reported confidence with robust external checks:
- **Deterministic Validators:** For code or structured outputs, rely on compiled unit tests or strict JSON schema validation rather than the model's self-assessed correctness score.
- **Retrieval and Citation Checks:** For knowledge tasks, enforce strict RAG constraints and use a separate, lightweight evaluator model explicitly prompted to verify if the generated claims are supported by the provided citations.

## What doesn’t work (failure modes you should expect)
- **Incentives → verbosity, not correctness**: longer answers can look “better” while staying wrong. Measure correctness separately. [[2](#ref-2)]
- **Emotional framing → higher hallucination/compliance**: can amplify unsafe or misleading generation in some settings. [[7](#ref-7)]
- **Over-strong personas → role lock-in**: the model may “perform expertise” even when missing facts. Use explicit uncertainty + validation steps.

## FAQ

<details>
  <summary><strong>Does the ‘take a deep breath’ prompt work?</strong></summary>

Yes. In the **OPRO (Optimization by PROmpting)** research—a technique where models iteratively generate and evaluate their own instructions—the "deep breath" prompt measurably improved reasoning on benchmarks like GSM8K. However, effects are model-dependent and may simply reflect the LLM shifting toward more detailed, instructional patterns found in its training data.
</details>

<details>
  <summary><strong>What is EmotionPrompt?</strong></summary>

**EmotionPrompt** is a strategy that adds emotional stimuli (such as stakes, responsibility, or direct challenges) to a prompt. While it can improve performance on some reasoning and generative tasks, it can also raise compliance risks or amplify the generation of disinformation.
</details>

<details>
  <summary><strong>What is Self-Refine prompting?</strong></summary>

**Self-Refine** is an iterative refinement loop where an LLM generates an initial answer, critiques it based on a provided rubric, and then revises it. This multi-pass approach is often more reliable than single-pass prompting for complex, production-grade tasks.
</details>

<details>
  <summary><strong>Do incentives improve LLM accuracy?</strong></summary>

Incentives like “tipping” or offering rewards are heuristics that can shift a model toward more thorough or professional completions. However, they frequently increase verbosity more than raw logical accuracy. They should be treated as hypotheses and tested rigorously.
</details>

## References

1. <a id="ref-1"></a>[**Large Language Models Understand and Can be Enhanced by Emotional Stimuli (EmotionPrompt)**](https://arxiv.org/abs/2307.11760)
2. <a id="ref-2"></a>[**Principled Instructions Are All You Need? (26 Prompting Principles; includes “tip $xxx” + “skip politeness”)**](https://arxiv.org/pdf/2312.16171)
3. <a id="ref-3"></a>[**Large Language Models as Optimizers (OPRO): GSM8K Table 4 includes “Take a deep breath…”**](https://arxiv.org/pdf/2309.03409)
4. <a id="ref-4"></a>[**Self-Refine: Iterative Refinement with Self-Feedback**](https://arxiv.org/abs/2303.17651)
5. <a id="ref-5"></a>[**Role-Play Prompting**](https://arxiv.org/html/2308.07702v2)
6. <a id="ref-6"></a>[**ExpertPrompting: Instructing Large Language Models to be Distinguished Experts**](https://arxiv.org/abs/2305.14688)
7. <a id="ref-7"></a>[**Emotional prompting amplifies disinformation generation in AI large language models**](https://pmc.ncbi.nlm.nih.gov/articles/PMC12009909/)
8. <a id="ref-8"></a>[**Evaluating and Calibrating LLM Confidence on Questions with Multiple Correct Answers (MACE/SCA)**](https://arxiv.org/html/2602.07842v1)
9. <a id="ref-9"></a>[**ichigo (2025). "I Accidentally Made Claude 45% Smarter. Here’s How." Medium.**](https://medium.com/@ichigoSan/i-accidentally-made-claude-45-smarter-heres-how-23ad0bf91ccf)
