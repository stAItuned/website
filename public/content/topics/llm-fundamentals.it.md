---
title: "Fondamenti LLM"
description: "Concetti fondamentali dei Large Language Models, dall'architettura alla tokenizzazione."
seoTitle: "Fondamenti LLM - Guida Completa & Risorse"
seoDescription: "Guida completa ai Fondamenti LLM. Impara i concetti chiave, le best practices e le tecniche avanzate."
icon: "📚"
---

## What is LLM Fundamentals?

Questo argomento copre i meccanismi fondamentali dei **Large Language Models**. Esplora l'**architettura Transformer** (meccanismi di Attention), la **Tokenizzazione** (come il testo diventa numeri) e la pipeline di addestramento (Pre-training vs. Fine-tuning vs. RLHF). Comprendere queste basi è fondamentale per il debugging del perché i modelli si comportano in quel modo.

## When to focus on this

*   **Debugging del Comportamento:** Quando devi capire perché un modello si ripete, ha allucinazioni o ignora le istruzioni.
*   **Selezione del Modello:** Determinare se usare un modello open-weights (Llama 3, Mistral) o un'API chiusa (GPT-4, Claude) in base al conteggio dei parametri e alle capacità.
*   **Ottimizzazione:** Quando devi ottimizzare per latenza, costi o utilizzo della finestra di contesto.

## Common Pitfalls

*   **La Fallacia della "Base di Conoscenza":** Trattare un LLM come un database di fatti piuttosto che come un motore di ragionamento.
*   **Ignorare la Tokenizzazione:** Non tenere conto di come i prompt vengono tokenizzati può portare a costi imprevisti e overflow della finestra di contesto.
*   **Incomprensione della Temperatura:** Usare alta temperatura (creatività) per compiti che richiedono logica deterministica, o viceversa.

## FAQ

<details>
<summary>Cos'è un Token?</summary>
Un token è l'unità base di testo che un LLM elabora. Può essere una parola, parte di una parola o anche uno spazio. Approssimativamente, 1000 token ≈ 750 parole.
</details>

<details>
<summary>Cos'è la Finestra di Contesto?</summary>
La quantità massima di testo (prompt + risposta) che un LLM può considerare in una volta. Una volta superata, il modello "dimentica" le parti più vecchie della conversazione.
</details>
