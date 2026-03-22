export type RoleFitLocale = 'it' | 'en'

export const ROLE_FIT_DEFAULT_LOCALE: RoleFitLocale = 'it'
export const ROLE_FIT_QUERY_PARAM = 'lang'

export function isRoleFitLocale(value: unknown): value is RoleFitLocale {
  return value === 'it' || value === 'en'
}

export function normalizeRoleFitLocale(value: unknown): RoleFitLocale {
  if (typeof value !== 'string') return ROLE_FIT_DEFAULT_LOCALE
  const normalized = value.toLowerCase()
  return normalized === 'en' ? 'en' : 'it'
}

export interface RoleFitQuestionTranslation {
  question: string
  helpText?: string
  options: string[]
}

export interface RoleFitTranslations {
  meta: {
    title: string
    description: string
    keywords: string[]
    openGraphLocale: string
    imageAlt: string
  }
  localeToggle: {
    label: string
    italian: string
    english: string
  }
  hero: {
    badge: string
    titlePrefix: string
    titleAccent: string
    titleSuffix: string
    subtitle: string
    cta: string
    trustSignals: string[]
  }
  marketEvidence: {
    sectionLabel: string
    stats: Array<{
      value: string
      metric: string
      label: string
      source: string
      link: string
    }>
  }
  howItWorks: {
    title: string
    titleAccent: string
    subtitle: string
    stepLabel: string
    previewLabel: string
    zoom: string
    steps: Array<{
      n: string
      title: string
      shortTitle: string
      bullets: Array<{ text: string; highlight?: string }>
      img: { src: string; alt: string }
    }>
  }
  faq: {
    sectionTitle: string
    items: Array<{ q: string; a: string }>
  }
  loading: {
    steps: Array<{ text: string; icon: string }>
    caption: string
    almostDone: string
  }
  promoGate: {
    unlocked: string
    free: string
    access: string
    oneTime: string
    forNow: string
    codeApplied: string
    haveCode: string
    insertCode: string
    apply: string
    invalidCode: string
    transformationLabel: string
    painsToSolutions: Array<{ pain: string; solution: string }>
    startButton: string
  }
  form: {
    completion: string
    receiveReport: string
    receiveReportSubtitle: string
    whatYouGet: string
    fullPdfReport: string
    reportIncludes: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    profileLabel: string
    profilePlaceholder: string
    profileHelp: string
    privacyConsent: string
    marketingConsent: string
    microcopy: string
    back: string
    next: string
    continue: string
    preparing: string
    submit: string
    sectionLabel: string
    errors: {
      invalidEmail: string
      missingEmail: string
      missingPrivacy: string
      submitError: string
    }
  }
  results: {
    completed: string
    title: string
    checkEmail: string
    archetypeWhy: string
    superpower: string
    risk: string
    lever: string
    scoreSnapshot: string
    readiness: string
    recommendedRoles: string
    whyFit: string
    needsToReachNext: string
    topGaps: string
    fixIn7Days: string
    output: string
    coachNote: string
    next7Days: string
    ctaTitle: string
    ctaSubtitle: string
    ctaPrimary: string
    ctaSecondary: string
    footer: string
  }
  email: {
    greetingNamed: string
    greetingGeneric: string
    title: string
    intro: string
    attachmentTitle: string
    attachmentSubtitle: string
    archetype: string
    scores: string
    readiness: string
    roles: string
    gaps: string
    fixIn7Days: string
    now: string
    next: string
    ctaTitle: string
    ctaBody: string
    ctaButton: string
    complianceLine: string
    privacy: string
    terms: string
    pdfFilenamePrefix: string
    subjectPrefix: string
  }
  pdf: {
    personalReportFor: string
    personalReportForYou: string
    title: string
    subtitle: string
    superpower: string
    risk: string
    snapshot: string
    readiness: string
    roles: string
    whyFit: string
    needs: string
    topGaps: string
    fixIn7Days: string
    output: string
    executiveSummary: string
    strengths: string
    weaknesses: string
    strategy: string
    next7Days: string
    ctaTitle: string
    ctaText: string
    ctaButton: string
    footer: string
  }
  sections: Record<string, string>
  questions: Record<string, RoleFitQuestionTranslation>
  roleOptions: string[]
  apiErrors: {
    invalidEmail: string
    missingAnswers: string
    privacyRequired: string
    serverError: string
    submitError: string
  }
}

const commonLinks = {
  pwc: 'https://www.pwc.com/gx/en/issues/artificial-intelligence/ai-jobs-barometer.html',
  ms: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
  insight: 'https://insightglobal.com/2025-ai-in-hiring-report/',
}

