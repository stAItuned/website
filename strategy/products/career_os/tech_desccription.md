
# Tool: stAItuned Career OS Assistant (CV/LinkedIn + JD Tailoring + Interview Prep)

## 1) What it is (product definition)

A goal-driven “Career Operating System” tool for **Applied GenAI (LLM apps) junior candidates** that helps users:

* choose a clear target (role + constraints),
* transform their experience into **credible, role-aligned evidence**,
* tailor CV + cover letter to specific job descriptions,
* prepare interviews with **JD-personalized** and **standard** questions,
* understand the company and role context (reviews, signals),
* iterate with measurable improvement (scoring, versioning, tracking).

**Key idea:** not “a resume builder”, but an **outcome engine** that produces deliverables and a repeatable workflow.

---

## 2) The problem it solves (user pain)

### Primary pain

Juniors don’t fail because they lack intelligence—they fail because they:

* don’t know which Applied GenAI role to target,
* apply with generic material,
* can’t translate experience into “evidence” that matches a JD,
* don’t know what gaps are truly blocking them,
* don’t have a system to iterate,
* prepare interviews in a random way.

### What the tool changes

It converts:

* **confusion → clarity** (goal + role fit),
* **generic CV → targeted applications** (JD tailoring),
* **claims → evidence** (evidence bank),
* **random prep → structured prep** (interview simulator + rubrics),
* **guessing → feedback loops** (scoring + versioning + tracking).

---

## 3) Target user and usage context

**ICP:** junior / new grad targeting Applied GenAI roles like LLM Application Engineer, RAG Engineer, Agent Engineer, GenAI Product Engineer (entry-level).
**Context:** they’re actively applying and need results in 4–8 weeks.
**Constraints:** limited time, incomplete portfolio, needs guidance.

---

# 4) Core workflow (end-to-end user journey)

### Step 0 — Goal setup (mandatory)

User sets:

* Primary role target (pick from list)
* 1 adjacent role (optional but recommended)
* Constraints: geography, remote/onsite, industry preference, timeline, salary (optional)
* Seniority: entry/junior
* Current baseline: CV upload + LinkedIn URL + optional GitHub/portfolio

**Output:**

* “Target Profile” summary (role narrative + keywords + competencies)
* baseline readiness score (CV + LinkedIn)

---

### Step 1 — Evidence Bank (single source of truth)

User inputs (guided form + import options):

* Projects (title, description, role, stack, outcomes/metrics, links)
* Experiences (company, responsibilities, impact, quantifiable results)
* Skills (with proof links)
* Education/certs
* STAR stories (Situation/Task/Action/Result)

**Output:**

* Evidence cards with tags: skill, domain, seniority signal, proof strength score
* “Bullet bank” suggestions generated from evidence (draft bullets, user approves)

**Development note:** all downstream writing must reference this bank to avoid hallucinations.

---

### Step 2 — CV & LinkedIn Audit (rubric-based)

The tool evaluates CV + LinkedIn against:

* Role alignment (keywords and competencies)
* Evidence quality (metrics, scope, ownership)
* Narrative coherence (positioning, consistency)
* ATS readability (structure)
* Human recruiter readability (clarity, signal/noise)

**Outputs:**

* Overall score + sub-scores (e.g., 0–100)
* “Top 10 fixes” ranked by impact
* Suggested rewritten bullets per section (requires user approval)
* LinkedIn recommendations by section:

  * headline variants
  * about section structure
  * experience bullet upgrades
  * featured section checklist

---

### Step 3 — JD Parser + Match Map (per job description)

User pastes the JD text or uploads a PDF; optionally adds company link.

Tool extracts:

* Must-have requirements
* Nice-to-have requirements
* Responsibilities
* Keywords/skills
* Role level expectations
* “Implicit signals” (ownership, collaboration, ambiguity handling)

**Outputs:**

* JD Summary (structured)
* Match Map:

  * ✅ covered requirements (linked to evidence cards)
  * ⚠️ partially covered (needs reframing or stronger proof)
  * ❌ missing (true gaps)
* “Gap actions”:

  * for each missing/partial item: suggested actions (e.g., mini project, reading, practice) with effort estimate

---

### Step 4 — Tailored CV + Cover Letter (per JD)

This is the money feature.

**Input:**

* Base CV version + Evidence Bank + JD Match Map + Target Profile

**Outputs (per JD):**

1. **Tailored CV version**

   * Updated summary/title
   * Reordered/reweighted sections
   * Rewritten bullets referencing evidence bank
   * Keyword alignment without stuffing
2. **Cover letter**

   * Role-specific hook
   * 2–3 evidence-driven paragraphs mapped to JD
   * company-specific angle (if available)
