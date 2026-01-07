# Phase 0 Implementation Plan — stAItuned Career OS

> **Obiettivo:** Mettere in campo tutti gli elementi fondamentali per il lancio di Career OS.
> 
> **Data creazione:** 2026-01-07
> **Durata stimata:** 2 settimane

---

## 📋 Overview Attività

| # | Pilastro | Attività Principali | Effort | Priorità |
|:--|:---------|:--------------------|:-------|:---------|
| 1 | **Stripe Setup** | Payment links per tutti i tier | 45 min | 🔴 P0 |
| 2 | **Form Custom** | Application form Firebase + Telegram | 4-6h | 🔴 P0 |
| 3 | **Landing Career OS** | Long-form sales page pain-first | 4-6h | 🔴 P0 |
| 4 | **Homepage Updates** | Hero pain+mission, CTA, trending/recent | 3-4h | 🟡 P1 |
| 5 | **Lead Magnet** | CV Rubric + Interview Bank | 7-10h | 🟡 P1 |
| 6 | **GA Tracking** | Eventi CTA, form, lead magnet | 2-3h | 🟡 P1 |
| 7 | **Soft Launch** | LinkedIn, outreach, prime call | 3-5h | 🔴 P0 |

---

## ✅ Week 1: Foundation

### Day 1: Stripe Setup (45 min)
- [ ] Creare account Stripe (se non esiste)
- [ ] Creare prodotti:
  - [ ] "Career OS Starter (Beta Offer)" - €390
  - [ ] "Career OS Starter" - €590
  - [ ] "Career OS Pro (Beta Offer)" - €790
  - [ ] "Career OS Pro" - €1.190
  - [ ] "Career OS Elite (Beta Offer)" - €1.490
  - [ ] "Career OS Elite" - €1.990
- [ ] Generare Payment Links per ciascun prodotto
- [ ] Salvare link in doc/Notion per uso in call
- [ ] Testare un payment link (sandbox)

---

### Day 1-2: Form Application Custom (4-6h)

#### Setup Backend (2h)
- [ ] Creare collection `applications` su Firebase Firestore
- [ ] Creare API route `/api/career-os/apply`
- [ ] Implementare salvataggio dati in Firestore
- [ ] Integrare notifica Telegram (bot già esistente)
- [ ] Testare API route con Postman/curl

#### Setup Frontend (2-3h)
- [ ] Creare componente Form multi-step
- [ ] Step 1: Chi sei (Nome, Email, Background)
- [ ] Step 2: Obiettivo (Ruolo target, Timeline)
- [ ] Step 3: Situazione (Blocco principale, Candidature)
- [ ] Step 4: Contatto opzionale (LinkedIn, Note)
- [ ] Implementare validazione form
- [ ] Styling form (coerente con brand)

#### GA Tracking Form (1h)
- [ ] Evento `form_start` (form aperto)
- [ ] Evento `form_step_complete` (ogni step)
- [ ] Evento `form_submit` (submit finale)
- [ ] Evento `form_abandon` (chiuso senza submit)

---

### Day 2-3: Landing Career OS (4-6h)

#### Struttura Pagina
- [ ] Creare pagina `/career-os`
- [ ] **HERO Pain-First:**
  - "50+ candidature AI. Zero risposte. Ti suona familiare?"
  - CTA: "Prenota Audit Gratuito"
- [ ] **Sezione IL PROBLEMA:**
  - Pain points specifici
  - "Il mercato cerca GenAI Engineers. Ma se non sai come presentarti, resti invisibile."
- [ ] **Sezione LA SOLUZIONE:**
  - 4 bullet points Career OS (Role-fit, CV, Proof, Interview)
  - Track-based approach
- [ ] **Sezione AI EXPERT GUIDANCE:**
  - Foto team + bio breve
  - Credenziali e differenziazione
- [ ] **Sezione COME FUNZIONA:**
  - Timeline 4-8 settimane
  - Week-by-week breakdown
- [ ] **Sezione RISULTATI:**
  - Placeholder per case study (o testo "Coming soon")
- [ ] **Sezione PRICING:**
  - 3 tier cards (Starter/Pro/Elite)
  - Highlight "Pro" come popolare
  - Nota pagamento in 2 rate
- [ ] **Sezione FAQ:**
  - "Garantite il lavoro?" → No
  - "E se non sono soddisfatto?"
  - "Quanto tempo devo dedicare?"
  - "Differenza con bootcamp?"
- [ ] **CTA FINALE:**
  - "Non sei sicuro?" → Audit gratuito

#### Form Integration
- [ ] Embed form application in pagina (o link a `/career-os/apply`)
- [ ] CTA "Prenota Audit" → scroll a form o redirect

---

### Day 3-4: Homepage Updates (3-4h)

#### Hero Section
- [ ] Aggiornare copy hero:
  - "L'AI sta cambiando tutto. Tu stai cambiando con lei?"
  - Pain: "Il mercato cerca GenAI engineers, ma il 90% non sa come posizionarsi"
  - Mission: "Impara l'AI da chi la costruisce"
- [ ] CTA: "Esplora articoli" + "Scopri Career OS"

#### Articles Section
- [ ] Implementare toggle Trending/Recent
- [ ] Limitare a 9 articoli
- [ ] Link "Vedi tutti" → `/learn/articles`