export const roleFitAuditTranslations: Record<RoleFitLocale, RoleFitTranslations> = {
  it: {
    meta: {
      title: 'GenAI Fit Check | Scopri il tuo ruolo GenAI ideale',
      description:
        "PwC 2025: le skill AI specializzate valgono un +56% di salario. Fai l'audit (5 min) per scoprire il tuo ranking e colmare i gap tecnici.",
      keywords: [
        'GenAI Fit Check',
        'test carriera AI',
        'profilo GenAI',
        'assessment AI Italia',
        'carriera intelligenza artificiale',
      ],
      openGraphLocale: 'it_IT',
      imageAlt: 'GenAI Fit Check - Scopri il tuo ruolo GenAI ideale',
    },
    localeToggle: {
      label: 'Lingua del Role Fit Audit',
      italian: 'Italiano',
      english: 'English',
    },
    hero: {
      badge: 'Il tuo CV sembra uguale a tutti gli altri',
      titlePrefix: 'Il tuo profilo GenAI è',
      titleAccent: 'troppo generico',
      titleSuffix: 'per essere scelto.',
      subtitle:
        'Non è solo una tua impressione: il mercato è diventato iperselettivo. Smetti di essere generico. Scopri il tuo Vero Ranking e ottieni il piano per colmare i gap.',
      cta: 'Qual è il mio fit GenAI? →',
      trustSignals: ['Score da 0-100', 'Gap chiari', 'Piano 7 giorni', 'Solo 5 min'],
    },
    marketEvidence: {
      sectionLabel: 'Dati di Mercato',
      stats: [
        {
          value: '+56%',
          metric: 'Stipendio',
          label: 'Se decidi di specializzarti',
          source: 'PwC Jobs Barometer 2025',
          link: commonLinks.pwc,
        },
        {
          value: '66%',
          metric: 'Ti Scarta',
          label: 'Se il tuo profilo è generico',
          source: 'Microsoft Work Trend 2024',
          link: commonLinks.ms,
        },
        {
          value: '93%',
          metric: 'Non Trova',
          label: 'Talenti pronti (è la tua chance)',
          source: 'Insight Global Report 2025',
          link: commonLinks.insight,
        },
      ],
    },
    howItWorks: {
      title: 'Cosa scoprirai nel Report',
      titleAccent: '(Analisi in 4 step)',
      subtitle:
        'Visualizzerai subito i risultati e ti manderemo un PDF con ulteriori approfondimenti via mail',
      stepLabel: 'Fase',
      previewLabel: 'Anteprima\nReport',
      zoom: 'Ingrandisci',
      steps: [
        {
          n: '01',
          title: 'Scopri il tuo Profilo Reale',
          shortTitle: 'Il tuo Profilo',
          bullets: [
            { text: 'Non sei solo un "Dev": vedi il tuo vero posizionamento.' },
            { text: 'Il tuo vero punto di forza (la tua leva sul mercato).', highlight: 'punto di forza' },
            { text: 'Cosa ti sta bloccando oggi (e non lo sai).', highlight: 'bloccando' },
          ],
          img: { src: '/assets/role-fit-audit/slide_3_1600.webp', alt: 'GenAI Fit Check - Fase 1: Profilo e posizionamento' },
        },
        {
          n: '02',
          title: 'Il tuo Punteggio (Score)',
          shortTitle: 'Tuo Punteggio',
          bullets: [
            { text: 'Misurati su 4 assi: Engineering, Product, Data, AI.', highlight: '4 assi' },
            { text: 'Un numero chiaro da 0 a 100.' },
            { text: 'Scopri esattamente dove sei carente.', highlight: 'carente' },
          ],
          img: { src: '/assets/role-fit-audit/slide_4_1600.webp', alt: 'GenAI Fit Check - Fase 2: Punteggi e Readiness' },
        },
        {
          n: '03',
          title: 'I tuoi Gap Tecnici',
          shortTitle: 'I tuoi Gap',
          bullets: [
            { text: 'I 3 ostacoli precisi tra te e il ruolo Senior.', highlight: '3 ostacoli' },
            { text: 'Zero teoria: solo problemi di "Engineering Rigor".' },
            { text: 'La soluzione pratica per ogni gap.', highlight: 'soluzione pratica' },
          ],
          img: { src: '/assets/role-fit-audit/slide_5_1600.webp', alt: 'GenAI Fit Check - Fase 3: Gap Analysis' },
        },
        {
          n: '04',
          title: 'Il Piano Operativo',
          shortTitle: 'Piano 7 Giorni',
          bullets: [
            { text: 'Cosa fare domani mattina (Roadmap 7 giorni).', highlight: '7 giorni' },
            { text: 'Consigli su misura per il tuo profilo.', highlight: 'su misura' },
            { text: 'Report PDF gratuito nella tua email.', highlight: 'PDF gratuito' },
          ],
          img: { src: '/assets/role-fit-audit/slide_6_1600.webp', alt: "GenAI Fit Check - Fase 4: Piano d'azione" },
        },
      ],
    },
    faq: {
      sectionTitle: 'Domande Frequenti',
      items: [
        {
          q: 'Quanto dura?',
          a: 'Circa 5 minuti. Le domande sono progettate per essere rapide, dirette e senza fronzoli.',
        },
        {
          q: 'Cosa ricevo?',
          a: 'Report PDF personalizzato con Archetipo, Punteggio di Readiness, Gap Analysis e Piano d’azione.',
        },
        {
          q: 'I dati sono privati?',
          a: 'Assolutamente sì. Non vendiamo i tuoi dati. Servono solo per calcolare il tuo score.',
        },
      ],
    },
    loading: {
      steps: [
        { text: 'Analisi delle risposte in corso...', icon: '🔍' },
        { text: 'Confronto con gli Archetipi AI...', icon: '🧠' },
        { text: 'Identificazione dei Gap critici...', icon: '⚡️' },
        { text: 'Generazione strategia personalizzata...', icon: '🎯' },
        { text: 'Impaginazione e invio PDF...', icon: '📄' },
      ],
      caption:
        "Stiamo costruendo il tuo piano su misura unendo l'esperienza dei nostri Manager AI alla potenza di Gemini 3 Pro.",
      almostDone: 'Manca poco...',
    },
    promoGate: {
      unlocked: 'Accesso sbloccato',
      free: 'Gratis',
      access: 'accesso',
      oneTime: 'una tantum',
      forNow: 'per ora',
      codeApplied: 'Codice applicato',
      haveCode: 'Hai un codice accesso?',
      insertCode: 'Inserisci codice',
      apply: 'Applica',
      invalidCode: 'Codice non valido. Riprova.',
      transformationLabel: 'Dal problema alla soluzione',
      painsToSolutions: [
        { pain: '"Il mio profilo sembra AI generico"', solution: 'Ruolo consigliato + alternativa' },
        { pain: '"Non so quale ruolo puntare"', solution: 'Score su 4 assi + spiegazione' },
        { pain: '"Mando CV, niente colloqui"', solution: 'Gap analysis + piano 7 giorni' },
        { pain: '"Non ho proof credibili"', solution: 'Report PDF salvabile' },
      ],
      startButton: 'Inizia il tuo audit →',
    },
    form: {
      completion: 'Completamento',
      receiveReport: 'Ricevi il report via email',
      receiveReportSubtitle: 'Ti invio tutto via email così non lo perdi.',
      whatYouGet: 'Cosa ricevi',
      fullPdfReport: 'Report PDF completo',
      reportIncludes: 'Score · Archetipo · Gap analysis · Piano 7 giorni',
      nameLabel: 'Nome (opzionale)',
      namePlaceholder: 'Il tuo nome',
      emailLabel: 'Email *',
      emailPlaceholder: 'tu@email.com',
      profileLabel: 'LinkedIn o GitHub (opzionale)',
      profilePlaceholder: 'https://linkedin.com/in/...',
      profileHelp: 'Opzionale: per una review più precisa del tuo profilo.',
      privacyConsent:
        'Acconsento al trattamento dei dati per ricevere il report via email. I dati delle risposte e i risultati saranno visibili al team stAItuned per migliorare il servizio. Leggi Privacy e Terms.',
      marketingConsent: 'Voglio ricevere aggiornamenti e offerte su Career OS via email (facoltativo).',
      microcopy:
        'Niente spam. 1 email con il tuo report PDF (e solo se vuoi, aggiornamenti occasionali). I dati audit sono accessibili al team admin stAItuned per finalita di servizio e conservati per 12 mesi. Per revoca/cancellazione: info@staituned.com.',
      back: '← Indietro',
      next: 'Avanti →',
      continue: 'Continua →',
      preparing: 'Sto preparando il report...',
      submit: 'Invia report →',
      sectionLabel: 'Sezione {current}/{total}: {title}',
      errors: {
        invalidEmail: "L'email inserita non sembra valida. Controlla e riprova.",
        missingEmail: 'Inserisci la tua email per ricevere il report.',
        missingPrivacy: "Per procedere, accetta privacy/termini e l'invio del report via email.",
        submitError: "Errore durante l'invio",
      },
    },
    results: {
      completed: 'Audit completato',
      title: 'Il tuo GenAI Fit Check',
      checkEmail: 'Controlla la tua email! Ti abbiamo inviato il report PDF con analisi dettagliate, strategia di carriera e consigli personalizzati.',
      archetypeWhy: 'Perché questo archetipo?',
      superpower: 'Superpower',
      risk: 'Rischio',
      lever: 'Leva principale',
      scoreSnapshot: 'Score Snapshot',
      readiness: 'GenAI Readiness',
      recommendedRoles: 'Ruoli Consigliati',
      whyFit: 'Perché sei un fit:',
      needsToReachNext: 'Cosa ti serve:',
      topGaps: 'Top 3 Gap da colmare',
      fixIn7Days: 'Fix in 7 giorni',
      output: 'Output',
      coachNote: 'Nota del Coach',
      next7Days: 'I prossimi 7 giorni',
      ctaTitle: 'Prenota il tuo 1:1 per avere un feedback personalizzato sul tuo GenAI Fit Check',
      ctaSubtitle:
        'Una call gratuita di 15 minuti, in cui i nostri esperti AI saranno a tua completa disposizione per darti feedback, chiarire dubbi e darti consigli.',
      ctaPrimary: 'Scopri il Career OS →',
      ctaSecondary: 'Prenota sessione strategica (15 min)',
      footer: 'Ti invieremo una copia via email. Se non arriva entro 2 min, controlla spam/promozioni.',
    },
    email: {
      greetingNamed: 'Ciao {name}!',
      greetingGeneric: 'Ciao!',
      title: 'Il tuo Role Fit Audit',
      intro: 'Ecco il tuo report Role Fit Audit. Questo è il tuo punto di partenza verso una carriera GenAI.',
      attachmentTitle: 'Report PDF allegato',
      attachmentSubtitle: 'Aprilo per l\'analisi approfondita del tuo profilo, la strategia di carriera e consigli personalizzati!',
      archetype: 'Il tuo archetipo',
      scores: 'I tuoi score',
      readiness: 'Readiness',
      roles: 'Ruoli consigliati',
      gaps: 'Top 3 gap da colmare',
      fixIn7Days: 'Fix 7 giorni',
      now: 'NOW',
      next: 'NEXT',
      ctaTitle: 'Vuoi il piano personalizzato?',
      ctaBody: 'Con Career OS ottieni una roadmap completa, review 1:1 del tuo profilo, e supporto per arrivare al colloquio.',
      ctaButton: 'Applica al Career OS →',
      complianceLine: 'Ricevi questa email perché hai completato il Role Fit Audit su stAItuned.',
      privacy: 'Privacy Policy',
      terms: 'Terms',
      pdfFilenamePrefix: 'role-fit-audit',
      subjectPrefix: 'Il tuo Role Fit Audit',
    },
    pdf: {
      personalReportFor: 'Report Personale per {name}',
      personalReportForYou: 'Report Personale per Te',
      title: 'Il tuo Role Fit Audit',
      subtitle: 'Analisi di compatibilità per ruoli AI & GenAI',
      superpower: 'Superpower',
      risk: 'Rischio',
      snapshot: 'SCORE SNAPSHOT',
      readiness: 'GenAI Readiness',
      roles: 'RUOLI CONSIGLIATI',
      whyFit: 'Perché sei un fit:',
      needs: 'Cosa ti serve:',
      topGaps: 'TOP 3 GAP DA COLMARE',
      fixIn7Days: 'Fix in 7 giorni',
      output: 'Output',
      executiveSummary: 'Executive Summary',
      strengths: 'Punti di Forza',
      weaknesses: 'Aree di Miglioramento',
      strategy: 'Strategia di Carriera',
      next7Days: 'I PROSSIMI 7 GIORNI',
      ctaTitle: 'Prenota il tuo 1:1 per avere un feedback personalizzato sul tuo Role Fit Audit',
      ctaText:
        'Una call gratuita di 15 minuti in cui i nostri esperti AI ti daranno feedback pratico e consigli operativi.',
      ctaButton: 'Candidati al Career OS →',
      footer: 'Tutti i diritti riservati.',
    },
    sections: {
      section1: 'Profilo & Obiettivo',
      section2: 'Engineering',
      section3: 'Data & ML',
      section4: 'Product & Comunicazione',
      section5: 'GenAI Systems & Proof',
    },
    roleOptions: [
      'LLM Apps Dev',
      'RAG Dev',
      'GenAI Engineer',
      'Applied GenAI (Eval)',
      'AI Product Engineer',
      'Solutions GenAI',
      'Non lo so ancora',
    ],
    questions: {
      Q1: { question: 'Quanti anni di esperienza hai in ambito dev/data?', options: ['0 (studente/no esperienza)', '1 anno', '2-3 anni', '4-5 anni', '6+ anni'] },
      Q2: { question: 'Nei prossimi 3 mesi, qual è il ruolo GenAI che vuoi puntare?', helpText: 'Questa risposta viene usata solo per personalizzare i consigli, non influisce sullo score.', options: ['LLM Apps Dev', 'RAG Dev', 'GenAI Engineer', 'Applied GenAI (Eval)', 'AI Product Engineer', 'Solutions GenAI', 'Non lo so ancora'] },
      Q3: { question: 'Quanto ti senti solido/a a scrivere codice "senza tutorial" (feature vere, non esercizi)?', options: ['Non mi sento per niente solido', 'Solo cose semplici', 'Abbastanza, ma devo cercare spesso', 'Bene, riesco a costruire feature complete', 'Molto solido, anche architettura e qualità'] },
      Q4: { question: 'Quanta esperienza hai con backend/API (anche semplici)?', options: ['Mai fatto', 'Solo progetti toy/tutorial', 'API semplici (CRUD base)', 'API in produzione con auth/db', 'Prod + scaling/monitoring'] },
      Q5: { question: 'Quanto sei a tuo agio a costruire una UI "presentabile" (anche minimale)?', options: ['Non faccio frontend', 'Copio template/tutorial', 'Costruisco UI funzionali', 'UI polished e responsive', 'Design system + UX thinking'] },
      Q6: { question: 'Come lavori di solito con Git?', options: ['Non uso git', 'Solo commit base', 'Branch + PR', 'PR + code review', 'PR + CI + release process'] },
      Q7: { question: 'Quanto usi test e pratiche di qualità nel tuo codice?', options: ['Mai', 'Sporadico/quando ho tempo', 'Unit test base', 'Unit + integration test', 'Test + lint + quality gates'] },
      Q8: { question: 'Quanto sei a tuo agio con SQL e data wrangling?', options: ['Non conosco SQL', 'Query base (SELECT, WHERE)', 'JOIN, aggregazioni, subquery', 'Query complesse + ottimizzazione', 'Expert level + pipeline ETL'] },
      Q9: { question: 'Qual è il tuo livello sui fondamentali ML?', helpText: 'Overfitting, bias/variance, embeddings, cosine similarity, ecc.', options: ['Non li conosco', 'Conosco le definizioni base', 'Ho fatto training base', 'So usare metriche + CV + debug', 'Li ho applicati in progetti reali'] },
      Q10: { question: 'Come gestisci esperimenti e misurazione della qualità?', options: ['Non misuro', 'Qualitativo/a sentimento', 'Metriche base su un set di test', 'A/B test o eval strutturata', 'Eval harness ripetibile + regressioni'] },
      Q11: { question: 'Come gestisci un problema vago o ambiguo?', helpText: 'Es: "migliora il supporto clienti"', options: ['Mi blocco senza requisiti chiari', 'Chiedo chiarimenti e procedo', 'Trasformo in spec (target, scope)', 'Spec + metriche + rischi', 'Spec + tradeoff + piano delivery'] },
      Q12: { question: 'Quanto pensi al valore utente e allo scope quando costruisci?', options: ['Faccio quello che mi dicono', 'Penso al risultato finale', 'Definisco chi usa e perché', 'MVP + iterazione + feedback', 'User research + metriche impatto'] },
      Q13: { question: 'Quanto sei forte nella comunicazione scritta (doc, README, write-up)?', options: ['Evito di scrivere', 'Scrivo, ma disorganizzato', 'README base, funzionale', 'README + decision log', 'Write-up chiaro con trade-off'] },
      Q14: { question: 'Hai esperienza pratica con RAG (retrieval augmented generation)?', options: ['Mai fatto', 'Ho seguito un tutorial', 'Progetto toy con chunking + retrieval', 'RAG con embeddings + reranking', 'RAG + eval + guardrails'] },
      Q15: { question: 'Come gestisci prompting e structured outputs?', options: ['Prompt "a caso"', 'Prompt template base', 'Template + few-shot', 'CoT + structured output (JSON)', 'Prompt versioning + A/B testing'] },
      Q16: { question: 'Hai esperienza con agents e tool calling?', options: ['No', 'Ho letto/visto demo', 'Progetto toy con 1-2 tools', 'Agent con fallback e loop control', 'Agent + observability + guardrails'] },
      Q17: { question: 'Come valuti la qualità di un sistema GenAI?', options: ['A sentimento', 'Testo io manualmente', 'Dataset di test + metriche base', 'Eval suite con golden set', 'Eval + regression + cost tracking'] },
      Q18: { question: 'Quanta esperienza hai con deploy (cloud, env, secrets)?', options: ['Mai deployato', 'Deploy manuale occasionale', 'Deploy con env vars + secrets', 'CI/CD + staging + prod', 'CI/CD + monitoring + cost awareness'] },
      Q19: { question: 'Quanto consideri security, PII e cost control nelle app GenAI?', options: ['Mai pensato', 'So che esistono', 'Li gestisco in modo base', 'Token limit + caching + sanitization', 'Full security + abuse protection + budget'] },
      Q20: { question: 'Quanta evidenza pubblica hai oggi (repo, demo, write-up)?', options: ['Nulla di pubblico', '1 repo incompleto/privato', '1 repo pubblico decente', 'Repo + README + demo hostata', 'Demo live + eval report + write-up'] },
    },
    apiErrors: {
      invalidEmail: 'Email non valida.',
      missingAnswers: 'Risposte mancanti.',
      privacyRequired: 'Devi accettare la privacy per inviare il Role Fit Audit.',
      serverError: 'Server error',
      submitError: "Errore durante l'invio",
    },
  },
  en: {
    meta: {
      title: 'GenAI Fit Check | Find your ideal GenAI role',
      description:
        'PwC 2025: specialized AI skills can drive a +56% salary premium. Take the 5-minute audit to find your ranking and close technical gaps.',
      keywords: ['GenAI Fit Check', 'AI career test', 'GenAI profile', 'AI career assessment', 'GenAI engineer'],
      openGraphLocale: 'en_US',
      imageAlt: 'GenAI Fit Check - Find your ideal GenAI role',
    },
    localeToggle: {
      label: 'Role Fit Audit language',
      italian: 'Italian',
      english: 'English',
    },
    hero: {
      badge: 'Your CV looks like everyone else’s',
      titlePrefix: 'Your GenAI profile is',
      titleAccent: 'too generic',
      titleSuffix: 'to get selected.',
      subtitle:
        'This is not just your feeling: the market is now hyper-selective. Stop being generic. Discover your true ranking and get a concrete plan to close your gaps.',
      cta: 'What is my GenAI fit? →',
      trustSignals: ['Score from 0-100', 'Clear gaps', '7-day plan', 'Only 5 min'],
    },
    marketEvidence: {
      sectionLabel: 'Market Data',
      stats: [
        {
          value: '+56%',
          metric: 'Salary',
          label: 'If you specialize',
          source: 'PwC Jobs Barometer 2025',
          link: commonLinks.pwc,
        },
        {
          value: '66%',
          metric: 'Rejected',
          label: 'If your profile is generic',
          source: 'Microsoft Work Trend 2024',
          link: commonLinks.ms,
        },
        {
          value: '93%',
          metric: 'Talent Gap',
          label: 'Companies cannot find ready talent',
          source: 'Insight Global Report 2025',
          link: commonLinks.insight,
        },
      ],
    },
    howItWorks: {
      title: 'What you will discover in the report',
      titleAccent: '(4-step analysis)',
      subtitle: 'You will see results immediately and receive a PDF with deeper insights by email.',
      stepLabel: 'Step',
      previewLabel: 'Report\nPreview',
      zoom: 'Zoom',
      steps: [
        {
          n: '01',
          title: 'Discover your real profile',
          shortTitle: 'Your Profile',
          bullets: [
            { text: 'You are not just a “Dev”: understand your real positioning.' },
            { text: 'Your strongest market lever.', highlight: 'strongest' },
            { text: 'What is blocking you right now.', highlight: 'blocking' },
          ],
          img: { src: '/assets/role-fit-audit/slide_3_1600.webp', alt: 'GenAI Fit Check - Step 1: profile and positioning' },
        },
        {
          n: '02',
          title: 'Your score',
          shortTitle: 'Your Score',
          bullets: [
            { text: 'Measured across 4 axes: Engineering, Product, Data, AI.', highlight: '4 axes' },
            { text: 'A clear number from 0 to 100.' },
            { text: 'See exactly where you are weak.', highlight: 'weak' },
          ],
          img: { src: '/assets/role-fit-audit/slide_4_1600.webp', alt: 'GenAI Fit Check - Step 2: scores and readiness' },
        },
        {
          n: '03',
          title: 'Your technical gaps',
          shortTitle: 'Your Gaps',
          bullets: [
            { text: 'The 3 specific blockers between you and a senior role.', highlight: '3 specific blockers' },
            { text: 'No theory: only execution gaps.' },
            { text: 'A practical fix for each gap.', highlight: 'practical fix' },
          ],
          img: { src: '/assets/role-fit-audit/slide_5_1600.webp', alt: 'GenAI Fit Check - Step 3: gap analysis' },
        },
        {
          n: '04',
          title: 'Your action plan',
          shortTitle: '7-Day Plan',
          bullets: [
            { text: 'What to do tomorrow morning (7-day roadmap).', highlight: '7-day' },
            { text: 'Advice tailored to your profile.', highlight: 'tailored' },
            { text: 'Free PDF report in your inbox.', highlight: 'Free PDF' },
          ],
          img: { src: '/assets/role-fit-audit/slide_6_1600.webp', alt: 'GenAI Fit Check - Step 4: action plan' },
        },
      ],
    },
    faq: {
      sectionTitle: 'Frequently Asked Questions',
      items: [
        { q: 'How long does it take?', a: 'About 5 minutes. Questions are concise and practical.' },
        { q: 'What do I get?', a: 'A personalized PDF report with Archetype, Readiness score, Gap analysis, and a 7-day action plan.' },
        { q: 'Is my data private?', a: 'Yes. We do not sell your data. It is only used to calculate your score.' },
      ],
    },
    loading: {
      steps: [
        { text: 'Analyzing your answers...', icon: '🔍' },
        { text: 'Matching your profile with AI archetypes...', icon: '🧠' },
        { text: 'Identifying your critical gaps...', icon: '⚡️' },
        { text: 'Building your personalized strategy...', icon: '🎯' },
        { text: 'Preparing and sending your PDF...', icon: '📄' },
      ],
      caption: 'We are creating your tailored plan by combining our AI managers’ expertise with Gemini 3 Pro.',
      almostDone: 'Almost done...',
    },
    promoGate: {
      unlocked: 'Access unlocked',
      free: 'Free',
      access: 'access',
      oneTime: 'one-time',
      forNow: 'for now',
      codeApplied: 'Code applied',
      haveCode: 'Do you have an access code?',
      insertCode: 'Enter code',
      apply: 'Apply',
      invalidCode: 'Invalid code. Try again.',
      transformationLabel: 'From pain to solution',
      painsToSolutions: [
        { pain: '“My profile sounds generic AI”', solution: 'Recommended role + alternative' },
        { pain: '“I do not know which role to target”', solution: '4-axis score + explanation' },
        { pain: '“I send CVs, no interviews”', solution: 'Gap analysis + 7-day plan' },
        { pain: '“I lack credible proof”', solution: 'Downloadable PDF report' },
      ],
      startButton: 'Start your audit →',
    },
    form: {
      completion: 'Completion',
      receiveReport: 'Receive your report by email',
      receiveReportSubtitle: 'We will send everything by email so you do not lose it.',
      whatYouGet: 'What you get',
      fullPdfReport: 'Full PDF report',
      reportIncludes: 'Score · Archetype · Gap analysis · 7-day plan',
      nameLabel: 'Name (optional)',
      namePlaceholder: 'Your name',
      emailLabel: 'Email *',
      emailPlaceholder: 'you@email.com',
      profileLabel: 'LinkedIn or GitHub (optional)',
      profilePlaceholder: 'https://linkedin.com/in/...',
      profileHelp: 'Optional: helps us provide a more precise profile review.',
      privacyConsent:
        'I consent to data processing to receive the report by email. Answers and results may be visible to the stAItuned team to improve the service. Read Privacy and Terms.',
      marketingConsent: 'I want to receive Career OS updates and offers by email (optional).',
      microcopy:
        'No spam. 1 email with your PDF report (and occasional updates only if you want). Audit data can be accessed by the stAItuned admin team for service operations and retained for 12 months. For revocation/deletion: info@staituned.com.',
      back: '← Back',
      next: 'Next →',
      continue: 'Continue →',
      preparing: 'Preparing your report...',
      submit: 'Send report →',
      sectionLabel: 'Section {current}/{total}: {title}',
      errors: {
        invalidEmail: 'The provided email address does not look valid. Please check and try again.',
        missingEmail: 'Enter your email to receive the report.',
        missingPrivacy: 'To continue, accept privacy/terms and report delivery by email.',
        submitError: 'Submission error',
      },
    },
    results: {
      completed: 'Audit completed',
      title: 'Your GenAI Fit Check',
      checkEmail: 'Check your email! We sent your PDF report with detailed analysis, career strategy, and personalized recommendations.',
      archetypeWhy: 'Why this archetype?',
      superpower: 'Superpower',
      risk: 'Risk',
      lever: 'Primary leverage',
      scoreSnapshot: 'Score Snapshot',
      readiness: 'GenAI Readiness',
      recommendedRoles: 'Recommended Roles',
      whyFit: 'Why this fit:',
      needsToReachNext: 'What you need:',
      topGaps: 'Top 3 gaps to close',
      fixIn7Days: '7-day fix',
      output: 'Output',
      coachNote: 'Coach Note',
      next7Days: 'Your next 7 days',
      ctaTitle: 'Book your 1:1 and get personalized feedback on your GenAI Fit Check',
      ctaSubtitle:
        'A free 15-minute call where our AI experts give direct feedback, clarify doubts, and suggest practical next steps.',
      ctaPrimary: 'Discover Career OS →',
      ctaSecondary: 'Book strategy session (15 min)',
      footer: 'We will send you a copy by email. If it does not arrive within 2 minutes, check spam/promotions.',
    },
    email: {
      greetingNamed: 'Hi {name}!',
      greetingGeneric: 'Hi!',
      title: 'Your Role Fit Audit',
      intro: 'Here is your Role Fit Audit report. This is your starting point for a GenAI career.',
      attachmentTitle: 'PDF report attached',
      attachmentSubtitle: 'Open it for a deeper analysis of your profile, career strategy, and personalized recommendations.',
      archetype: 'Your archetype',
      scores: 'Your scores',
      readiness: 'Readiness',
      roles: 'Recommended roles',
      gaps: 'Top 3 gaps to close',
      fixIn7Days: '7-day fix',
      now: 'NOW',
      next: 'NEXT',
      ctaTitle: 'Want a personalized plan?',
      ctaBody: 'Career OS gives you a complete roadmap, 1:1 profile review, and support to reach interviews.',
      ctaButton: 'Apply to Career OS →',
      complianceLine: 'You received this email because you completed the Role Fit Audit on stAItuned.',
      privacy: 'Privacy Policy',
      terms: 'Terms',
      pdfFilenamePrefix: 'role-fit-audit',
      subjectPrefix: 'Your Role Fit Audit',
    },
    pdf: {
      personalReportFor: 'Personal report for {name}',
      personalReportForYou: 'Personal report for you',
      title: 'Your Role Fit Audit',
      subtitle: 'Fit analysis for AI & GenAI roles',
      superpower: 'Superpower',
      risk: 'Risk',
      snapshot: 'SCORE SNAPSHOT',
      readiness: 'GenAI Readiness',
      roles: 'RECOMMENDED ROLES',
      whyFit: 'Why this fit:',
      needs: 'What you need:',
      topGaps: 'TOP 3 GAPS TO CLOSE',
      fixIn7Days: '7-day fix',
      output: 'Output',
      executiveSummary: 'Executive Summary',
      strengths: 'Strengths',
      weaknesses: 'Areas to improve',
      strategy: 'Career strategy',
      next7Days: 'YOUR NEXT 7 DAYS',
      ctaTitle: 'Book your 1:1 for personalized feedback on your Role Fit Audit',
      ctaText:
        'A free 15-minute call where our AI experts provide practical feedback and concrete next steps.',
      ctaButton: 'Apply to Career OS →',
      footer: 'All rights reserved.',
    },
    sections: {
      section1: 'Profile & Goal',
      section2: 'Engineering',
      section3: 'Data & ML',
      section4: 'Product & Communication',
      section5: 'GenAI Systems & Proof',
    },
    roleOptions: [
      'LLM Apps Dev',
      'RAG Dev',
      'GenAI Engineer',
      'Applied GenAI (Eval)',
      'AI Product Engineer',
      'GenAI Solutions',
      'Not sure yet',
    ],
    questions: {
      Q1: { question: 'How many years of dev/data experience do you have?', options: ['0 (student/no experience)', '1 year', '2-3 years', '4-5 years', '6+ years'] },
      Q2: { question: 'In the next 3 months, which GenAI role do you want to target?', helpText: 'This answer is only used to personalize recommendations and does not affect the score.', options: ['LLM Apps Dev', 'RAG Dev', 'GenAI Engineer', 'Applied GenAI (Eval)', 'AI Product Engineer', 'GenAI Solutions', 'Not sure yet'] },
      Q3: { question: 'How confident are you writing production code without tutorials?', options: ['Not confident at all', 'Only simple things', 'Decent, but I still search a lot', 'Good, I can build complete features', 'Very solid, including architecture and quality'] },
      Q4: { question: 'How much backend/API experience do you have?', options: ['None', 'Only toy/tutorial projects', 'Simple APIs (basic CRUD)', 'Production APIs with auth/db', 'Production + scaling/monitoring'] },
      Q5: { question: 'How comfortable are you building a presentable UI (even minimal)?', options: ['I do not do frontend', 'I copy templates/tutorials', 'I build functional UIs', 'Polished and responsive UIs', 'Design system + UX thinking'] },
      Q6: { question: 'How do you usually work with Git?', options: ['I do not use git', 'Basic commits only', 'Branch + PR', 'PR + code review', 'PR + CI + release process'] },
      Q7: { question: 'How much do you use tests and quality practices?', options: ['Never', 'Sometimes/when I have time', 'Basic unit tests', 'Unit + integration tests', 'Tests + lint + quality gates'] },
      Q8: { question: 'How comfortable are you with SQL and data wrangling?', options: ['I do not know SQL', 'Basic queries (SELECT, WHERE)', 'JOINs, aggregations, subqueries', 'Complex queries + optimization', 'Expert level + ETL pipelines'] },
      Q9: { question: 'What is your level on ML fundamentals?', helpText: 'Overfitting, bias/variance, embeddings, cosine similarity, etc.', options: ['I do not know them', 'I know basic definitions', 'I did basic training', 'I can use metrics + CV + debug', 'I used them in real projects'] },
      Q10: { question: 'How do you run experiments and quality measurement?', options: ['I do not measure', 'Qualitative/feeling-based', 'Basic metrics on a test set', 'A/B tests or structured evaluation', 'Repeatable eval harness + regressions'] },
      Q11: { question: 'How do you handle vague or ambiguous problems?', helpText: 'Example: "improve customer support"', options: ['I get blocked without clear requirements', 'I ask clarifying questions and proceed', 'I turn it into a spec (target, scope)', 'Spec + metrics + risks', 'Spec + tradeoffs + delivery plan'] },
      Q12: { question: 'How much do you think about user value and scope when building?', options: ['I do what I am told', 'I think about final outcome', 'I define who uses it and why', 'MVP + iteration + feedback', 'User research + impact metrics'] },
      Q13: { question: 'How strong is your written communication (docs, README, write-ups)?', options: ['I avoid writing', 'I write but disorganized', 'Basic, functional README', 'README + decision log', 'Clear write-up with tradeoffs'] },
      Q14: { question: 'Do you have hands-on RAG experience?', options: ['Never', 'I followed a tutorial', 'Toy project with chunking + retrieval', 'RAG with embeddings + reranking', 'RAG + eval + guardrails'] },
      Q15: { question: 'How do you manage prompting and structured outputs?', options: ['Random prompting', 'Basic prompt templates', 'Templates + few-shot', 'CoT + structured output (JSON)', 'Prompt versioning + A/B testing'] },
      Q16: { question: 'Do you have experience with agents and tool calling?', options: ['No', 'Read/watched demos', 'Toy project with 1-2 tools', 'Agent with fallback and loop control', 'Agent + observability + guardrails'] },
      Q17: { question: 'How do you evaluate GenAI system quality?', options: ['By feeling', 'Manual testing by myself', 'Test dataset + basic metrics', 'Eval suite with golden set', 'Eval + regressions + cost tracking'] },
      Q18: { question: 'How much experience do you have with deployment (cloud, env, secrets)?', options: ['Never deployed', 'Occasional manual deploy', 'Deploy with env vars + secrets', 'CI/CD + staging + prod', 'CI/CD + monitoring + cost awareness'] },
      Q19: { question: 'How much do you consider security, PII, and cost control in GenAI apps?', options: ['Never thought about it', 'I know they exist', 'I manage them at a basic level', 'Token limits + caching + sanitization', 'Full security + abuse protection + budget control'] },
      Q20: { question: 'How much public proof do you have today (repo, demo, write-up)?', options: ['Nothing public', '1 incomplete/private repo', '1 decent public repo', 'Repo + README + hosted demo', 'Live demo + eval report + write-up'] },
    },
    apiErrors: {
      invalidEmail: 'Invalid email.',
      missingAnswers: 'Missing answers.',
      privacyRequired: 'You must accept privacy consent to submit the Role Fit Audit.',
      serverError: 'Server error',
      submitError: 'Submission error',
    },
  },
}
