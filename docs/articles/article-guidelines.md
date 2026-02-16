# Linee guida editoriali: come deve / non deve essere un articolo

Queste linee guida servono per pubblicare articoli **originali, autentici e autorevoli** (non “testi ben scritti ma vuoti”), con standard coerenti per SEO/GEO e qualità tecnica.

Applica sempre anche i controlli di autenticità (manuali o automatizzati): vedi `docs/articles/article-authenticity-check.md`.

---

## 1) Deve essere (MUST)

### 1.0 Metadati (date) — pubblicazione vs aggiornamento
- `date`: **data di pubblicazione** (non cambiarla per fix minori/typo).
- `updatedAt`: **data ultimo aggiornamento** quando fai modifiche sostanziali (contenuto, sezioni, claim, fonti, struttura).
- Note: nel sito l’ordinamento “più recente” e il flag “new” possono usare `updatedAt` quando presente; la sitemap usa `updatedAt` come `lastmod`.

### 1.1 Tesi chiara e posizionamento
- La **tesi** sta in 1 frase nelle prime righe.
- L’articolo prende una posizione (“dipende” va bene) ma la **argomenta con criteri** e assunzioni esplicite.

### 1.2 Esperienza verificabile (Experience / Field notes)
- Inserisci almeno 1 “field note” breve (3–8 righe), sobrio, verificabile:
  - cosa avete visto / errore tipico / come lo avete debuggato
  - metriche o vincoli reali **non sensibili** (es. “latency budget 300ms”, “SLO 99.9%”, “dataset ~1M record”)
- Prima persona ok, ma **niente storytelling finto**.

### 1.3 Claim forti ancorati (Evidence)
- Ogni numero/benchmark/costo/percentuale deve avere una **fonte affidabile** vicino al claim:
  - link inline accanto alla frase, oppure riferimento tipo `[[1](#ref-1)]`.
- Distingui sempre tra:
  - **dato** (con fonte)
  - **opinione/criterio** (marcato come tale)
  - **ipotesi** (marcata e motivata)

### 1.4 Trade-off, failure modes, edge cases
- Se consigli X, devi dire anche:
  - quando non funziona
  - costi nascosti / costi operativi
  - alternative e perché sceglierle
- Almeno 1 sezione/box “Limiti e trade-off” è spesso il modo più semplice per rispettare questo punto.

### 1.5 Originalità del contributo (“1 cosa nuova”)
In ogni articolo deve esserci almeno 1 asset originale (tuo), ad esempio:
- checklist operativa
- matrice decisionale
- framework/pattern di architettura con criteri
- snippet/diagramma originale
- comparazione con criteri tuoi (non “feature list”)

### 1.6 Linguaggio specifico e operativo
- Frasi precise, pochi aggettivi.
- Definizioni operative (“per X intendo…”).
- Termini usati in modo coerente lungo il testo.

### 1.7 Struttura che serve al lettore
- Flusso logico (non template industriale ripetuto).
- A fine articolo: **next step verificabile** (mini-test, checklist, template, “cosa fare domani”).

### 1.8 Reputazione e attribuzione
- Autore con bio/ruolo coerente.
- Se usi dati/idee di terzi, attribuzione chiara (non “link salad”).

### 1.9 Non deve “sembrare AI-generated” (stile + ritmo + densità)
- Intro breve: vai al punto, evita preamboli.
- Densità alta: ogni paragrafo deve cambiare una decisione o aggiungere un criterio.
- Lessico stabile: non cambiare termini solo per “variare”.
- Criteri e condizioni: “scegli X se…”, “evita X quando…”, con limiti e assunzioni.
- 1–2 edge case reali e non ovvi (da campo), anche piccoli.

---

## 2) Non deve essere (MUST NOT)

### 2.1 Placeholder, note interne, prompt leak (FAIL immediato)
- Vietati: `{cover_url}`, `{Name Surname}`, `TODO/TBD`, note tipo “as inspiration…”.
- Vietati riferimenti a pipeline: “as an AI”, “the assistant”, “the model”, ecc.

