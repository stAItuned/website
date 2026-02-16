# Rubrica: originalità, autenticità e anti “AI-generated” (pre-pubblicazione)

Questo documento definisce regole operative per assicurare che un articolo sia:
- **originale** (contributo nuovo, non solo sintesi),
- **autentico** (niente placeholder/prompt leak),
- **autorevole** (claim ancorati con fonti affidabili),
- **utile** (trade-off, failure modes, next step).

Usalo come checklist editoriale e come base per “agent rules”.

---

## 1) Segnali di un articolo originale e autorevole (PASS)

1) **Experience verificabile (Field notes)**
   - 1 blocco breve (3–8 righe) con:
     - “cosa abbiamo visto” / “errore tipico” / “come lo abbiamo debuggato”
     - dettagli concreti **non sensibili**: stack, contesto, vincoli, metriche (es. latency budget, SLO, volumi)
   - prima persona sobria: niente storytelling, niente “success story” artificiale.

2) **Tesi + posizionamento chiaro**
   - tesi in 1 frase all’inizio.
   - posizionamento con criteri: “dipende” va bene se spieghi *da cosa* dipende.

3) **Claim forti ancorati (Evidence)**
   - ogni numero/benchmark/costo/percentuale ha fonte affidabile **vicino al claim**.
   - esplicita la differenza tra: dato / opinione / ipotesi.

4) **Trade-off e failure modes**
   - per ogni raccomandazione importante: quando non funziona, costi nascosti, alternative.
   - segnale forte: chi ha esperienza parla sempre di limiti.

5) **Originalità del contributo**
   - almeno 1 asset nuovo rispetto a ciò che trovi online:
     - checklist operativa, matrice decisionale, framework, pattern, snippet/diagramma originale, comparazione con criteri tuoi.

6) **Linguaggio specifico (no aria fritta)**
   - frasi precise, pochi aggettivi.
   - definizioni operative (“per X intendo…”).
   - terminologia coerente e stabile.

7) **Struttura che serve al lettore**
   - flusso logico (non template ripetuto).
   - chiusura con next step verificabile (mini-test, checklist, template).

8) **Reputazione e attribuzione**
   - autore con bio/ruolo; attribuzioni chiare per dati o contributi di terzi.

---

## 2) Segnali che fanno sembrare un articolo finto / autogenerato (FAIL o rework)

A) **Placeholder / prompt leak / note interne** (FAIL immediato)
- `{cover_url}`, `{Name Surname}`, `TODO/TBD`, “as inspiration…”
- “as an AI”, “the assistant”, “the model”, riferimenti a pipeline o istruzioni interne.

B) **Naked numbers / precisione sospetta** (FAIL)
- percentuali e moltiplicatori (“93.1%”, “10–25×”) senza:
  - fonte primaria/affidabile
  - contesto (setup, dataset, condizioni)
  - caveat (limiti e trade-off)

C) **Tono iper-sicuro e assoluti** (rework)
- “always/never/guaranteed/the best/proven to” o “sempre/mai/garantito/il migliore”.

D) **Generalità ripetitive e frasi da brochure** (rework)
- “In today’s fast-paced world…”, “This comprehensive guide explores…”, “Unlock the power of…”

E) **Struttura clonata / catena di montaggio** (rework)
- stesso ritmo e stesso schema su molti articoli.
- FAQ decorative che ripetono la tesi invece di aggiungere criteri o edge cases.

F) **Fonti deboli o “link salad”** (rework/FAIL se claim grandi)
- poche fonti per claim importanti, o fonti secondarie casuali usate come prova.

G) **Contraddizioni e imprecisioni semantiche** (FAIL)
- definizioni che cambiano, acronimi usati in modi diversi, esempi incoerenti con la tesi.

H) **Mancanza totale di edge cases** (FAIL)
- niente trade-off, niente limiti, niente failure modes → sembra un pitch.

I) **Over-polished ma vuoto** (rework)
- scorre bene, ma non lascia azioni o decisioni verificabili.

L) **Errori tecnici/di rendering** (FAIL qualità)
- date invalide, markdown rotto, immagini o link rotti.

---

## 3) Regola brutale (minimo per pubblicare)

Per sembrare originale/autorevole, devi avere almeno:
- 1 field note reale (anche breve)
- 1 trade-off serio
- 1 asset originale (framework/checklist/matrice/snippet/diagramma)
- fonti:
  - Midway: **6+** fonti affidabili, con **2** primarie/high-trust
  - Expert: **8+** fonti affidabili, con **2** primarie/high-trust
- **0** placeholder / prompt leak
- **0** numeri “naked” su claim
- **0** frasi da brochure

