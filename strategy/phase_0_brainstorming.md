# Phase 0 Foundation — Brainstorming Decisionale

> **Obiettivo:** Definire le decisioni operative per i 4 pilastri della Phase 0, valutando trade-off, effort, e impatto sulla strategia.

---

## 🎯 I 4 Pilastri da Decidere

| # | Area | Domanda Chiave | Effort Stimato |
|:--|:-----|:---------------|:---------------|
| 1 | **Setup Sito** | Come posizionare blog (reader) vs Career OS (target)? | 1-2 giorni |
| 2 | **Sistema Pagamento** | Quale soluzione per incassare in modo semplice? | 2-4 ore |
| 3 | **Application Form** | Build custom vs tool esterno (Tally/Typeform)? | 0.5-4 ore |
| 4 | **Lead Magnet** | Quali contenuti free per catturare contatti? | 2-5 giorni |

---

# 1) Setup Sito stAItuned

## Il Problema Attuale

Il sito stAItuned ha due anime:
- **Blog/Learn:** Contenuti per chi vuole imparare AI (ampio, SEO, traffico)
- **Career OS:** Servizio per chi vuole diventare GenAI Engineer (stretto, conversione)

**Rischio:** Confondere i visitatori. Chi arriva per un articolo non capisce che vendi anche un servizio.

---

## Opzioni di Posizionamento

### Opzione A: Sito Unico con Sezioni Chiare

```
staituned.com/
├── / (Home) → Hero con doppio path: "Impara" vs "Accelera la tua carriera"
├── /learn → Blog/Articoli (reader)
├── /career-os → Landing page Career OS (target)
└── /career-os/apply → Application form
```

**Pro:**
- Un solo dominio = più autorità SEO
- Cross-selling naturale (chi legge articoli vede Career OS)
- Meno infrastruttura da gestire

**Contro:**
- Richiede design homepage chiaro
- Chi arriva da SEO potrebbe confondersi

---

### Opzione B: Subdomain Separato

```
staituned.com/ → Blog/Learn (focus reader)
careeroscorpio.staituned.com/ → Career OS (focus conversion)
```

**Pro:**
- Posizionamento netto per ogni audience
- Messagging più mirato

**Contro:**
- Due "siti" da gestire
- Meno cross-pollination
- Subdomain penalizzato SEO

---

### Opzione C: Landing Page Dedicata (Minimalista)

```
staituned.com/ → Blog/Learn
staituned.com/career-os → Landing page unica con form embedded
```

**Pro:**
- Veloce da implementare
- Il blog resta intatto
- La landing è focalizzata sulla conversione

**Contro:**
- Meno "presenza" del Career OS
- Dipende dalla qualità della landing

---

## 🔍 Analisi Trade-off

| Criterio | Opzione A | Opzione B | Opzione C |
|:---------|:----------|:----------|:----------|
| **Sforzo implementazione** | 🟡 Medio | 🔴 Alto | 🟢 Basso |
| **Chiarezza posizionamento** | 🟡 Medio | 🟢 Alto | 🟡 Medio |
| **SEO/Authority** | 🟢 Alto | 🔴 Basso | 🟢 Alto |
| **Cross-selling** | 🟢 Alto | 🔴 Basso | 🟡 Medio |
| **Velocità lancio** | 🟡 3-5 gg | 🔴 5-10 gg | 🟢 1-2 gg |

---

## 💡 Raccomandazione: Opzione A (Variante Ibrida)

**Approccio:** Sito unico con navigazione chiara + CTA strategiche.

### Homepage (nuovo design)

```
┌─────────────────────────────────────────────────────────────────┐
│  stAItuned — Expert-Level AI Education & Career Acceleration   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐│
│  │   📚 IMPARA         │    │  🚀 CAREER OS                   ││
│  │   Articoli, guide,  │    │  Il percorso per diventare      ││
│  │   tutorial AI       │    │  GenAI Engineer                 ││
│  │                     │    │                                 ││
│  │   [Vai al Blog →]   │    │  [Scopri Career OS →]           ││
│  └─────────────────────┘    └─────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Navigazione

```
[Logo stAItuned] | Learn | Career OS | Chi Siamo | [CTA: Prenota Audit]
```

### CTA in ogni articolo

Ogni articolo del blog ha un banner/box:

```
┌─────────────────────────────────────────────────────────────────┐
│  💡 Vuoi diventare GenAI Engineer?                              │
│                                                                 │
│  Con Career OS ti aiuto a passare da "leggere articoli"         │
│  a "essere pronto per il colloquio".                            │
│                                                                 │
│  [Prenota un Audit Gratuito →]                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Pagine necessarie

