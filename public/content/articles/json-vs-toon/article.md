---
title: 'TOON vs JSON for LLMs: Performance & Accuracy Deep Dive'
seoTitle: 'TOON vs JSON for LLMs: Performance & Accuracy Deep Dive'
seoDescription: >-
  Perché il formato TOON sta sfidando JSON nella comunicazione AI? Analisi di
  accuratezza, latenza e token-efficiency.
author: Daniele Moltisanti
topics:
  - GenAI
target: Expert
business: false
language: English
cover: >-
  https://storage.googleapis.com/editorial-planner-images/article-images/9a123e84-a2d9-49e4-a364-ac16356a9b03/cover_20251203_154839.webp
meta: >-
  Discover why LLMs struggle with JSON and how TOON's schema-aware structure can
  improve accuracy, reduce hallucinations, and cut token usage in AI workflows.
date: 2025-12-03T00:00:00.000Z
updatedAt: 2025-01-16T00:00:00.000Z
published: true
primaryTopic: llm-fundamentals
---

While many laud TOON for its token savings, treating it as “cheaper JSON” for LLMs misses the point.  
The real difference between TOON and JSON in AI workflows is **structural**: how clearly the format tells a model what the data looks like, and how much room it leaves for the model to guess.

And every time an LLM has to guess about structure, your risk of hallucinations and subtle data errors goes up.

---

## What Are TOON and JSON, and Why Does This Comparison Matter for LLMs?

