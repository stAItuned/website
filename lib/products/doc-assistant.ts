import type { Product } from '@/types/product'

/**
 * Document AI Assistant
 * 
 * Il tuo AI assistant dedicato sui tuoi documenti
 */
export const docAssistant: Product = {
  slug: 'doc-assistant',
  title: 'Document AI Assistant',
  subtitle: 'Parla con i tuoi documenti',
  tagline: 'Parla con i tuoi documenti',
  description: 'Il tuo AI assistant dedicato sui tuoi documenti aziendali. Cerca, analizza e ottieni risposte istantanee.',
  longDescription: 'Un chatbot AI specializzato che indicizza i tuoi documenti aziendali e risponde alle tue domande con riferimenti precisi alle fonti.',
  
  image: '/assets/products/ai_doc_assistant.jpeg',
  coverImage: '/assets/products/ai_doc_assistant_cover.jpeg',
  
  status: 'coming-soon',
  
  tags: ['GenAI', 'Produttività', 'Enterprise'],
  category: 'productivity',
  techStack: ['Python', 'LangChain', 'Pinecone/Weaviate', 'FastAPI', 'React'],
  
  problem: `Le aziende hanno documenti ovunque: contratti, manuali, procedure, report.
    Trovare un'informazione specifica richiede tempo e spesso nessuno sa esattamente dove cercare.
    La conoscenza aziendale è dispersa e difficile da consultare rapidamente.`,
  problemStatement: `Le aziende hanno documenti ovunque: contratti, manuali, procedure, report.
    Trovare un'informazione specifica richiede tempo e spesso nessuno sa esattamente dove cercare.
    La conoscenza aziendale è dispersa e difficile da consultare rapidamente.`,
  
  solution: `Document AI Assistant è un chatbot specializzato che:
    - Indicizza tutti i tuoi documenti aziendali
    - Risponde a domande specifiche citando le fonti
    - Ricorda il contesto della conversazione
    - Suggerisce documenti correlati
    - Funziona con PDF, Word, Excel, presentazioni e più`,
  solutionDescription: `Document AI Assistant è un chatbot specializzato che:
    - Indicizza tutti i tuoi documenti aziendali
    - Risponde a domande specifiche citando le fonti
    - Ricorda il contesto della conversazione
    - Suggerisce documenti correlati
    - Funziona con PDF, Word, Excel, presentazioni e più`,
  
  features: [
    {
      title: 'Multi-formato',
      description: 'Supporta PDF, Word, Excel, PowerPoint e documenti Google',
      icon: '📚'
    },
    {
      title: 'Citazioni Precise',
      description: 'Ogni risposta include riferimenti al documento originale',
      icon: '🔍'
    },
    {
      title: 'Contesto Persistente',
      description: 'Ricorda la conversazione per follow-up naturali',
      icon: '🧠'
    },
    {
      title: 'Sicurezza Enterprise',
      description: 'Permessi utente, crittografia e compliance GDPR',
      icon: '🔒'
    },
    {
      title: 'Aggiornamento Automatico',
      description: 'Riconosce nuovi documenti e aggiorna la knowledge base',
      icon: '🔄'
    },
    {
      title: 'Multi-lingua',
      description: 'Funziona con documenti in italiano, inglese e altre lingue',
      icon: '🌍'
    }
  ],
  
  caseStudy: {
    company: 'Studio legale',
    companySize: '10-25 dipendenti',
    industry: 'Legale',
    problem: 'Centinaia di contratti e precedenti legali. Trovare clausole specifiche richiedeva ore.',
    solution: 'Implementato Document AI Assistant per consultare velocemente l\'archivio documentale.',
    results: [
      'Tempo di ricerca ridotto dell\'80%',
      'Junior lawyer più autonomi',
      'Meno errori da documenti non trovati',
      'Migliore riuso della conoscenza aziendale'
    ]
  },
  
  technicalSpecs: {
    tech: ['Python', 'LangChain', 'Pinecone/Weaviate', 'FastAPI', 'React'],
    deployment: 'Cloud (AWS/Azure) o On-Premise',
    apiAvailable: true
  },
  
  faq: [
    {
      question: 'Posso usarlo con documenti riservati?',
      answer: 'Sì, offriamo deployment on-premise per massima sicurezza. I dati non escono mai dalla tua infrastruttura.'
    },
    {
      question: 'Quanti documenti può gestire?',
      answer: 'Da centinaia a milioni di documenti. La performance scala con l\'infrastruttura.'
    },
    {
      question: 'Si integra con Sharepoint/Google Drive?',
      answer: 'Sì, abbiamo connettori per i principali sistemi di document management.'
    },
    {
      question: 'Che lingue supporta?',
      answer: 'Italiano, inglese, spagnolo, francese, tedesco e altre su richiesta.'
    }
  ],
  
  pricing: {
    model: 'custom',
    description: 'Prezzo basato su numero di documenti e utenti'
  },
  
  ctaText: 'Richiedi un progetto pilota',
  ctaLink: '/aziende',
  ctaUrl: '/aziende',
  
  publishedDate: '2025-02-01',
  featured: true
}