| Pagina | Stato | Effort |
|:-------|:------|:-------|
| `/` (Home) | 🔄 Redesign | 4-6 ore |
| `/learn` | ✅ Esiste | 0 |
| `/career-os` | 🆕 Creare | 4-6 ore |
| `/career-os/apply` | 🆕 Creare (o embed form) | 1-2 ore |

**Effort totale:** ~1-2 giorni

---

## ❓ Domande Aperte (Da Decidere)

1. **Homepage:** Dual-path (Learn vs Career OS) o focus su uno solo con l'altro in nav?
2. **Career OS landing:** Lunga (tipo sales page) o corta (tipo Calendly embed)?
3. **CTA primaria:** Form application o direttamente Calendly?

---

# 2) Sistema di Pagamento

## Opzioni

### Opzione A: Stripe Payment Links

**Cos'è:** Link diretto che apre una pagina Stripe pre-configurata con prodotto/prezzo.

**Come funziona:**
1. Crei prodotto su Stripe (es. "Career OS Starter - €590")
2. Generi Payment Link
3. Mandi il link al cliente dopo la call
4. Stripe gestisce tutto (pagamento, ricevuta, webhook)

**Pro:**
- ✅ Zero sviluppo
- ✅ Attivo in 15 minuti
- ✅ Rate/abbonamenti supportati
- ✅ Ricevute automatiche
- ✅ Dashboard analytics

**Contro:**
- ❌ Esperienza "staccata" dal sito
- ❌ Meno branding (è pagina Stripe)
- ❌ Fee standard Stripe (1.4-2.9% + €0.25)

---

### Opzione B: Stripe Checkout integrato

**Cos'è:** Bottone sul tuo sito che apre Stripe Checkout (overlay o redirect).

**Come funziona:**
1. Crei prodotto/prezzo su Stripe
2. Integri Stripe Checkout via Next.js API route
3. L'utente paga senza "uscire" troppo dal sito

**Pro:**
- ✅ Esperienza più integrata
- ✅ Puoi tracciare meglio conversioni
- ✅ Più controllo sul flow

**Contro:**
- ❌ Richiede 2-4 ore di sviluppo
- ❌ Devi gestire webhook (per conferma)
- ❌ Stesse fee Stripe

---

### Opzione C: Stripe + LemonSqueezy / Gumroad

**Cos'è:** Usare una piattaforma "wrapper" sopra Stripe.

**Pro:**
- ✅ UI più bella out of the box
- ✅ Gestione IVA/VAT automatica (LemonSqueezy)
- ✅ Affiliati built-in

**Contro:**
- ❌ Fee più alte (3-5% + Stripe fee)
- ❌ Dipendenza da terzo servizio

---

## 🔍 Analisi Trade-off

| Criterio | Payment Links | Checkout integrato | Lemon/Gumroad |
|:---------|:--------------|:-------------------|:--------------|
| **Sforzo setup** | 🟢 15 min | 🟡 2-4 ore | 🟢 30 min |
| **Esperienza utente** | 🟡 OK | 🟢 Migliore | 🟢 Buona |
| **Costi** | 🟢 Solo Stripe | 🟢 Solo Stripe | 🔴 +3-5% |
| **Scalabilità** | 🟢 Alta | 🟢 Alta | 🟡 Media |
| **VAT/Compliance** | 🟡 Manuale | 🟡 Manuale | 🟢 Auto |

---

## 💡 Raccomandazione: Stripe Payment Links (ora), poi Checkout integrato

**Fase 0-1 (primi 10 clienti):** Payment Links
- Zero sforzo
- Valida che la gente paga
- Impara cosa funziona

**Fase 2+ (10+ clienti):** Checkout integrato
- Migliora UX
- Tracking migliore
- Upsell/cross-sell

**Setup immediato:**
1. Crea prodotti su Stripe:
   - "Career OS Starter (Founding Member)" - €390
   - "Career OS Starter" - €590
   - "Career OS Pro (Founding Member)" - €790
   - "Career OS Pro" - €1.190
2. Genera Payment Links per ciascuno
3. Salva i link in un doc/Notion per usarli nelle call

**Effort:** 30-45 minuti

---

# 3) Application Form

## La Domanda Chiave

> **"Se me lo creo io ci metterei mezza giornata. Ha vantaggi farlo custom?"**

Analizziamo.

---

## Opzioni

### Opzione A: Tool esterno (Tally, Typeform, Google Forms)

