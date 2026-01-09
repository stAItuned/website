# Career OS Module: Week 4 — Prima Proof Pubblica & Interview Prep

Questo documento è il manuale operativo per la **Week 4**.
L'obiettivo è duplice:
1.  **Authority**: Uscire dall'anonimato pubblicando un articolo tecnico su stAItuned (usando la nostra piattaforma come leva di credibilità).
2.  **Readiness**: Preparare le "munizioni" per i colloqui che inizieranno ad arrivare.

---

## 1. Il Protocollo "stAItuned Article" (Authority)

Non scrivere un post generico "Cos'è un LLM". Scrivi un pezzo da **Problem Solver**.
Pubblicarlo su stAItuned ti posiziona come "Guest Author/Expert", non come un candidato qualunque che scrive su Medium.

### Criteri Editoriali (Cosa pubblichiamo)
Per essere approvato, l'articolo deve seguire una di queste strutture:
*   **The "Trade-off" Analysis**: Confronto ragionato tra due tecnologie (es. *Pinecone vs Chroma: Quale scegliere per un'app RAG in produzione?*).
*   **The "Deep Dive"**: Analisi di un problema specifico (es. *Come ridurre le allucinazioni nei chatbot legali*).
*   **The "Hot Take"**: Opinione informata su un trend (es. *Perché i piccoli modelli specifici batteranno GPT-5 nelle Enterprise*).

### Struttura Obbligatoria (1000-1500 parole)
1.  **The Hook**: Perché questa cosa è difficile o costosa oggi?
2.  **The Context**: Cosa serve sapere per capire?
3.  **The Analysis/Solution**: Il "cuore" tecnico (diagrammi, snippet di codice, o analisi logica).
4.  **The Takeaway**: Cosa si porta a casa il lettore lunedì mattina?

---

## 2. LinkedIn Share Kit (Visibility)

L'articolo è inutile se nessuno lo legge. Ti forniamo lo "Share Kit" per massimizzare le view su LinkedIn.

### A. Il Post (Testo)
Formula "Stop the Scroll":
*   **Riga 1 (Controversa/Forte)**: "Tutti usano RAG, ma pochi misurano la 'groundedness'. Ecco perché è un suicidio."
*   **Riga 2 (Spazio vuoto)**.
*   **Righe 3-5 (Insight)**: "Nel mio ultimo articolo per @stAItuned, analizzo..."
*   **CTA (Call to Action)**: "Link nei commenti / Leggi qui sotto."

### B. Il Visual (Immagine/Carosello)
*   Useremo i template grafici di stAItuned (professionale, brandizzato).
*   Non serve che tu sia un designer.
*   Titolo grande + Foto autorevole + Logo stAItuned.

---

## 3. Interview Manual 360° (Preparation & Execution)

Non improvvisare. Un colloquio è una negoziazione di valore, non un interrogatorio scolastico.
Questo manuale copre le 4 dimensioni critiche: **Soft, Hard, Negotiation, Reverse Interview**.

### A. Soft Skills: Il Metodo STAR+
Non raccontare storie a caso. Usa la struttura per dimostrare *impatto*.

*   **S (Situation)**: "Eravamo in ritardo di 2 settimane sulla release..." (10% del tempo)
*   **T (Task)**: "Dovevo ottimizzare la latency del RAG..." (10% del tempo)
*   **A (Action)**: "Ho analizzato i log, identificato il collo di bottiglia in Pinecone, e implementato un caching layer..." (60% del tempo - IO, non NOI)
*   **R (Result)**: "Latenza scesa del 40%, churn ridotto del 5%." (20% del tempo - Numeri!)

> **Compito**: Scrivi 3 storie STAR per: *Conflict*, *Failure*, *Tech Challenge*.

### B. Hard Skills: Il Metodo "Trade-off"
Un Senior non dice "X è meglio". Dice "Dipende".

*   **Domanda**: "Meglio Pinecone o Chroma?"
*   **Risposta Junior**: "Pinecone perché è veloce."
*   **Risposta Senior**: "Dipende dai vincoli. Se hai bisogno di **managed service** e scalabilità immediata, Pinecone (costo $$). Se vuoi tenere i dati **on-prem** o costi bassi per piccoli volumi, Chroma o Qdrant self-hosted. Nel mio progetto X ho scelto Qdrant perché..."

> **Compito**: Prepara i Trade-off per 3 tecnologie chiave del tuo stack.

### C. Salary & Negotiation: Chi parla per primo perde
Obiettivo: Non dare mai il tuo numero prima che loto ti abbiano dato un range o fatto un'offerta.

*   **Recruiter**: "Qual è la tua aspettativa?"
*   **Tu (Script)**: *"Al momento sono focalizzato sul trovare il ruolo giusto per portare valore. Sono sicuro che avete un budget per questa posizione: qual è il range previsto per questo livello?"*
*   **Se insistono**: *"Sulla base delle ricerche di mercato per Senior AI Engineer, vedo range tra X e Y, ma dipende molto dal pacchetto totale (equity, bonus, remote). Voi dove vi posizionate?"*

### D. Reverse Interview: Le domande da fare a Loro
La qualità delle tue domande dimostra la tua seniority più delle tue risposte.

*   **Tech Culture**: "Qual è l'ultima volta che avete fatto deploy di venerdì? Come gestite gli incidenti?" (Cerca: Blame culture vs Learning culture).
*   **GenAI Maturity**: "Avete già utenti reali in produzione o siamo in fase PoC? Qual è il collo di bottiglia attuale?"
*   **Business**: "Come impatta questo team sul fatturato aziendale?" (Fondamentale: se sei un centro di costo, sei a rischio licenziamento).
*   **Killer Question**: "Tra 6 mesi, cosa devo aver fatto per farvi dire che assumermi è stata l'idea migliore dell'anno?"

### E. Red Flags (Quando scappare)
*   🚩 "Siamo una famiglia" = Ti chiederemo overworking gratis.
*   🚩 "Il ruolo è fluido" = Non sappiamo cosa farti fare.
*   🚩 "Stiamo capendo la strategia AI" = Finirai a fare slide per il CEO.

---

## 5. Output della Week 4 (Checklist Finale)

*   [ ] **Articolo Draftato & Approvato**: Pronto per la pubblicazione su stAItuned.
*   [ ] **Post LinkedIn Programmato**: Testo + Immagine pronti.
*   [ ] **Cheat Sheet compilato**: Hai scritto le tue 3 storie STAR e i 3 concetti Hard.
*   [ ] **Mock "Zero"**: Hai provato a ripetere le risposte ad alta voce davanti allo specchio (o registrandoti).

> **Obiettivo**: Quando il recruiter chiama, non sei nel panico. Hai le risposte scritte davanti a te e un articolo pubblicato che ti dà status.
