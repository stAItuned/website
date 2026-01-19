---
title: "Architetture dei Modelli & Training"
description: "Approfondimenti sulle architetture interne (MoE, Attention) e tecniche di addestramento (Fine-tuning, RLHF)."
seoTitle: "Architetture dei Modelli & Training - Guida Completa & Risorse"
seoDescription: "Guida completa alle Architetture dei Modelli e Training. Impara i concetti chiave, le best practices e le tecniche avanzate."
icon: "🏗️"
---

## What is Model Architectures & Training?

Questo argomento esplora la **sala macchine** dell'AI moderna. Copre i meccanismi interni dei Transformer (Attention, Feed-Forward Networks), le variazioni architettoniche come **Mixture of Experts (MoE)** contro i modelli Dense, e il ciclo di vita dell'addestramento di un modello—dal **Pre-training** su enormi dataset al **Fine-tuning** per compiti specifici e **RLHF** per l'allineamento.

## When to focus on this

*   **Sviluppo di Modelli Personalizzati:** Quando i modelli standard non sono sufficienti e hai bisogno di perfezionare un modello sui dati specifici del tuo dominio.
*   **Ottimizzazione delle Prestazioni:** Capire perché i modelli MoE potrebbero essere più veloci/economici per l'inferenza ma più difficili da perfezionare.
*   **Ricerca & Sperimentazione:** Se vuoi sperimentare con nuove tecniche di addestramento come LoRA (Low-Rank Adaptation) o QLoRA per adattare in modo efficiente modelli come Llama o Mistral.

## Common Pitfalls

*   **Overfitting:** Addestrare su un piccolo dataset per troppo tempo, facendo sì che il modello memorizzi gli esempi e perda la capacità di generalizzare.
*   **Dimenticanza Catastrofica (Catastrophic Forgetting):** Quando un modello "dimentica" le sue conoscenze precedenti (es. come programmare) dopo essere stato perfezionato pesantemente su un nuovo compito (es. diagnosi medica).
*   **Problemi di Qualità dei Dati:** "Garbage In, Garbage Out". Sprecare calcolo addestrando con dati di scarsa qualità è lo spreco di risorse più comune nell'ingegneria AI.

## FAQ

<details>
<summary>Cos'è il Fine-Tuning?</summary>
Il fine-tuning è il processo di prendere un modello pre-addestrato (che capisce già il linguaggio) e addestrarlo ulteriormente su un dataset più piccolo e specifico per specializzarlo in un compito o stile particolare.
</details>

<details>
<summary>Cos'è MoE (Mixture of Experts)?</summary>
Un'architettura in cui il modello è diviso in molte sotto-reti "esperte" più piccole. Per ogni token, un "router" seleziona solo pochi esperti per elaborarlo. Ciò consente al modello di avere parametri totali enormi (conoscenza) ma parametri attivi molto più bassi (velocità/costo) per inferenza.
</details>

<details>
<summary>Cos'è LoRA?</summary>
Low-Rank Adaptation (LoRA) è una tecnica efficiente di fine-tuning che congela i pesi del modello principale e addestra solo un minuscolo strato adattatore. Riduce drasticamente la memoria e il calcolo necessari per personalizzare gli LLM.
</details>
