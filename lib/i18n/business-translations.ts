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
  positioning: string
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

type BusinessRequestFieldTranslations = {
  name: string
  email: string
  company: string
  role: string
  processName: string
  mainPain: string
  notes: string
  privacyLabelPrefix: string
  privacyPolicy: string
  submit: string
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
    closing: string
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
    asIsIntro: string
    toBeIntro: string
    transitionCue: string
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
    lead: string
    patternsTitle: string
    patterns: string[]
    items: ItemTranslation[]
    closing: string
    ctas: Array<{
      title: string
      action: string
    }>
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
  requestSection: {
    eyebrow: string
    title: string
    description: string
    bullets: string[]
    formTitle: string
    formDescription: string
    successTitle: string
    successSubtitle: string
    resetCta: string
    fields: BusinessRequestFieldTranslations
    placeholders: {
      role: string
      processName: string
      mainPain: string
      notes: string
    }
    errors: {
      nameRequired: string
      emailRequired: string
      invalidEmail: string
      companyRequired: string
      processNameRequired: string
      mainPainRequired: string
      privacyRequired: string
      submitFailed: string
    }
  }
  apiErrors: {
    apply: {
      nameRequired: string
      invalidEmail: string
      companyRequired: string
      processNameRequired: string
      mainPainRequired: string
      privacyRequired: string
      serverError: string
      notConfigured: string
    }
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
      positioning:
        'stAI tuned trasforma processi operativi gestiti tra Excel, email e chat in workflow unificati, tracciati e pronti all azione.',
      primaryCta: 'Guarda cosa potresti fare',
      secondaryCta: 'Candidati per una demo',
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
          description: 'Riconciliazioni pronte prima dell’export',
        },
      ],
      priorityCard: {
        eyebrow: 'Use case concreto',
        title: 'Esempio HR/Admin: ore, assenze, approvazioni e payroll nello stesso flusso.',
        body:
          'Partiamo da un caso reale: prima canali sparsi e merge manuali, poi un workflow unico dal campo all’export finale.',
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
            description: 'con priorità e storico',
          },
          {
            title: 'Eccezioni admin',
            value: '3',
            description: 'da correggere prima della chiusura',
          },
          {
            title: 'Export pronti',
            value: '24',
            description: 'già verificati e consolidati',
          },
        ],
        stepsTitle: 'Cosa rende la demo utile',
        steps: [
          'L’operatore inserisce richiesta, ore e allegati.',
          'Il manager vede contesto, storico e priorità.',
          'L’admin intercetta anomalie e blocchi operativi.',
          'L’export finale parte da dati già controllati.',
        ],
        proofNote: 'Non è un mock generico: la logica è costruita sui passaggi critici del processo HR/Admin.',
      },
    },
    evidence: {
      eyebrow: 'Perché questo problema conta',
      title: 'Il problema è strutturale, non episodico.',
      items: [
        {
          value: '73%',
          label: 'PMI UE con intensita digitale almeno base, ancora sotto il target UE 2030.',
          note: 'La presenza di tool non basta se il processo resta frammentato.',
          sourceLabel: 'Fonte: Eurostat Digitalisation in Europe 2025',
          sourceHref: 'https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025',
        },
        {
          value: '76,1%',
          label: 'PMI UE ancora a livello low o very low di intensita digitale nel 2023.',
          note: 'Il gap non è solo adottare software, ma collegare ruoli e dati nello stesso flusso.',
          sourceLabel: 'Fonte: Digital Decade 2024',
          sourceHref: 'https://digital-strategy.ec.europa.eu/en/library/digital-decade-2024-strategic-foresight-report',
        },
        {
          value: '60%',
          label: 'Del tempo lavorativo assorbito da coordinamento, follow-up e lavoro accessorio.',
          note: 'Quando gli stati non sono condivisi, il tempo va in rincorse invece che in chiusura operativa.',
          sourceLabel: 'Fonte: McKinsey High Tech Practice',
          sourceHref:
            'https://www.mckinsey.com/~/media/mckinsey/dotcom/client_service/high%20tech/pdfs/impact_of_internet_technologies_search_final2.ashx',
        },
      ],
      lead:
        'Molte PMI lavorano ancora con processi frammentati, strumenti scollegati e coordinamento manuale.',
      closing:
        'Quando dati, richieste e approvazioni vivono in posti diversi, il lavoro non scala: si frammenta.',
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
          description: 'Admin e manager lavorano su copie diverse e nessuno sa qual è quella aggiornata.',
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
      eyebrow: 'Come lo abbiamo già tradotto nel concreto',
      title: 'Un esempio reale: da processo HR/Admin frammentato a workflow unico già modellato.',
      lead:
        'Un caso concreto, letto in pochi secondi: prima le rotture del flusso, poi lo stesso processo ricomposto in un sistema unico.',
      exampleLabel: 'Esempio reale di partenza',
      exampleTitle: 'Gestione HR di rendicontazione ore, approvazione e reportistica su sistemi separati.',
      exampleBody:
        'Dipendente, manager e HR lavorano su applicativi diversi. Poi i dati vengono scaricati in Excel, uniti con altri fogli, arricchiti con database separati e trasformati in ulteriori file per assenze e payroll.',
      exampleImageCaption:
        'Schema as-is: più passaggi manuali, più file e più sistemi da allineare prima di arrivare a un dato affidabile.',
      riskLabels: ['Rischio errori alto', 'Incongruenze tra file', 'Controllo tardivo', 'Dipendenza da merge manuali'],
      chaoticLabel: 'Prima',
      chaoticTitle: 'Processo frammentato',
      chaoticBody:
        'Ore, assenze, approvazioni e controlli passano tra app, file Excel, chat, email ed export manuali.',
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
      centralizedTitle: 'Workflow centralizzato stAI tuned',
      centralizedBody:
        'Lo stesso processo viene gestito in un flusso unico, con dati sincronizzati, stati tracciati e output gia pronti.',
      centralizedPoints: [
        'Un inserimento, più viste per ruolo',
        'Approvazioni contestualizzate',
        'Export finale senza ricopia manuale',
        'Dati sincronizzati tra ruoli e funzioni',
      ],
      syncNote: 'Stesso dato, più viste operative: campo, manager, admin e operations lavorano in tempo reale sullo stesso flusso.',
      asIsIntro: 'Mappa rapida di dove il flusso attuale si rompe.',
      toBeIntro: 'Stessi ruoli, ma su un flusso unico e tracciato.',
      transitionCue: 'Dall’as-is al to-be',
    },
    metrics: {
      eyebrow: 'Perché intervenire ora',
      title: 'Ogni passaggio manuale moltiplica ritardi, errori e lavoro amministrativo.',
      items: [
        { value: '1 sola', label: 'fonte dati operativa', note: 'per evitare doppie copie e rincorse manuali' },
        { value: '3 ruoli', label: 'coinvolti nello stesso flusso', note: 'operatore, manager, admin con responsabilità chiare' },
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
          'Export e controllo finale partono da dati già verificati.',
        ],
        footer: 'Meno coordinamento, più controllo operativo.',
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
          description: 'Inserimento ore, note di lavoro e allegati dal campo o dall’ufficio.',
        },
        {
          title: 'Coda del manager',
          description: 'Vista delle richieste pendenti con priorità, storico e segnalazioni.',
        },
        {
          title: 'Approva o correggi',
          description: 'Decisione rapida con motivazione e ritorno all’operatore se manca qualcosa.',
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
          summary: 'L’operatore invia ore, note e allegati da mobile senza passare da chat, fogli o recap manuali.',
          highlights: [
            'Compila e invia in un solo punto',
            'Vede subito cosa è stato approvato o respinto',
            'Riduce messaggi dispersi e correzioni a fine mese',
          ],
        },
        manager: {
          label: 'Manager',
          title: 'Approvazione con contesto, non per rincorsa.',
          summary: 'Il manager lavora su una coda unica con stato, dettagli e storico, così può approvare o correggere subito.',
          highlights: [
            'Richieste pendenti in una sola vista',
            'Storico e motivazioni sempre disponibili',
            'Decisione rapida senza cercare informazioni altrove',
          ],
        },
        admin: {
          label: 'Admin',
          title: 'Controllo finale su dati gia riconciliati.',
          summary: 'L’admin verifica anomalie, consolidamento ed export partendo da un flusso già tracciato e coerente.',
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
      title: 'HR/Admin è un esempio concreto. La logica vale per molti altri processi manuali.',
      lead:
        'Quello che hai visto non è limitato a un reparto. Il valore sta nel pattern: richieste sparse, approvazioni fuori flusso, dati duplicati e controllo che arriva troppo tardi. Se riconosci questi segnali in un altro processo, possiamo lavorare anche su quello.',
      patternsTitle: 'Segnali che il problema non è solo HR/Admin',
      patterns: [
        'Dati che arrivano da canali diversi',
        'Approvazioni gestite fuori sistema',
        'File duplicati o versioni incoerenti',
        'Controlli che emergono solo a fine processo',
      ],
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
      closing:
        'Hai un processo che oggi ti fa perdere tempo in manualità, rincorse e ricostruzione del contesto? È esattamente il tipo di flusso da cui partiamo.',
      ctas: [
        {
          title: 'Vorresti provare questo use case anche da te?',
          action: 'Prova questo use case',
        },
        {
          title: 'Hai un processo diverso a cui voler provare questo approccio?',
          action: 'Raccontami il tuo processo',
        },
      ],
    },
    benefits: {
      eyebrow: 'Impatto operativo',
      title: 'Impatto atteso sul processo',
      lead:
        'Indicazioni di miglioramento potenziale su flussi oggi gestiti tra app, file Excel, messaggi e passaggi manuali. I valori variano in base al livello di frammentazione iniziale.',
      items: [
        { value: '', label: 'Meno tempo speso nel consolidare dati', note: 'Il team smette di ricostruire il quadro partendo da file e fonti diverse.', progress: 85 },
        { value: '', label: 'Meno passaggi manuali tra ruoli', note: 'Richieste, approvazioni e verifiche scorrono nello stesso flusso.', progress: 70 },
        { value: '', label: 'Più visibilità su anomalie e blocchi', note: 'Admin e manager vedono prima dove il processo si ferma.', progress: 60 },
        { value: '', label: 'Export finale più pulito e rapido', note: 'L output arriva già strutturato, con meno interventi di sistemazione.', progress: 92 },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Domande tipiche prima di partire con una demo.',
      items: [
        {
          question: 'Si parte da zero o dalla demo esistente?',
          answer:
            'Partiamo dalla demo già validata in ambito HR/Admin e la adattiamo al tuo processo reale: campi, ruoli, stati, regole di approvazione e output finali.',
        },
        {
          question: 'Serve cambiare tutti i sistemi esistenti?',
          answer:
            'No. Il punto iniziale è togliere attrito dai passaggi manuali. Possiamo partire su un flusso circoscritto e poi collegarlo agli strumenti già presenti.',
        },
        {
          question: 'Chi usa davvero la soluzione?',
          answer:
            'Gli operatori inseriscono dati e allegati, i manager approvano o correggono, l’admin controlla eccezioni, blocchi ed export finale.',
        },
        {
          question: 'Quanto velocemente si vede qualcosa di concreto?',
          answer:
            'L’obiettivo è mostrare un workflow funzionante in tempi brevi, con dati e schermate che riflettono il processo operativo reale della tua azienda.',
        },
      ],
    },
    requestSection: {
      eyebrow: 'Richiesta demo',
      title: 'Raccontami il processo che vuoi centralizzare.',
      description:
        'Compila questa richiesta e ti ricontatto con una demo mirata sul tuo caso, non con una call generica.',
      bullets: [
        'Partiamo dal processo che oggi ti crea rincorse, eccezioni o ricopia manuale',
        'Adattiamo la demo al tuo contesto operativo e ai ruoli coinvolti',
        'Ricevi un riscontro concreto su cosa ha senso provare per primo',
      ],
      formTitle: 'Richiedi una demo business',
      formDescription: 'Bastano poche informazioni per capire se il workflow va modellato su questo use case o su un altro.',
      successTitle: 'Richiesta inviata.',
      successSubtitle: 'Ti ricontatto con un prossimo passo coerente con il processo che hai descritto.',
      resetCta: 'Invia un’altra richiesta',
      fields: {
        name: 'Nome',
        email: 'Email',
        company: 'Azienda',
        role: 'Ruolo',
        processName: 'Processo da rivedere',
        mainPain: 'Problema principale',
        notes: 'Note aggiuntive',
        privacyLabelPrefix: 'Accetto il trattamento dei dati personali come descritto nella',
        privacyPolicy: 'Privacy Policy',
        submit: 'Invia richiesta demo',
      },
      placeholders: {
        role: 'Es. HR Manager, Operations, Amministrazione',
        processName: 'Es. ore operai, assenze, onboarding documentale',
        mainPain: 'Dove si rompe oggi il processo? Cosa vi fa perdere più tempo?',
        notes: 'Vincoli, sistemi già usati, sedi, team coinvolti, tempistiche...',
      },
      errors: {
        nameRequired: 'Nome richiesto.',
        emailRequired: 'Email richiesta.',
        invalidEmail: 'Inserisci un indirizzo email valido.',
        companyRequired: 'Azienda richiesta.',
        processNameRequired: 'Descrivi il processo da rivedere.',
        mainPainRequired: 'Descrivi il problema principale.',
        privacyRequired: 'Devi accettare la privacy policy per procedere.',
        submitFailed: "Errore nell'invio. Riprova.",
      },
    },
    apiErrors: {
      apply: {
        nameRequired: 'Nome richiesto.',
        invalidEmail: 'Email non valida.',
        companyRequired: 'Azienda richiesta.',
        processNameRequired: 'Processo richiesto.',
        mainPainRequired: 'Problema principale richiesto.',
        privacyRequired: 'Accettazione privacy richiesta.',
        serverError: 'Errore server.',
        notConfigured: 'Calendly non configurato',
      },
    },
    finalCta: {
      title: 'Ti mostro in 20 minuti come questo flusso può funzionare nel tuo caso.',
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
      positioning:
        'stAItuned turns operational processes managed across spreadsheets, email and chat into unified, traceable workflows ready for action.',
      primaryCta: 'See what you could do',
      secondaryCta: 'Apply for a demo',
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
      title: 'The problem is structural, not occasional.',
      items: [
        {
          value: '73%',
          label: 'EU SMEs with at least basic digital intensity, still below the EU 2030 target.',
          note: 'Having tools is not enough if the process stays fragmented.',
          sourceLabel: 'Source: Eurostat Digitalisation in Europe 2025',
          sourceHref: 'https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025',
        },
        {
          value: '76.1%',
          label: 'EU SMEs still at low or very low digital intensity in 2023.',
          note: 'The gap is not just software adoption, but linking roles and data in one flow.',
          sourceLabel: 'Source: Digital Decade 2024',
          sourceHref: 'https://digital-strategy.ec.europa.eu/en/library/digital-decade-2024-strategic-foresight-report',
        },
        {
          value: '60%',
          label: 'Of work time absorbed by coordination, follow-up and accessory work.',
          note: 'When statuses are not shared, time goes into chasing instead of operational closure.',
          sourceLabel: 'Source: McKinsey High Tech Practice',
          sourceHref:
            'https://www.mckinsey.com/~/media/mckinsey/dotcom/client_service/high%20tech/pdfs/impact_of_internet_technologies_search_final2.ashx',
        },
      ],
      lead:
        'Many SMEs still run on fragmented processes, disconnected tools and manual coordination.',
      closing:
        'When data, requests and approvals live in different places, work does not scale. It fragments.',
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
        'One concrete case, readable in seconds: first the breakpoints, then the same process rebuilt into one shared system.',
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
        'Hours, absences, approvals and checks move across apps, spreadsheets, chat, email and manual exports.',
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
        'The same process runs in one flow, with synced data, tracked states and outputs already ready.',
      centralizedPoints: [
        'One intake, multiple role-based views',
        'Approvals with context',
        'Final export without manual re-entry',
        'Synced data across roles and functions',
      ],
      syncNote: 'One shared dataset, multiple operational views: field, manager, admin and operations work in real time on the same flow.',
      asIsIntro: 'Quick map of where the current flow still breaks.',
      toBeIntro: 'Same roles, but on one shared, tracked flow.',
      transitionCue: 'From as-is to to-be',
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
      title: 'HR/Admin is one concrete example. The same logic applies to many other manual workflows.',
      lead:
        'What you saw is not limited to one department. The value is in the pattern: scattered requests, approvals outside the flow, duplicated data, and control that arrives too late. If you recognize these signals in another process, we can work on that too.',
      patternsTitle: 'Signals that the issue is not only HR/Admin',
      patterns: [
        'Data arriving from different channels',
        'Approvals handled outside the system',
        'Duplicated files or inconsistent versions',
        'Controls appearing only at the end of the process',
      ],
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
      closing:
        'Do you have a process that is wasting time in manual steps, chasing and context rebuilding? That is exactly the kind of workflow we start from.',
      ctas: [
        {
          title: 'Would you like to try this use case in your company?',
          action: 'Try this use case',
        },
        {
          title: 'Do you have a different process where you want to test this approach?',
          action: 'Tell me about your process',
        },
      ],
    },
    benefits: {
      eyebrow: 'Operational impact',
      title: 'Expected process impact',
      lead:
        'Directional improvement signals for workflows still managed across apps, spreadsheets, messages and manual handoffs. Actual values depend on the starting level of fragmentation.',
      items: [
        { value: '', label: 'Less time spent consolidating data', note: 'The team stops rebuilding the picture from disconnected files and sources.', progress: 85 },
        { value: '', label: 'Fewer manual handoffs across roles', note: 'Requests, approvals and checks move inside the same flow.', progress: 70 },
        { value: '', label: 'More visibility on anomalies and blockers', note: 'Admin and managers see earlier where the process is getting stuck.', progress: 60 },
        { value: '', label: 'Cleaner and faster final export', note: 'The output arrives already structured, with less manual cleanup.', progress: 92 },
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
    requestSection: {
      eyebrow: 'Demo request',
      title: 'Tell me which process you want to centralize.',
      description:
        'Submit this request and I will come back with a demo tailored to your case, not a generic intro call.',
      bullets: [
        'We start from the process currently causing chase work, exceptions or manual re-entry',
        'We adapt the demo to your operating context and the roles involved',
        'You get a concrete recommendation on what makes sense to test first',
      ],
      formTitle: 'Request a business demo',
      formDescription: 'A few details are enough to understand whether the workflow should be modeled around this use case or a different one.',
      successTitle: 'Request sent.',
      successSubtitle: 'I will get back to you with a next step aligned with the process you described.',
      resetCta: 'Send another request',
      fields: {
        name: 'Name',
        email: 'Email',
        company: 'Company',
        role: 'Role',
        processName: 'Process to review',
        mainPain: 'Main pain point',
        notes: 'Additional notes',
        privacyLabelPrefix: 'I accept personal data processing as described in the',
        privacyPolicy: 'Privacy Policy',
        submit: 'Send demo request',
      },
      placeholders: {
        role: 'e.g. HR Manager, Operations, Admin',
        processName: 'e.g. worker time reporting, absences, document onboarding',
        mainPain: 'Where does the process break today? What costs you the most time?',
        notes: 'Constraints, systems already in use, locations, teams involved, timing...',
      },
      errors: {
        nameRequired: 'Name is required.',
        emailRequired: 'Email is required.',
        invalidEmail: 'Enter a valid email address.',
        companyRequired: 'Company is required.',
        processNameRequired: 'Describe the process to review.',
        mainPainRequired: 'Describe the main pain point.',
        privacyRequired: 'You must accept the privacy policy to continue.',
        submitFailed: 'Submission failed. Please try again.',
      },
    },
    apiErrors: {
      apply: {
        nameRequired: 'Name is required.',
        invalidEmail: 'Invalid email.',
        companyRequired: 'Company is required.',
        processNameRequired: 'Process is required.',
        mainPainRequired: 'Main pain point is required.',
        privacyRequired: 'Privacy acceptance is required.',
        serverError: 'Server error.',
        notConfigured: 'Calendly not configured',
      },
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
