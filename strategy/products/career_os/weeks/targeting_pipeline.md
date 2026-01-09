# Career OS Module: Week 2 — Setup Pipeline & Ricerca Mirata

Questo documento è il manuale operativo per la **Week 2**. L'obiettivo è costruire il tuo "motore di ricerca" personale per smettere di cercare offerte a mano e focalizzarsi solo su opportunità ad alta conversione.

---

## 1. Strategia di Targeting: Il "Reverse Funnel"

Invece di partire da "Cosa c'è aperto oggi?", partiamo da "Dove voglio lavorare?".
Usiamo un approccio a 3 Tier per prioritizzare le energie.

### Tier 1: "Dream Targets" (High Effort, High Reward)
*   **Definizione**: Aziende dove il tuo *Role-Fit* (W1) è perfetto e il brand/stipendio è top.
*   **Quante**: 5-10 aziende max.
*   **Azione**: Networking spinto, Referral obbligatorio, CV iper-custom.
*   **Esempi**: Tech Giants, Unicorni AI, Enterprise con team GenAI maturi.

### Tier 2: "Solid Match" (Mid Effort, Good Reward)
*   **Definizione**: Buona cultura, stack giusto, ruolo interessante.
*   **Quante**: 15-20 aziende.
*   **Azione**: CV Custom (ma rapido), Application diretta (LinkedIn/Sito).
*   **Esempi**: Scale-up, Consulting firm serie, Banche/Assicurazioni svecchiate.

### Tier 3: "Volume / Allenamento" (Low Effort)
*   **Definizione**: Aziende meno note o ruoli leggermente meno a fuoco.
*   **Quante**: Indefinite (feed automatico).
*   **Azione**: "Easy Apply" o candidatura rapida. Utili per fare pratica con i colloqui.

---

## 2. Come selezionare le "Golden JD" (Input per W3)

Le **Golden JD** sono le 3 Job Description che useremo nella Week 3 per riscrivere il tuo CV.
Devono essere *perfette*. Se sbagli queste, il CV verrà sbagliato.

### Criteri di Selezione (Checklist)
Una JD è "Golden" se ha almeno 4 su 5 di questi elementi:
1.  ✅ **Stack Tecnico Esplicito**: Cita le tecnologie del tuo Primary Track (es. "Python, LangChain, Pinecone").
2.  ✅ **Problema Chiaro**: Dice cosa devi risolvere (es. "Ridurre le allucinazioni del chatbot customer service").
3.  ✅ **Team Strutturato**: Cita con chi lavorerai (PM, Data Scientist, altri Eng). *Red flag: "Lavorerai da solo con il CEO".*
4.  ✅ **Responsabilità Reali**: Cita deploy, monitoring, scala. *Red flag: "Ricerca e sviluppo", "Prototipazione".*
5.  ✅ **Recency**: Pubblicata negli ultimi 14 giorni (o ri-pubblicata).

### Template Analisi Golden JD (Da compilare per ogni JD)
Per ognuna delle 3 JD, estrai questi dati (ti serviranno per il CV):
*   **Titolo Ruolo**: __________________
*   **Top 3 Hard Skills richieste**: __________________
*   **Top 3 Soft Skills / Valori**: __________________
*   **Il problema "business" di fondo**: __________________
*   **Keyword ricorrenti (ripetute >2 volte)**: __________________

---

## 3. Setup del Job Feed (Automazione)

Non devi passare 2 ore al giorno su LinkedIn. Devi spenderci 15 minuti.
Impostiamo le alert per ricevere le "Tier 2/3" in automatico.

### Query String Avanzate (Copia-Incolla su LinkedIn/Google Jobs)
Non cercare "AI Engineer". Cerca per *skill*.

**Per Track RAG / Backend:**
> `("Generative AI" OR "LLM" OR "RAG") AND ("Python" OR "Backend") AND ("Production" OR "Deploy") NOT ("Intern" OR "PhD")`

**Per Track Platform / Ops:**
> `("LLMOps" OR "MLOps" OR "AI Platform") AND ("Kubernetes" OR "AWS" OR "Azure") AND ("Evaluation" OR "Monitoring")`

**Per Track Product:**
> `("Product Manager" OR "Technical PM") AND ("AI" OR "Generative") AND ("Roadmap" OR "User stories")`

*Istruzioni:*
1.  Inserisci la stringa nella search bar.
2.  Filtra per "Ultimi 7 giorni".
3.  Attiva "Set Alert" (Daily).

---

## 4. Pipeline Tracker (Il tuo Template Operativo)

Usa un semplice Google Sheet o Notion Board. Non usare strumenti complessi.

### Colonne Obbligatorie
1.  **Company Name**
2.  **Role Title** (+ Link JD)
3.  **Tier** (1, 2, 3)
4.  **Status**:
    *   *To Do* (Visto, da analizzare)
    *   *Ready* (Golden JD analizzata, pronto per CV)
    *   *Applied* (Inviato)
    *   *Networking* (Contattato qualcuno)
    *   *Rejected / Interview*
5.  **Date Applied** (Fondamentale per il follow-up)

---

## 5. Output della Week 2 (Checklist Finale)

Alla fine di questa settimana, devi avere:

*   [ ] **Target List**: Almeno 5 aziende Tier 1 e 15 aziende Tier 2 nel Tracker.
*   [ ] **3 Golden JD**: Salvate e analizzate (keyword estratte).
*   [ ] **Job Feed Attivo**: Ricevi max 10 mail al giorno, di cui almeno 3 rilevanti (se sono 0, allarga i filtri; se sono 50, stringili).
*   [ ] **Networking Plan**: Per le Tier 1, hai identificato *chi* contattare (Hiring Manager o Peer).

> **Regola d'oro del Targeting:**
> Meglio candidarsi a 5 aziende Tier 1 con referral e CV perfetto, che a 100 aziende a caso col tasto "Easy Apply".
