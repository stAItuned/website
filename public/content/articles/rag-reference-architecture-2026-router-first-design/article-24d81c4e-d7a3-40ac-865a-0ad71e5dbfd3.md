---
title: 'RAG Reference Architecture 2026: Router-First Design Guide'
author: Daniele Moltisanti
target: Midway
language: English
cover: >-
  https://storage.googleapis.com/editorial-planner-images/article-images/24d81c4e-d7a3-40ac-865a-0ad71e5dbfd3/cover_20260206_142002.webp
meta: >-
  Explore the 2026 RAG reference architecture with a router-first approach. Learn to balance cost, latency, and quality using hybrid search and guardrails.
date: 2026-02-09T08:00:29.000Z
published: true
primaryTopic: rag
topics: []
geo:
  quickAnswer:
    title: "RAG 2026 Reference Architecture in 30 seconds"
    bullets:
      - "The 2026 RAG architecture standardizes a **multi-stage pipeline** with hybrid search, reranking, and built-in governance, moving beyond simple vector search."
      - "A **Router-First design** classifies query intent (Fast, Standard, Deep lanes) to reduce LLM inference costs; savings depend on traffic mix and routing KPIs [9]."
      - "The **Fused Retrieval Layer** uses **hybrid search** (vector + keyword) and **Reciprocal Rank Fusion (RRF)** to maximize relevance [4, 5]."
      - "**Smart caching** (semantic/intermediate) optimizes performance for repeat workloads [11, 13], while **guardrails** must treat retrieved context as untrusted to mitigate injection risks [6, 7]."
      - "While enhancing quality, components like cross-encoders introduce **latency and cost trade-offs**, which are managed by dynamically selecting the cheapest path per query [8]."
    oneThing: "Adopt a phased, metric-driven approach to RAG architecture evolution, starting with a verifiable baseline and introducing complexity only as validated by performance metrics."
  audience:
    title: "Who is this for"
    description: "Senior engineers, ML engineers, and tech leads designing production RAG systems and looking for a pragmatic, router-first blueprint."
  definition:
    term: "RAG Reference Architecture 2026"
    definition: "A sophisticated, multi-stage pipeline for industrial-grade Retrieval Augmented Generation (RAG). It integrates advanced data ingestion, hybrid retrieval, rigorous reranking, router-first design, and built-in compliance for reliability, governance, and precision."
  decisionRules:
    title: "Decision Rules for RAG 2026"
    rules:
      - if: "Goal is to minimize latency and costs for simple or common queries"
        then: "Route queries to the **Fast Lane** (Cache/Static) for zero retrieval cost and near-instant response."
        example: "Common FAQs or greetings can be directly answered without full retrieval."
      - if: "Query requires specific, factual information"
        then: "Use the **Standard Lane** (Vector + Keyword) which triggers the hybrid search pipeline."
        example: "Queries like 'What is the Q3 revenue?' require precise factual retrieval."
      - if: "Query requires complex analytical tasks, multi-step reasoning, or tool-use"
        then: "Route to the **Deep Lane** (Agentic/Tool-Using) for advanced processing [1]."
        example: "Queries requiring deep insights across interconnected data points or multi-step execution."
      - if: "Need to maximize relevance by combining disparate search results (e.g., keyword and vector)"
        then: "Employ **Reciprocal Rank Fusion (RRF)** to consolidate results based on ordinal position [4, 5]."
        example: "Fused_docs = rrf_fuse(ranked_lists, top_n=6)"
      - if: "Dealing with sensitive enterprise data (e.g., PII, or untrusted inputs)"
        then: "Implement **guardrails** (PII masking and prompt injection prevention) before generation [6, 7]."
        example: "Ensuring compliance and mitigating risk from untrusted retrieval results."
      - if: "Seeking superior scalability and cost-efficiency for data freshness"
        then: "Prioritize **RAG** over frequent LLM fine-tuning."
        example: "Operational expenditure of RAG is lower than recurrent LLM retraining cycles for enterprise data."
  pitfalls:
    - pitfall: "Premature Over-engineering"
      cause: "Attempting to deploy the complete '2026 architecture' (e.g., semantic routing, graph fusion, multi-agent loops) during initial implementation."
      mitigation: "Start with a verifiable baseline, and only introduce complexity like RRF or hybrid search when justified by metrics."
      isCommon: true
    - pitfall: "Relying on Simple Vector Search"
      cause: "Vector search alone often struggles with precise lexical distinctions, leading to a 'relevance ceiling.'"
      mitigation: "Standardize on **hybrid search**, combining dense vector search for semantic meaning with keyword (BM25) search for exact matches [4, 5]."
    - pitfall: "Treating Compliance and Security as an Afterthought"
      cause: "Not integrating PII masking or injection prevention (untrusted retrieval) into the pipeline."
      mitigation: "Adopt a 'security-by-design' approach; treat retrieved documents as untrusted input to mitigate exfiltration risks [6, 7]."
    - pitfall: "Uniform, Resource-Intensive Query Processing"
      cause: "Routing every user query through the same computationally intensive sequence (embedding, retrieval, reranking, generation)."
      mitigation: "Implement a **Router-First design** with a semantic classifier to direct queries to appropriate lanes (Fast, Standard, Deep) based on intent, reducing unnecessary compute costs."
  checklist:
    title: "Building Enterprise RAG Architectures Checklist"
    items:
      - "Establish a **verifiable RAG baseline** by launching a simplified pipeline (ingest, chunk, embed, retrieve) to set performance benchmarks."
      - "Implement a **semantic router** as a central traffic controller to classify query intent into Fast, Standard, or Deep lanes."
      - "Standardize on a **Fused Retrieval Layer** utilizing **hybrid search** (dense vector + keyword BM25) to capture both semantic and lexical specificity [4, 5]."
      - "Apply **Reciprocal Rank Fusion (RRF)** to reconcile and prioritize results from multiple retrieval lists [4, 5]."
      - "Integrate **smart caching** (semantic/intermediate-state) to optimize for high-repeat workloads [11, 13]."
      - "Implement **compliance guardrails** and treat retrieved docs as untrusted input to mitigate prompt injection [6, 7]."
      - "Utilize **parent-document retrieval** to return larger, more complete spans to the LLM for better context [10]."
      - "Instrument **robust observability**, including RAG-specific evaluation metrics like faithfulness and context relevance [2, 3]."
      - "Document **Architecture Decision Records (ADRs)** for critical trade-offs and design choices as the RAG system matures (document trade-offs with ADRs)."
  timeline:
    title: "Phased Implementation for Enterprise RAG Architectures"
    steps:
      - title: "Phase 1: Foundational Baseline & Compliance (Initial 1-3 Months)"
        description: "Establish a simplified RAG pipeline (ingest, chunk, embed, retrieve) and set initial performance benchmarks. Implement mandatory PII anonymization and basic compliance directly into the ingestion layer. Set up fundamental observability for key metrics. Avoid premature over-engineering."
      - title: "Phase 2: Optimization & Enhanced Relevance (Months 4-9)"
        description: "Introduce a semantic router for query classification (Fast, Standard, Deep lanes). Implement the Fused Retrieval Layer with hybrid search and Reciprocal Rank Fusion (RRF). Integrate smart caching to optimize efficiency and latency. Introduce advanced retrieval techniques like multi-query generation or parent-document retrieval based on observed metric demands."
      - title: "Phase 3: Maturation, Governance & Advanced Features (Months 10+)"
        description: "Continuously monitor KPIs, refine components, and conduct A/B testing for trade-offs (cost, latency, quality). Consider integrating advanced '2026' complexities like knowledge graphs or multi-agent loops only when validated by evaluation metrics. Ensure ongoing compliance and document all critical architecture decisions via Architecture Decision Records (ADRs)."
