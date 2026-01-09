# Playbook — CV orientato al ruolo (Career OS)

Questo playbook ti guida a creare un **CV master** e poi derivarne **varianti per track** e **versioni tailored su singola Job Description (JD)**, con standard “da hiring”.

---

## A chi serve
* Candidati che vogliono aumentare il tasso di risposta su ruoli specifici (es. Applied GenAI, SWE, Data/ML, Product, ecc.).
* Persone con CV “generalista” che non comunica *fit* in 30 secondi.

## Output (deliverable)
* **CV Master**: la tua versione completa e aggiornata (base di tutto).
* **CV Track Variant** (1–2): es. “RAG/Agents” vs “Product/Applied”.
* **CV JD-Tailored**: adattamento leggero (10–20 min) su una JD specifica.

## Standard di qualità (Definition of Done)
Il CV è “pronto” quando:
* In **30 secondi** un hiring manager capisce **ruolo target**, **seniority**, **dominio**, **prove**.
* Ogni esperienza ha **impact** (numeri o proxy) e non solo mansioni.
* Copre le **keyword** principali della JD senza sembrare “keyword stuffing”.
* È **ATS-safe** (niente layout fragili) e **human-readable** (scannabile).
* È **versionato** (sai sempre qual è l’ultima versione e per cosa).

---

# Processo (end-to-end)

## 0) Fissa il bersaglio (prima di scrivere)
Senza bersaglio, il CV diventa un elenco.

1. Scegli **1 ruolo primario** + (opzionale) 1 secondario.
2. Raccogli **3–5 JD** reali del ruolo target (aziende diverse).
3. Definisci i criteri che vuoi far emergere:
   * stack/skill core
   * scope (individual contributor vs lead)
   * domain (fintech, e-commerce, B2B SaaS, ecc.)
   * proof richieste (repo, case study, certificazioni, pubblicazioni)

Output di questa fase:
* 1 frase di target: “Ruolo + seniority + dominio + focus”.

Esempio:
* “Applied GenAI Engineer (mid) con focus su RAG/Agents ed evaluation in contesti B2B SaaS”.

---

## 1) Costruisci l’Evidence Bank (materia prima)
Se non hai “evidenze”, non puoi scrivere bullet forti.

Per ogni esperienza/progetto, raccogli:
* Contesto: prodotto/team, scala, utenti, vincoli (tempo/costo/latenza/compliance).
* Responsabilità: cosa *hai posseduto* davvero.
* Azioni: cosa hai fatto (decisioni, tradeoff, implementazioni).
* Impatto: numeri (meglio) o proxy credibili (tempo risparmiato, riduzione errori, conversion, uptime, ecc.).
* Proof: link (GitHub, demo, doc, articolo), oppure “available on request”.

Domande guida (veloci):
* Che problema c’era **prima** e cosa è cambiato **dopo**?
* Qual era la metrica o il “pain” misurabile?
* Cosa hai fatto che non era ovvio? (tradeoff, scelta architettura, debug)
* Quale parte era tua e quale del team?

---

## 2) Scegli il formato (ATS + scannabilità)
Regole pratiche:
* **1 pagina** (junior/mid) o **2 pagine** (senior) se hai *veri* risultati.
* **Niente tabelle/colonne** se vuoi massima compatibilità ATS.
* Font leggibile (es. 10.5–11.5), spaziatura coerente, sezioni chiare.
* Link corti e puliti (GitHub/LinkedIn/portfolio).

Ordine sezioni consigliato:
1. Header (nome + contatti + link)
2. Summary (3–5 righe)
3. Skills (mirate al ruolo)
4. Experience (reverse chronological)
5. Projects (se rilevanti e “da hiring”)
6. Education / Certificazioni
7. (Opz.) Publications / Talks / Awards

---

## 3) Scrivi la Summary (posizionamento in 5 righe)
La Summary deve rispondere a: **chi sei**, **cosa fai**, **dove porti valore**, **prove**.

Formula utile:
* `[Ruolo + seniority]` con focus su `[2–3 aree]`. Esperienza in `[dominio/contesto]`. Ho guidato/realizzato `[1–2 proof]` con impatto `[metrica/proxy]`. Stack: `[6–10 keyword mirate]`.

Esempio (generico):
* “Applied GenAI Engineer (mid) con focus su RAG/Agents ed evaluation. Esperienza in B2B SaaS: ho costruito pipeline di retrieval+rerank e framework di test con riduzione del tasso di risposte non-grounded. Stack: Python, FastAPI, OpenAI/Anthropic, LangGraph, vector DB, eval harness, Docker, CI.”

---

## 4) Skills: poche, mirate, “matchabili”
Obiettivo: aiutare ATS e recruiter a trovare corrispondenza.

