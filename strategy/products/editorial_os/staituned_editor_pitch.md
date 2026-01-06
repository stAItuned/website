# 🦅 stAItuned Editorial OS: The Operating System for High-Impact Content

## Executive Summary
**stAItuned Editorial OS** is a purpose-built, agentic content operation platform designed to streamline the entire editorial lifecycle—from trend discovery to multi-channel distribution. By orchestrating advanced AI with structured editorial workflows, it solves the problem of "content chaos" and "generic AI output," empowering teams to produce authoritative, brand-aligned content at scale. Our system engages the author in an **interactive co-creation process**, ensuring every piece is unique, original, and deeply personal.

## The Problem It Solves
Modern content teams are stuck in a fragmented workflow:
*   **Discovery Gap:** Manually scouring the web for trends is slow and reactive.
*   **Context Switching:** Jumping between news sites, Google Docs, SEO tools, and LinkedIn/Twitter.
*   **Generic AI:** Standard LLMs lack brand memory, resulting in "fluff" content that sounds robotic.
*   **Distribution Fatigue:** Manually reformatting articles for social media is tedious and often skipped.

## The Solution: A Unified Intelligence Layer
This tool connects the dots, providing a single command center where AI agents act as specialized teammates—researchers, writers, SEO experts, and social media managers.

## Key Modules & Features

### 1. 📡 News Scout (Autonomous Monitoring)
*   **What it is:** An always-on radar for your industry.
*   **How it works:** Leverages **Perplexity API** to scour the web daily for specific keywords (AI, Tech, Innovation).
*   **Value:** Delivers actionable content opportunities ("News Cards") with pre-calculated "Staituned Angles," ensuring you're always first to the conversation. It connects **News, Topics, and Trends** into a cohesive narrative.

### 2. ✍️ Editor Studio (AI-Augmented Creation)
*   **What it is:** A dual-pane writing environment that combines human creativity with machine speed.
*   **Deep Features:**
    *   **Context-Aware Generation:** Uses **RAG (Retrieval-Augmented Generation)** to access accurate historical data and files (from `/knowledge`), ensuring content mirrors your unique Tone of Voice.
    *   **Live SEO Assistant:** Real-time analysis of keyword density, H-structure, and meta tags (`article_assistant_service.py`).
    *   **Ghostwriting Capabilities:** Generates full drafts from news cards using specialized templates (How-to, Deep Dive, Contrarian).

### 3. ♻️ Social Repurposing Engine (Social Share Kit)
*   **What it is:** An automated distribution machine that generates a complete **Social Share Kit**.
*   **How it works:** Instantly transforms long-form articles into optimized posts for LinkedIn, X (Twitter), and more.
*   **The Kit Includes:**
    *   **Teaser Posts:** Short, punchy hooks to drive traffic.
    *   **Deep Dives:** Thread-style breakdowns of complex topics.
    *   **Storytelling:** Narrative-driven posts that humanize the content.
    *   **Educational Carousels:** Step-by-step guides formatted for slide views.
*   **Visuals Included:** Integrates with **DALL-E 3** (`image_service.py`) to auto-generate platform-specific visuals that match the post's context.

### 4. 🤝 Interactive Co-Creation: The Author's POV
The system is designed to be **Interviewer-First**, not just a passive generator.
*   **The Experience:** You are the pilot. The **Interviewer Agent** asks you strategic questions ("What's your contrarian take on this news?"), ensuring your unique expert perspective drives the content.
*   **The Result:** A well-done, deeply personal article that *sounds like you*, backed by the research power of AI.

### 5. 🧠 The "Brain" (Backend Orchestration)
*   **Tech Stack:** Python 3.11+, Google ADK (Agent Development Kit), Gemini Pro/Flash Models.
*   **GitHub CMS:** Articles are pushed directly to a GitHub repository (`github_cms_service.py`), treating content as code for version control and developer-friendly management.
*   **Smart Caching:** Utilizes In-Memory and Firestore solutions for fast load times and efficient API usage.

## The Agentic Advantage: Not Just Faster, Better
Because this system is **Agentic**—meaning it thinks, plans, and loops *before* it writes—the output is fundamentally superior to standard LLM chat:

