export type BusinessLocale = 'it' | 'en'

export const BUSINESS_DEFAULT_LOCALE: BusinessLocale = 'it'
export const BUSINESS_QUERY_PARAM = 'lang'

export function normalizeBusinessLocale(value: unknown): BusinessLocale {
  if (typeof value !== 'string') return BUSINESS_DEFAULT_LOCALE
  return value.toLowerCase() === 'en' ? 'en' : 'it'
}

type HeroTranslation = {
  badge: string
  title: string
  highlight: string
  subtitle: string
  subtitleHighlights: string[]
  primaryCta: string
  secondaryCta: string
  trustSignals: Array<{
    title: string
    description: string
  }>
  priorityCard: {
    eyebrow: string
    title: string
    body: string
  }
  demoCard: {
    eyebrow: string
    title: string
    status: string
    focusLabel: string
    focusValue: string
    focusNote: string
    cards: Array<{
      title: string
      value: string
      description: string
    }>
    stepsTitle: string
    steps: string[]
    proofNote: string
  }
}

type MetricTranslation = {
  value: string
  label: string
  note: string
}

type ItemTranslation = {
  title: string
  description: string
}

type EvidenceTranslation = {
  value: string
  label: string
  note: string
  sourceLabel: string
  sourceHref: string
}

type ComparisonTranslation = {
  title: string
  bullets: string[]
  footer: string
}

type FlowStepTranslation = {
  title: string
  description: string
}

type FlowRoleKey = 'operator' | 'manager' | 'admin'

type FlowRoleTranslation = {
  label: string
  title: string
  summary: string
  highlights: string[]
}

type CurrentStateLaneTranslation = {
  role: string
  action: string
  tools: string[]
}

type FaqTranslation = {
  question: string
  answer: string
}

export interface BusinessTranslations {
  meta: {
    title: string
    description: string
    keywords: string[]
    openGraphLocale: string
  }
  localeToggle: {
    label: string
    italian: string
    english: string
  }
  breadcrumb: {
    home: string
    business: string
  }
  hero: HeroTranslation
  evidence: {
    eyebrow: string
    title: string
    items: EvidenceTranslation[]
    lead: string
  }
  painPoints: {
    eyebrow: string
    title: string
    items: ItemTranslation[]
  }
  currentState: {
    eyebrow: string
    title: string
    lead: string
    exampleLabel: string
    exampleTitle: string
    exampleBody: string
    exampleImageCaption: string
    riskLabels: string[]
    chaoticLabel: string
    chaoticTitle: string
    chaoticBody: string
    fragmentedToolsLabel: string
    fragmentedTools: string[]
    lanes: CurrentStateLaneTranslation[]
    centralizedLabel: string
    centralizedTitle: string
    centralizedBody: string
    centralizedPoints: string[]
    syncNote: string
  }
  metrics: {
    eyebrow: string
    title: string
    items: MetricTranslation[]
  }
  comparison: {
    eyebrow: string
    title: string
    before: ComparisonTranslation
    after: ComparisonTranslation
  }
  flow: {
    eyebrow: string
    title: string
    lead: string
    selectorLabel: string
    steps: FlowStepTranslation[]
    roles: Record<FlowRoleKey, FlowRoleTranslation>
  }
  useCases: {
    eyebrow: string
    title: string
    items: ItemTranslation[]
  }
  benefits: {
    eyebrow: string
    title: string
    lead: string
    items: Array<MetricTranslation & { progress: number }>
  }
  faq: {
    eyebrow: string
    title: string
    items: FaqTranslation[]
  }
  finalCta: {
    title: string
    description: string
    primaryCta: string
    secondaryCta: string
  }
}

