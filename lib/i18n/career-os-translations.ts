export type CareerOSLocale = 'it' | 'en'

export const CAREER_OS_DEFAULT_LOCALE: CareerOSLocale = 'it'
export const CAREER_OS_QUERY_PARAM = 'lang'

export function isCareerOSLocale(value: unknown): value is CareerOSLocale {
  return value === 'it' || value === 'en'
}

export function normalizeCareerOSLocale(value: unknown): CareerOSLocale {
  if (typeof value !== 'string') return CAREER_OS_DEFAULT_LOCALE
  return value.toLowerCase() === 'en' ? 'en' : 'it'
}

interface CareerOSFaqItem {
  question: string
  answer: string
}

interface CareerOSCourseOffer {
  name: string
  description: string
  price: string
}

export interface CareerOSTranslations {
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
    ctaPrimary: string
    ctaSecondary: string
    marketLabel: string
  }
  problem: {
    title: string
    titleAccent: string
    items: Array<{ title: string; description: string }>
  }
  aiExpert: {
    badge: string
    title: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
  }
  socialProof: {
    badge: string
    title: string
    subtitle: string
    qualityTitle: string
    qualitySubtitle: string
    cta: string
    standards: string[]
    cards: Array<{ title: string; description: string; articleLabel?: string }>
  }
  journey: {
    sectionTitle: string
  }
  pricing: {
    title: string
    titleAccent: string
    roiOldLabel: string
    roiNewLabel: string
    roiTagline: string
    classComingSoon: string
    recommended: string
    applyNow: string
    guaranteeLine: string
    paymentLine: string
    auditCardTitle: string
    auditCardBody: string
    auditCardCta: string
    deadlinePrefix: string
    priceOnRequest: string
    unlockPriceCta: string
    revealTitle: string
    revealSubtitle: string
    revealEmailLabel: string
    revealPrivacyLabelPrefix: string
    revealMarketingLabel: string
    revealPrivacyPolicy: string
    revealTerms: string
    revealTermsConsentLabel: string
    revealButton: string
    revealError: string
    revealSubmitError: string
    revealSuccess: string
    revealMarketingConfirmHint: string
    priceUnlocked: string
  }
  faq: {
    title: string
    categories: {
      fit: string
      method: string
      logistics: string
    }
    contactPrefix: string
    contactLink: string
    contactSuffix: string
    items: {
      fit: CareerOSFaqItem[]
      method: CareerOSFaqItem[]
      logistics: CareerOSFaqItem[]
    }
  }
  applicationModal: {
    stepLabel: string
    title: string
    subtitle: string
    close: string
    successTitle: string
    successSubtitle: string
    bookCallNow: string
    back: string
    continue: string
    submit: string
    submitting: string
    closeCta: string
    fields: {
      fullName: string
      email: string
      phoneOptional: string
      background: string
      roleTarget: string
      timeline: string
      mainBlock: string
      applicationsLastMonth: string
      linkedinOptional: string
      notesOptional: string
      selectPlaceholder: string
      privacyLabelPrefix: string
      privacyPolicy: string
      terms: string
    }
    errors: {
      nameRequired: string
      emailRequired: string
      invalidEmail: string
      backgroundRequired: string
      roleRequired: string
      timelineRequired: string
      blockRequired: string
      applicationsRequired: string
      privacyRequired: string
      submitFailed: string
    }
    options: {
      background: string[]
      roleTarget: string[]
      timeline: string[]
      mainBlock: string[]
      applicationsLastMonth: string[]
    }
  }
  auditModal: {
    badge: string
    title: string
    subtitle: string
    close: string
    successTitle: string
    successSubtitle: string
    closeCta: string
    submit: string
    submitting: string
    addSlot: string
    labels: {
      fullName: string
      email: string
      doubt: string
      doubtPlaceholder: string
      availability: string
      phoneOptional: string
      privacyLabelPrefix: string
      privacyPolicy: string
      terms: string
    }
    errors: {
      generic: string
    }
  }
  apiErrors: {
    apply: {
      nameRequired: string
      invalidEmail: string
      backgroundRequired: string
      roleRequired: string
      privacyRequired: string
      serverError: string
      notConfigured: string
    }
    audit: {
      nameRequired: string
      invalidEmail: string
      privacyRequired: string
      doubtRequired: string
      serverError: string
    }
    waitlist: {
      invalidEmail: string
      privacyRequired: string
      termsRequired: string
      intentRequired: string
      serverError: string
    }
  }
  jsonLd: {
    courseName: string
    courseDescription: string
    audienceType: string
    teaches: string[]
    offers: CareerOSCourseOffer[]
    faq: CareerOSFaqItem[]
    breadcrumbHome: string
    breadcrumbCurrent: string
  }
}