3. **Change log**

   * what changed vs base CV and why (helps learning and transparency)
4. **Truthfulness guardrails**

   * flags any suggested content not supported by evidence
   * prompts user to add evidence or remove claim

**Packaging logic (important for your tiers):**

* Starter includes **3 JD tailorings**
* Pro includes **10 JD tailorings**
* Extra tailorings can be purchased via credits

---

### Step 5 — Job Targeting Assistant (Pro / Elite)

User wants help finding *the right roles* to apply to.

**Inputs:**

* Target profile + skills + constraints
* Optional: jobs they liked/disliked

**Outputs:**

* Suggested role variants/titles (synonyms + adjacent roles)
* Keyword sets (hard skills, domain, tools)
* Boolean search queries (LinkedIn/Google)
* Filtering framework:

  * “good fit / risky / no-fit” criteria
* Starter job board list + weekly plan:

  * how many applications/week
  * which types of companies to prioritize

---

### Step 6 — Interview Preparation (standard + JD-personalized)

Two modes:

**A) Standard interview prep (role-based)**

* hard skill questions by role (ML fundamentals, evaluation, data pipelines, LLM apps, RAG basics, etc.)
* system/design questions for juniors (simplified)
* behavioral questions (STAR library)
* scoring rubric per competency

**B) JD-personalized interview prep**

* questions derived from JD responsibilities + required skills
* follow-up questions chain (multi-turn)
* recommended “stories” from Evidence Bank mapped to JD requirements

**Outputs:**

* Interview kit per JD:

  * question set + suggested answer outline
  * “must-hit points”
  * weaknesses to address
* Practice mode:

  * timed simulation
  * scoring + feedback
  * improvement tasks

---

### Step 7 — Company Insights (careful implementation)

Goal: provide useful context without legal/ToS headaches.

**Recommended approach:**

* Allow user to paste:

  * company description
  * review snippets they have
  * links to public sources
* Summarize into:

  * pros/cons themes
  * interview experience patterns
  * culture signals
  * likely red flags
  * suggested questions to ask in interview

**Outputs:**

* “Company Brief” PDF/section:

  * culture & risks
  * role expectations
  * questions to ask
  * negotiation considerations (optional)

*(If you later integrate third-party reviews, do it via compliant sources/partnership APIs.)*

---

### Step 8 — Versioning + Tracking (feedback loop)

This is what makes it an “OS”.

**Features:**

* Version history (Base CV v1/v2, tailored CVs per JD)
* “What changed” diffs
* Application tracker:

  * saved/applied/interview/offer
  * which CV version used
* Outcome logging:

  * callbacks/interviews per version
* Recommendations:

  * “your CV v2 performs better for role X”
  * “your JD targeting is too broad”

**Outputs:**

* Weekly dashboard:

  * applications sent
  * interview rate
  * tasks for next week

---

# 5) Key features list (concise for development backlog)

### P0 (MVP must-have)

* Goal setup (role + constraints)
* Evidence Bank (evidence cards + bullet bank)
* CV & LinkedIn audit (rubric scoring + prioritized fixes)
* JD parser + match map + gap actions
* Tailored CV + cover letter (with change log + truthfulness guardrails)
* Interview prep (standard + JD-personalized) with scoring rubric
* Basic versioning (store base + tailored outputs)

### P1 (high leverage next)

* Job Targeting Assistant (Pro)
* Application tracker + performance dashboard
* Outreach kit (recruiter DM + hiring manager DM + referral ask)
* Credits system (packs + usage caps)

### P2 (later)

* Company insights integration (compliant)
* Interview simulator advanced (multi-turn + timed + follow-up)
* Negotiation pack

---

# 6) Monetization model (built into the product)

* Tiers in program determine included usage:

  * Starter: 3 JD tailorings
  * Pro: 10 JD tailorings + job targeting
* Credits upsell:

  * extra JD tailorings
  * extra interview kits
  * extra reviews/priority
  * extra articles (if you want cross-sell with Editorial Planner)

**Important:** credits are also margin protection (caps on tool usage).

---

# 7) Non-functional requirements (trust + quality)

### Privacy & security

* CV contains sensitive data → support:

  * “Delete my data” button
  * retention policy (e.g., auto-delete after X days if requested)
  * “redact mode” for PII
* Clear consent for:

  * storing documents
  * generating content
  * publishing anything (separate consent)

### Quality controls

* No hallucinated experience: outputs must reference evidence bank
* Provide transparent change logs and “unsupported claim warnings”

### UX requirements

* Everything is “guided”: users don’t know what to do next
* Always show: *what to do now*, *why it matters*, *what output you’ll get*
