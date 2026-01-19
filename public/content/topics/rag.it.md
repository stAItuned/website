---
title: "RAG & Context Engineering"
description: "Retrieval-Augmented Generation, vector access, e gestione avanzata del contesto."
seoTitle: "RAG & Context Engineering - Guida Completa & Risorse"
seoDescription: "Guida completa a RAG e Context Engineering. Impara i concetti chiave, le best practices e le tecniche avanzate."
icon: "📚"
---

## What is RAG?

**Retrieval-Augmented Generation (RAG)** è l'architettura che collega gli LLM ai tuoi dati privati. A differenza del **fine-tuning**, che "incide" la conoscenza nei pesi del modello, la RAG recupera il contesto rilevante al momento dell'esecuzione (solitamente da un Vector Database) per basare le risposte del modello su fatti specifici del tuo dominio.

## When to focus on this

*   **Conoscenza Privata:** Quando la tua applicazione deve rispondere a domande su documenti proprietari (PDF, Wiki aziendali, Notion).
*   **Riduzione delle Allucinazioni:** Quando l'accuratezza standard degli LLM non è sufficiente e hai bisogno di citazioni o risposte basate su fonti.
*   **Dati in Tempo Reale:** Quando le informazioni cambiano frequentemente (es. prezzi delle azioni, notizie) e riaddestrare un modello non è fattibile.

## Common Pitfalls

*   **Garbage In, Garbage Out:** Recuperare chunk irrilevanti o di bassa qualità confonderà il modello, indipendentemente da quanto sia intelligente l'LLM.
*   **Sovraccarico del Contesto:** Inserire troppo contesto nel prompt aumenta la latenza, i costi e il rischio che il modello si "perda nel mezzo" (lost in the middle).
*   **Ignorare il Reranking:** Affidarsi solo alla similarità vettoriale spesso fa perdere sfumature; un secondo passaggio di reranking di solito migliora significativamente l'accuratezza.

## FAQ

<details>
<summary>RAG è meglio del Fine-Tuning?</summary>
Risolvono problemi diversi. La RAG serve per l'**iniezione di conoscenza** (aggiungere nuovi fatti). Il fine-tuning serve per la **modifica del comportamento** (insegnare al modello un tono, un formato o uno stile specifico). Spesso, i sistemi migliori usano entrambi.
</details>

<details>
<summary>Cos'è un Vector Database?</summary>
Un database specializzato che memorizza i dati come vettori matematici (embedding). Ti permette di cercare contenuti basati sul *significato semantico* piuttosto che solo sulla corrispondenza delle parole chiave.
</details>
