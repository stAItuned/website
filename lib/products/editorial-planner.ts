import type { Product } from '@/types/product'

/**
 * AI Editorial Planner
 * 
 * Pianificatore editoriale AI per blog e social media
 */
export const editorialPlanner: Product = {
  slug: 'editorial-planner',
  title: 'AI Editorial Planner',
  subtitle: 'Il tuo assistente AI per la pianificazione editoriale',
  tagline: 'Il tuo assistente AI per la pianificazione editoriale',
  description: 'Pianificatore editoriale AI per blog e social media. Prototipo basato su progetti reali.',
  longDescription: 'Pianificatore editoriale AI per blog e social media che aiuta le PMI a mantenere una presenza costante e professionale sui canali digitali.',
  
  image: '/assets/products/editorial_planner.jpeg',
  coverImage: '/assets/products/editorial_planner_cover.jpeg',
  
  status: 'coming-soon',
  
  tags: ['GenAI', 'Marketing', 'Automazione'],
  category: 'marketing',
  techStack: ['Next.js', 'OpenAI GPT-4', 'TypeScript', 'Tailwind CSS'],
  
  problem: `Le PMI spesso faticano a mantenere una presenza costante e coerente sui canali digitali. 
    La pianificazione editoriale richiede tempo, creatività e strategia - risorse che spesso scarseggiano nelle piccole e medie imprese.`,
  problemStatement: `Le PMI spesso faticano a mantenere una presenza costante e coerente sui canali digitali. 
    La pianificazione editoriale richiede tempo, creatività e strategia - risorse che spesso scarseggiano nelle piccole e medie imprese.`,
  
  solution: `L'AI Editorial Planner è un assistente intelligente che aiuta a:
    - Generare idee di contenuto allineate al tuo business
    - Pianificare post per blog e social media
    - Mantenere coerenza nella comunicazione
    - Ottimizzare i tempi di pubblicazione
    - Suggerire argomenti basati su trend e stagionalità`,
  solutionDescription: `L'AI Editorial Planner è un assistente intelligente che aiuta a:
    - Generare idee di contenuto allineate al tuo business
    - Pianificare post per blog e social media
    - Mantenere coerenza nella comunicazione
    - Ottimizzare i tempi di pubblicazione
    - Suggerire argomenti basati su trend e stagionalità`,
  
  features: [
    {
      title: 'Generazione Idee',
      description: 'Suggerimenti automatici di topic basati sul tuo settore e obiettivi',
      icon: '💡'
    },
    {
      title: 'Calendario Intelligente',
      description: 'Pianificazione automatica considerando eventi, stagionalità e best practices',
      icon: '📅'
    },
    {
      title: 'Multi-Canale',
      description: 'Adatta i contenuti per blog, LinkedIn, Instagram e altri canali',
      icon: '🔀'
    },
    {
      title: 'Brand Voice',
      description: 'Mantiene coerenza con il tone of voice della tua azienda',
      icon: '🎯'
    }
  ],
  
  caseStudy: {
    company: 'PMI nel settore consulenza',
    companySize: '5-15 dipendenti',
    industry: 'Consulenza',
    problem: 'Difficoltà a mantenere una presenza costante su LinkedIn e blog aziendale. Il content marketing veniva fatto "quando c\'era tempo".',
    solution: 'Implementato AI Editorial Planner per generare idee mensili e bozze di post da rifinire internamente.',
    results: [
      'Da 1-2 post al mese a 8-10 post mensili',
      'Tempo di pianificazione ridotto del 70%',
      'Maggiore coerenza nel tone of voice',
      'Aumento del 40% nell\'engagement'
    ]
  },
  
  technicalSpecs: {
    tech: ['Next.js', 'OpenAI GPT-4', 'TypeScript', 'Tailwind CSS'],
    deployment: 'Web App',
    apiAvailable: false
  },
  
  faq: [
    {
      question: 'Posso personalizzare gli argomenti suggeriti?',
      answer: 'Sì, il sistema impara dai tuoi feedback e si adatta alle tue preferenze nel tempo.'
    },
    {
      question: 'L\'AI scrive i post completi?',
      answer: 'Genera bozze e outline che puoi rifinire. L\'obiettivo è accelerare il processo, non sostituire completamente il lavoro umano.'
    },
    {
      question: 'Si integra con i miei strumenti attuali?',
      answer: 'Stiamo lavorando su integrazioni con i principali tool di social media management.'
    }
  ],
  
  pricing: {
    model: 'custom',
    description: 'Progetto pilota personalizzato per la tua azienda'
  },
  
  ctaText: 'Richiedi una demo personalizzata',
  ctaLink: '/aziende',
  ctaUrl: '/aziende',
  
  publishedDate: '2025-01-15',
  featured: true
}
