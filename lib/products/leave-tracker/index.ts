import { Product } from '@/types/product'

export const leaveTracker: Product = {
  slug: 'leave-tracker',
  title: 'Leave Tracker AI',
  shortDescription: 'Sistema intelligente per gestire ferie, permessi e assenze del team. Automatizza approvazioni e bilancia i carichi di lavoro.',
  description: 'Gestione smart di ferie, permessi e assenze aziendali con AI che ottimizza la copertura del team e automatizza le approvazioni.',
  
  longDescription: `Un sistema intelligente che trasforma la gestione delle assenze da processo manuale e frammentato a workflow automatizzato e prevedibile.

L'AI analizza storico, stagionalità e priorità aziendali per suggerire approvazioni ottimali, evitare sovrapposizioni critiche e mantenere sempre la copertura necessaria.`,

  problem: `La gestione manuale di ferie e permessi è uno dei processi più frustranti nelle PMI:
  
• **Richieste sparse** - Email, WhatsApp, post-it: impossibile avere una vista d'insieme
• **Approvazioni ad hoc** - Manca una logica chiara, si decide "a sensazione"
• **Sovrapposizioni critiche** - Si scopre troppo tardi che mancano persone chiave
• **Tempo perso** - HR e manager passano ore a coordinare e rincorrere conferme
• **Conflitti nascosti** - Due persone dello stesso team in ferie insieme, senza accorgersene

Il risultato: stress per HR, frustrazione per i dipendenti, e copertura del lavoro lasciata al caso.`,

  solution: `Leave Tracker AI centralizza e automatizza l'intero processo, con intelligenza che ti aiuta a decidere meglio:

**Per i dipendenti:**
• Richiesta ferie in 30 secondi da web o mobile
• Visibilità immediata del saldo disponibile
• Conferma automatica se non ci sono conflitti

**Per manager e HR:**
• Dashboard unica con tutte le richieste e lo storico
• AI suggerisce approvazione/rifiuto basandosi su: copertura team, priorità progetti, storico periodi
• Alert automatici per sovrapposizioni critiche
• Report mensili su utilizzo ferie e pattern del team

**Integrazioni smart:**
• Si collega al calendario aziendale (Google/Outlook)
• Notifiche via email o Slack
• Export per paghe e presenze
• API per integrare con gestionale esistente`,

  features: [
    {
      title: 'Richieste self-service',
      description: 'Dipendenti richiedono ferie/permessi in autonomia, con saldo sempre aggiornato',
      icon: '📱'
    },
    {
      title: 'AI per approvazioni',
      description: 'Suggerimenti intelligenti basati su copertura team, priorità progetti e storico',
      icon: '🤖'
    },
    {
      title: 'Alert sovrapposizioni',
      description: 'Notifica automatica se due persone dello stesso team/ruolo sono assenti insieme',
      icon: '⚠️'
    },
    {
      title: 'Dashboard unificata',
      description: 'Vista completa di tutte le assenze: passate, presenti, future',
      icon: '📊'
    },
    {
      title: 'Calendario condiviso',
      description: 'Sincronizzazione automatica con Google Calendar o Outlook',
      icon: '📅'
    },
    {
      title: 'Report automatici',
      description: 'Analytics su utilizzo ferie, pattern stagionali, previsioni di picco',
      icon: '📈'
    }
  ],

  benefits: [
    {
      metric: '90%',
      description: 'Riduzione tempo HR dedicato a gestione assenze'
    },
    {
      metric: '0',
      description: 'Sovrapposizioni critiche non previste'
    },
    {
      metric: '2 min',
      description: 'Tempo medio per approvare una richiesta'
    },
    {
      metric: '100%',
      description: 'Visibilità su saldo ferie e permessi'
    }
  ],

  useCases: [
    {
      title: 'PMI con 15-100 dipendenti',
      description: 'Gestione manuale diventa impossibile, ma software HR enterprise è troppo costoso',
      before: 'HR passa 10+ ore/mese a coordinare ferie via email e WhatsApp',
      after: 'Sistema automatico gestisce 95% delle richieste, HR interviene solo su casi complessi'
    },
    {
      title: 'Team con turnazioni',
      description: 'Ristoranti, negozi, servizi: serve sempre copertura minima',
      before: 'Manager approva "a occhio", rischio di restare scoperti nei giorni chiave',
      after: 'AI verifica automaticamente che rimanga sempre il numero minimo di persone per ruolo'
    },
    {
      title: 'Aziende multi-sede',
      description: 'Uffici in città diverse, difficile coordinare assenze tra team',
      before: 'Ogni sede gestisce per conto suo, nessuna visibilità centrale',
      after: 'Dashboard unica mostra assenze di tutte le sedi, con alert cross-team'
    }
  ],

  techStack: [
    'Next.js 14',
    'TypeScript',
    'Supabase',
    'OpenAI GPT-4',
    'Tailwind CSS',
    'Vercel'
  ],

  tags: ['GenAI', 'HR', 'Automazione', 'Workflow'],
  category: 'hr',
  
  status: 'beta',
  liveUrl: undefined,
  githubUrl: undefined,
  
  image: '/assets/products/leave_tracker.jpeg',
  images: [
    '/assets/products/leave_tracker_dashboard.jpeg',
    '/assets/products/leave_tracker_calendar.jpeg',
    '/assets/products/leave_tracker_mobile.jpeg'
  ],

  cta: {
    primary: {
      text: 'Richiedi una demo personalizzata',
      href: '/aziende#prenota-call'
    },
    secondary: {
      text: 'Scarica il caso studio',
      href: '/case-studies/leave-tracker.pdf'
    }
  },

  faqs: [
    {
      question: 'Si integra con il nostro gestionale paghe?',
      answer: 'Sì, forniamo API REST e webhook per integrare con qualsiasi sistema. I formati di export più comuni (CSV, Excel) sono già supportati out-of-the-box.'
    },
    {
      question: 'Quanto tempo serve per metterlo in produzione?',
      answer: 'Setup base in 1 settimana. Configurazione personalizzata (policy aziendali, ruoli, integrazioni) in 2-3 settimane. Parte con dati storici importati dal sistema precedente.'
    },
    {
      question: 'Come funziona l\'AI per le approvazioni?',
      answer: 'L\'AI analizza: 1) Copertura minima del team per ruolo, 2) Priorità progetti in corso, 3) Storico assenze del dipendente, 4) Pattern stagionali. Suggerisce approva/rifiuta con motivazione, ma la decisione finale resta sempre umana.'
    },
    {
      question: 'È GDPR compliant?',
      answer: 'Sì, completamente. I dati sono ospitati in EU (Supabase Frankfurt), con encryption at-rest e in-transit. Ogni dipendente accede solo ai propri dati, HR vede solo ciò che serve per gestione.'
    },
    {
      question: 'Quanto costa?',
      answer: 'Prezzo basato su numero dipendenti: da €99/mese (fino a 25 persone) a €299/mese (fino a 100). Include setup iniziale, training team, e supporto prioritario.'
    }
  ],

  testimonial: {
    quote: 'Prima passavo 2 giorni al mese solo a coordinare ferie e controllare sovrapposizioni. Ora il sistema fa tutto in automatico e io intervengo solo per casi particolari. Un sollievo enorme.',
    author: 'Laura M.',
    role: 'HR Manager',
    company: 'Studio tecnico, 35 dipendenti'
  },

  relatedProducts: ['editorial-planner', 'doc-assistant'],

  metadata: {
    title: 'Leave Tracker AI - Gestione Ferie e Permessi Intelligente | stAItuned',
    description: 'Sistema AI per gestire ferie, permessi e assenze del team. Automatizza approvazioni, previene sovrapposizioni e riduce il carico HR del 90%.',
    keywords: ['gestione ferie', 'permessi dipendenti', 'HR automation', 'leave management', 'AI HR', 'gestione assenze'],
    ogImage: '/assets/products/leave_tracker_og.jpeg'
  },

  pricing: {
    model: 'subscription',
    tiers: [
      {
        name: 'Starter',
        price: '€99/mese',
        description: 'Per team fino a 25 persone',
        features: [
          'Richieste self-service illimitate',
          'AI per suggerimenti approvazione',
          'Dashboard e calendario condiviso',
          'Export CSV/Excel',
          'Supporto email'
        ]
      },
      {
        name: 'Growth',
        price: '€199/mese',
        description: 'Per aziende fino a 50 persone',
        features: [
          'Tutto di Starter, più:',
          'Integrazioni calendario (Google/Outlook)',
          'Report analytics avanzati',
          'API e webhook',
          'Supporto prioritario'
        ],
        highlighted: true
      },
      {
        name: 'Enterprise',
        price: '€299/mese',
        description: 'Per aziende fino a 100 persone',
        features: [
          'Tutto di Growth, più:',
          'Multi-sede e org complesse',
          'Custom policy e workflow',
          'Integrazioni personalizzate',
          'Onboarding dedicato + training'
        ]
      }
    ]
  }
}
