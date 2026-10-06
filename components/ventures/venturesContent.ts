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
      headlineAccent: 'Now we want to make them win.',
      description:
        'We are building and testing a portfolio of AI-native products. Product and engineering are already moving. The next challenge is validation, distribution and growth.',
      primaryCta: "Explore what we're building",
      secondaryCta: 'Founding GTM opportunity',
      proof: ['AI-native products', 'Working software', '0→1 focus'],
    },
    thesis: {
      eyebrow: 'THE BOTTLENECK',
      title: "Shipping isn't the problem. Knowing what deserves to win is.",
      body:
        'Fast product execution only matters if it is paired with equally fast market learning. The goal is not to build more ideas. It is to discover which ideas deserve more capital, time and attention.',
    },
    engine: {
      eyebrow: 'THE VENTURE ENGINE',
      title: 'A repeatable path from idea to evidence.',
      subtitle:
        'The sequence is simple; the decisions are not. We build enough to learn, test the highest-risk assumptions and only scale what earns the right to continue.',
      steps: [
        { label: 'Idea', detail: 'Select a sharp problem worth testing.', status: 'existing' },
        { label: 'Build', detail: 'Create working software fast enough to learn.', status: 'existing' },
        { label: 'Validate', detail: 'Test ICP, pain, willingness to pay and usage.', status: 'focus' },
        { label: 'Distribute', detail: 'Find repeatable channels and commercial motion.', status: 'focus' },
        { label: 'Scale', detail: 'Invest only when evidence compounds.', status: 'next' },
      ],
      productSideLabel: 'Product / Engineering',
      gtmSideLabel: 'Founding GTM',
    },
    portfolio: {
      eyebrow: 'WHAT WE ARE BUILDING',
      title: 'Products first. Narratives second.',
      subtitle:
        'The portfolio is the proof. Each venture starts from a concrete problem and advances only when the next assumption is worth testing.',
      ventures: [
        {
          id: 'closedroom',
          title: 'ClosedRoom',
          proposition: 'Private AI for meetings.',
          description:
            'A Mac application for recording, transcribing and analysing meetings entirely on-device, designed around privacy by architecture rather than policy alone.',
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
            'A practical environment to run, compare and understand local language models directly on Android, with a focus on real device constraints and transparent benchmarking.',
          stage: 'Technical validation',
          tags: ['Local LLM', 'Android', 'Developer tooling'],
          visualLabel: 'Harnex product visual',
          placeholderLabel: 'Visual placeholder',
        },
        {
          id: 'aura-finance',
          title: 'Aura Finance',
          proposition: 'Exploring a clearer interface for financial intelligence.',
          description:
            'An AI-native finance venture in discovery, focused on reducing the friction between complex financial information and useful decisions. Positioning remains intentionally open while the highest-risk assumptions are tested.',
          stage: 'Discovery / validation',
          tags: ['Fintech', 'AI', 'Decision support'],
          visualLabel: 'Aura Finance product visual',
          placeholderLabel: 'Visual placeholder',
        },
      ],
      pipelineLabel: '+ experiments in the pipeline',
      pipelineText:
        'Not every experiment should become a company. A strong venture engine is also a disciplined way to stop building the wrong thing.',
    },
    principles: {
      eyebrow: 'HOW WE DECIDE',
      title: 'Build to learn, not to accumulate projects.',
      subtitle:
        'Every venture should reduce uncertainty. The process is designed to surface evidence before complexity becomes expensive.',
      items: [
        {
          number: '01',
          title: 'Build enough to learn',
          description:
            'Move beyond decks quickly. Put something usable in front of the market and observe what changes when the product becomes real.',
        },
        {
          number: '02',
          title: 'Test the uncomfortable assumptions',
          description:
            'Customer interviews, outbound, pricing, willingness to pay and usage signals come before polishing a story around the product.',
        },
        {
          number: '03',
          title: 'Double down or kill it',
          description:
            'Speed is valuable because it lets us reallocate attention. Strong evidence earns investment; weak evidence earns a stop.',
        },
      ],
      killLine: 'We kill ideas too.',
      killDescription:
        'The goal is not to protect every project. It is to make better allocation decisions earlier.',
    },
    bridge: {
      eyebrow: 'THE MISSING HALF',
      title: 'The technical machine is moving. The commercial machine is the next build.',
      existingTitle: 'What already exists',
      existingItems: [
        'AI / ML product engineering',
        'Rapid prototyping',
        'Technical experimentation',
        'Working ventures to test',
        'A bias toward shipping',
      ],
      missingTitle: 'What needs an owner',
      missingItems: [
        'Market selection',
        'ICP discovery',
        'Customer interviews',
        'Outbound and founder-led sales',
        'Offer and pricing design',
        'Growth experiments',
      ],
      connector: "That's why we're looking for a Founding GTM / Venture Builder.",
    },
    role: {
      eyebrow: 'FOUNDING GTM / VENTURE BUILDER',
      title: 'Become the commercial half of the machine.',
      roleName: 'Founding GTM / Venture Builder',
      intro:
        'This is a zero-to-one operating role. You would work across the venture portfolio, helping decide what to validate, who to sell to, what to stop and where to double down.',
      notThis: [
        "You won't inherit a mature funnel.",
        "You won't manage an existing sales team on day one.",
        "You won't receive a finished product and a quota.",
      ],
      ownershipLead: 'You will have ownership over',
      ownership:
        'market learning, customer conversations, commercial experiments and the evidence that determines what the venture engine does next.',
      fitTitle: 'This is probably for you if…',
      fitItems: [
        'You have taken something from 0 to first customers.',
        'You would rather speak to 20 customers than optimise a 200-step funnel too early.',
        'You can think strategically and still send the first outbound messages yourself.',
        'You are comfortable saying: this idea is not working.',
        'You want ownership more than a pre-written roadmap.',
      ],
      notFitTitle: 'Probably not for you if…',
      notFitItems: [
        'Paid acquisition is your default answer before customer learning.',
        'You want a team to manage from day one.',
        'You prefer optimising an established machine to discovering one.',
        'You need product-market fit before you start selling.',
      ],
      closingTitle: 'The technical half exists. Let’s build the other half.',
      closingBody:
        "If you've built, sold or grown something before it was obvious it would work, we should probably talk.",
      cta: 'Start a conversation',
      ctaSubject: 'Founding GTM / Venture Builder — stAI tuned Ventures',
    },
  },
  it: {
    hero: {
      eyebrow: 'stAI tuned / VENTURES',
      headlineTop: 'Costruiamo prodotti AI.',
      headlineAccent: 'Ora vogliamo farli vincere.',
      description:
        'Stiamo costruendo e testando un portfolio di prodotti AI-native. Product ed engineering sono già in movimento. La prossima sfida è validazione, distribuzione e crescita.',
      primaryCta: 'Scopri cosa stiamo costruendo',
      secondaryCta: 'Opportunità Founding GTM',
      proof: ['Prodotti AI-native', 'Software funzionante', 'Focus 0→1'],
    },
    thesis: {
      eyebrow: 'IL COLLO DI BOTTIGLIA',
      title: 'Costruire non è il problema. Capire cosa merita di vincere sì.',
      body:
        'L’esecuzione veloce sul prodotto conta solo se è accompagnata da apprendimento di mercato altrettanto veloce. L’obiettivo non è costruire più idee: è capire quali meritano più capitale, tempo e attenzione.',
    },
    engine: {
      eyebrow: 'THE VENTURE ENGINE',
      title: 'Un percorso ripetibile dall’idea all’evidenza.',
      subtitle:
        'La sequenza è semplice; le decisioni no. Costruiamo quanto basta per imparare, testiamo le assunzioni più rischiose e scaliamo solo ciò che si guadagna il diritto di continuare.',
      steps: [
        { label: 'Idea', detail: 'Selezionare un problema netto che valga la pena testare.', status: 'existing' },
        { label: 'Build', detail: 'Creare software funzionante abbastanza in fretta da imparare.', status: 'existing' },
        { label: 'Validate', detail: 'Testare ICP, pain, willingness to pay e utilizzo.', status: 'focus' },
        { label: 'Distribute', detail: 'Trovare canali e motion commerciali ripetibili.', status: 'focus' },
        { label: 'Scale', detail: 'Investire solo quando le evidenze si accumulano.', status: 'next' },
      ],
      productSideLabel: 'Product / Engineering',
      gtmSideLabel: 'Founding GTM',
    },
    portfolio: {
      eyebrow: 'COSA STIAMO COSTRUENDO',
      title: 'Prima i prodotti. Poi la narrativa.',
      subtitle:
        'Il portfolio è la prova. Ogni venture parte da un problema concreto e avanza solo quando la prossima assunzione merita davvero di essere testata.',
      ventures: [
        {
          id: 'closedroom',
          title: 'ClosedRoom',
          proposition: 'AI privata per i meeting.',
          description:
            'Un’app Mac per registrare, trascrivere e analizzare meeting interamente on-device, progettata attorno alla privacy per architettura e non soltanto per policy.',
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
            'Un ambiente pratico per eseguire, confrontare e comprendere modelli linguistici locali direttamente su Android, con attenzione ai vincoli reali del device e a benchmark trasparenti.',
          stage: 'Validazione tecnica',
          tags: ['Local LLM', 'Android', 'Developer tooling'],
          visualLabel: 'Visual prodotto Harnex',
          placeholderLabel: 'Placeholder visuale',
        },
        {
          id: 'aura-finance',
          title: 'Aura Finance',
          proposition: 'Esplorare un’interfaccia più chiara per l’intelligenza finanziaria.',
          description:
            'Una venture AI-native in ambito finance ancora in discovery, focalizzata sul ridurre la distanza tra informazione finanziaria complessa e decisioni utili. Il posizionamento resta volutamente aperto mentre vengono testate le assunzioni più rischiose.',
          stage: 'Discovery / validazione',
          tags: ['Fintech', 'AI', 'Decision support'],
          visualLabel: 'Visual prodotto Aura Finance',
          placeholderLabel: 'Placeholder visuale',
        },
      ],
      pipelineLabel: '+ esperimenti in pipeline',
      pipelineText:
        'Non ogni esperimento deve diventare un’azienda. Un buon venture engine serve anche a smettere in modo disciplinato di costruire la cosa sbagliata.',
    },
    principles: {
      eyebrow: 'COME DECIDIAMO',
      title: 'Costruiamo per imparare, non per accumulare progetti.',
      subtitle:
        'Ogni venture deve ridurre l’incertezza. Il processo serve a far emergere evidenze prima che la complessità diventi costosa.',
      items: [
        {
          number: '01',
          title: 'Build enough to learn',
          description:
            'Andare oltre i deck rapidamente. Mettere qualcosa di utilizzabile davanti al mercato e osservare cosa cambia quando il prodotto diventa reale.',
        },
        {
          number: '02',
          title: 'Testare le assunzioni scomode',
          description:
            'Customer interview, outbound, pricing, willingness to pay e segnali di utilizzo vengono prima della rifinitura della narrativa.',
        },
        {
          number: '03',
          title: 'Double down o kill',
          description:
            'La velocità è utile perché permette di riallocare l’attenzione. Evidenze forti meritano investimento; evidenze deboli meritano uno stop.',
        },
      ],
      killLine: 'Sappiamo anche uccidere le idee.',
      killDescription:
        'L’obiettivo non è proteggere ogni progetto. È prendere prima decisioni migliori su dove allocare tempo e capitale.',
    },
    bridge: {
      eyebrow: 'LA METÀ MANCANTE',
      title: 'La macchina tecnica si muove già. La macchina commerciale è il prossimo pezzo da costruire.',
      existingTitle: 'Cosa esiste già',
      existingItems: [
        'Product engineering AI / ML',
        'Rapid prototyping',
        'Sperimentazione tecnica',
        'Venture funzionanti da testare',
        'Bias verso lo shipping',
      ],
      missingTitle: 'Cosa ha bisogno di un owner',
      missingItems: [
        'Market selection',
        'ICP discovery',
        'Customer interview',
        'Outbound e founder-led sales',
        'Offer e pricing design',
        'Growth experiment',
      ],
      connector: 'Per questo stiamo cercando un Founding GTM / Venture Builder.',
    },
    role: {
      eyebrow: 'FOUNDING GTM / VENTURE BUILDER',
      title: 'Diventa la metà commerciale della macchina.',
      roleName: 'Founding GTM / Venture Builder',
      intro:
        'È un ruolo operativo zero-to-one. Lavoreresti trasversalmente sul portfolio, aiutando a decidere cosa validare, a chi vendere, cosa fermare e dove raddoppiare la scommessa.',
      notThis: [
        'Non erediterai un funnel maturo.',
        'Non gestirai un team sales esistente dal giorno uno.',
        'Non riceverai un prodotto finito e una quota da raggiungere.',
      ],
      ownershipLead: 'Avrai ownership su',
      ownership:
        'market learning, conversazioni con i clienti, esperimenti commerciali e sulle evidenze che determinano cosa farà dopo il venture engine.',
      fitTitle: 'Probabilmente fa per te se…',
      fitItems: [
        'Hai portato qualcosa da 0 ai primi clienti.',
        'Preferisci parlare con 20 clienti invece di ottimizzare troppo presto un funnel da 200 step.',
        'Sai ragionare strategicamente e inviare tu stesso i primi messaggi outbound.',
        'Sai dire: questa idea non sta funzionando.',
        'Cerchi ownership più di una roadmap già scritta.',
      ],
      notFitTitle: 'Probabilmente non fa per te se…',
      notFitItems: [
        'Il paid acquisition è la tua risposta di default prima del customer learning.',
        'Vuoi un team da gestire dal giorno uno.',
        'Preferisci ottimizzare una macchina esistente invece di scoprirne una.',
        'Hai bisogno del product-market fit prima di iniziare a vendere.',
      ],
      closingTitle: 'La metà tecnica esiste. Costruiamo l’altra metà.',
      closingBody:
        'Se hai costruito, venduto o fatto crescere qualcosa prima che fosse ovvio che avrebbe funzionato, probabilmente dovremmo parlare.',
      cta: 'Parliamone',
      ctaSubject: 'Founding GTM / Venture Builder — stAI tuned Ventures',
    },
  },
}