Regole:
* Metti prima le skill *core* del ruolo (dalle JD).
* Evita liste infinite: meglio 3 blocchi con 6–10 item ciascuno.
* Usa naming standard (es. “PostgreSQL” non “Postgres”, o entrambi se serve).

Template:
* **Core**: …
* **Systems/Tools**: …
* **Methods**: … (es. evaluation, A/B testing, system design, ecc.)

---

## 5) Experience: bullet che dimostrano impatto (non task)
Ogni ruolo dovrebbe avere:
* 1 riga contesto (azienda/prodotto/team/scala)
* 3–6 bullet “forti”

### Bullet formula (semplice e replicabile)
* **Azione** + **Come** + **Impatto** (+ **Scala/metriche**)

Esempi di trasformazione:
* Debole: “Ho lavorato su un chatbot con LLM.”
* Forte: “Implementato un assistente RAG con retrieval+rerank e guardrail, riducendo del 35% le risposte non-grounded su un set di 200 query (eval harness proprietario).”

### Verbi “da ownership”
* progettato, guidato, implementato, automatizzato, ottimizzato, ridotto, aumentato, standardizzato, messo in produzione, monitorato, reso osservabile.

### Numeri: cosa mettere se non hai metriche perfette
* proxy: tempo risparmiato, riduzione incident, aumento adozione interna, latenza, costo per richiesta, tasso di successo task, copertura test.
* intervalli: “~20%”, “da X a Y”, “ordine di grandezza”.

---

## 6) Progetti: solo se “da hiring”
Inserisci progetti se:
* sono coerenti col ruolo target
* hanno un output verificabile (repo/demo/report)
* mostrano maturità: architettura, tradeoff, evaluation, docs

Template bullet progetto:
* “Costruito `[cosa]` per `[chi/contesto]` usando `[come]`, misurando `[metrica]` e documentando `[proof]`.”

---

## 7) Tailoring su JD (senza riscrivere tutto)
L’obiettivo non è “cambiare CV”, ma **allineare segnali**.

Metodo in 10–20 minuti:
1. Evidenzia nella JD:
   * must-have (hard)
   * nice-to-have
   * responsabilità chiave
   * segnali impliciti (scala, ownership, stakeholder)
2. Allinea:
   * Summary: 1–2 keyword/area coerente
   * Skills: ordina e aggiungi 2–4 keyword mancanti (se vere)
   * Experience: sostituisci 1–2 bullet con proof più rilevanti per quella JD
3. Rimuovi rumore:
   * 1–2 elementi non rilevanti per quel ruolo (se serve spazio)

Output:
* “CV_JD-tailored” che sembra scritto *per quel ruolo* ma resta autentico.

---

## 8) ATS & formatting checklist (anti-bug)
ATS-safe:
* niente tabelle, colonne, icone, immagini, progress bar
* titoli sezione semplici (“Experience”, “Skills”, “Education”)
* date e ruoli in formato consistente
* link testati, PDF esportato correttamente

Human-readable:
* 1 idea per bullet
* numeri visibili (non nascosti in testo lungo)
* parole chiave ripetute con parsimonia
* no wall of text: spaziatura e gerarchia chiara

---

# Checklist finali

## Checklist “prima di inviare”
* Il ruolo target è chiaro in header/summary.
* Le prime 3 bullet della prima esperienza sono le più forti.
* Ogni esperienza ha almeno 1 bullet con impatto misurabile o proxy credibile.
* Keyword coverage: le 8–12 keyword principali della JD compaiono (se vere).
* PDF: leggibile su schermo e stampabile, senza layout che si rompe.

## Versioning consigliato
* `CV_MASTER_v1.pdf`
* `CV_TRACK_RAG_v1.pdf`
* `CV_{Company}_{Role}_YYYY-MM-DD.pdf`

---

# Template (da copiare)

## Struttura CV (outline)
* **Nome Cognome** — Ruolo target  
  Email · Telefono · Città/Remote · LinkedIn · GitHub · Portfolio
* **Summary** (3–5 righe)
* **Skills**
  * Core:
  * Tools/Systems:
  * Methods:
* **Experience**
  * Ruolo — Azienda (YYYY–YYYY) · Città/Remote  
    1 riga contesto (prodotto/team/scala)  
    - Bullet impatto 1  
    - Bullet impatto 2  
    - Bullet impatto 3  
  * …
* **Projects** (opz.)
* **Education / Certifications**
* **Publications / Talks** (opz.)

---

# Anti-pattern (da evitare)
* “CV enciclopedia”: tutto quello che hai fatto, niente che importa.
* Bullet “task list”: “responsabile di…”, “ho lavorato su…”.
* Keyword inventate: meglio poche vere che tante false.
* Layout “bello ma fragile”: se ATS non legge, perdi prima di iniziare.
