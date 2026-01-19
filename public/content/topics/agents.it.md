---
title: "Agenti AI & Tool Use"
description: "Agenti autonomi, function calling, pianificazione e sistemi multi-agente."
seoTitle: "Agenti AI & Tool Use - Guida Completa & Risorse"
seoDescription: "Guida completa agli Agenti AI e Tool Use. Impara i concetti chiave, le best practices e le tecniche avanzate."
icon: "📚"
---

## What are AI Agents?

Gli **Agenti AI** sono sistemi in cui un LLM agisce come un "cervello" per orchestrare flussi di lavoro in modo autonomo. Invece di generare solo testo, un agente può **pianificare** una sequenza di azioni, usare **strumenti** esterni (tramite Function Calling verso API, browser web o database) e interagire con il suo ambiente per raggiungere un obiettivo.

## When to focus on this

*   **Flussi di Lavoro Complessi:** Quando un compito richiede più passaggi che non possono essere codificati rigidamente (es. "Fai una ricerca su questa azienda e scrivi un riassunto").
*   **App Orientate all'Azione:** Quando hai bisogno che l'AI *faccia* cose—prenotare riunioni, interrogare database SQL o fare scraping di siti web—non solo parlarne.
*   **Loop Autonomi:** Costruire sistemi che possano girare in background, monitorare eventi e reagire senza intervento umano.

## Common Pitfalls

*   **Loop Infiniti:** Gli agenti possono facilmente bloccarsi in un ciclo provando ripetutamente la stessa azione fallita senza un meccanismo di "time-out".
*   **Mancanza di Supervisione:** Permettere agli agenti di eseguire azioni distruttive (es. eliminare file, inviare email) senza un passaggio di approvazione "human-in-the-loop".
*   **Problemi di Affidabilità:** Gli agenti sono probabilistici; un flusso di lavoro che funziona il 90% delle volte può comunque fallire in modo spettacolare nell'altro 10%.

## FAQ

<details>
<summary>Cos'è il Function Calling?</summary>
Una funzionalità in cui descrivi una funzione (es. `get_weather(city)`) all'LLM, e il modello restituisce un oggetto JSON strutturato contenente gli argomenti per chiamare quella funzione, invece di testo conversazionale.
</details>

<details>
<summary>Agente Singolo vs. Multi-Agente?</summary>
Gli agenti singoli sono più facili da costruire ma possono essere sopraffatti. I sistemi multi-agente assegnano specifiche "persone" (es. Ricercatore, Scrittore, Editore) a diverse istanze, migliorando spesso la qualità per compiti complessi.
</details>