| Tool | Costo | Pro | Contro |
|:-----|:------|:----|:-------|
| **Tally** | Free (illimitato) | Bello, potente, embed facile | Meno customizzabile |
| **Typeform** | €25+/mese | UX migliore, logic flows | Costoso |
| **Google Forms** | Free | Velocissimo | Brutto, no branding |

**Effort:** 30-60 minuti

---

### Opzione B: Form custom (Next.js + DB)

**Stack:**
- Form component React
- API route Next.js
- DB (già hai Firebase? o Supabase/Postgres)
- Email notification (Resend/SendGrid)

**Effort:** Mezza giornata (4-6 ore)

---

## 🔍 Vantaggi Build Custom

| Vantaggio | Impatto | Rilevanza Ora |
|:----------|:--------|:--------------|
| **Branding completo** | UX più integrata | 🟡 Medio |
| **Dati in tuo DB** | Ownership, analytics custom | 🟢 Alto |
| **Logic condizionale** | Scoring, routing, segmentazione | 🟢 Alto |
| **Automazioni custom** | Email auto, webhook, CRM sync | 🟢 Alto |
| **Nessun limite** | Infinite submissions | 🟢 Alto (se scala) |
| **Integrazioni future** | CV upload, LinkedIn scraping, AI analysis | 🟢 Alto |
| **No dipendenza** | Non ti cambiano pricing/features | 🟡 Medio |

---

## 🔍 Vantaggi Tool Esterno

| Vantaggio | Impatto | Rilevanza Ora |
|:----------|:--------|:--------------|
| **Velocità** | Risparmi 3-4 ore | 🟢 Alto |
| **Zero manutenzione** | Non devi debuggare | 🟢 Alto |
| **Analytics built-in** | Conversion tracking gratis | 🟡 Medio |
| **Prova prima** | Validi domande/flow prima di buildare | 🟢 Alto |

---

## 💡 Raccomandazione: Ibrida (Tally ora, Custom dopo)

### Fase 0 (primi 10 clienti): Tally

**Perché:**
- Validi le domande giuste
- Impari cosa serve davvero
- Zero time investment

**Cosa fare:**
1. Crea form su Tally (30 min)
2. Embed su `/career-os/apply`
3. Configura notifica email
4. Traccia conversion rate

---

### Fase 1+ (10+ clienti): Valuta Custom

**Trigger per buildare custom:**
- Hai bisogno di scoring lead automatico
- Vuoi integrare con CRM/DB interno
- Vuoi fare AI analysis del profilo (LinkedIn, CV)
- Limiti di Tally diventano bloccanti

**Se buildi custom, includi:**
1. Form multi-step (migliore UX)
2. Scoring automatico (A/B/C lead)
3. Salvataggio in DB interno
4. Email automatica (conferma + te)
5. Webhook per Slack/notifiche
6. (Future) CV upload + parsing
7. (Future) LinkedIn URL → scraping profilo

**Effort stimato custom completo:** 1-1.5 giorni

---

## ❓ Domande per Decidere

1. **Hai già un DB setup (Firebase, Supabase)?**
   - Sì → Custom ha meno overhead
   - No → Tally per ora

2. **Quante application ti aspetti/mese?**
   - <30 → Tally basta
   - >30 → Custom ha più senso (analytics, automazioni)

3. **Vuoi scoring automatico dei lead?**
   - Sì → Custom (o Tally → Zapier → Sheet con formula)
   - No → Tally basta

4. **Vuoi AI analysis del profilo (futuro)?**
   - Sì → Custom necessario (integrazioni)
   - No → Tally per sempre

---

# 4) Lead Magnet — Playbook/Tutorial/Guide Free

## Il Principio

> Un lead magnet efficace **non è contenuto generico**. È un **"campione gratuito del prodotto"** che mostra il tuo approccio unico.

---

## Framework: Lead Magnet Ladder

```
                    ┌─────────────────┐
                    │ PAID: Career OS │  ← Prodotto
                    │ (€590-€1.190)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ FREE: Audit     │  ← Qualificazione
                    │ (15 min call)   │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
   ┌────────▼────────┐ ┌─────▼──────┐ ┌───────▼───────┐
   │ Guide/Playbook  │ │ Template   │ │ Mini-corso    │
   │ (PDF/Notion)    │ │ (Notion)   │ │ (5 email)     │
   │                 │ │            │ │               │
   └────────┬────────┘ └─────┬──────┘ └───────┬───────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
                    ┌────────▼────────┐
                    │ BLOG CONTENT    │  ← Traffico SEO
                    │ (Articoli free) │
                    └─────────────────┘
```

