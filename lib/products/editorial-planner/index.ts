import type { Product } from '@/types/product'

/**
 * Staituned Editorial Suite
 * 
 * AI agentic suite for automated content creation and social media distribution
 */
export const editorialPlanner: Product = {
  slug: 'editorial-planner',
  title: 'Staituned Editorial Suite',
  subtitle: 'Dalla notizia al post LinkedIn in un click',
  tagline: 'Dalla notizia al post LinkedIn in un click',
  description: 'AI agentic suite that scouts tech news, drafts SEO-ready articles, repurposes to LinkedIn, and keeps your editorial calendar synced.',
  longDescription: 'The suite combines FastAPI + Google ADK orchestrators with React to run a structured pipeline: extract news via Perplexity, outline/write with Gemini loops, fact-check, and SEO-tune before handing the draft to a LinkedIn transformer. Status updates stream over WebSockets so writers see progress live, while the calendar tab tracks draft→ready→published.',
  
  image: '/assets/products/editorial-planner/editorial_planner.jpeg',
  coverImage: '/assets/products/editorial-planner/editorial_planner_robot.jpeg',
  
  status: 'beta',
  
  tags: ['GenAI', 'Content automation', 'SEO', 'LinkedIn', 'News scouting'],
  category: 'marketing',
  techStack: ['React', 'Vite', 'FastAPI', 'Python 3.11', 'Google ADK', 'Google Gemini', 'Firestore', 'Perplexity API'],
  
  problem: `Marketing teams burn hours hunting relevant news, turning them into articles, and rewriting for LinkedIn. Coordination across drafts, fact-checks, and calendars is manual and error-prone. Style consistency is hard without a central brief, and costly external writers slow turnaround.
    
Slow publishing loses news timing windows; inconsistent tone hurts brand; manual rewrites inflate cost per article; missed slots in the calendar mean lost reach.`,
  problemStatement: `Marketing teams burn hours hunting relevant news, turning them into articles, and rewriting for LinkedIn. Coordination across drafts, fact-checks, and calendars is manual and error-prone. Style consistency is hard without a central brief, and costly external writers slow turnaround.`,
  
  solution: `Agents scout AI/tech/innovation news daily, score relevance, and suggest angles for your blog. A guided editor generates outlines and drafts with Gemini, tuned to your tone and target. Built-in SEO assistant suggests keywords, structure, and meta. A social repurposing step turns drafts into LinkedIn posts with image prompts. Everything is persisted in Firestore with spend telemetry so you see token usage.`,
  solutionDescription: `Agents scout AI/tech/innovation news daily, score relevance, and suggest angles for your blog. A guided editor generates outlines and drafts with Gemini, tuned to your tone and target. Built-in SEO assistant suggests keywords, structure, and meta. A social repurposing step turns drafts into LinkedIn posts with image prompts. Everything is persisted in Firestore with spend telemetry so you see token usage.`,
  
  features: [
    {
      title: 'News Scout',
      description: 'Daily Perplexity-powered search on AI/tech/innovation with relevance scoring and suggested editorial angles',
      icon: '📡'
    },
    {
      title: 'Outline & Draft',
      description: 'Gemini-driven outline and writing loops tuned to brand tone, target persona, and template',
      icon: '✍️'
    },
    {
      title: 'SEO Assistant',
      description: 'Keyword gaps, H1-H3 structure, and meta description suggestions baked into the editor',
      icon: '🔍'
    },
    {
      title: 'Fact-Check Loop',
      description: 'Iterative agent passes to verify claims and fix inaccuracies before publish',
      icon: '✅'
    },
    {
      title: 'Social Repurposing',
      description: 'One-click conversion from article to LinkedIn post plus image prompt suggestions',
      icon: '♻️'
    },
    {
      title: 'Editorial Calendar',
      description: 'Track Bozza/Pronto/Pubblicato with simple ordering and status visibility',
      icon: '📅'
    }
  ],
  
  benefits: [
    {
      metric: '60-70%',
      description: 'Faster draft-to-publish cycle (news to article to post)'
    },
    {
      metric: '40%',
      description: 'Fewer manual rewrites thanks to tone and SEO guidance'
    },
    {
      metric: '2-3',
      description: 'Extra LinkedIn posts per week repurposed from existing drafts'
    }
  ],
  
  useCases: [
    {
      title: 'SaaS startup blog cadence',
      description: 'Content and social teams in tech/innovation struggling with consistent blog output',
      before: 'Ad-hoc topics, slow drafts, inconsistent publishing schedule',
      after: 'Daily news-derived angles, outlines, and ready-to-edit drafts with consistent flow'
    },
    {
      title: 'Agency LinkedIn calendar',
      description: 'B2B marketing agencies running client blogs plus LinkedIn amplification',
      before: 'Manual rewrites of articles to posts, time-consuming adaptation process',
      after: 'One-click LinkedIn posts with hooks and image prompts, automated workflow'
    },
    {
      title: 'Brand tone consistency',
      description: 'Solo content leads at startups needing consistent brand voice',
      before: 'Multiple writers drift off-style, inconsistent messaging',
      after: 'RAG-tuned prompts and SEO assistant enforce tone and structure automatically'
    }
  ],
  
  caseStudy: {
    company: 'Agenzia B2B SaaS',
    companySize: '15 dipendenti',
    industry: 'Marketing services',
    problem: 'Needed steady thought-leadership on AI trends without a full-time writer',
    solution: 'Ran daily news scouting, generated outlines/drafts, repurposed to LinkedIn with prompts',
    results: [
      '3→8 posts per month published',
      '50% faster approval cycles',
      'LinkedIn impressions +35%',
      'Reduced freelance spend on rewrites'
    ],
    testimonial: {
      quote: 'Abbiamo trasformato le news in contenuti pubblicabili in poche ore, mantenendo tono e SEO allineati.',
      author: 'Marketing Lead',
      role: 'Marketing Lead'
    }
  },
  
  technicalSpecs: {
    tech: ['React', 'Vite', 'FastAPI', 'Python 3.11', 'Google ADK', 'Google Gemini', 'Firestore', 'Perplexity API'],
    deployment: 'Web App (Cloud - GCP) + API',
    apiAvailable: true
  },
  
  faq: [
    {
      question: 'Come gestite sicurezza e dati?',
      answer: 'Firestore con credenziali GCP; chiavi API conservate via env; nessun dato è condiviso con terze parti oltre ai provider scelti (Gemini/Perplexity).'
    },
    {
      question: 'Quanto costa?',
      answer: 'Modello a consumo su token Perplexity/Gemini con tetti configurabili; piano a seats per l\'editor web.'
    },
    {
      question: 'Si integra con CMS esistenti?',
      answer: 'Esporta markdown e può inviare draft via API; webhook/plugin CMS in roadmap.'
    },
    {
      question: 'Posso usare il mio tone of voice?',
      answer: 'Sì, prompt custom e knowledge base /knowledge per mantenere stile storico.'
    },
    {
      question: 'Serve installazione?',
      answer: 'No, è web app in cloud; API disponibili per integrazione.'
    },
    {
      question: 'Che supporto offrite?',
      answer: 'Onboarding guidato, chat di supporto, e report di utilizzo/spend via dashboard usage.'
    }
  ],
  
  pricing: {
    model: 'custom',
    description: 'Modello a consumo su token Perplexity/Gemini con tetti configurabili; piano a seats per l\'editor web'
  },
  
  cta: {
    primary: {
      text: 'Richiedi una demo',
      href: '/aziende#prenota-call'
    },
    secondary: {
      text: 'Vedi il progetto',
      href: '/projects/editorial-suite'
    }
  },
  
  liveUrl: undefined,
  demoUrl: undefined,
  githubUrl: undefined,
  
  publishedDate: '2025-12-07',
  lastUpdated: '2025-12-07',
  featured: true
}
