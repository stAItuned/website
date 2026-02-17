---
title: 'LLM costs aren’t a pricing problem: it’s architecture'
author: Gianluca Capuzzi
target: Expert
language: English
cover: >-
  https://storage.googleapis.com/editorial-planner-images/article-images/1824726b-3564-4ec2-b14d-552f858e2cab/cover_20260217_085733.webp
meta: >-
  Most LLM spend is hidden in debugging, retries, and observability. Why agentic RAG gets expensive and how hybrid SLM routing restores control.
date: 2026-02-17T10:26:54.000Z
published: false
primaryTopic: genai-fundamentals
topics:
  - genai
geo:
  quickAnswer:
    title: "Architecture-First LLM Cost Control"
    bullets:
      - "Token pricing is a distraction; the real cost driver is **operational entropy**, the engineering time spent debugging stochastic agentic chains."
      - "Hybrid router-first systems reduce cost by constraining when expensive reasoning is used and by improving debuggability."
      - "Track escalation rate, per-lane latency, and disagreement rate to keep architecture economics observable."
    oneThing: "Control architecture first: route simple requests to specialized paths and escalate to large reasoning models only when necessary."
  audience:
    title: "Who is this for"
    description: "AI engineers and product teams operating production RAG/agentic systems who need to reduce total cost of ownership, improve reliability, and keep debugging complexity under control."
  definition:
    term: "Operational Entropy"
    definition: "The cumulative cost of unpredictability in LLM systems, including retries, branching failures, observability overhead, and engineering time spent diagnosing stochastic behavior."
  decisionRules:
    title: "Decision Framework"
    rules:
      - if: "Most requests are repetitive and well-scoped"
        then: "Route by default to specialized/deterministic lanes and escalate only uncertain cases to a reasoning model."
        example: "Intent classification, extraction, and policy checks stay on SLM/rules; only ambiguous requests hit the large model."
      - if: "Escalation rate stays high (>30%) for a stable workload"
        then: "Refine router policy and add missing specialized lanes before increasing model size."
        example: "Add a dedicated lane for top recurring query classes instead of sending all traffic to agentic chains."
      - if: "Debugging time dominates token spend"
        then: "Prioritize observability and component boundaries over prompt tweaks."
        example: "Track failure by stage (routing, retrieval, synthesis) and fix the highest-leverage stage first."
  pitfalls:
    - pitfall: "Optimizing only per-token price"
      cause: "Assuming cheaper model pricing automatically lowers total cost."
      mitigation: "Measure total cost of ownership including retries, latency, and engineering/debug time."
      isCommon: true
    - pitfall: "Using agentic reasoning as default for all requests"
      cause: "No explicit routing policy between simple and complex cases."
      mitigation: "Adopt router-first escalation so complex reasoning is invoked intentionally."
      isCommon: true
    - pitfall: "Weak observability in multi-step pipelines"
      cause: "Missing stage-level metrics and traceability across chain steps."
      mitigation: "Instrument each stage and monitor escalation rate, disagreement rate, and lane-level latency."
---

Most teams try to reduce LLM costs by switching models or limiting tokens. In production, this is a micro-optimization. The dominant cost driver is **architecture**.

This article explains why "fully agentic" architectures often fail economically over time, not because tokens are expensive, but because **entropy is expensive**. We will explore how hybrid systems with specialized Small Language Models (SLMs) reshape the cost curve by trading theoretical flexibility for operational control.

## What “cost” really means in LLM systems