---

## Opzioni Lead Magnet

### Opzione 1: "GenAI Role Fit Guide" (PDF/Notion)

**Contenuto:**
- Differenza tra ruoli AI (DS vs ML Eng vs GenAI Eng)
- Checklist: "Sei pronto per candidarti?"
- 5 errori comuni nel posizionarsi
- CTA: Prenota Audit

**Pro:**
- Veloce da creare (2-3 ore)
- Evergreen (non scade)
- Download = email catturata

**Contro:**
- Bassa perceived value (PDF = commodity)
- Richiede follow-up email per convertire

---

### Opzione 2: "CV Rubric for GenAI Roles" (Template)

**Contenuto:**
- La rubrica che USI TU per valutare i CV
- Checklist: Cosa deve avere un CV per GenAI
- Esempi: Prima/Dopo
- CTA: "Vuoi che lo valuti io? Prenota Audit"

**Pro:**
- Altissima perceived value (è il tuo "segreto")
- Molto actionable
- Dimostra expertise

**Contro:**
- Richiede 3-4 ore per farlo bene
- Potrebbe cannibalizzare il servizio? (No, perché non è la stessa cosa)

---

### Opzione 3: "5-Day GenAI Career Sprint" (Email Sequence)

**Struttura:**
- **Day 1:** Role Fit — quale ruolo fa per te
- **Day 2:** CV Audit — i 3 errori che ti bloccano
- **Day 3:** Proof Strategy — come costruire credibilità
- **Day 4:** Interview Prep — cosa ti chiederanno
- **Day 5:** Next Steps — il tuo piano d'azione

**Pro:**
- Engagement alto (5 touchpoint)
- Nurturing automatico
- Mostra il tuo framework/approccio

**Contro:**
- Richiede 1-2 giorni per scrivere
- Richiede email automation setup

---

### Opzione 4: "GenAI Interview Questions Bank" (Notion/PDF)

**Contenuto:**
- 30-50 domande reali da colloqui GenAI
- Organizzate per categoria (RAG, Agents, Eval, Product)
- Con hints/risposte brevi
- CTA: "Vuoi prepararti con un esperto? Prenota Audit"

**Pro:**
- Altissima perceived value
- Molto cercato (SEO potential)
- Direttamente legato al servizio

**Contro:**
- Richiede 4-6 ore per farlo bene
- Potrebbe cannibalizzare mock interview? (No, perché è diverso)

---

### Opzione 5: "Proof Project Template" (GitHub + Tutorial)

**Contenuto:**
- Template repo per progetto GenAI (RAG / Agent)
- README strutturato "da engineer"
- Evaluation framework incluso
- Tutorial di accompagnamento

**Pro:**
- Altissima credibilità tecnica
- Dimostra expertise engineering
- Virale tra dev community

**Contro:**
- Richiede 1-2 giorni per farlo bene
- Target più stretto (solo chi fa progetti)

---

## 🔍 Analisi Trade-off

| Lead Magnet | Effort | Perceived Value | Conversion Potential | Scalabilità |
|:------------|:-------|:----------------|:---------------------|:------------|
| **Role Fit Guide** | 🟢 2-3h | 🟡 Medio | 🟡 Medio | 🟢 Alta |
| **CV Rubric** | 🟡 3-4h | 🟢 Alto | 🟢 Alto | 🟢 Alta |
| **5-Day Sprint** | 🔴 1-2gg | 🟢 Alto | 🟢 Alto | 🟢 Alta |
| **Interview Bank** | 🟡 4-6h | 🟢 Alto | 🟢 Alto | 🟢 Alta |
| **Proof Template** | 🔴 1-2gg | 🟢 Altissimo | 🟡 Medio | 🟡 Media |

---

## 💡 Raccomandazione: Stack Progressivo

### Week 1: CV Rubric (Quick Win)

**Perché:**
- Alto valore percepito
- Direttamente legato al pain
- Crea reciprocità ("mi ha dato qualcosa di utile")
- Effort ragionevole (3-4 ore)

**Distribuzione:**
- Landing page con form (email → download)
- CTA negli articoli blog
- Menzione nei post LinkedIn

---

### Week 2-3: Interview Questions Bank

**Perché:**
- Complementare al CV Rubric
- Cattura chi è più avanti nel funnel (già candidati)
- SEO potential alto ("domande colloquio AI")

---

### Month 2: 5-Day Email Sprint

**Perché:**
- Nurturing automatico
- Libera tempo (non devi follow-up manualmente)
- Mostra il tuo framework completo

---

