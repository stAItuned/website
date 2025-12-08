import type { Product } from '@/types/product'

/**
 * Comparatore Fondi Pensione
 * 
 * GenAI per confrontare fondi pensione in base a esigenze personali
 */
export const fundComparison: Product = {
  slug: 'fund-comparison',
  title: 'Comparatore Fondi Pensione',
  subtitle: 'AI per scelte previdenziali consapevoli',
  tagline: 'AI per scelte previdenziali consapevoli',
  description: 'GenAI per confrontare fondi pensione in base a esigenze personali. Demo da progetto PMI.',
  longDescription: 'Strumento AI che aiuta a confrontare fondi pensione analizzando documenti complessi e fornendo raccomandazioni personalizzate basate sul tuo profilo.',
  
  image: '/assets/products/fund-comparison/fund_comparison.jpeg',
  coverImage: '/assets/products/fund-comparison/fund_comparison_robot.jpeg',
  
  status: 'beta',
  demoLink: '/demo/fund-comparison',
  demoUrl: '/demo/fund-comparison',
  
  tags: ['GenAI', 'Finanza', 'Personalizzazione'],
  category: 'analytics',
  techStack: ['Next.js', 'LangChain', 'OpenAI', 'Vector Database', 'Python'],
  
  problem: `Scegliere un fondo pensione è complesso: documenti tecnici lunghi, termini difficili, 
    e ogni persona ha esigenze diverse basate su età, reddito, propensione al rischio e obiettivi.
    Le comparazioni online sono spesso generiche e non tengono conto del profilo individuale.`,
  problemStatement: `Scegliere un fondo pensione è complesso: documenti tecnici lunghi, termini difficili, 
    e ogni persona ha esigenze diverse basate su età, reddito, propensione al rischio e obiettivi.
    Le comparazioni online sono spesso generiche e non tengono conto del profilo individuale.`,
  
  solution: `Il Comparatore Fondi Pensione usa l'AI per:
    - Analizzare documenti complessi dei fondi pensione
    - Fare domande in linguaggio naturale
    - Confrontare opzioni in base al tuo profilo
    - Spiegare vantaggi e rischi in modo chiaro
    - Suggerire la soluzione più adatta alle tue esigenze`,
  solutionDescription: `Il Comparatore Fondi Pensione usa l'AI per:
    - Analizzare documenti complessi dei fondi pensione
    - Fare domande in linguaggio naturale
    - Confrontare opzioni in base al tuo profilo
    - Spiegare vantaggi e rischi in modo chiaro
    - Suggerire la soluzione più adatta alle tue esigenze`,
  
  features: [
    {
      title: 'Analisi Documenti',
      description: 'Carica i documenti dei fondi e l\'AI li analizza per te',
      icon: '📄'
    },
    {
      title: 'Domande in Linguaggio Naturale',
      description: 'Chiedi qualsiasi cosa: "Quale costa meno?", "Qual è il più sicuro?"',
      icon: '💬'
    },
    {
      title: 'Confronto Personalizzato',
      description: 'Risultati basati su età, reddito, orizzonte temporale e propensione al rischio',
      icon: '🎯'
    },
    {
      title: 'Spiegazioni Chiare',
      description: 'Termini tecnici tradotti in linguaggio comprensibile',
      icon: '✨'
    }
  ],
  
  caseStudy: {
    company: 'Consulente finanziario indipendente',
    companySize: '1-5 dipendenti',
    industry: 'Consulenza finanziaria',
    problem: 'Clienti confusi dalle opzioni previdenziali. Molto tempo speso a spiegare le stesse cose.',
    solution: 'Implementato tool AI che pre-filtra e spiega le opzioni ai clienti prima della consulenza.',
    results: [
      'Tempo consulenza ridotto del 40%',
      'Clienti arrivano più preparati',
      'Maggiore soddisfazione del servizio',
      'Possibilità di seguire più clienti'
    ]
  },
  
  technicalSpecs: {
    tech: ['Next.js', 'LangChain', 'OpenAI', 'Vector Database', 'Python'],
    deployment: 'Web App + API',
    apiAvailable: true
  },
  
  faq: [
    {
      question: 'I miei dati sono sicuri?',
      answer: 'Sì, tutti i dati personali sono criptati e non vengono condivisi. Puoi usare il tool in modalità anonima.'
    },
    {
      question: 'Sostituisce un consulente finanziario?',
      answer: 'No, è uno strumento di pre-screening. Per decisioni importanti consigliamo sempre di consultare un professionista.'
    },
    {
      question: 'Posso usarlo per altri prodotti finanziari?',
      answer: 'Attualmente è specifico per fondi pensione, ma la tecnologia è adattabile ad altri prodotti.'
    }
  ],
  
  pricing: {
    model: 'freemium',
    description: 'Versione base gratuita, versione PRO con analisi avanzate'
  },
  
  ctaText: 'Prova la demo in beta',
  ctaLink: '/demo/fund-comparison',
  ctaUrl: '/demo/fund-comparison',
  
  publishedDate: '2024-11-20',
  lastUpdated: '2025-12-01',
  featured: true
}