#### Intermezzo CTA Section
- [ ] Creare sezione Intermezzo
- [ ] CTA Career OS: "Stai cercando lavoro nell'AI ma nessuno risponde?"
- [ ] Lead Magnet alternativo: "Scarica CV Rubric Gratis"
- [ ] Bottone dismiss "Non ora" → localStorage 30 giorni

#### CTA Dismissal Logic
- [ ] Implementare `shouldShowCareerCTA()` con localStorage
- [ ] Check dismissal date + 30 giorni
- [ ] Toast "Ok, non ti mostreremo più questo per 30 giorni"

---

### Day 5: Lead Magnet (CV Rubric) (3-4h)

#### Contenuto CV Rubric
- [ ] Creare PDF/Notion template
- [ ] Sezione 1: Headline & Positioning (max 6 punti)
- [ ] Sezione 2: Experience (max 6 punti)
- [ ] Sezione 3: Proof (max 6 punti)
- [ ] Sezione 4: Technical Depth (max 4 punti)
- [ ] Scoring guide: "___/22 punti"
- [ ] CTA finale: "Prenota Audit"

#### Landing Lead Magnet
- [ ] Creare mini-landing o modal per download
- [ ] Form: solo Email
- [ ] Salvataggio email in Firebase `leads` collection
- [ ] Notifica Telegram "Nuovo lead magnet download"
- [ ] Redirect a thank-you page con CTA Audit

---

## ✅ Week 2: Launch + Refinement

### Day 1: Interview Bank Lead Magnet (4-6h)

#### Contenuto
- [ ] Raccogliere 30-50 domande reali colloqui GenAI
- [ ] Organizzare per categoria:
  - RAG
  - Agents
  - Evaluation
  - Product/Tradeoffs
- [ ] Aggiungere hints/risposte brevi
- [ ] CTA: "Vuoi prepararti con un esperto?"

#### Integration
- [ ] Stessa logica lead magnet CV Rubric
- [ ] Placement: articoli interview, landing Career OS

---

### Day 1-2: GA Tracking Completo (2-3h)

#### CTA Events
- [ ] `cta_view` - CTA appare in viewport
- [ ] `cta_click` - Click su CTA
- [ ] `cta_dismissed` - Click su "Non ora"

#### Article Events
- [ ] `article_view` - Visita articolo
- [ ] `scroll_depth` - 25/50/75/100%

#### Lead Magnet Events
- [ ] `lead_magnet_view` - Modal/landing aperto
- [ ] `lead_magnet_download` - Email submitted + download

---

### Day 2-3: Soft Launch (3-5h)

#### LinkedIn
- [ ] Preparare post lancio
- [ ] Hook: Pain statement + soluzione
- [ ] CTA: Link a landing Career OS

#### Outreach
- [ ] Lista 10-15 contatti caldi (potenziali target)
- [ ] DM personalized
- [ ] Template: "[Nome], ho visto che [context]. Sto lanciando..."

#### Prime Call
- [ ] Configurare Cal.com/Calendly per Audit 15 min
- [ ] Preparare script discovery call
- [ ] Tracking: chi prenota, chi converte

---

### Day 3-5: Iterate e Refine

- [ ] Monitorare GA: quali CTA funzionano?
- [ ] Feedback dalle prime call: cosa modificare?
- [ ] A/B test copy se necessario
- [ ] Sistemare bug/UX issues

---

## 📊 Checklist Pre-Launch

Prima di considerare Phase 0 "completa":

### Must Have ✅
- [ ] Stripe payment links funzionanti
- [ ] Form application funzionante + Telegram notification
- [ ] Landing `/career-os` live
- [ ] Cal.com/Calendly configurato
- [ ] Almeno 1 lead magnet (CV Rubric) disponibile

### Nice to Have 🟡
- [ ] Homepage hero aggiornato
- [ ] Intermezzo CTA con dismiss
- [ ] Trending/Recent toggle
- [ ] GA tracking completo
- [ ] Interview Bank lead magnet

---

## 🔗 Reference Documenti

| Documento | Path | Contenuto |
|:----------|:-----|:----------|
| Brainstorming | `strategy/phase_0_brainstorming.md` | Decisioni dettagliate |
| Sales Strategy | `strategy/sales_marketing_communication_strategy.md` | Funnel, script, template |
| Business Model | `strategy/business_model.md` | Target, pricing rationale |
| Financial Plan | `strategy/financial_plan.md` | Unit economics, break-even |

---

## 📅 Timeline Visiva

```
Week 1
├── Day 1: Stripe Setup (45 min)
├── Day 1-2: Form Application (4-6h)
├── Day 2-3: Landing Career OS (4-6h)
├── Day 3-4: Homepage Updates (3-4h)
└── Day 5: CV Rubric Lead Magnet (3-4h)

Week 2
├── Day 1: Interview Bank (4-6h)
├── Day 1-2: GA Tracking (2-3h)
├── Day 2-3: Soft Launch (3-5h)
└── Day 3-5: Iterate & Refine
```

---

## ❓ Decisioni da Prendere in Corso

Durante l'implementazione potrebbero emergere:

1. **Copy specifico** per hero/CTA → iterare dopo primi feedback
2. **Placement lead magnet** → testare e ottimizzare
3. **Conversion rate** → aggiustare pricing/messaging se necessario

---

> **Prossimo step:** Scegliere da dove partire e iniziare l'implementazione!