### Month 3+: Proof Project Template

**Perché:**
- Cementa posizionamento tecnico
- Viralità community dev
- Upsell naturale verso Pro (che include progetto)

---

## 📋 Struttura CV Rubric (Esempio)

```markdown
# GenAI CV Rubric — La Checklist per Passare lo Screening

## Come usare questa rubrica
Dai un punteggio 0-2 per ogni criterio. Totale < 8 = CV non pronto.

## Sezione 1: Headline & Positioning (max 6 punti)
| Criterio | 0 | 1 | 2 |
|:---------|:--|:--|:--|
| **Role clarity** | "AI Enthusiast" | "ML Engineer" | "GenAI Engineer (RAG/Agents)" |
| **Value proposition** | Assente | Vaga | Specifica (cosa fai + per chi) |
| **Keywords GenAI** | Nessuna | Generiche | Specifiche (RAG, LangChain, Eval) |

## Sezione 2: Experience (max 6 punti)
| Criterio | 0 | 1 | 2 |
|:---------|:--|:--|:--|
| **Relevance** | Solo accademico | Stage/progetto generico | Esperienza LLM/GenAI |
| **Quantification** | Nessun numero | Numeri vaghi | Metriche chiare |
| **Impact framing** | "Ho fatto X" | "Ho contribuito a Y" | "X ha portato a Y risultato" |

## Sezione 3: Proof (max 6 punti)
| Criterio | 0 | 1 | 2 |
|:---------|:--|:--|:--|
| **GitHub link** | Assente | Presente ma disordinato | Repo pulite con README |
| **Demo/Project** | Nessuno | Solo codice | Demo funzionante |
| **Write-up/Articolo** | Nessuno | Blog personale | Pubblicazione autorevole |

## Sezione 4: Technical Depth (max 4 punti)
| Criterio | 0 | 1 | 2 |
|:---------|:--|:--|:--|
| **Stack specifico** | "Python, ML" | "LangChain, OpenAI" | Stack completo + versioni |
| **Eval/Monitoring** | Non menzionato | Menzionato | Esperienza concreta |

---

## Il tuo punteggio: ___/22

- **18-22:** Sei pronto a candidarti. Focus su targeting e volume.
- **12-17:** CV migliorabile. Lavora su positioning e proof.
- **<12:** CV non competitivo. Serve ristrutturazione completa.

---

💡 **Vuoi un feedback personalizzato?**
[Prenota un GenAI Role Fit Audit gratuito →](LINK)
```

---

# 📊 Riepilogo Decisioni

## Matrice Decisionale Finale

| Area | Decisione Raccomandata | Effort | Priorità |
|:-----|:-----------------------|:-------|:---------|
| **1. Setup Sito** | Opzione A (Home dual-path + /career-os) | 1-2 giorni | 🔴 Alta |
| **2. Pagamento** | Stripe Payment Links (per ora) | 30-45 min | 🔴 Alta |
| **3. Application Form** | Tally (ora), custom dopo 10 clienti | 30-60 min | 🔴 Alta |
| **4. Lead Magnet** | CV Rubric (prima), poi Interview Bank | 3-4 ore + 4-6 ore | 🟡 Media |

---

## 📅 Timeline Proposta

### Week 1 (Foundation)

| Giorno | Task | Effort |
|:-------|:-----|:-------|
| **Day 1** | Setup Stripe Products + Payment Links | 1h |
| **Day 1** | Creare form application su Tally | 1h |
| **Day 2-3** | Redesign homepage (dual-path) | 4-6h |
| **Day 3-4** | Creare landing `/career-os` | 4-6h |
| **Day 5** | Creare CV Rubric (lead magnet) | 3-4h |

### Week 2 (Soft Launch)

| Giorno | Task | Effort |
|:-------|:-----|:-------|
| **Day 1** | Primo post LinkedIn (lancio) | 1h |
| **Day 2-3** | Outreach DM (10-15 contatti caldi) | 2-3h |
| **Day 3-5** | Prime discovery call | 3-4h |

---

## ❓ Domande per Proseguire

1. **Homepage:** Vuoi che prepari un mockup/wireframe della nuova homepage dual-path?

2. **Landing Career OS:** Preferisci landing lunga (sales page) o corta (hero + form)?

3. **CV Rubric:** Vuoi che creiamo insieme il contenuto completo?

4. **Tally vs Custom:** Hai già Firebase/Supabase setup? Se sì, potrebbe valere la pena fare custom subito.

5. **Priorità assoluta:** Quale dei 4 pilastri vuoi affrontare per primo?