![A split-screen image comparing two data structures. On the left, a tangled, chaotic web of glowing blue lines represents a complex JSON object. On the right, a clean, orderly grid of bright orange lines represents a TOON table. The mood is analytical and technical, with a dark background to make the glowing data structures pop.](https://storage.googleapis.com/editorial-planner-images/article-images/9a123e84-a2d9-49e4-a364-ac16356a9b03/cover_20251203_154821.webp)

For two decades, **JSON (JavaScript Object Notation)** has been the default format for data exchange on the web. It’s flexible, human-readable, and universally supported. Most APIs, webhooks, and config systems speak JSON fluently.

But JSON was never designed with large language models in mind.

- It’s **hierarchical**, with arbitrarily nested objects and arrays.
- It **doesn’t enforce a schema** by itself — that lives in your code or JSON Schema.
- And when you tell an LLM “return JSON like this” in a prompt, there’s no built-in structural safety net.

**TOON (Token-Oriented Object Notation)** is almost the opposite philosophy:

- It encodes the **same JSON data model**, but in a syntax optimised for LLM prompts.   
- It is **schema-aware and tabular-first**: you declare field names and array lengths up front.
- It’s indentation-based, closer to YAML + CSV than to classic `{}`/`[]` JSON.   

Here’s a simple example: a list of users.

**JSON:**

```json
[
  {
    "id": 101,
    "username": "alex",
    "role": "admin"
  },
  {
    "id": 102,
    "username": "casey",
    "role": "editor"
  }
]
````

**TOON (conceptual example):**

```text
users(id, username, role):
- 101, "alex", "admin"
- 102, "casey", "editor"
```

Both encodings represent the same logical structure. But in the TOON version:

* The **schema is declared once** (`id, username, role`).
* Each row is just values, like a CSV line.
* There’s less punctuation and duplication for the LLM to deal with.

That’s why multiple benchmarks find **30–60% fewer tokens** when using TOON instead of JSON for similar data, without losing structure.

For LLMs, this isn’t just about cost. It’s about **how clearly the input data’s shape is described**.

---

## Why Does JSON’s Structure Lead to More LLM Mistakes?

![A split-screen image illustrating a concept. On the left, a chaotic, tangled web of neon blue lines represents the ambiguity of JSON data structure. On the right, a clean, orderly grid of glowing green lines represents the structured, schema-aware format of TOON, leading to a clear, straight path. The mood is a stark contrast between confusion and clarity, with a dark, tech-themed background.](https://storage.googleapis.com/editorial-planner-images/article-images/9a123e84-a2d9-49e4-a364-ac16356a9b03/cover_20251203_154821.webp)

First, an important nuance:

> **JSON itself isn’t “bad”.**
> It’s a generic data syntax. The problems show up when we ask LLMs to **generate or interpret JSON without any enforced schema**, purely from a prompt.

In a lot of real-world LLM workflows, the pattern looks like this:

* “Here is some JSON. Answer questions about it.”
* “Return JSON in exactly this shape: `{ "field1": ..., "field2": ... }`.”

Two big issues appear:

1. **Models struggle with strict syntax + escaping**

   Benchmarks from tools like Aider show that when you force models to wrap code or answers inside JSON, reliability often drops versus plain text or markdown: more failures, more syntax issues, and more time spent fixing quotes and braces instead of solving the actual task. 

   Even with today’s “strict JSON” modes, JSON is still a lot of punctuation for the model to keep perfectly aligned.

2. **There are no built-in structural guardrails**

   Unless you use a separate mechanism (JSON Schema, OpenAI’s structured outputs, Vertex `responseSchema`, etc.), JSON doesn’t tell the model:

   * How many items are expected.
   * Which keys are mandatory vs optional.
   * What types each field must have.

   So the model has to **infer structure from examples in the prompt**. That’s where hallucinations sneak in:

   * Extra fields that weren’t in the original data.
   * Misinterpreting a number as a string or vice versa.
   * Dropping or duplicating records in long arrays.

For human developers, these are obvious bugs. For an LLM, they’re just “plausible text continuations”.

> **Key takeaway:** JSON’s flexibility is great for systems and humans, but when LLMs work only from prompt examples, that same flexibility becomes ambiguity.

---

## How Do TOON’s Schema-Aware Guardrails Help LLMs?

![An abstract, futuristic image showing two data streams. One stream, labeled JSON, is chaotic and tangled with glowing red lines. The other stream, labeled TOON, is orderly and flows in straight, parallel lines of cool blue light, representing clarity and efficiency. The mood is technical and analytical, with a dark background and a minimalist, digital art style.](https://storage.googleapis.com/editorial-planner-images/article-images/9a123e84-a2d9-49e4-a364-ac16356a9b03/cover_20251203_154825.webp)

TOON’s design goal is simple:

> “Encode the JSON data model in a way that is **compact and obvious** to an LLM.” 

The key ideas:

* **Schema first:** TOON encourages declaring the structure up front (field names, sometimes lengths, and sometimes types).
* **Less noise:** It removes a lot of repeated keys and punctuation that JSON needs.
* **Table-friendly:** For arrays of similar objects, it behaves like a table with headers and rows — a pattern models handle well.

Here’s a more explicit (simplified) TOON example:

```text
users(3) name:string age:int city:string
"Alice" 30 "New York"
"Bob" 25 "London"
"Charlie" 35 "Paris"
```

A model reading this can immediately infer:

* There are **3** user records.
* Each has **exactly three fields**: `name`, `age`, `city`.
* `age` is an integer, the rest are strings.

Compare that with JSON:

```json
[
  {"name": "Alice", "age": 30, "city": "New York"},
  {"name": "Bob", "age": 25, "city": "London"},
  {"name": "Charlie", "age": 35, "city": "Paris"}
]
```

JSON is still clear to us, but for a model:

* The schema is **implicit** and repeated every row.
* A single missing key or comma can shift everything.
* It has to piece together the structure from multiple examples.

With TOON, the **shape is declared once**, and every row must conform. That acts as a strong bias against hallucinating extra columns or misaligning values.

> **Key takeaway:** TOON shifts work from “LLM guessing the structure” to “LLM being told the structure”, which is exactly what you want when you care about reliable structured data.

---

## TOON vs JSON: What Do Benchmarks Actually Show?

![An abstract data visualization showing two streams of information flowing side-by-side. One stream, labeled 'TOON,' is orderly and composed of neat, glowing blue blocks forming a straight line. The other stream, 'JSON,' is a chaotic tangle of red and purple lines with occasional errors sparking off. The setting is a dark, futuristic digital space, and the mood is one of clarity versus complexity.](https://storage.googleapis.com/editorial-planner-images/article-images/9a123e84-a2d9-49e4-a364-ac16356a9b03/cover_20251203_154830.webp)

Several public benchmarks now compare TOON and JSON for LLM workloads:

* The **official TOON repo** reports that on its structured retrieval benchmark, TOON reaches **73.9%** accuracy vs **69.7%** for JSON while using about **39–40% fewer tokens**. 
* An independent analysis summarised in *TOON Benchmarks: A Critical Analysis of Different Results* finds a similar pattern on a slightly different setup: **68.7% vs 65.7%** with **≈39.5% fewer tokens**. 
* Another dev-focused write-up shows **70.1%** accuracy for TOON vs **65.4%** for JSON and roughly **46% token reduction** across several models (GPT-5 nano, Claude Haiku, Gemini Flash, Grok). 

Across these sources, the pattern is consistent:

* **Token usage:** TOON often reduces tokens by **30–60%** for structured/tabular data.
* **Accuracy:** TOON usually delivers a **3–5 percentage point** improvement in retrieval accuracy on those benchmarks.

That might sound small, but in production this can mean:

* Fewer mis-parsed records in logs or analytics.
* Fewer hallucinated fields or misaligned values.
* Less manual clean-up of model outputs.

### Important caveats

It’s not magic, and it’s not always better:

* Independent tests highlight **cases where TOON underperforms** JSON or markdown-style formats, especially with deeply nested or irregular data that doesn’t fit a neat table. ([towardsdeeplearning.com][5])
* TOON’s strength is **uniform, structured data** (lists of customers, products, transactions, events), not arbitrary document trees.

> **Honest summary:** TOON tends to win on “rows and columns” style data, with better accuracy *and* fewer tokens. For weird, deeply nested data, JSON (or even YAML / markdown) may still be the better choice.

---

## When Should You Use TOON vs JSON in LLM Projects?

![A close-up shot of a sophisticated, glowing blue and purple circuit board, with a clean, minimalist design. Two distinct pathways are etched into the board: one is a complex, winding path labeled 'JSON', and the other is a straight, efficient line labeled 'TOON'. The TOON path glows brighter, suggesting speed and accuracy, set against a dark, tech-focused background. The mood is modern, technical, and analytical.](https://storage.googleapis.com/editorial-planner-images/article-images/9a123e84-a2d9-49e4-a364-ac16356a9b03/cover_20251203_154822.webp)

A simple way to decide:

> **Is the primary consumer of this data an LLM, or another system/human?**

### Use TOON when…

* You’re feeding **large, uniform datasets** into a model:
  customer lists, transaction logs, product catalogs, events.
* You’re building **agents or tools** that repeatedly query structured data and you want:

  * fewer hallucinated fields,
  * fewer off-by-one errors in arrays,
  * more predictable parsing behaviour.
* You care about **token cost and context window limits** and are happy to adopt a more specialised format for LLM-facing data.

In these scenarios, benchmarks suggest TOON can give you both **cost savings** and **a few percentage points of extra accuracy** — which is often more valuable than the cost itself.

### Stick with JSON when…

* You’re building **public or general-purpose APIs**, webhooks, or config files.
* Your main consumers are **services and humans**, not LLMs.
* You need **universally understood, battle-tested tooling** (every language has a JSON parser; not yet true for TOON).
* Your data is **deeply nested and irregular**, where TOON’s tabular bias doesn’t buy you much.

In those cases, JSON remains the pragmatic choice. You can still combine it with:

* JSON Schema
* OpenAI structured outputs / Vertex `responseSchema`
* Strong validation in your application code

…to get robust structure without changing the wire format.

---

### Quick decision table

| Scenario                                      | Recommended Format    | Why                                                   |
| --------------------------------------------- | --------------------- | ----------------------------------------------------- |
| LLM agent over customers / products / events  | **TOON**              | Better token density + clearer structure for the LLM. |
| Repeated structured queries (analytics, logs) | **TOON**              | Fewer hallucinations, more predictable retrieval.     |
| Public REST APIs / webhooks / configs         | **JSON**              | Ubiquitous support and human readability.             |
| One-off, conversational LLM calls             | **JSON / plain text** | Flexibility is enough; structure is less critical.    |

> **Bottom line:**
> JSON is still the default language of the web. TOON is emerging as a specialised “LLM-first” format: worth adopting where structured accuracy and token efficiency really matter, but not a universal replacement.

---

JSON is still the default language of the web. TOON is emerging as a specialised “LLM-first” format: worth adopting where structured accuracy and token efficiency really matter, but not a universal replacement.

---

## FAQ

> **Tip:** Each question below expands to a concise, production-oriented answer.

<details>
  <summary><strong>What is TOON format?</strong></summary>

**TOON (Token-Oriented Object Notation)** is a data format designed specifically for LLMs. It mimics JSON's data model but uses a schema-aware, tabular structure to reduce token usage (by 30-50%) and improve the model's ability to generate valid, accurate structured data.
</details>

<details>
  <summary><strong>Why use TOON instead of JSON for LLMs?</strong></summary>

LLMs often struggle with strict JSON syntax (brackets, commas) and can hallucinate structure. **TOON** simplifies the syntax and enforces a schema upfront, leading to higher accuracy (fewer hallucinations) and lower latency because the model generates fewer tokens to represent the same data.
</details>

<details>
  <summary><strong>Does TOON save tokens?</strong></summary>

Yes, benchmarks consistently show **TOON reduces token usage by 30% to 60%** compared to standard JSON for structured lists (like product catalogs or user logs). This translates directly to lower API costs and faster response times.
</details>

---

## References

1. **TOON Format Specification** – GitHub: official spec and rationale.
   [https://github.com/toon-format/spec](https://github.com/toon-format/spec)

2. **TOON Benchmarks: A Critical Analysis of Different Results** – *Towards Deep Learning*.
   [https://www.towardsdeeplearning.com/toon-benchmarks-a-critical-analysis-of-different-results-d2a74563adca](https://www.towardsdeeplearning.com/toon-benchmarks-a-critical-analysis-of-different-results-d2a74563adca)

3. **TOON GitHub Repository & Benchmarks** – Official repo with accuracy and token metrics.
   [https://github.com/toon-format/toon](https://github.com/toon-format/toon)

4. **TOON vs JSON: The New Format Designed for AI** – dev.to article with 70.1% vs 65.4% accuracy and ~46% token reduction.
   [https://dev.to/akki907/toon-vs-json-the-new-format-designed-for-ai-nk5](https://dev.to/akki907/toon-vs-json-the-new-format-designed-for-ai-nk5)

5. **What the TOON Format Is (Token-Oriented Object Notation)** – OpenAPI.com overview and 30–60% token savings.
   [https://openapi.com/blog/what-the-toon-format-is-token-oriented-object-notation](https://openapi.com/blog/what-the-toon-format-is-token-oriented-object-notation) 

6. **LLMs are bad at returning code in JSON** – Aider benchmark discussion of JSON-wrapped outputs vs plain text.
   [https://aider.chat/2024/08/14/code-in-json.html](https://aider.chat/2024/08/14/code-in-json.html)