const commonOfferUrl = '/career-os#pricing'

export const careerOSTranslations: Record<CareerOSLocale, CareerOSTranslations> = {
  it: {
    meta: {
      title: 'Career OS, Il Percorso per Diventare GenAI Engineer',
      description:
        'Smetti di mandare CV a vuoto. Career OS ti prepara per ruoli Applied GenAI in 4-8 settimane: Role-fit, CV ottimizzato, Proof pubblica, Interview prep. Da chi assume, non da career coach.',
      keywords: [
        'GenAI Engineer',
        'Career mentoring AI',
        'corso AI Italia',
        'Applied GenAI',
        'RAG engineer',
        'AI career',
        'mentorship AI',
        'diventare AI engineer',
        'lavoro intelligenza artificiale',
      ],
      openGraphLocale: 'it_IT',
      imageAlt: 'Career OS - Sistema per Diventare GenAI Engineer',
    },
    localeToggle: {
      label: 'Lingua della pagina Career OS',
      italian: 'Italiano',
      english: 'English',
    },
    hero: {
      ctaPrimary: 'Vedi cosa costruirai',
      ctaSecondary: 'Richiedi un audit gratuito (15 min)',
      marketLabel: 'Mercato AI in Italia',
    },
    problem: {
      title: 'Perché non ti chiamano',
      titleAccent: '(anche se sai programmare)',
      items: [
        {
          title: 'Nessun target',
          description: '"Cerco un ruolo AI" non basta. Serve: RAG Engineer, Agent Engineer, GenAI Product.',
        },
        {
          title: 'CV generico',
          description: 'I recruiter cercano: RAG, Agents, Evaluation. "Appassionato di AI" = cestino.',
        },
        {
          title: 'Zero proof',
          description: 'Servono: demo funzionante, repo pulita, evaluation con metriche reali.',
        },
      ],
    },
    aiExpert: {
      badge: 'Il Nostro Differenziatore',
      title: 'AI Expert Guidance',
      subtitle: 'Impari da chi assume per questi ruoli, non da career coach generici.',
      ctaPrimary: 'Vedi cosa costruirai →',
      ctaSecondary: 'Hai dei dubbi? Parliamone',
    },
    socialProof: {
      badge: 'Cosa Costruirai',
      title: 'Output tangibili, non slide',
      subtitle: "Ogni partecipante esce con asset verificabili che riducono il rischio percepito per l'hiring manager.",
      qualityTitle: 'Standard di qualità inclusi',
      qualitySubtitle: 'Ogni progetto segue checklist da engineering professionale.',
      cta: 'Scopri il percorso →',
      standards: ['Definition of Done', 'Evaluation Harness', 'Decision Log', 'Peer Review'],
      cards: [
        {
          title: 'Repo + Demo',
          description: 'GitHub pubblico con demo riproducibile. Esempio: progetto "HairStyle Try-On" con AI generativa.',
        },
        {
          title: 'CV Personalizzato su JD',
          description: 'CV tailored automatico su ogni job description, con keyword match e formatting ottimizzato.',
        },
        {
          title: 'Write-up Tecnico',
          description: 'Articolo pubblicato su stAI tuned che dimostra le tue competenze.',
          articleLabel: 'CAG vs RAG: Which Enterprise AI Approach Wins?',
        },
      ],
    },
    journey: {
      sectionTitle: 'Il percorso',
    },
    pricing: {
      title: 'Investi nel tuo',
      titleAccent: 'ROI',
      roiOldLabel: 'Bootcamp Tradizionali',
      roiNewLabel: 'Career OS (Start / Pro)',
      roiTagline: 'Non vendiamo ore. Vendiamo CV, Proof Pubblica, Interview Readiness.',
      classComingSoon: 'Classe (Coming Soon)',
      recommended: 'Consigliato',
      applyNow: 'Candidati Ora →',
      guaranteeLine:
        "🛡️ Garanzia 15 giorni: rimborso completo se richiesto entro 15 giorni dall'inizio e prima della consegna del primo deliverable.",
      paymentLine: '💳 Pagamento in rate disponibile • Nessun abbonamento nascosto',
      auditCardTitle: 'Hai ancora dei dubbi? Parliamone.',
      auditCardBody: 'Prenota una video-call gratuita di 15 minuti per capire se Career OS è il percorso giusto per i tuoi obiettivi.',
      auditCardCta: 'Prenota video-call (15 min)',
      deadlinePrefix: 'Scadenza',
      priceOnRequest: 'Prezzo su richiesta',
      unlockPriceCta: 'Entra in lista di attesa',
      revealTitle: 'Sblocca il prezzo del pacchetto',
      revealSubtitle: 'Inserisci la tua email per entrare in lista di attesa sul piano selezionato.',
      revealEmailLabel: 'Email',
      revealPrivacyLabelPrefix: 'Accetto il trattamento dei dati personali come descritto nella',
      revealMarketingLabel: 'Voglio ricevere aggiornamenti e offerte su Career OS via email (facoltativo).',
      revealPrivacyPolicy: 'Privacy Policy',
      revealTerms: 'Termini',
      revealTermsConsentLabel: 'Accetto i Termini e Condizioni del servizio.',
      revealButton: 'Entra in lista',
      revealError: 'Inserisci una email valida.',
      revealSubmitError: 'Invio non riuscito. Riprova tra qualche minuto.',
      revealSuccess: 'Perfetto, sei in lista di attesa. Ti contatteremo presto.',
      revealMarketingConfirmHint: 'Controlla la tua email e conferma il consenso marketing per ricevere aggiornamenti.',
      priceUnlocked: 'Prezzo sbloccato',
    },
    faq: {
      title: 'Domande Frequenti',
      categories: {
        fit: 'Fit & Requisiti',
        method: 'Metodo e Garanzie',
        logistics: 'Tempi & Costi',
      },
      contactPrefix: 'Hai altre domande?',
      contactLink: 'Scrivici',
      contactSuffix: "o prenota l'audit gratuito.",
      items: {
        fit: [
          {
            question: 'È il percorso adatto a me?',
            answer:
              'Sì, se hai background tecnico (dev/data), sei junior/early-career e cerchi ruoli Applied AI (RAG, Agents).',
          },
          {
            question: 'Che requisiti servono?',
            answer:
              'Serve familiarità con codice (Python/JS). Non serve sapere di AI/LLM: se sai scrivere una funzione e usare Git, sei pronto.',
          },
        ],
        method: [
          {
            question: 'Perché NON è il solito bootcamp?',
            answer:
              'Non vendiamo ore di video: costruisci asset (CV, GitHub, Proof) e ricevi feedback da chi assume.',
          },
          {
            question: 'Garantite il lavoro?',
            answer:
              'No. Ti forniamo il sistema e gli asset per essere preso sul serio e arrivare ai colloqui con credibilità.',
          },
        ],
        logistics: [
          {
            question: 'Quanto impegno richiede?',
            answer: '5-8 ore a settimana, in modalità compatibile con studio o lavoro.',
          },
          {
            question: 'Come funziona il pagamento?',
            answer: 'Pagamento in unica soluzione o in 2-3 rate mensili senza interessi.',
          },
        ],
      },
    },
    applicationModal: {
      stepLabel: 'Step',
      title: 'Application Career OS',
      subtitle: 'Completa i 4 step. Ci serve solo il minimo per capire il tuo fit.',
      close: 'Chiudi',
      successTitle: 'Application inviata',
      successSubtitle: 'Ti rispondiamo entro 48 ore con i prossimi step.',
      bookCallNow: 'Prenota call adesso',
      back: 'Indietro',
      continue: 'Continua',
      submit: 'Invia application',
      submitting: 'Invio...',
      closeCta: 'Chiudi',
      fields: {
        fullName: 'Nome e Cognome',
        email: 'Email',
        phoneOptional: 'Telefono (Opzionale)',
        background: 'Background',
        roleTarget: 'Ruolo target',
        timeline: 'Timeline',
        mainBlock: 'Blocco principale',
        applicationsLastMonth: 'Candidature ultimo mese',
        linkedinOptional: 'LinkedIn URL (opzionale)',
        notesOptional: 'Note aggiuntive (opzionale)',
        selectPlaceholder: 'Seleziona',
        privacyLabelPrefix: 'Accetto il trattamento dei dati personali come descritto nella',
        privacyPolicy: 'Privacy Policy',
        terms: 'Termini',
      },
      errors: {
        nameRequired: 'Inserisci il tuo nome.',
        emailRequired: 'Inserisci una email valida.',
        invalidEmail: 'Formato email non valido.',
        backgroundRequired: 'Seleziona il tuo background.',
        roleRequired: 'Seleziona il ruolo target.',
        timelineRequired: 'Seleziona una timeline.',
        blockRequired: 'Seleziona il blocco principale.',
        applicationsRequired: 'Seleziona il numero di candidature.',
        privacyRequired: 'Devi accettare la privacy policy per procedere.',
        submitFailed: "Errore nell'invio. Riprova.",
      },
      options: {
        background: [
          'Software Engineer (Frontend/Backend)',
          'Data Scientist / Analyst',
          'Studente STEM / Neolaureato',
          'Product / Design / No-Code',
          'Career Switcher (Non-tech)',
          'Altro',
        ],
        roleTarget: [
          'GenAI/AI Engineer (RAG/Agents)',
          'ML Ops / Data Engineer',
          'Product Manager AI',
          'Founder / CTO',
          'Non so ancora',
        ],
        timeline: ['Sto cercando ora', 'Nei prossimi 3 mesi', 'Più avanti'],
        mainBlock: [
          'Manca esperienza pratica (Portfolio)',
          'Voglio ottimizzare le mie candidature',
          'Non passo lo screening CV',
          'Blocco ai colloqui tecnici',
          'Non so cosa studiare (Roadmap)',
          'Altro',
        ],
        applicationsLastMonth: ['0', '1-10', '11-30', '30+'],
      },
    },
    auditModal: {
      badge: 'Parliamone',
      title: 'Hai ancora dei dubbi? Parliamone.',
      subtitle: 'Prenota una video-call gratuita di 15 minuti per capire se Career OS è il percorso giusto per i tuoi obiettivi.',
      close: 'Chiudi',
      successTitle: 'Richiesta ricevuta',
      successSubtitle: 'Un mentor ti contatterà a breve sulla mail indicata.',
      closeCta: 'Chiudi',
      submit: 'Prenota Call',
      submitting: 'Invio...',
      addSlot: 'Aggiungi',
      labels: {
        fullName: 'Nome e Cognome',
        email: 'Email',
        doubt: 'Cosa ti frena?',
        doubtPlaceholder: 'Es: Ho poco tempo / Non so se ho il background giusto...',
        availability: 'Disponibilità per call (Proponi 2-3 orari)',
        phoneOptional: 'Numero di Telefono (Opzionale)',
        privacyLabelPrefix: 'Accetto il trattamento dei dati personali come descritto nella',
        privacyPolicy: 'Privacy Policy',
        terms: 'Termini',
      },
      errors: {
        generic: 'Qualcosa è andato storto. Riprova o scrivici direttamente.',
      },
    },
    apiErrors: {
      apply: {
        nameRequired: 'Nome richiesto.',
        invalidEmail: 'Email non valida.',
        backgroundRequired: 'Background richiesto.',
        roleRequired: 'Ruolo richiesto.',
        privacyRequired: 'Accettazione privacy richiesta.',
        serverError: 'Errore server',
        notConfigured: 'Non configurato',
      },
      audit: {
        nameRequired: 'Nome richiesto.',
        invalidEmail: 'Email non valida.',
        privacyRequired: 'Accettazione privacy richiesta.',
        doubtRequired: 'Dubbio richiesto.',
        serverError: 'Errore server',
      },
      waitlist: {
        invalidEmail: 'Email non valida.',
        privacyRequired: 'Accettazione privacy richiesta.',
        termsRequired: 'Accettazione termini richiesta.',
        intentRequired: 'Intent non valido.',
        serverError: 'Errore server',
      },
    },
    jsonLd: {
      courseName: 'Career OS - Percorso GenAI Engineer',
      courseDescription:
        'Programma di mentorship intensivo per diventare GenAI Engineer in 4-8 settimane. Non un corso teorico: costruisci asset professionali (CV, Proof GitHub, Interview Skills).',
      audienceType: 'Junior developers, Data professionals, Career changers targeting AI roles',
      teaches: [
        'GenAI Engineering',
        'Applied AI (RAG, Agents)',
        'AI Career Strategy',
        'Technical Interview Preparation',
        'Portfolio Development',
      ],
      offers: [
        { name: 'Starter', description: 'Accesso base al percorso Career OS', price: '590' },
        { name: 'Pro', description: 'Percorso completo con mentorship 1:1', price: '1190' },
        { name: 'Premium', description: 'Percorso intensivo con supporto prioritario', price: '1990' },
      ],
      faq: [
        {
          question: 'È il percorso adatto a me?',
          answer:
            'Sì, se hai background tecnico (dev/data), sei junior/early-career e cerchi ruoli Applied AI (RAG, Agents).',
        },
        {
          question: 'Che requisiti servono?',
          answer: 'Serve familiarità con codice (Python/JS). Se sai scrivere una funzione e usare Git, sei pronto.',
        },
      ],
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Career OS',
    },
  },
  en: {
    meta: {
      title: 'Career OS, The Path to Become a GenAI Engineer',
      description:
        'Stop sending resumes without results. Career OS prepares you for Applied GenAI roles in 4-8 weeks: role fit, optimized CV, public proof, and interview prep.',
      keywords: [
        'GenAI Engineer',
        'AI career mentorship',
        'Applied GenAI program',
        'RAG engineer',
        'AI career path',
        'AI interview prep',
        'become AI engineer',
        'AI jobs Europe',
        'GenAI portfolio',
      ],
      openGraphLocale: 'en_US',
      imageAlt: 'Career OS - System to Become a GenAI Engineer',
    },
    localeToggle: {
      label: 'Career OS page language',
      italian: 'Italian',
      english: 'English',
    },
    hero: {
      ctaPrimary: 'See what you will build',
      ctaSecondary: 'Request a free audit (15 min)',
      marketLabel: 'AI market in Italy',
    },
    problem: {
      title: 'Why recruiters are not calling you',
      titleAccent: '(even if you can code)',
      items: [
        {
          title: 'No target',
          description: '"I want an AI role" is too generic. You need a clear target: RAG Engineer, Agent Engineer, GenAI Product.',
        },
        {
          title: 'Generic CV',
          description: 'Recruiters look for RAG, Agents, Evaluation. "AI enthusiast" usually gets ignored.',
        },
        {
          title: 'No proof',
          description: 'You need a working demo, a clean repo, and evaluation with real metrics.',
        },
      ],
    },
    aiExpert: {
      badge: 'Our Differentiator',
      title: 'AI Expert Guidance',
      subtitle: 'Learn from people hiring for these roles, not generic career coaches.',
      ctaPrimary: 'See what you will build →',
      ctaSecondary: 'Have doubts? Let us talk',
    },
    socialProof: {
      badge: 'What You Will Build',
      title: 'Tangible outputs, not slides',
      subtitle: 'Every participant exits with verifiable assets that reduce hiring risk for managers.',
      qualityTitle: 'Quality standards included',
      qualitySubtitle: 'Each project follows professional engineering checklists.',
      cta: 'Explore the journey →',
      standards: ['Definition of Done', 'Evaluation Harness', 'Decision Log', 'Peer Review'],
      cards: [
        {
          title: 'Repo + Demo',
          description: 'Public GitHub with reproducible demo. Example: generative AI "HairStyle Try-On" project.',
        },
        {
          title: 'JD-tailored CV',
          description: 'Automatically tailored CV for each job description with keyword match and optimized formatting.',
        },
        {
          title: 'Technical write-up',
          description: 'Published article on stAI tuned proving your skills.',
          articleLabel: 'CAG vs RAG: Which Enterprise AI Approach Wins?',
        },
      ],
    },
    journey: {
      sectionTitle: 'The journey',
    },
    pricing: {
      title: 'Invest in your',
      titleAccent: 'ROI',
      roiOldLabel: 'Traditional Bootcamps',
      roiNewLabel: 'Career OS (Start / Pro)',
      roiTagline: 'We do not sell hours. We sell CV, public proof, and interview readiness.',
      classComingSoon: 'Class (Coming Soon)',
      recommended: 'Recommended',
      applyNow: 'Apply Now →',
      guaranteeLine:
        '🛡️ 15-day guarantee: full refund if requested within 15 days from start and before the first deliverable.',
      paymentLine: '💳 Installments available • No hidden subscription',
      auditCardTitle: 'Still have doubts? Let us talk.',
      auditCardBody: 'Book a free 15-minute video call to understand if Career OS is the right path for your goals.',
      auditCardCta: 'Book video call (15 min)',
      deadlinePrefix: 'Deadline',
      priceOnRequest: 'Price on request',
      unlockPriceCta: 'Join the waitlist',
      revealTitle: 'Unlock package price',
      revealSubtitle: 'Enter your email to join the waitlist for the selected plan.',
      revealEmailLabel: 'Email',
      revealPrivacyLabelPrefix: 'I accept personal data processing as described in the',
      revealMarketingLabel: 'I want to receive Career OS updates and offers by email (optional).',
      revealPrivacyPolicy: 'Privacy Policy',
      revealTerms: 'Terms',
      revealTermsConsentLabel: 'I accept the Terms and Conditions of the service.',
      revealButton: 'Join waitlist',
      revealError: 'Please enter a valid email.',
      revealSubmitError: 'Submission failed. Please retry in a few minutes.',
      revealSuccess: 'You are on the waitlist. We will contact you soon.',
      revealMarketingConfirmHint: 'Check your inbox and confirm marketing consent to receive updates.',
      priceUnlocked: 'Price unlocked',
    },
    faq: {
      title: 'Frequently Asked Questions',
      categories: {
        fit: 'Fit & Requirements',
        method: 'Method & Guarantees',
        logistics: 'Timing & Costs',
      },
      contactPrefix: 'Do you have more questions?',
      contactLink: 'Write to us',
      contactSuffix: 'or book a free audit.',
      items: {
        fit: [
          {
            question: 'Is this path right for me?',
            answer:
              'Yes, if you have a technical background (dev/data), are junior or early-career, and target Applied AI roles (RAG, Agents).',
          },
          {
            question: 'What requirements are needed?',
            answer:
              'You need coding familiarity (Python/JS). You do not need AI/LLM knowledge to start: if you can write a function and use Git, you are ready.',
          },
        ],
        method: [
          {
            question: 'Why is this NOT the usual bootcamp?',
            answer:
              'We do not sell passive video hours: you build assets (CV, GitHub, proof) and receive feedback from real hiring professionals.',
          },
          {
            question: 'Do you guarantee a job?',
            answer:
              'No. We provide the system and assets that make you credible and interview-ready.',
          },
        ],
        logistics: [
          {
            question: 'How much time does it require?',
            answer: '5-8 hours per week, designed for people working or studying.',
          },
          {
            question: 'How does payment work?',
            answer: 'One-time payment or 2-3 monthly installments with no interest.',
          },
        ],
      },
    },
    applicationModal: {
      stepLabel: 'Step',
      title: 'Career OS Application',
      subtitle: 'Complete 4 steps. We only need the minimum to evaluate your fit.',
      close: 'Close',
      successTitle: 'Application sent',
      successSubtitle: 'We will reply within 48 hours with next steps.',
      bookCallNow: 'Book a call now',
      back: 'Back',
      continue: 'Continue',
      submit: 'Submit application',
      submitting: 'Sending...',
      closeCta: 'Close',
      fields: {
        fullName: 'Full name',
        email: 'Email',
        phoneOptional: 'Phone (Optional)',
        background: 'Background',
        roleTarget: 'Target role',
        timeline: 'Timeline',
        mainBlock: 'Main blocker',
        applicationsLastMonth: 'Applications in the last month',
        linkedinOptional: 'LinkedIn URL (optional)',
        notesOptional: 'Additional notes (optional)',
        selectPlaceholder: 'Select',
        privacyLabelPrefix: 'I accept personal data processing as described in the',
        privacyPolicy: 'Privacy Policy',
        terms: 'Terms',
      },
      errors: {
        nameRequired: 'Please enter your name.',
        emailRequired: 'Please enter a valid email.',
        invalidEmail: 'Invalid email format.',
        backgroundRequired: 'Please select your background.',
        roleRequired: 'Please select your target role.',
        timelineRequired: 'Please select a timeline.',
        blockRequired: 'Please select your main blocker.',
        applicationsRequired: 'Please select the number of applications.',
        privacyRequired: 'You must accept the privacy policy to continue.',
        submitFailed: 'Submission failed. Please try again.',
      },
      options: {
        background: [
          'Software Engineer (Frontend/Backend)',
          'Data Scientist / Analyst',
          'STEM Student / Recent Graduate',
          'Product / Design / No-Code',
          'Career Switcher (Non-tech)',
          'Other',
        ],
        roleTarget: [
          'GenAI/AI Engineer (RAG/Agents)',
          'ML Ops / Data Engineer',
          'AI Product Manager',
          'Founder / CTO',
          'I am not sure yet',
        ],
        timeline: ['I am looking now', 'Within the next 3 months', 'Later on'],
        mainBlock: [
          'Missing hands-on experience (Portfolio)',
          'I want to optimize my applications',
          'I fail CV screening',
          'I get blocked in technical interviews',
          'I do not know what to study (Roadmap)',
          'Other',
        ],
        applicationsLastMonth: ['0', '1-10', '11-30', '30+'],
      },
    },
    auditModal: {
      badge: 'Let us talk',
      title: 'Still have doubts? Let us talk.',
      subtitle: 'Book a free 15-minute video call to check if Career OS is the right path for your goals.',
      close: 'Close',
      successTitle: 'Request received',
      successSubtitle: 'A mentor will contact you soon at the provided email.',
      closeCta: 'Close',
      submit: 'Book Call',
      submitting: 'Sending...',
      addSlot: 'Add',
      labels: {
        fullName: 'Full name',
        email: 'Email',
        doubt: 'What is blocking you?',
        doubtPlaceholder: 'Ex: I have little time / I am not sure I have the right background...',
        availability: 'Availability for call (propose 2-3 slots)',
        phoneOptional: 'Phone number (optional)',
        privacyLabelPrefix: 'I accept personal data processing as described in the',
        privacyPolicy: 'Privacy Policy',
        terms: 'Terms',
      },
      errors: {
        generic: 'Something went wrong. Please retry or contact us directly.',
      },
    },
    apiErrors: {
      apply: {
        nameRequired: 'Name is required.',
        invalidEmail: 'Valid email is required.',
        backgroundRequired: 'Background is required.',
        roleRequired: 'Target role is required.',
        privacyRequired: 'Privacy acceptance is required.',
        serverError: 'Server error',
        notConfigured: 'Not configured',
      },
      audit: {
        nameRequired: 'Name is required.',
        invalidEmail: 'Valid email is required.',
        privacyRequired: 'Privacy acceptance is required.',
        doubtRequired: 'Doubt is required.',
        serverError: 'Server error',
      },
      waitlist: {
        invalidEmail: 'Valid email is required.',
        privacyRequired: 'Privacy acceptance is required.',
        termsRequired: 'Terms acceptance is required.',
        intentRequired: 'Invalid intent.',
        serverError: 'Server error',
      },
    },
    jsonLd: {
      courseName: 'Career OS - GenAI Engineer Path',
      courseDescription:
        'Intensive mentorship program to become a GenAI Engineer in 4-8 weeks. Not passive theory: build professional assets (CV, GitHub proof, interview skills).',
      audienceType: 'Junior developers, data professionals, and career switchers targeting AI roles',
      teaches: [
        'GenAI Engineering',
        'Applied AI (RAG, Agents)',
        'AI Career Strategy',
        'Technical Interview Preparation',
        'Portfolio Development',
      ],
      offers: [
        { name: 'Starter', description: 'Entry access to Career OS', price: '590' },
        { name: 'Pro', description: 'Complete path with 1:1 mentorship', price: '1190' },
        { name: 'Premium', description: 'Intensive path with priority support', price: '1990' },
      ],
      faq: [
        {
          question: 'Is this path right for me?',
          answer:
            'Yes, if you have a technical background (dev/data), are junior or early-career, and target Applied AI roles (RAG, Agents).',
        },
        {
          question: 'What requirements are needed?',
          answer: 'Coding familiarity (Python/JS) is enough. If you can write a function and use Git, you can start.',
        },
      ],
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Career OS',
    },
  },
}

export function getCareerOSTranslations(locale: CareerOSLocale): CareerOSTranslations {
  return careerOSTranslations[locale]
}

export const CAREER_OS_PRICING_URL = commonOfferUrl
