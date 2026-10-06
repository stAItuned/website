import type { LearnLocale } from '@/lib/i18n'

export type VentureEngineStatus = 'existing' | 'focus' | 'next'

export interface VentureEngineStep {
  label: string
  detail: string
  status: VentureEngineStatus
}

export interface VentureShowcaseItem {
  id: 'closedroom' | 'harnex' | 'aura-finance'
  title: string
  proposition: string
  description: string
  stage: string
  tags: string[]
  visualLabel: string
  placeholderLabel: string
}

export interface VenturesCopy {
  hero: {
    eyebrow: string
    headlineTop: string
    headlineAccent: string
    description: string
    primaryCta: string
    secondaryCta: string
    proof: string[]
  }
  thesis: {
    eyebrow: string
    title: string
    body: string
  }
  engine: {
    eyebrow: string
    title: string
    subtitle: string
    steps: VentureEngineStep[]
    productSideLabel: string
    gtmSideLabel: string
  }
  portfolio: {
    eyebrow: string
    title: string
    subtitle: string
    ventures: VentureShowcaseItem[]
    pipelineLabel: string
    pipelineText: string
  }
  principles: {
    eyebrow: string
    title: string
    subtitle: string
    items: Array<{
      number: string
      title: string
      description: string
    }>
    killLine: string
    killDescription: string
  }
  bridge: {
    eyebrow: string
    title: string
    existingTitle: string
    existingItems: string[]
    missingTitle: string
    missingItems: string[]
    connector: string
  }
  role: {
    eyebrow: string
    title: string
    roleName: string
    intro: string
    notThis: string[]
    ownershipLead: string
    ownership: string
    fitTitle: string
    fitItems: string[]
    notFitTitle: string
    notFitItems: string[]
    closingTitle: string
    closingBody: string
    cta: string
    ctaSubject: string
  }
}

