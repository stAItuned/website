---
title: "Valutazione LLM & Benchmark"
description: "Misurare le prestazioni, rating ELO, benchmark e framework di valutazione."
seoTitle: "Valutazione LLM & Benchmark - Guida Completa & Risorse"
seoDescription: "Guida completa alla Valutazione LLM e Benchmark. Impara i concetti chiave, le best practices e le tecniche avanzate."
icon: "📊"
---

## What is LLM Evaluation?

La **Valutazione LLM** (o "Evals") è la scienza di misurare quanto è buono un modello (o sistema). Poiché il linguaggio è soggettivo, la valutazione è notoriamente difficile. Spazia dai **Benchmark Statici** (MMLU, HumanEval) per misurare l'intelligenza grezza del modello, ai **Model-Based Graders** (usare GPT-4 per valutare la risposta di un modello più piccolo), alla **Valutazione Umana**.

## When to focus on this

*   **Selezione del Modello:** Decidere quale modello usare per il tuo caso d'uso. Ti fidi della classifica o esegui i tuoi test?
*   **Raffinamento del Sistema:** Sapere specificamente se la tua nuova strategia di recupero RAG ha effettivamente migliorato la qualità della risposta o l'ha solo resa più lunga.
*   **Test di Regressione:** Assicurarsi che una modifica al prompt non abbia peggiorato il modello in specifici casi limite.

## Common Pitfalls

*   **Contaminazione:** Testare un modello su domande che erano nei suoi dati di addestramento. Il modello non è "intelligente", ha solo memorizzato la risposta.
*   **Legge di Goodhart:** Quando una misura diventa un obiettivo, cessa di essere una buona misura. Ottimizzare esclusivamente per un punteggio di benchmark specifico porta spesso a modelli che sono distintamente strani o "ingannano" il test ma falliscono nella conversazione reale.
*   **Vibe Checking:** Affidarsi solo a "sembra meglio" piuttosto che ai dati. Le "vibrazioni" non sono una metrica scalabile.

## FAQ

<details>
<summary>Cos'è l'Arena Elo?</summary>
Una classifica (come Chatbot Arena) basata su test A/B alla cieca in cui gli umani votano quale tra due modelli anonimi ha dato una risposta migliore. È ampiamente considerata la classifica "mondo reale" più robusta.
</details>

<details>
<summary>Gli LLM possono valutare gli LLM?</summary>
Sì. "LLM-as-a-Judge" è una tecnica comune in cui un modello forte (come GPT-4) valuta gli output di un modello o sistema più debole. Si correla altamente con la preferenza umana ma è molto più veloce ed economico.
</details>
