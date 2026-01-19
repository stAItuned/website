---
title: "LLM Evaluation & Benchmarks"
description: "Measuring performance, ELO ratings, benchmarks, and evaluation frameworks."
seoTitle: "LLM Evaluation & Benchmarks - Complete Guide & Resources"
seoDescription: "Comprehensive guide to LLM Evaluation & Benchmarks. Learn key concepts, best practices, and advanced techniques."
icon: "📊"
---

## What is LLM Evaluation?

**LLM Evaluation** (or "Evals") is the science of measuring how good a model (or system) is. Since language is subjective, evaluation is notoriously hard. It ranges from **Static Benchmarks** (MMLU, HumanEval) to measure raw model intelligence, to **Model-Based Graders** (using GPT-4 to grade a smaller model's answer), to **Human Evaluation**.

## When to focus on this

*   **Model Selection:** Deciding which model to use for your use case. Do you trust the leaderboard or run your own tests?
*   **System Refinement:** Knowing specifically if your new RAG retrieval strategy actually improved answer quality or just made it longer.
*   **Regression Testing:** ensuring that a prompt change didn't make the model worse at specific edge cases.

## Common Pitfalls

*   **Contamination:** Testing a model on questions that were in its training data. The model isn't "smart," it just memorized the answer.
*   **Goodhart's Law:** When a measure becomes a target, it ceases to be a good measure. Optimizing solely for a specific benchmark score often leads to models that are distinctively weird or "game" the test but fail in real conversation.
*   **Vibe Checking:** Relying only on "it feels better" rather than data. "Vibes" are not a scalable metric.

## FAQ

<details>
<summary>What is the Arena Elo?</summary>
A leaderboard (like Chatbot Arena) based on blind A/B tests where humans vote on which of two anonymous models gave a better answer. It is widely considered the most robust "real world" ranking.
</details>

<details>
<summary>Can LLMs grade LLMs?</summary>
Yes. "LLM-as-a-Judge" is a common technique where a strong model (like GPT-4) evaluates the outputs of a weaker model or system. It correlates highly with human preference but is much faster and cheaper.
</details>