*   **✨ Original:** No more derivative fluff. By combining unique "News Cards" with your internal `/knowledge` base, every article is a novel synthesis of fresh data and brand heritage.
*   **📈 SEO Ready:** It’s not an afterthought. The **SEO Agent** and **Writer Agent** collaborate in real-time loops, ensuring every header and keyword placement solves a specific search intent before the draft is even finished.
*   **✅ Fact Checked:** Hallucinations are caught at the source. The **Fact-Checker Agent** verifies every claim against live web data (`verify_claim_tool`), creating trust-grade content automatically.
*   **🤝 Engaging:** It reads like a human expert. Special **HIL Agents** (Interviewer, Coherence, Thesis) mimic the workflow of a senior editor, injecting strong opinions, logical flow, and "hooks" that keep readers glued to the page.

## Why This Matters
For a pitch audience, the key takeaway is **Efficiency + Quality**. This isn't just a wrapper around ChatGPT; it's a verticalized application that embeds specific editorial workflows into code, ensuring that every piece of content published meets a high "Expert" standard while reducing production time by 70%.

## Annex: Technical Feature Breakdown

### 🔬 The Agentic Workforce (Backend Architecture)
The platform is powered by **Google ADK (Agent Development Kit)**, orchestrating a fleet of specialized agents defined in `app/agents/definitions.py`.

#### Core Agents
1.  **Extractor Agent (News Research):**
    *   **Tooling:** Perplexity API.
    *   **Role:** Scours the web for real-time data, extracting sources, key stats, and evidence.
2.  **Outline Agent (Structuring):**
    *   **Role:** Architects the logical flow of the article based on the identified "Staituned Angle."
3.  **Writer Agent (Content Generation):**
    *   **Role:** Drafts content section-by-section, mimicking the specific tone of voice required.
4.  **SEO Agent (Optimization):**
    *   **Tooling:** Google Search Tool.
    *   **Role:** Validates keyword usage, header structure, and search intent alignment.
5.  **Fact-Checker Agent (Validation):**
    *   **Tooling:** `verify_claim_tool`.
    *   **Role:** Cross-references assertions with live web data to prevent hallucinations.

#### Advanced Workflows (Loops & HIL)
*   **Sequential Chains:** The `article_orchestrator` executes a rigid 5-step process: Research → Outline → Write → Fact Check → Final SEO.
*   **Feedback Loops:** Agents don't just work once; they loop. For example, the `write_seo_loop` iterates up to 2 times per section to ensure the draft meets SEO standards before moving on.
*   **Human-in-the-Loop (HIL) Agents:** Dedicated agents for specific feedback phases:
    *   **Brief Agent:** Analyzes initial requirements and creates a structured brief.
    *   **Thesis Agent:** Formulates a strong, argumentative thesis statement to anchor the article.
    *   **Interviewer Agent:** Asks clarifying questions to the human user to refine the angle.
    *   **Section Planner Agent:** Breaks down the article into detailed, logical sections before writing starts.
    *   **FAQ Agent:** Generates relevant Frequently Asked Questions based on the article content.
    *   **Coherence Agent:** Ensuring logical flow and transitions between paragraphs and sections.
    *   **Final Polish Agent:** Smooths out robotic phrasing and ensures professional tone.
    *   **Refinement Agent:** Applies specific improvements based on user feedback (Simpify, Expand, etc.).

### 🛠️ Service-Level Features

#### Article Assistant Service (`article_assistant_service.py`)
*   **Feature:** **"Chat with your Draft"**
    *   Allows users to ask questions like "Is this intro too long?" or "What's missing here?"
*   **Feature:** **Smart Edits**
    *   **Modes:** `Improve`, `Rewrite`, `Expand`, `Simplify`.
    *   **Tech:** Uses `gemini-2.0-flash-exp` for sub-second latency on editorial suggestions.

#### News Service (`news_service.py`)
*   **Intelligence:**
    *   **Relevance Scoring:** A dedicated Gemini call scores news items (0-100) based on fit for "AI," "Innovation," or "Marketing."
    *   **Structured Extraction:** Parses raw unstructured HTML into clean JSON with fields like `data_evidence`, `pros/cons`, and `call_outs`.

#### Social Service (`social_service.py`)
*   **Multi-Modal Generation:**
    *   **Text:** Generates platform-optimized copy (LinkedIn/Twitter).
    *   **Visual:** Auto-compresses the article context into a precise prompt for DALL-E 3 to generate accompanying headers or charts.