---

The landscape of Retrieval Augmented Generation (RAG) is evolving rapidly, demanding more sophisticated architectures to deliver reliable, high-quality AI outputs. This article is for senior engineers, ML engineers, and tech leads who already know RAG fundamentals and need a pragmatic router-first blueprint for production.


## What Defines the RAG Reference Architecture 2026 for Enterprise AI?

![Comparison diagram showing the evolution from simple 2024 RAG architectures to the complex, multi-stage 2026 enterprise RAG reference architecture.](https://storage.googleapis.com/editorial-planner-images/article-images/24d81c4e-d7a3-40ac-865a-0ad71e5dbfd3/section_comparison_0_20260206_141939.webp)


The 2026 RAG reference architecture marks a fundamental transition from experimental prototypes to **industrial-grade systems**. The era of rudimentary Retrieval Augmented Generation, characterized by simplistic vector database uploads, has concluded. Instead, the modern standard is a **sophisticated, multi-stage pipeline** designed for **reliability, governance, and precision**.

As organizations define their [enterprise AI roadmap](https://staituned.com/learn/midway/generative-ai-roadmap-2026-enterprise-playbook), they are moving beyond simple semantic similarity. The 2026 architecture standardizes on an integrated workflow: **advanced data ingestion**, **hybrid retrieval** (combining keyword and vector search), and **rigorous reranking**. This architectural maturity is essential because RAG can improve **answer reliability** by grounding outputs in retrieved context — but you still need **continuous evaluation** to quantify **faithfulness** and **context relevance** in your domain [[2](#ref-2), [3](#ref-3)].

Crucially, this architecture treats **trust as a structural component**, not a policy afterthought. To master [LLM practical fundamentals](https://staituned.com/learn/midway/llm-practical-fundamentals-guide-ai-apps), one must understand that data flow requires protection. In regulated environments, **anonymization/PII masking** is often required for sensitive data, and should be treated as a **first-class control** in the pipeline [[6](#ref-6), [7](#ref-7)]. Without integrating these compliance features directly into the retrieval layer, organizations risk **exposing PII** and failing basic security requirements, which blocks high-value use cases in practice [[6](#ref-6), [7](#ref-7)].

> **The 2026 Shift:**
> *   **From:** Single Vector Database → **To:** Hybrid Search + Reranking (+ optional Knowledge Graphs where the domain supports it)
> *   **From:** "Black Box" Retrieval → **To:** Auditable, Compliant Pipelines
> *   **From:** Static Indexing → **To:** Dynamic, Router-based Execution

## Why a Router-First Approach is Essential for 2026 RAG System Design?

![Flowchart illustrating a semantic router directing AI queries into Fast, Standard, and Deep processing lanes based on complexity.](https://storage.googleapis.com/editorial-planner-images/article-images/24d81c4e-d7a3-40ac-865a-0ad71e5dbfd3/section_diagram_1_20260206_141926.webp)

Early RAG implementations relied on a uniform, resource-intensive sequence for every user query: embedding, retrieval, reranking, and generation. By 2026, this linear approach is considered inefficient. The defining feature of modern enterprise architecture is a **Router-First design**, where a lightweight semantic classifier acts as the central traffic controller before any retrieval begins.

Treating every input as a complex research question significantly increases compute costs and diminishes user engagement. Unnecessary resource consumption occurs when simple queries, such as greetings or requests for static policy dates, are routed through computationally intensive processes like GPU-accelerated embedding and vector search. Instead, the 2026 reference architecture uses a **semantic router** to classify intent into three distinct lanes:

* **Fast Lane (Cache/Static):** Direct hits for common FAQs or greeting protocols. Zero retrieval cost, near-instant latency.
* **Standard Lane (Vector + Keyword):** The workhorse path for specific, factual queries. This triggers the hybrid search pipeline we discuss later.
* **Deep Lane (Agentic/Tool-Using):** Reserved for complex analytical tasks requiring multi-step reasoning (and optionally graph-based retrieval if your domain supports it).

This strategy extends beyond mere latency reduction; it is crucial for **economic viability**. By filtering distinct intents early, organizations avoid the **"relevance ceiling"** where simple queries get confused by complex retrieval logic, and complex queries fail because they weren't allocated enough compute [[9](#ref-9)].

> **The Efficiency Gap:**
> Implementing a semantic router **can** reduce LLM inference costs by diverting simple queries away from the heavy generation pipeline.
> The actual savings depend on your **traffic mix** (how many queries qualify for Fast/Standard vs Deep), so measure it with **routing KPIs** (lane distribution, cost/query, p95 latency).

## How Does the Fused Retrieval Layer Maximize Relevance with Hybrid Search and RRF?

![Diagram showing how hybrid search combines vector and keyword results via RRF fusion.](https://storage.googleapis.com/editorial-planner-images/article-images/24d81c4e-d7a3-40ac-865a-0ad71e5dbfd3/section_diagram_2_20260206_141935.webp)

Reliance on simple vector search in early RAG implementations frequently resulted in a 'relevance ceiling,' limiting the specificity of retrieved information. While vector search excels at conceptual understanding, it often struggles with precise lexical distinctions, such as differentiating between "Policy A-12" and "Policy A-13." To solve this, the 2026 reference architecture standardizes on a **Fused Retrieval Layer**, moving beyond single-algorithm dependency.

### The Mechanics of Hybrid Fusion
The core of this layer is **hybrid search**, which runs two parallel queries: a dense **vector search** for semantic meaning and a **keyword (BM25) search** for exact lexical matches. This combination is now standard practice, effectively capturing both the semantic intent and lexical specificity of a user's request [[5](#ref-5), [4](#ref-4)].

To reconcile these disparate results, Elastic and other major search providers recommend **Reciprocal Rank Fusion (RRF)** [[4](#ref-4), [5](#ref-5)]. Unlike normalization of arbitrary score thresholds, which can be mathematically problematic, RRF ranks documents based on their ordinal position within each retrieval list. The logic prioritizes consensus: if a document appears in the top 5 for *both* keyword and vector search, it ascends to the top of the final context window.

#### RRF logic effectively boosts consensus candidates
```python
fused_docs = rrf_fuse(ranked_lists, top_n=6)
```

This snippet demonstrates the consolidation logic commonly implemented in production architectures [[5](#ref-5)]. However, better ranking cannot fix broken data. Therefore, fusion is typically paired with **parent-document retrieval** [[10](#ref-10)]. By indexing small chunks for search precision but returning larger parent spans to the LLM, the system ensures the model receives **complete paragraphs** rather than fragmented sentences.

## How Do Caching and Guardrails Enhance RAG System Reliability and Efficiency?

![Process diagram showing RAG architecture with caching and guardrail layers placed before and after the retrieval-generation step.](https://storage.googleapis.com/editorial-planner-images/article-images/24d81c4e-d7a3-40ac-865a-0ad71e5dbfd3/section_process_3_20260206_141933.webp)

In the 2026 RAG architecture, reliability and efficiency are not merely operational optimizations but fundamental structural components. Building a scalable RAG system necessitates the integration of dedicated caching and compliance layers.

### The Efficiency Layer: Smart Caching
The most efficient query is one that bypasses the LLM entirely, often addressed by a cache. Caching serves as a primary **defense mechanism** against escalating API costs and latency. Instead of re-computing embeddings for every recurring question - like "What is the Q3 revenue?" - a **semantic cache** returns the validated result instantly.

Implementing an effective semantic cache (and/or intermediate-state caching) can significantly optimize performance for **high-repeat workloads** [[11](#ref-11), [12](#ref-12), [13](#ref-13)]. The realized benefit scales with **cache hit-rate** and invalidation strategy.

### The Trust Layer: Compliance Guardrails
While caching optimizes resource expenditure, guardrails safeguard business operations. Enterprise RAG requires a "security-by-design" approach where compliance is an active filter, not a policy document. In regulated environments, anonymization/PII masking is often required for sensitive data, and should be treated as a first-class control in the pipeline [[6](#ref-6), [7](#ref-7)].

#### Untrusted Retrieval and Security
A critical addition to modern guardrails is the treatment of retrieved documents as **untrusted input**. Malicious actors can use **prompt injection** (indirect or direct) or **data exfiltration** techniques through manipulated retrieval context. Without integrating these compliance features, organizations risk exposing PII and failing basic security requirements, which blocks high-value use cases in practice [[6](#ref-6), [7](#ref-7)]. To mitigate these risks, follow the **OWASP Top 10 for LLM Applications** and treat the retrieval-generation boundary as a **security perimeter**.

> **Critical Insight:** Caching and guardrails must be treated as integrated, active components. Caching provides the necessary latency budget to accommodate the computational overhead of robust security filters.

## What are the Practical Trade-offs for Optimizing RAG Cost, Latency, and Quality?

![Comparison table showing the trade-offs between Cost, Latency, and Quality for different RAG components like Vector Search and Cross-Encoders.](https://storage.googleapis.com/editorial-planner-images/article-images/24d81c4e-d7a3-40ac-865a-0ad71e5dbfd3/section_comparison_4_20260206_141938.webp)

### The Iron Triangle: Cost, Latency, and Quality
In practice, you are continuously trading off **cost**, **latency**, and **answer quality** across retrieval depth, reranking, and context length. Design for **measurement-first** so you can tune these trade-offs with real production KPIs [[1](#ref-1)].

#### The Price of Precision
A prevalent point of friction arises within the **re-ranking layer**. Adding a cross-encoder step significantly boosts quality by strictly re-ordering documents based on deep semantic relevance. However, this precision comes with a tax. Cross-encoders are computationally intensive - often slower than bi-encoders - and are typically used to rerank the top-k results rather than the entire corpus [[8](#ref-8)].

Teams can often mitigate this trade-off by employing **Multi-query generation**. By having the LLM generate query variations (e.g., "Explain with examples"), retrieval recall and relevance can improve without the heavy latency penalty of re-ranking every single result.

A crucial strategic perspective reveals that **RAG can offer superior scalability and cost-efficiency compared to frequent LLM fine-tuning**. For enterprise applications prioritizing data freshness, RAG's operational expenditure is often significantly lower than recurrent model retraining cycles, though the choice depends on specific latency and consistency requirements.

To help navigate these choices, here is how the key components stack up:

| Component | Latency Impact | Cost Impact | Quality Gain |
| --- | --- | --- | --- |
| **Vector Search** | Low (~50ms) | Low | Baseline |
| **Hybrid Search** | Medium | Low | **High** (Keyword precision) |
| **Cross-Encoder** | **High** (200ms+) | **High** (GPU inference) | **Very High** (Deep relevance) |
| **Agentic Router** | Variable | Medium | **Max** (Context-aware pathing) |

The 2026 reference architecture isn't about picking the "best" component; it's about using a router to dynamically select the cheapest path that satisfies the query's quality requirement.

## What Are Key Considerations for Building and Evolving Enterprise RAG Architectures?

![Process diagram showing the evolution of RAG architecture from Baseline to Optimized to Advanced 2026 standards.](https://storage.googleapis.com/editorial-planner-images/article-images/24d81c4e-d7a3-40ac-865a-0ad71e5dbfd3/section_process_5_20260206_141927.webp)

Developing a production-ready RAG system constitutes an ongoing product lifecycle, rather than a singular project. A common error is the premature deployment of the complete '2026 architecture,' including components like semantic routing, graph fusion, and multi-agent loops, during initial implementation. Instead, success comes from a phased, metric-driven evolution.

**Start with a verifiable baseline.** Launch a simplified pipeline (ingest, chunk, embed, retrieve) to establish performance benchmarks. Only introduce complexity like **Reciprocal Rank Fusion (RRF)** or semantic splitting when your metrics demand it.

### Measurement is Part of the Architecture
In 2026, you cannot optimize what you do not measure. **Evaluation should be integrated into the architecture itself**, not treated as a post-hoc analysis. Utilize frameworks like **RAGAS** (Retrieval Augmented Generation Assessment) to automate the measurement of **faithfulness**, **answer relevance**, and **context precision** [[3](#ref-3)]. AWS recommends a **continuous evaluation workflow** to ensure the system remains reliable as data and user needs evolve [[2](#ref-2)].

**Treat security as architecture.** In enterprise environments, data governance cannot be an afterthought. Security-by-design means features like PII anonymization and untrusted retrieval mitigation (guardrails) are mandatory components of the ingestion and retrieval layers [[1](#ref-1), [6](#ref-6)].

Finally, robust **observability** must be instrumented from inception. Tracking **granular metrics** - like the specific latency cost of the reranking step - is the only way to decide if the quality gain is worth the speed penalty [[2](#ref-2)]. Use **Architecture Decision Records (ADRs)** to document these trade-offs as your system matures.

> **Critical Guidance:** Avoid premature over-engineering. Establish a foundational baseline, enforce data layer security, and introduce advanced "2026" complexities only when validated by evaluation metrics and real production KPIs.

---

## FAQ

> **Tip:** Each question below expands to a concise, production-oriented answer.

<details>
  <summary><strong>What are the key distinctions of the RAG 2026 reference architecture compared to earlier RAG systems?</strong></summary>

The 2026 RAG architecture moves beyond simple vector search to a sophisticated, multi-stage pipeline. It integrates hybrid retrieval (keyword and vector search), rigorous reranking, and treats trust as a structural component with mandatory anonymization. This industrial-grade approach ensures reliability, governance, and precision for enterprise AI.
</details>

<details>
  <summary><strong>Why is a Router-First design crucial for efficiency and cost reduction in 2026 RAG systems?</strong></summary>

A Router-First design uses a lightweight semantic classifier to intelligently direct user queries into 'Fast,' 'Standard,' or 'Deep' lanes. This avoids unnecessary compute for simple queries, reducing costs and latency. The actual savings depend on the traffic mix and are measured with routing KPIs like lane distribution and cost per query.
</details>

<details>
  <summary><strong>How do Hybrid Search and Reciprocal Rank Fusion (RRF) improve retrieval relevance in RAG 2026?</strong></summary>

The Fused Retrieval Layer combines hybrid search, which runs parallel dense vector and keyword (BM25) queries, to capture both semantic meaning and lexical specificity. Reciprocal Rank Fusion (RRF) then consolidates these disparate results by prioritizing documents that appear high in both ranked lists, effectively boosting consensus candidates and overcoming the 'relevance ceiling' of single-algorithm approaches.
</details>

<details>
  <summary><strong>What roles do caching and guardrails play in enhancing RAG system reliability and efficiency?</strong></summary>

Caching acts as an efficiency layer, storing validated results for recurring queries to reduce latency and cut API costs. Guardrails form a trust layer, implementing "security-by-design" through PII masking and treating retrieved context as untrusted input. This approach ensures compliance and prevents risks like prompt injection or hallucinations.
</details>

<details>
  <summary><strong>What are the main trade-offs to consider when optimizing RAG for cost, latency, and quality?</strong></summary>

Optimizing RAG involves balancing the "Iron Triangle" of Cost, Latency, and Quality. For instance, using a cross-encoder for higher quality introduces significant latency and cost. Strategies like multi-query generation can improve quality without the heavy reranking penalty. Enterprises should prioritize RAG over frequent LLM fine-tuning for better scalability and cost-efficiency when data freshness is key. Starting with a simpler baseline and adding complexity based on metrics is advised.
</details>


---

## References

1. <a id="ref-1"></a>[**AWS Prescriptive Guidance — Retrieval Augmented Generation options and architectures**](https://docs.aws.amazon.com/prescriptive-guidance/latest/retrieval-augmented-generation-options/introduction.html)
2. <a id="ref-2"></a>[**AWS ML Blog — Evaluate the reliability of RAG applications using Amazon Bedrock**](https://aws.amazon.com/blogs/machine-learning/evaluate-the-reliability-of-retrieval-augmented-generation-applications-using-amazon-bedrock/)
3. <a id="ref-3"></a>[**RAGAS — Automated Evaluation of Retrieval Augmented Generation (paper)**](https://arxiv.org/abs/2309.15217)
4. <a id="ref-4"></a>[**Elastic Docs — Hybrid search (recommends RRF for hybrid)**](https://www.elastic.co/docs/solutions/search/hybrid-search)
5. <a id="ref-5"></a>[**Elastic Docs — Reciprocal Rank Fusion (RRF) API + formula**](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)
6. <a id="ref-6"></a>[**OWASP — Top 10 for Large Language Model Applications (Prompt Injection, etc.)**](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
7. <a id="ref-7"></a>[**OWASP Cheat Sheet — LLM Prompt Injection Prevention**](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
8. <a id="ref-8"></a>[**Sentence-Transformers Docs — Cross-Encoders (rerankers)**](https://sbert.net/docs/cross_encoder/usage/usage.html)
9. <a id="ref-9"></a>[**Routing Survey (LLM systems) — Implementing Routing Strategies in LLM-Based Systems**](https://arxiv.org/abs/2502.00409)
10. <a id="ref-10"></a>[**LangChain (JS) — ParentDocumentRetriever**](https://reference.langchain.com/javascript/classes/_langchain_classic.retrievers_parent_document.ParentDocumentRetriever.html)
11. <a id="ref-11"></a>[**RAGCache (paper) — Efficient Knowledge Caching for RAG**](https://dl.acm.org/doi/10.1145/3768628)
12. <a id="ref-12"></a>[**Prompt Cache (paper) — Attention reuse for low-latency inference**](https://proceedings.mlsys.org/paper_files/paper/2024/file/a66caa1703fe34705a4368c3014c1966-Paper-Conference.pdf)
13. <a id="ref-13"></a>[**AWS Database Blog — Semantic cache with ElastiCache + Bedrock**](https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/)