### 2.2 Numeri “naked” o precisione sospetta (FAIL)
- Vietati numeri/percentuali/“10–25×” senza:
  - fonte primaria/affidabile
  - contesto (setup, cosa si misura, condizioni)
- Regola pratica: **0 numeri senza citazione inline** quando sono claim, KPI, benchmark, costi, tempi, performance.

### 2.3 Tono iper-sicuro, assoluti, marketing
- Evita “always/never/guaranteed/the best/proven to” o equivalenti (“sempre/mai/garantito/il migliore”).
- Evita promesse tipo “trasformerà il tuo business” senza condizioni, vincoli e limiti.

### 2.4 Generalità ripetitive e frasi da brochure
Esempi da tagliare:
- “In today’s fast-paced world…”
- “This comprehensive guide explores…”
- “Unlock the power of…”

### 2.5 Catena di montaggio (struttura clonata)
- Intro hook standard → 5 bullet → stat messo lì → FAQ → conclusion, identico su più articoli.
- Se la struttura è sempre uguale, probabilmente manca un contributo originale.

### 2.6 Contraddizioni e imprecisioni semantiche
- Definizioni che cambiano a metà testo.
- Acronimi usati in modi diversi.
- Esempi incoerenti con la tesi.

### 2.7 Over-polished ma vuoto
- Se il lettore non sa “cosa fare” dopo, l’articolo è incompleto.

### 2.8 Errori tecnici di rendering
- Date invalide, markdown rotto, immagini o link rotti, heading incoerenti.

### 2.9 Pattern tipici “AI-first” (da evitare)
- Paragrafi che ripetono lo stesso concetto con parole diverse.
- Strutture clonate (stesso schema e stessi titoli su tanti articoli).
- FAQ decorative che non aggiungono criteri o failure modes.

---

## 3) Standard minimi (rubrica rapida pre-pubblicazione)

### MUST (minimo)
- 1 tesi chiara all’inizio
- 1 trade-off serio
- 1 asset originale (checklist/framework/matrice/snippet/diagramma)
- Fonti:
  - Midway: **6+** fonti affidabili, con **2** primarie/high-trust
  - Expert: **8+** fonti affidabili, con **2** primarie/high-trust

### MUST NOT (zero tolleranza)
- 0 placeholder / prompt leak
- 0 numeri “naked” su claim
- 0 frasi da brochure

---

## 4) Processo consigliato (editoriale)

1) Scrivi una bozza con tesi + outline.
2) Inserisci:
   - field note reale
   - trade-off/failure modes
   - asset originale
3) Aggiungi fonti inline vicino ai claim (non solo in fondo).
4) Esegui i controlli di autenticità (checklist o tool) e risolvi tutti i blocchi “FAIL”.
5) Review umana finale: coerenza, struttura, next steps, rendering.

---

## Appendix (EN) — Article MUST / MUST NOT (short)

### Metadata (dates) — publish vs update
- `date`: publication date (don’t change it for minor edits/typos).
- `updatedAt`: last-updated date for substantial revisions (content/structure/claims/sources).
- Note: site recency/newness and sitemap `lastmod` may use `updatedAt` when present.

### MUST
- Clear thesis in the first lines, explicit assumptions.
- Verifiable experience signal (“field note”) with non-sensitive constraints/metrics.
- Strong claims anchored with reliable sources inline (links or `[[n](#ref-n)]`).
- Trade-offs, failure modes, alternatives.
- At least one original artifact (checklist/framework/matrix/snippet/diagram).
- Specific, operational language + a verifiable next step at the end.

### MUST NOT
- Placeholders, internal notes, prompt leaks (“as an AI…”, “the assistant/model…”).
- Naked numbers / benchmarks without context + citation nearby.
- Absolute marketing language and brochure filler.
- Assembly-line structure repeated across many articles.