export const venturesContent: Record<LearnLocale, VenturesCopy> = {
  en: {
    hero: {
      eyebrow: 'stAI tuned / VENTURES',
      headlineTop: 'We build AI products.',
      headlineAccent: 'Now we take them to market.',
      description:
        'We build working products, put them in front of real users and quickly learn which ones deserve to grow.',
      primaryCta: 'See the products',
      secondaryCta: 'Explore the GTM role',
      proof: ['Working products', 'Fast validation', '0→1 focus'],
    },
    thesis: {
      eyebrow: 'THE QUESTION',
      title: 'What is actually worth building?',
      body:
        'We ship fast, talk to users and invest only where the signal is real.',
    },
    engine: {
      eyebrow: 'HOW IT WORKS',
      title: 'From idea to traction.',
      subtitle: 'Build. Test. Learn. Then scale or stop.',
      steps: [
        { label: 'Idea', detail: 'Pick a real problem.', status: 'existing' },
        { label: 'Build', detail: 'Ship a usable first version.', status: 'existing' },
        { label: 'Validate', detail: 'Talk to users and test demand.', status: 'focus' },
        { label: 'Distribute', detail: 'Find a channel that works.', status: 'focus' },
        { label: 'Scale', detail: 'Invest when the signal is clear.', status: 'next' },
      ],
      productSideLabel: 'Product / Engineering',
      gtmSideLabel: 'Founding GTM',
    },
    portfolio: {
      eyebrow: 'PRODUCTS',
      title: "What we're testing now.",
      subtitle: 'Real products, at different stages.',
      ventures: [
        {
          id: 'closedroom',
          title: 'ClosedRoom',
          proposition: 'Private AI for meetings.',
          description:
            'Record, transcribe and analyse meetings on-device on Mac. Your data stays local.',
          stage: 'Product built / validation',
          tags: ['Local AI', 'macOS', 'Productivity'],
          visualLabel: 'ClosedRoom product visual',
          placeholderLabel: 'Visual placeholder',
        },
        {
          id: 'harnex',
          title: 'Harnex',
          proposition: 'Your local AI harness for Android.',
          description:
            'Run and compare local LLMs on Android, on real devices.',
          stage: 'Technical validation',
          tags: ['Local LLM', 'Android', 'Developer tooling'],
          visualLabel: 'Harnex product visual',
          placeholderLabel: 'Visual placeholder',
        },
        {
          id: 'aura-finance',
          title: 'Aura Finance',
          proposition: 'Making financial decisions simpler.',
          description:
            'An AI-native finance product in discovery. We are testing which decisions it can make easier.',
          stage: 'Discovery / validation',
          tags: ['Fintech', 'AI', 'Decision support'],
          visualLabel: 'Aura Finance product visual',
          placeholderLabel: 'Visual placeholder',
        },
      ],
      pipelineLabel: 'More in progress',
      pipelineText:
        'We test ideas early. Some grow. Some stop.',
    },
    principles: {
      eyebrow: 'HOW WE WORK',
      title: 'Build. Test. Decide.',
      subtitle: 'Every step should answer a question.',
      items: [
        {
          number: '01',
          title: 'Build early',
          description:
            'Get something real in front of users.',
        },
        {
          number: '02',
          title: 'Talk to the market',
          description:
            'Interviews, outbound, pricing and usage before polish.',
        },
        {
          number: '03',
          title: 'Push or stop',
          description:
            'Strong signal: invest. Weak signal: move on.',
        },
      ],
      killLine: 'Stopping is part of the job.',
      killDescription:
        "We don't keep projects alive just because we built them.",
    },
    bridge: {
      eyebrow: "WHAT'S MISSING",
      title: 'The product side is here. Now we need go-to-market.',
      existingTitle: 'Already here',
      existingItems: [
        'AI product engineering',
        'Fast prototyping',
        'Working products',
        'Technical experiments',
        'Budget for early tests',
      ],
      missingTitle: "You'd own",
      missingItems: [
        'Market selection',
        'ICP discovery',
        'Customer conversations',
        'Outbound and sales',
        'Offers and pricing',
        'Growth tests',
      ],
      connector: "We're looking for a Founding GTM / Venture Builder.",
    },
    role: {
      eyebrow: 'FOUNDING GTM / VENTURE BUILDER',
      title: 'Own go-to-market from zero.',
      roleName: 'Founding GTM / Venture Builder',
      intro:
        'Work across the portfolio. Find demand, get first customers and help decide what to push or stop.',
      notThis: [
        'No mature funnel.',
        'No sales team to manage.',
        'No finished product to simply sell.',
      ],
      ownershipLead: 'You own',
      ownership:
        'customer discovery, outbound, sales experiments and market signal.',
      fitTitle: 'Good fit if you…',
      fitItems: [
        'Have taken something from 0 to first customers.',
        'Talk to customers before building funnels.',
        'Can think strategically and still do the outreach yourself.',
        'Can kill a weak idea.',
      ],
      notFitTitle: 'Not a fit if you…',
      notFitItems: [
        'Want to manage a team from day one.',
        'Need product-market fit before you start selling.',
        'Default to paid ads before talking to customers.',
      ],
      closingTitle: 'Build the GTM side with us.',
      closingBody:
        "If you've sold something before the playbook existed, let's talk.",
      cta: "Let's talk",
      ctaSubject: 'Founding GTM / Venture Builder — stAI tuned Ventures',
    },
  },
  it: {
    hero: {
      eyebrow: 'stAI tuned / VENTURES',
      headlineTop: 'Costruiamo prodotti AI.',
      headlineAccent: 'Ora li portiamo sul mercato.',
      description:
        'Costruiamo prodotti funzionanti, li mettiamo davanti a utenti reali e capiamo in fretta quali meritano di crescere.',
      primaryCta: 'Vedi i prodotti',
      secondaryCta: 'Scopri il ruolo GTM',
      proof: ['Prodotti funzionanti', 'Validazione veloce', 'Focus 0→1'],
    },
    thesis: {
      eyebrow: 'LA DOMANDA',
      title: 'Cosa vale davvero la pena costruire?',
      body:
        'Costruiamo in fretta, parliamo con gli utenti e investiamo solo dove vediamo segnali reali.',
    },
    engine: {
      eyebrow: 'COME FUNZIONA',
      title: 'Dall’idea alla trazione.',
      subtitle: 'Costruiamo. Testiamo. Impariamo. Poi scaliamo o ci fermiamo.',
      steps: [
        { label: 'Idea', detail: 'Scegliamo un problema reale.', status: 'existing' },
        { label: 'Build', detail: 'Creiamo una prima versione usabile.', status: 'existing' },
        { label: 'Validate', detail: 'Parliamo con utenti e testiamo la domanda.', status: 'focus' },
        { label: 'Distribute', detail: 'Troviamo un canale che funziona.', status: 'focus' },
        { label: 'Scale', detail: 'Investiamo quando il segnale è chiaro.', status: 'next' },
      ],
      productSideLabel: 'Product / Engineering',
      gtmSideLabel: 'Founding GTM',
    },
    portfolio: {
      eyebrow: 'PRODOTTI',
      title: 'Cosa stiamo testando.',
      subtitle: 'Prodotti reali, in fasi diverse.',
      ventures: [
        {
          id: 'closedroom',
          title: 'ClosedRoom',
          proposition: 'AI privata per i meeting.',
          description:
            'Registra, trascrive e analizza meeting su Mac, tutto on-device. I dati restano locali.',
          stage: 'Prodotto costruito / validazione',
          tags: ['Local AI', 'macOS', 'Produttività'],
          visualLabel: 'Visual prodotto ClosedRoom',
          placeholderLabel: 'Placeholder visuale',
        },
        {
          id: 'harnex',
          title: 'Harnex',
          proposition: 'Il tuo local AI harness per Android.',
          description:
            'Esegui e confronta LLM locali su Android, su dispositivi reali.',
          stage: 'Validazione tecnica',
          tags: ['Local LLM', 'Android', 'Developer tooling'],
          visualLabel: 'Visual prodotto Harnex',
          placeholderLabel: 'Placeholder visuale',
        },
        {
          id: 'aura-finance',
          title: 'Aura Finance',
          proposition: 'Rendere più semplici le decisioni finanziarie.',
          description:
            'Un prodotto AI-native per la finanza ancora in discovery. Stiamo testando quali decisioni può semplificare.',
          stage: 'Discovery / validazione',
          tags: ['Fintech', 'AI', 'Decision support'],
          visualLabel: 'Visual prodotto Aura Finance',
          placeholderLabel: 'Placeholder visuale',
        },
      ],
      pipelineLabel: 'Altri esperimenti in corso',
      pipelineText:
        'Testiamo presto. Alcune idee crescono, altre si fermano.',
    },
    principles: {
      eyebrow: 'COME LAVORIAMO',
      title: 'Costruiamo. Testiamo. Decidiamo.',
      subtitle: 'Ogni step deve rispondere a una domanda.',
      items: [
        {
          number: '01',
          title: 'Costruire presto',
          description:
            'Mettiamo qualcosa di reale davanti agli utenti.',
        },
        {
          number: '02',
          title: 'Parlare col mercato',
          description:
            'Interviste, outbound, pricing e utilizzo prima del polish.',
        },
        {
          number: '03',
          title: 'Spingere o fermare',
          description:
            'Segnali forti: investiamo. Segnali deboli: passiamo oltre.',
        },
      ],
      killLine: 'Fermarsi fa parte del lavoro.',
      killDescription:
        'Non teniamo vivo un progetto solo perché lo abbiamo costruito.',
    },
    bridge: {
      eyebrow: 'COSA MANCA',
      title: 'La parte prodotto c’è. Ora serve il go-to-market.',
      existingTitle: 'C’è già',
      existingItems: [
        'Product engineering AI',
        'Prototipazione rapida',
        'Prodotti funzionanti',
        'Sperimentazione tecnica',
        'Budget per i primi test',
      ],
      missingTitle: 'Te ne occuperesti tu',
      missingItems: [
        'Scelta del mercato',
        'ICP',
        'Customer interview',
        'Outbound e sales',
        'Offerta e pricing',
        'Growth test',
      ],
      connector: 'Cerchiamo un Founding GTM / Venture Builder.',
    },
    role: {
      eyebrow: 'FOUNDING GTM / VENTURE BUILDER',
      title: 'Prendi in mano il go-to-market da zero.',
      roleName: 'Founding GTM / Venture Builder',
      intro:
        'Lavori sul portfolio, cerchi domanda, trovi i primi clienti e ci aiuti a decidere cosa spingere e cosa fermare.',
      notThis: [
        'Nessun funnel già pronto.',
        'Nessun team sales da gestire.',
        'Nessun prodotto finito da vendere e basta.',
      ],
      ownershipLead: 'Ti occupi di',
      ownership:
        'customer discovery, outbound, esperimenti di vendita e segnali di mercato.',
      fitTitle: 'Fa per te se…',
      fitItems: [
        'Hai portato qualcosa da 0 ai primi clienti.',
        'Parli con i clienti prima di costruire funnel.',
        'Sai pensare in grande e fare outreach in prima persona.',
        'Sai fermare un’idea debole.',
      ],
      notFitTitle: 'Non fa per te se…',
      notFitItems: [
        'Vuoi gestire un team dal giorno uno.',
        'Hai bisogno del PMF prima di vendere.',
        'Parti dalle ads prima di parlare con i clienti.',
      ],
      closingTitle: 'Costruiamo insieme il go-to-market.',
      closingBody:
        'Se hai già venduto qualcosa prima che esistesse un playbook, parliamone.',
      cta: 'Parliamone',
      ctaSubject: 'Founding GTM / Venture Builder — stAI tuned Ventures',
    },
  },
}
