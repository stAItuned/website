# Career OS Module: Week 5 & 6 — Proof Platform & Vibe Coding

Questo documento è il manuale operativo per il blocco **Advanced Track (W5-W6)**.
Obiettivo: Smettere di avere "repo locali" e iniziare ad avere "prodotti live" usando la potenza dell'AI.

---

## 0. The Product Canvas (Blueprint da Compilare)

Prima di scrivere una sola riga di codice, devi compilare questa scheda.
Serve a evitare il "Feature Creep" (voler fare tutto) e mantenere il focus su ciò che dimostra il tuo valore.

### A. Core Concept & Positioning
*   **Nome Progetto**: ________________ (es. "LegalRAG", "DataAnalystAgent")
*   **One-Liner (Elevator Pitch)**: "Un assistente che aiuta [Chi] a fare [Cosa] riducendo [Problema] del X%."
*   **Problema Business Reale**: Quale inefficienza stai risolvendo? (Non dire "Volevo provare LangChain", di "I legali perdono 4 ore a cercare clausole").
*   **Business Value / ROI**: Qual è il guadagno concreto? (es. "Riduco il tempo di ricerca dell'80%", "Elimino gli errori di compliance").
*   **Target Hiring Manager**: Chi deve rimanere impressionato? (es. "Head of AI in una Fintech", "Lead Engineer in una Scale-up SaaS").

### B. The "Evidence" (Cosa vedranno)
*   **The Magic Moment**: Qual è l'unica interazione che deve far dire "WOW"? (es. "Carico un PDF e mi cita la pagina esatta con highlight").
*   **Input Utente**: Cosa deve fare l'utente per far partire il tutto? (es. Upload file, Inserire query, Linkare URL).
*   **Output Sistema**: Cosa restituisce? (es. Chat streamata, Tabella scaricabile, PDF report).

### C. Technical Constraints & Architecture
*   **Model Strategy**:
    *   *Reasoning Model*: (es. Claude 3.5 Sonnet / GPT-4o) → Perché?
    *   *Speed/Cost Model*: (es. GPT-4o-mini) → Perché?
*   **Data Strategy**:
    *   *Vector DB*: (Firebase Vector, Chroma, Pinecone) → Giustifica la scelta.
    *   *Persistence*: (Firestore) → Cosa salviamo? (Chat logs, User prefs).
*   **Infrastructure**:
    *   *Hosting*: Firebase Hosting.
    *   *Compute*: Cloud Functions (Python/Node).

### D. Showcase Strategy (Packaging)
*   **Repo Structure**: Monorepo o Backend/Frontend separati?
*   **README Hook**: Qual è lo screenshot o la GIF che metterai in cima al README?

---

## 1. Il Protocollo "Supervised Vibe Coding"

"Vibe Coding" non significa "chiedere codice a caso". Significa agire da **Technical Architect** che guida una flotta di Junior Developer instancabili (LLM).
Se non dai regole, l'AI scrive codice spaghetti. Ecco come si fa il setup per basi solide.

### A. Il "Context Loading" (System Instructions)
Prima di scrivere una riga di codice, devi istruire l'AI sulle regole del gioco.
Configura le **System Instructions** del tuo agent (Antigravity) con questo prompt:

> **System Instruction Template:**
> "Sei un Senior Full-Stack Engineer esperto in Google Cloud Platform, Next.js e TailwindCSS.
>
> **Regole di Architettura:**
> 1.  **Modularità**: Ogni componente UI deve essere in `/components`, ogni logica in `/hooks` o `/lib`.
> 2.  **Safety**: Mai esporre API Keys nel frontend. Usa sempre Environment Variables.
> 3.  **Style**: Usa TailwindCSS per tutto. Niente CSS files custom separati.
> 4.  **Database**: Usiamo Firebase Firestore. La struttura dati deve essere tipizzata (TypeScript interfaces).
>
> **Workflow:**
> - Prima di scrivere codice, riassumi cosa farai in 3 bullet points.
> - Se c'è un errore, non tentare fix a caso: analizza la Root Cause.
> - Scrivi codice pulito, commentato dove la logica è complessa."

### B. Iterative Prompting Strategy
Non chiedere "Fammi un sito". Usa la strategia **Component-by-Component** con Antigravity:
1.  **Step 1 (Scaffold)**: "Genera la struttura delle cartelle per un progetto Next.js con Firebase."
2.  **Step 2 (Data Layer)**: "Definisci le interfacce TypeScript per i nostri dati (es. `UserProfile`, `ChatHistory`)."
3.  **Step 3 (UI Skeleton)**: "Crea la Sidebar e il Layout principale (solo visivo, dati mock)."
4.  **Step 4 (Logic)**: "Ora collega la Sidebar a Firestore per leggere i dati reali."

---

## 2. GCP Bootstrap Guide (Infrastructure)

Usiamo Google Cloud perché è lo standard enterprise (spesso preferito dalle aziende Big Tech) e offre un Free Tier generoso.

### Step-by-Step Setup
1.  **Project Creation**: Vai su [console.firebase.google.com](https://console.firebase.google.com/) → "Add Project" (chiamalo `portfolio-tuonome`).
2.  **Web App Registration**:
    *   Registra app web (`</> icon`).
    *   Copia la `firebaseConfig` in un file `.env.local` (NON committarlo su GitHub!).
3.  **Firestore Database**:
    *   Crea Database (Mode: Production).
    *   Location: `eur3` (Europe West).
    *   **Security Rules** (Cruciale!): Inizia bloccando tutto tranne il tuo IP o Auth user.
        ```
        allow read, write: if request.auth != null;
        ```
4.  **Hosting Connect**:
    *   Nel terminale: `firebase init hosting`.
    *   Seleziona "Use existing project".
    *   Public directory: `out` (o `build`).
    *   Deploy: `npm run build && firebase deploy`.

---

## 3. Flagship Project Architecture (W6)

Cosa andiamo a "codare" dentro questo contenitore? Un progetto **End-to-End**.
Non basta uno script Python. Serve:

### Backend (The Brain)
*   **Technology**: Cloud Functions (Node/Python) o API Route di Next.js.
*   **Role**: Gestisce le chiavi OpenAI/Anthropic (segrete), fa la logica RAG, parla col Vector DB.

### Database (The Memory)
*   **Firestore**: Salva la history delle chat, le preferenze utente.
*   **Vector DB** (Opzionale/Esterno): Pinecone/Chroma per i documenti RAG.

### Frontend (The Face)
*   **Chat Interface**: Non reinventare la ruota. Usa librerie UI (Shadcn/UI) per avere una chat streamata stile ChatGPT.
*   **Analytics Dashboard**: Un grafico semplice che mostra "Token usati", "Costo stimato", "Latenza". (Questo fa impazzire i Manager).

---

## 4. Output Checklist (W5-W6)

*   [ ] **Repo GitHub**: Pubblica, con README pulito.
*   [ ] **URL Pubblico**: `https://tuo-progetto.web.app` funzionante.
*   [ ] **Login Funzionante**: Google Auth attivato (tutti hanno gmail).
*   [ ] **Demo Video**: Un Loom di 2 minuti dove usi il tool.
*   [ ] **Analytics Check**: Vedi il tuo accesso su GA4 Realtime.

> **Gate Finale**: Se non è live, non esiste. Se è live ma si rompe subito, non sei Senior.