export const businessTranslations: Record<BusinessLocale, BusinessTranslations> = {
  it: {
    meta: {
      title: 'Business Automation per HR/Admin e Operations',
      description:
        'Centralizza dati, richieste, approvazioni e controllo operativo in un unico flusso. Una pagina business stAItuned per PMI che vogliono eliminare rincorse manuali.',
      keywords: [
        'business automation PMI',
        'workflow HR admin',
        'centralizzazione dati aziendali',
        'automazione processi manuali',
        'rendicontazione ore operai',
        'approvazioni manager',
      ],
      openGraphLocale: 'it_IT',
    },
    localeToggle: {
      label: 'Lingua della pagina business',
      italian: 'Italiano',
      english: 'English',
    },
    breadcrumb: {
      home: 'Home',
      business: 'Business',
    },
    hero: {
      badge: 'Workflow business per PMI',
      title: 'File sparsi, Excel volanti, email disperse:',
      highlight: 'è lì che perdi tempo e controllo.',
      subtitle:
        'Centralizza le informazioni, semplifica le azioni operative e automatizza i passaggi manuali che oggi generano errori, rincorse e ritardi.',
      subtitleHighlights: [
        'Centralizza',
        'semplifica',
        'automatizza',
        'errori, rincorse e ritardi',
      ],
      primaryCta: 'Guarda come funzionerebbe nel tuo caso',
      secondaryCta: 'Vedi il flusso completo',
      trustSignals: [
        {
          title: 'Un solo flusso',
          description: 'Niente file sparsi e copie fuori controllo',
        },
        {
          title: 'Passaggi tracciati',
          description: 'Richieste, approvazioni e stati sempre visibili',
        },
        {
          title: 'Chiusura senza rincorse',
          description: 'Riconciliazioni pronte prima dell export',
        },
      ],
      priorityCard: {
        eyebrow: 'Use case concreto',
        title: 'Esempio HR/Admin: ore, assenze, approvazioni e payroll nello stesso flusso.',
        body:
          'Partiamo da un caso reale: prima canali sparsi e merge manuali, poi un workflow unico dal campo all export finale.',
      },
      demoCard: {
        eyebrow: 'Mappa operativa',
        title: 'Dal problema generale a un flusso operativo concreto.',
        status: 'Dove si crea il valore',
        focusLabel: 'Oggi da sbloccare',
        focusValue: '27 passaggi',
        focusNote: 'tra richieste pendenti, approvazioni in coda ed eccezioni amministrative.',
        cards: [
          {
            title: 'Nuove richieste',
            value: '18',
            description: 'entrate in un solo punto',
          },
          {
            title: 'Manager in coda',
            value: '6',
            description: 'con priorita e storico',
          },
          {
            title: 'Eccezioni admin',
            value: '3',
            description: 'da correggere prima della chiusura',
          },
          {
            title: 'Export pronti',
            value: '24',
            description: 'gia verificati e consolidati',
          },
        ],
        stepsTitle: 'Cosa rende la demo utile',
        steps: [
          'L operatore inserisce richiesta, ore e allegati.',
          'Il manager vede contesto, storico e priorita.',
          'L admin intercetta anomalie e blocchi operativi.',
          'L export finale parte da dati gia controllati.',
        ],
        proofNote: 'Non e un mock generico: la logica e costruita sui passaggi critici del processo HR/Admin.',
      },
    },
    evidence: {
      eyebrow: 'Perche questo problema conta',
      title: 'Il problema non è raro e non è marginale: molte aziende hanno strumenti digitali, ma non ancora un flusso governato.',
      items: [
        {
          value: '73%',
          label: 'PMI UE con intensita digitale almeno base nel 2024',
          note: 'Avere strumenti digitali non significa avere un workflow governato: molte PMI hanno software, ma non ancora un flusso unico affidabile.',
          sourceLabel: 'Fonte: Eurostat Digitalisation in Europe 2025',
          sourceHref: 'https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025',
        },
        {
          value: '58%',
          label: 'Tempo di lavoro assorbito da coordinamento e work about work',
          note: 'Quando manca uno stato condiviso, il team spende tempo in follow-up, riallineamenti e controlli invece che sull esecuzione.',
          sourceLabel: 'Fonte: Asana Anatomy of Work',
          sourceHref: 'https://asana.com/id/resources/pandemic-paradigm-shift',
        },
        {
          value: '5h/settimana',
          label: 'Tempo medio speso a cercare informazioni dai knowledge worker',
          note: 'Se il dato vive in troppi file e canali, il team non lavora sul processo: lavora per ritrovare il processo.',
          sourceLabel: 'Fonte: McKinsey High Tech Practice',
          sourceHref:
            'https://www.mckinsey.com/~/media/mckinsey/dotcom/client_service/high%20tech/pdfs/impact_of_internet_technologies_search_final2.ashx',
        },
      ],
      lead:
        'Il problema non è solo tecnologico. È organizzativo: quando dati, richieste e approvazioni vivono in strumenti diversi, il costo si sposta su coordinamento, ricerca di informazioni e controllo tardivo.',
    },
    painPoints: {
      eyebrow: 'Ti suona familiare?',
      title: 'Il problema non è il foglio. È tutto quello che gli gira intorno.',
      items: [
        {
          title: 'Richieste sparse',
          description: 'Ore, permessi e giustificativi arrivano via chat, email, telefonate o messaggi vocali.',
        },
        {
          title: 'File in piu versioni',
          description: 'Admin e manager lavorano su copie diverse e nessuno sa qual e quella aggiornata.',
        },
        {
          title: 'Riconciliazioni incoerenti',
          description: 'Ore, assenze e approvazioni non tornano tra sistemi e il controllo diventa tardivo.',
        },
        {
          title: 'Controllo a posteriori',
          description: 'Gli errori emergono solo a fine mese, quando serve chiudere paghe, report o commesse.',
        },
      ],
    },
    currentState: {
      eyebrow: 'Come lo abbiamo gia tradotto nel concreto',
      title: 'Un esempio reale: da processo HR/Admin frammentato a workflow unico gia modellato.',
      lead:
        'Partiamo da un caso gia messo a terra: ore, assenze, approvazioni e payroll gestiti su canali separati. Da qui mostriamo come lo stesso processo puo essere ridisegnato in un flusso unico, tracciato e governato per ruoli.',
      exampleLabel: 'Esempio reale di partenza',
      exampleTitle: 'Gestione HR di rendicontazione ore, approvazione e reportistica su sistemi separati.',
      exampleBody:
        'Dipendente, manager e HR lavorano su applicativi diversi. Poi i dati vengono scaricati in Excel, uniti con altri fogli, arricchiti con database separati e trasformati in ulteriori file per assenze e payroll.',
      exampleImageCaption:
        'Schema as-is: piu passaggi manuali, piu file e piu sistemi da allineare prima di arrivare a un dato affidabile.',
      riskLabels: ['Rischio errori alto', 'Incongruenze tra file', 'Controllo tardivo', 'Dipendenza da merge manuali'],
      chaoticLabel: 'Prima',
      chaoticTitle: 'Processo frammentato',
      chaoticBody:
        'Le informazioni passano tra chat, fogli, telefonate, allegati e sistemi diversi. Ogni ruolo vede solo un pezzo, quindi admin e operations ricostruiscono il contesto troppo tardi.',
      fragmentedToolsLabel: 'Canali che si accumulano',
      fragmentedTools: ['WhatsApp', 'Excel locali', 'Email con allegati', 'Chiamate e vocali', 'File condivisi', 'Tool separati'],
      lanes: [
        {
          role: 'Dipendente',
          action: 'Invia ore, note e assenze da canali diversi.',
          tools: ['WhatsApp', 'Telefono', 'Foglio'],
        },
        {
          role: 'Manager',
          action: 'Approva o corregge senza uno storico unico.',
          tools: ['Chat', 'Email', 'Conferma verbale'],
        },
        {
          role: 'Admin',
          action: 'Ricopia, verifica e unisce file prima di chiudere.',
          tools: ['Excel', 'Gestionale', 'Export'],
        },
      ],
      centralizedLabel: 'Dopo',
      centralizedTitle: 'Workflow centralizzato stAItuned',
      centralizedBody:
        'Un solo sistema raccoglie inserimento, approvazione, controllo e export. Web e mobile restano allineati, ogni passaggio ha uno stato e ogni ruolo vede solo quello che gli serve per agire.',
      centralizedPoints: [
        'Inserimento semplice da mobile per operatori e team sul campo',
        'Coda manager con contesto, motivazioni e storico approvazioni',
        'Controllo admin con anomalie, blocchi, documenti e consolidamento',
        'Dati sempre sincronizzati tra web, mobile e funzioni per ruolo',
      ],
      syncNote: 'Stesso dato, piu viste operative: campo, manager, admin e operations lavorano in tempo reale sullo stesso flusso.',
    },
    metrics: {
      eyebrow: 'Perche intervenire ora',
      title: 'Ogni passaggio manuale moltiplica ritardi, errori e lavoro amministrativo.',
      items: [
        { value: '1 sola', label: 'fonte dati operativa', note: 'per evitare doppie copie e rincorse manuali' },
        { value: '3 ruoli', label: 'coinvolti nello stesso flusso', note: 'operatore, manager, admin con responsabilita chiare' },
        { value: '0 passaggi', label: 'non tracciati', note: 'tutte le azioni devono lasciare uno stato e una data' },
      ],
    },
    comparison: {
      eyebrow: 'Prima vs dopo',
      title: 'Dal caos operativo al controllo quotidiano.',
      before: {
        title: 'Caso manuale',
        bullets: [
          'Operai che inviano ore e note in canali diversi.',
          'Manager che approvano a voce o inoltrando messaggi.',
          'Admin che ricopia dati e ricostruisce il contesto.',
          'Controlli finali lenti, con errori scoperti troppo tardi.',
        ],
        footer: 'Rincorse, eccezioni e lavoro invisibile.',
      },
      after: {
        title: 'Workflow centralizzato',
        bullets: [
          'Ogni richiesta nasce in un punto unico e segue stati chiari.',
          'Il manager approva con storico, contesto e motivazione.',
          'Admin vede tutto: ore, anomalie, blocchi e documenti.',
          'Export e controllo finale partono da dati gia verificati.',
        ],
        footer: 'Meno coordinamento, piu controllo operativo.',
      },
    },
    flow: {
      eyebrow: 'Demo del workflow',
      title: 'Come questo flusso prende forma operativamente, in 5 schermate.',
      lead: 'Seleziona un ruolo e guarda solo le schermate e le azioni che gli servono davvero.',
      selectorLabel: 'Vista per ruolo',
      steps: [
        {
          title: 'Richiesta operatore',
          description: 'Inserimento ore, note di lavoro e allegati dal campo o dall ufficio.',
        },
        {
          title: 'Coda del manager',
          description: 'Vista delle richieste pendenti con priorita, storico e segnalazioni.',
        },
        {
          title: 'Approva o correggi',
          description: 'Decisione rapida con motivazione e ritorno all operatore se manca qualcosa.',
        },
        {
          title: 'Controllo admin',
          description: 'Verifica completa di anomalie, documenti, ore extra e stati bloccanti.',
        },
        {
          title: 'Export finale',
          description: 'Dati pronti per paghe, reporting o contabilita senza ricopiare manualmente.',
        },
      ],
      roles: {
        operator: {
          label: 'Operatore',
          title: 'Inserimento semplice, dal campo al sistema.',
          summary: 'L operatore invia ore, note e allegati da mobile senza passare da chat, fogli o recap manuali.',
          highlights: [
            'Compila e invia in un solo punto',
            'Vede subito cosa e stato approvato o respinto',
            'Riduce messaggi dispersi e correzioni a fine mese',
          ],
        },
        manager: {
          label: 'Manager',
          title: 'Approvazione con contesto, non per rincorsa.',
          summary: 'Il manager lavora su una coda unica con stato, dettagli e storico, cosi puo approvare o correggere subito.',
          highlights: [
            'Richieste pendenti in una sola vista',
            'Storico e motivazioni sempre disponibili',
            'Decisione rapida senza cercare informazioni altrove',
          ],
        },
        admin: {
          label: 'Admin',
          title: 'Controllo finale su dati gia riconciliati.',
          summary: 'L admin verifica anomalie, consolidamento ed export partendo da un flusso gia tracciato e coerente.',
          highlights: [
            'Eccezioni e blocchi visibili prima della chiusura',
            'Stessa base dati per controllo ed export',
            'Meno merge manuali e meno errori in payroll',
          ],
        },
      },
    },
    useCases: {
      eyebrow: 'Dove lo applichiamo',
      title: 'Di solito partiamo da un flusso concreto, poi estendiamo la stessa logica ad altri processi.',
      items: [
        {
          title: 'Rendicontazione ore operai',
          description: 'Raccoglie ore, commesse, note e giustificativi in un flusso unico prima della chiusura mensile.',
        },
        {
          title: 'Permessi, assenze e straordinari',
          description: 'Sostituisce approvazioni informali con passaggi chiari e storico consultabile.',
        },
        {
          title: 'Onboarding documentale',
          description: 'Centralizza documenti mancanti, richieste di firma e controllo amministrativo.',
        },
        {
          title: 'Flussi multi-sede',
          description: 'Mantiene la stessa logica operativa anche quando manager e admin lavorano da sedi diverse.',
        },
      ],
    },
    benefits: {
      eyebrow: 'Impatto operativo',
      title: 'Quando il flusso è unico, il controllo arriva prima.',
      lead:
        'Questi sono i segnali che contano davvero: piu visibilita, meno lavoro manuale, approvazioni piu rapide.',
      items: [
        { value: '+85%', label: 'visibilita operativa', note: 'stato chiaro delle richieste in ogni momento', progress: 85 },
        { value: '-70%', label: 'lavoro manuale amministrativo', note: 'meno copia-incolla e meno ricostruzioni finali', progress: 70 },
        { value: '+60%', label: 'velocita di approvazione', note: 'il manager decide con contesto e storico', progress: 60 },
        { value: '+1', label: 'vista unica', note: 'piu dati centralizzati per admin e operations', progress: 92 },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Domande tipiche prima di partire con una demo.',
      items: [
        {
          question: 'Si parte da zero o dalla demo esistente?',
          answer:
            'Partiamo dalla demo gia validata in ambito HR/Admin e la adattiamo al tuo processo reale: campi, ruoli, stati, regole di approvazione e output finali.',
        },
        {
          question: 'Serve cambiare tutti i sistemi esistenti?',
          answer:
            'No. Il punto iniziale e togliere attrito dai passaggi manuali. Possiamo partire su un flusso circoscritto e poi collegarlo agli strumenti gia presenti.',
        },
        {
          question: 'Chi usa davvero la soluzione?',
          answer:
            'Gli operatori inseriscono dati e allegati, i manager approvano o correggono, l admin controlla eccezioni, blocchi ed export finale.',
        },
        {
          question: 'Quanto velocemente si vede qualcosa di concreto?',
          answer:
            'L obiettivo e mostrare un workflow funzionante in tempi brevi, con dati e schermate che riflettono il processo operativo reale della tua azienda.',
        },
      ],
    },
    finalCta: {
      title: 'Ti mostro in 20 minuti come questo flusso puo funzionare nel tuo caso.',
      description:
        'Nessun impianto teorico: partiamo dal tuo processo attuale, individuiamo dove si spezza e ti faccio vedere come centralizzarlo.',
      primaryCta: 'Prenota la tua demo',
      secondaryCta: 'Vai alla pagina demo',
    },
  },
  en: {
    meta: {
      title: 'Business Automation for HR/Admin and Operations',
      description:
        'Centralize requests, approvals, time entries and operational control in one workflow. A stAItuned business page for SMEs that want to remove manual chase work.',
      keywords: [
        'business automation for SMEs',
        'HR admin workflow',
        'business data centralization',
        'manual process automation',
        'worker timesheet automation',
        'manager approval workflow',
      ],
      openGraphLocale: 'en_US',
    },
    localeToggle: {
      label: 'Business page language',
      italian: 'Italiano',
      english: 'English',
    },
    breadcrumb: {
      home: 'Home',
      business: 'Business',
    },
    hero: {
      badge: 'Business workflows for SMEs',
      title: 'Scattered files, flying spreadsheets, lost emails:',
      highlight: 'that is where time and control disappear.',
      subtitle:
        'Centralize information, simplify operational actions, and automate the manual handoffs that create errors, chasing and delays today.',
      subtitleHighlights: [
        'Centralize information',
        'simplify operational actions',
        'automate the manual handoffs',
        'errors, chasing and delays',
      ],
      primaryCta: 'See how this would work in your process',
      secondaryCta: 'See the full workflow',
      trustSignals: [
        {
          title: 'One flow',
          description: 'No scattered files or uncontrolled copies',
        },
        {
          title: 'Tracked handoffs',
          description: 'Requests, approvals and states always visible',
        },
        {
          title: 'Close without chasing',
          description: 'Reconciliation ready before export',
        },
      ],
      priorityCard: {
        eyebrow: 'Concrete use case',
        title: 'HR/Admin example: time, absences, approvals and payroll in one flow.',
        body:
          'We start from a real scenario: scattered channels and manual merges today, one workflow from field entry to final export tomorrow.',
      },
      demoCard: {
        eyebrow: 'Operational map',
        title: 'From broad problem to one concrete operating flow.',
        status: 'Where value is created',
        focusLabel: 'Items to unblock today',
        focusValue: '27 handoffs',
        focusNote: 'across pending requests, queued approvals and admin exceptions.',
        cards: [
          {
            title: 'New requests',
            value: '18',
            description: 'arriving in one intake point',
          },
          {
            title: 'Manager queue',
            value: '6',
            description: 'with priority and history',
          },
          {
            title: 'Admin exceptions',
            value: '3',
            description: 'to fix before closing',
          },
          {
            title: 'Exports ready',
            value: '24',
            description: 'already validated and consolidated',
          },
        ],
        stepsTitle: 'Why the demo matters',
        steps: [
          'Workers submit requests, hours and files.',
          'Managers review with context, history and priority.',
          'Admin catches anomalies and operational blockers.',
          'Final export starts from data already checked.',
        ],
        proofNote: 'This is not a generic mockup: the logic is built around the critical handoffs in HR/Admin operations.',
      },
    },
    evidence: {
      eyebrow: 'Why this problem matters',
      title: 'This is not a niche issue: many companies have digital tools, but still no governed workflow.',
      items: [
        {
          value: '73%',
          label: 'EU SMEs reaching at least basic digital intensity in 2024',
          note: 'Having digital tools does not mean having a governed workflow: many SMEs have software, but still no reliable shared flow.',
          sourceLabel: 'Source: Eurostat Digitalisation in Europe 2025',
          sourceHref: 'https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025',
        },
        {
          value: '58%',
          label: 'Work time absorbed by coordination and work about work',
          note: 'Without a shared status model, teams spend time on follow-ups, alignment loops and checks instead of execution.',
          sourceLabel: 'Source: Asana Anatomy of Work',
          sourceHref: 'https://asana.com/id/resources/pandemic-paradigm-shift',
        },
        {
          value: '5h/week',
          label: 'Average time knowledge workers spend searching for information',
          note: 'When data lives across too many files and channels, teams are working to reconstruct the process before they can improve it.',
          sourceLabel: 'Source: McKinsey High Tech Practice',
          sourceHref:
            'https://www.mckinsey.com/~/media/mckinsey/dotcom/client_service/high%20tech/pdfs/impact_of_internet_technologies_search_final2.ashx',
        },
      ],
      lead:
        'This is not only a tooling issue. It is an operating model issue: when data, requests and approvals live in different tools, the cost shows up as coordination overhead, search time and late control.',
    },
    painPoints: {
      eyebrow: 'Does this sound familiar?',
      title: 'The issue is not the spreadsheet. It is everything growing around it.',
      items: [
        {
          title: 'Scattered requests',
          description: 'Hours, leave requests and supporting files arrive through chat, email, calls and voice notes.',
        },
        {
          title: 'Multiple file versions',
          description: 'Admin and managers work on different copies and nobody knows which one is current.',
        },
        {
          title: 'Unreliable reconciliation',
          description: 'Hours, absences and approvals diverge across systems and control arrives late.',
        },
        {
          title: 'Late control',
          description: 'Issues show up only at the end of the month, when payroll, reporting or job costing must close.',
        },
      ],
    },
    currentState: {
      eyebrow: 'How we already translated this into a concrete flow',
      title: 'One real example: from fragmented HR/Admin process to one modeled workflow.',
      lead:
        'We start from a case already modeled: time, absences, approvals and payroll handled across separate channels. From there, we show how the same process can be redesigned into one tracked flow managed by roles.',
      exampleLabel: 'Real starting example',
      exampleTitle: 'HR time reporting, approval and reporting spread across separate systems.',
      exampleBody:
        'Workers, managers and HR each operate in different applications. Then data gets exported to spreadsheets, merged with other files, enriched with separate databases and turned into even more files for absences and payroll.',
      exampleImageCaption:
        'As-is diagram: more manual handoffs, more files and more systems to align before data becomes reliable.',
      riskLabels: ['High error risk', 'File inconsistencies', 'Late control', 'Manual merge dependency'],
      chaoticLabel: 'Before',
      chaoticTitle: 'Fragmented process',
      chaoticBody:
        'Information moves through chat, spreadsheets, calls, files and separate systems. Each role only sees one slice, so admin and operations rebuild context too late.',
      fragmentedToolsLabel: 'Channels that pile up',
      fragmentedTools: ['WhatsApp', 'Local spreadsheets', 'Email attachments', 'Calls and voice notes', 'Shared files', 'Separate tools'],
      lanes: [
        {
          role: 'Employee',
          action: 'Sends hours, notes and absences through different channels.',
          tools: ['WhatsApp', 'Phone', 'Sheet'],
        },
        {
          role: 'Manager',
          action: 'Approves or corrects without one shared history.',
          tools: ['Chat', 'Email', 'Verbal confirmation'],
        },
        {
          role: 'Admin',
          action: 'Retypes, checks and merges files before closing.',
          tools: ['Excel', 'Back office tool', 'Export'],
        },
      ],
      centralizedLabel: 'After',
      centralizedTitle: 'Centralized stAItuned workflow',
      centralizedBody:
        'One system handles submission, approval, control and export. Web and mobile stay aligned, every handoff has a status, and each role sees exactly what it needs to act.',
      centralizedPoints: [
        'Simple mobile entry for workers and field teams',
        'Manager queue with context, reasons and approval history',
        'Admin control for anomalies, blockers, documents and consolidation',
        'Data always synchronized across web, mobile and role-based views',
      ],
      syncNote: 'One shared dataset, multiple operational views: field, manager, admin and operations work in real time on the same flow.',
    },
    metrics: {
      eyebrow: 'Why fix it now',
      title: 'Every manual handoff multiplies delays, errors and admin workload.',
      items: [
        { value: '1 single', label: 'operational data source', note: 'to avoid duplicate copies and chase work' },
        { value: '3 roles', label: 'inside the same flow', note: 'worker, manager and admin with clear responsibilities' },
        { value: '0 hidden', label: 'workflow steps', note: 'every action should leave a status and a timestamp' },
      ],
    },
    comparison: {
      eyebrow: 'Before vs after',
      title: 'From operational chaos to daily control.',
      before: {
        title: 'Manual setup',
        bullets: [
          'Workers send hours and notes through different channels.',
          'Managers approve verbally or by forwarding messages.',
          'Admin retypes data and rebuilds missing context.',
          'Final checks are slow, with issues discovered too late.',
        ],
        footer: 'Chasing, exceptions and invisible work.',
      },
      after: {
        title: 'Centralized workflow',
        bullets: [
          'Every request starts in one place and moves through explicit states.',
          'Managers approve with history, context and a reason.',
          'Admin sees everything: hours, anomalies, blockers and files.',
          'Final export starts from data that was already validated.',
        ],
        footer: 'Less coordination overhead, more operational control.',
      },
    },
    flow: {
      eyebrow: 'Workflow demo',
      title: 'How this flow takes shape operationally, in 5 screens.',
      lead: 'Select a role and see only the screens and actions that matter to that person.',
      selectorLabel: 'Role-based view',
      steps: [
        {
          title: 'Worker request',
          description: 'Time entry, work notes and attachments from the field or office.',
        },
        {
          title: 'Manager queue',
          description: 'Pending requests view with priorities, history and alerts.',
        },
        {
          title: 'Approve or correct',
          description: 'Fast decision with a reason and return to the worker if something is missing.',
        },
        {
          title: 'Admin control',
          description: 'Full review of anomalies, files, overtime and blocking states.',
        },
        {
          title: 'Final export',
          description: 'Data ready for payroll, reporting or accounting without manual re-entry.',
        },
      ],
      roles: {
        operator: {
          label: 'Worker',
          title: 'Simple entry, from the field into the system.',
          summary: 'The worker submits time, notes and attachments from mobile without relying on chats, sheets or manual relays.',
          highlights: [
            'Submits everything in one place',
            'Sees immediately what was approved or rejected',
            'Less scattered messaging and end-of-month fixes',
          ],
        },
        manager: {
          label: 'Manager',
          title: 'Approval with context, not by chasing updates.',
          summary: 'The manager works from one queue with status, details and history, so approval or correction happens immediately.',
          highlights: [
            'Pending requests in one view',
            'History and reasons always available',
            'Faster decisions without looking elsewhere',
          ],
        },
        admin: {
          label: 'Admin',
          title: 'Final control on already reconciled data.',
          summary: 'Admin reviews anomalies, consolidation and export starting from a tracked and coherent workflow.',
          highlights: [
            'Exceptions and blockers visible before close',
            'Same data base for control and export',
            'Less manual merging and fewer payroll errors',
          ],
        },
      },
    },
    useCases: {
      eyebrow: 'Where we apply it',
      title: 'We usually start from one concrete workflow, then extend the same logic to adjacent processes.',
      items: [
        {
          title: 'Worker time reporting',
          description: 'Collects hours, jobs, notes and support files in one flow before monthly close.',
        },
        {
          title: 'Leave, absences and overtime',
          description: 'Replaces informal approvals with explicit steps and searchable history.',
        },
        {
          title: 'Document onboarding',
          description: 'Centralizes missing files, signature requests and admin validation.',
        },
        {
          title: 'Multi-site operations',
          description: 'Keeps the same workflow logic when managers and admin work across locations.',
        },
      ],
    },
    benefits: {
      eyebrow: 'Operational impact',
      title: 'When the workflow is unified, control arrives earlier.',
      lead:
        'These are the signals that actually matter: more visibility, less manual work, faster approvals.',
      items: [
        { value: '+85%', label: 'operational visibility', note: 'clear request status at any moment', progress: 85 },
        { value: '-70%', label: 'manual admin work', note: 'less copy-paste and less end-of-month reconstruction', progress: 70 },
        { value: '+60%', label: 'approval speed', note: 'managers decide with context and history', progress: 60 },
        { value: '+1', label: 'single control view', note: 'more centralized data for admin and operations', progress: 92 },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Typical questions before starting with a demo.',
      items: [
        {
          question: 'Do we start from scratch or from an existing demo?',
          answer:
            'We start from the HR/Admin demo already validated and adapt it to your real process: fields, roles, statuses, approval rules and final outputs.',
        },
        {
          question: 'Do we need to replace all existing systems?',
          answer:
            'No. The first goal is to remove friction from manual handoffs. We can start with one scoped workflow and connect it later to the tools you already use.',
        },
        {
          question: 'Who actually uses the solution?',
          answer:
            'Workers submit data and attachments, managers approve or correct, and admin controls exceptions, blockers and the final export.',
        },
        {
          question: 'How fast can we see something concrete?',
          answer:
            'The goal is to show a working workflow quickly, using data and screens that reflect the real operational process of your company.',
        },
      ],
    },
    finalCta: {
      title: 'In 20 minutes I can show how this flow would work in your case.',
      description:
        'No theoretical deck. We start from your current process, identify where it breaks, and show how to centralize it.',
      primaryCta: 'Book your demo',
      secondaryCta: 'Go to the demo page',
    },
  },
}