![Visualizing the total cost of ownership (TCO) in LLM systems: token pricing is just the tip of the iceberg, while the cost of control is the massive submerged part.](https://storage.googleapis.com/editorial-planner-images/article-images/1824726b-3564-4ec2-b14d-552f858e2cab/section_visual_0_20260217_085952.webp)

Token pricing is the most visible cost and often the least relevant variable in the TCO equation (Total Cost of Ownership = Tokens + Engineering & Operational Overhead). In a production environment, the TCO is dominated by the **Cost of Control**:

*   **Engineering time** spent debugging nondeterministic failures.
*   **Latency overhead** from retries and verification loops.
*   **Cascading failures** in multi-step pipelines requiring manual intervention.
*   **Observability tax**: the sheer volume of logs needed to trace a single request.

> **The Reality:** A $0.01 API call that triggers a 2-hour debugging session for a senior engineer effectively costs $300. The dominant cost is not inference; it is the **cost of unpredictability**.

## The core mismatch: Reasoning vs. controllability

![Infographic showing the gap between reasoning capability and operational controllability, along with the multiplicative decay of reliability in a 10-step agentic chain.](https://storage.googleapis.com/editorial-planner-images/article-images/1824726b-3564-4ec2-b14d-552f858e2cab/section_infographic_1_20260217_091443.webp)

Agentic architectures, often built on top of RAG pipelines, promise autonomy. In practice, the operational issues show up exactly where the architecture adds depth, retries, and branching (see also an interesting article about [Router-First design notes](https://staituned.com/learn/midway/rag-reference-architecture-2026-router-first-design)). In demos, they feel magical. In production, a structural mismatch emerges: **reasoning capability scales faster than operational controllability**.

Each additional "reasoning step" in an agent chain introduces:
1.  More probabilistic branching points.
2.  More intermediate states to track.
3.  New, often silent, failure modes.

The result is a system that becomes more powerful and less operable at the same time. This is the **"Unreliability Tax"**: as you add reasoning depth to handle edge cases, the debug surface area grows **combinatorially**, not linearly [[1](#ref-1)].

> **The Math:** If a step has 97% reliability, a 10-step agentic chain has a total success rate of just ~74% ($0.97^{10}$). **Reliability decays multiplicatively (back-of-the-envelope, assumes independent steps).**

## Why agentic RAG scales poorly in production

![Infographic showing Klarna's AI assistant success metrics (2.3M chats, 700 FTE equivalent) and the strategic shift toward balancing cost-cutting with service quality and operational control.](https://storage.googleapis.com/editorial-planner-images/article-images/1824726b-3564-4ec2-b14d-552f858e2cab/section_infographic_2_20260217_162629.webp)

### Public case study: Klarna’s customer service AI assistant (why “control” becomes the cost)

A concrete public example of “LLM costs are architectural” is Klarna’s customer service AI assistant.

Klarna reported that the assistant:
- handled roughly **two-thirds** of customer service chats (about **2.3 million** conversations in its early rollout),
- delivered resolution times of **<2 minutes vs ~11 minutes** previously,
- and was described as doing work equivalent to **~700 full-time agents** (with reported reductions in repeat inquiries). [[5](#ref-5)]

What matters for production economics is the *second-order effect*.
Reuters later reported Klarna’s CEO acknowledged the company may have **over-indexed on AI for cost cutting**, shifting focus from “pure savings” to **service quality and growth**, including resuming hiring. [[6](#ref-6)]

> **Takeaway:** once an LLM system becomes a core operational layer, the dominant cost is not the API bill.
It’s the **cost of control**: escalation policies, monitoring, QA, and the engineering effort to keep failure modes bounded.

(Technical note) Klarna’s stack is often discussed as moving toward a more **controllable architecture**, explicit routing/structured agent workflows and better observability, precisely to make production behavior operable. [[7](#ref-7)]

## Specialization changes the cost curve

![The Router-First architecture: a central router triages requests between specialized, efficient SLMs and a general-purpose reasoning model.](https://storage.googleapis.com/editorial-planner-images/article-images/1824726b-3564-4ec2-b14d-552f858e2cab/section_diagram_3_20260217_091833.webp)

The alternative is **specialization**. Instead of treating every request as a nail for the "General Reasoning" hammer, we treat the Large Language Model as an **escalation path**, not a default.

By delegating well-scoped tasks to fine-tuned small models (SLMs), think intent classification, entity extraction, policy checks, we introduce a **Control Surface**.

In this model, aligned with the Router-First RAG reference architecture, a lightweight **Router** (often a small classifier (rules/logreg) or a tiny SLM) triages requests:
1.  **Known/Simple:** Route to specialized SLM (Local, Fast, Cheap).
2.  **Ambiguous/Complex:** Escalate to Reasoning Model (Remote, Slow, Expensive).

This changes the economic structure of the system:
*   **Fewer model calls:** 80% of traffic hits deterministic or specialized paths.
*   **Lower operational entropy:** Improving the "Intent Classifier" fixes 80% of errors without touching the complex reasoning/generation logic.
*   **Debuggability:** You know exactly *why* a request went to the SLM or the LLM.

As demonstrated in technical reports for modern SLMs [[3](#ref-3)], specifically fine-tuned small models can rival larger counterparts on narrow tasks, but with a fraction of the latency and zero "creative" drift.

## Economic impact: Intentional escalation

![Comparative visualization between a complex, unpredictable Agentic Loop and a structured, efficient Hybrid/Router-First architecture.](https://storage.googleapis.com/editorial-planner-images/article-images/1824726b-3564-4ec2-b14d-552f858e2cab/section_comparison_4_20260217_091952.webp)

Hybrid architectures do not remove large models; they **discipline** them. Most importantly, routing enables **intentional escalation**: reasoning becomes expensive *by design* and is used only when its value is clear.

| Feature | Agentic "Loop" | Hybrid / Router-First |
| :--- | :--- | :--- |
| **Default mode** | Max Reasoning | Max Efficiency |
| **Failure mode** | Hallucination / Loop | Fallback to Generalist |
| **Debug cost** | High (Trace graph) | Low (Component inspect) |
| **Latency** | Variable (High var) | Predictable (Bimodal) |

### What this does NOT claim
To be clear:
*   **Hybrid does not always win:** For highly open-ended research or raw creativity, the general reasoning of a large LLM is irreplaceable.
*   **It does not remove LLMs:** It disciplines them as an escalation path.
*   **Complexity doesn't disappear:** It is redistributed from painful runtime debugging to proactive architectural design.

## Operational metrics for the control surface

To move from "vibes" to engineering, track these 5 metrics for your hybrid system:

1.  **Escalation Rate:** % of traffic routed to the large model (**A common target is <20%, depending on traffic mix**).
2.  **Router Confidence:** Distribution of router certainty scores (Are you confident in your routing?).
3.  **Cost per Lane:** Explicit tracking of SLM vs. LLM spend.
4.  **Disagreement Rate:** How often the LLM disagrees with the SLM on sampled traffic (Ground Truth).
5.  **P95 Latency per Lane:** Is the fast lane actually fast?

## When to use hybrid specialization

![Visual guide for decision-making: when to use hybrid specialization (reliability, speed, Pareto distribution) versus when to avoid it (open-ended tasks, lack of data).](https://storage.googleapis.com/editorial-planner-images/article-images/1824726b-3564-4ec2-b14d-552f858e2cab/section_comparison_6_20260217_092358.webp)

Use this approach when:
*   **Workload follows [Pareto Principle](https://en.wikipedia.org/wiki/Pareto_principle):** 20% of query types account for 80% of volume.
*   **Reliability is non-negotiable:** Financial or medical advice where "creative" answers are a liability.
*   **Latency matters:** Users expect instant feedback for simple interactions.

Avoid it when:
*   **Tasks are highly open-ended:** "Brainstorm marketing ideas" requires the broad world knowledge of a large model.
*   **No training data:** You cannot fine-tune an SLM without examples.

## Conclusion

The main challenge in LLM systems is not capability, it is **operational sustainability**. Instead of asking *"How much reasoning can we add?"*, effective AI leads ask *"How much reasoning can we afford to control?"*.

Hybrid architectures redistribute complexity from runtime debugging to upfront architectural design. The goal is not to minimize reasoning, but to make its cost visible, bounded, and **intentional**.

---

## References

1. <a id="ref-1"></a>[**Avoiding the AI Agent Reliability Tax: A Developer’s Guide**](https://thenewstack.io/avoiding-the-ai-agent-reliability-tax-a-developers-guide/) - *Drew Robb, The New Stack, 2025.*
2. <a id="ref-2"></a>[**Seven Failure Points When Engineering a Retrieval Augmented Generation System**](https://arxiv.org/abs/2401.05856) - *Barnett et al., 2024.*
3. <a id="ref-3"></a>[**Phi-3 Technical Report: A Highly Capable Language Model Locally on Your Phone**](https://arxiv.org/abs/2404.14219) - *Microsoft Research, 2024.*
4. <a id="ref-4"></a>[**Building Effective AI Agents**](https://www.anthropic.com/research/building-effective-agents) - *Anthropic Research, 2024.*
5. <a id="ref-5"></a>[**Klarna's AI assistant does the work of 700 full-time agents**](https://openai.com/index/klarna/) - *OpenAI, 2024.*
6. <a id="ref-6"></a>[**Sweden's Klarna shifts AI focus from cost cuts to growth**](https://www.reuters.com/business/swedens-klarna-shifts-ai-focus-cost-cuts-growth-2025-09-10/) - *Reuters, 2025.*
7. <a id="ref-7"></a>[**How Klarna's AI assistant redefined customer support at Klarna**](https://blog.langchain.com/customers-klarna/) - *LangChain Blog, 2024.*

---

## Related reading

- [**Router-First RAG architecture notes**](https://staituned.com/learn/midway/rag-reference-architecture-2026-router-first-design)
- [**Generative AI Roadmap 2026 (enterprise playbook)**](https://staituned.com/learn/midway/generative-ai-roadmap-2026-enterprise-playbook)
- [**LLM Practical Fundamentals (for cost/latency trade-offs)**](https://staituned.com/learn/midway/llm-practical-fundamentals-guide-ai-apps)
