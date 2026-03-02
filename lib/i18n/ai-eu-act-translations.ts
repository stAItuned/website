export type AiEuActLocale = 'it' | 'en'

export const AI_EU_ACT_DEFAULT_LOCALE: AiEuActLocale = 'it'
export const AI_EU_ACT_QUERY_PARAM = 'lang'

export function isAiEuActLocale(value: unknown): value is AiEuActLocale {
  return value === 'it' || value === 'en'
}

export function normalizeAiEuActLocale(value: unknown): AiEuActLocale {
  if (typeof value !== 'string') return AI_EU_ACT_DEFAULT_LOCALE
  return value.toLowerCase() === 'en' ? 'en' : 'it'
}

interface AiEuActMetric {
  value: string
  label: string
  sourceLabel: string
  sourceUrl: string
}

interface AiEuActPainItem {
  title: string
  description: string
  risk: string
}

interface AiEuActStepItem {
  title: string
  outcome: string
  action: string
}

interface ToolkitTabBase {
  id: string
  tabLabel: string
  title: string
  description: string
  locked: string
}

interface ToolkitPdfTab extends ToolkitTabBase {
  kind: 'pdf'
  pages: Array<{
    id: string
    label: string
    src: string
  }>
}

interface ToolkitExcelTab extends ToolkitTabBase {
  kind: 'excel'
  sheets: Array<{
    id: string
    label: string
    rows: string[][]
  }>
}

export type AiEuActToolkitTab = ToolkitPdfTab | ToolkitExcelTab

export interface AiEuActTranslations {
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
    title: string
    subtitle: string
    cta: string
    trustLine: string
  }
  whyNow: {
    title: string
    subtitle: string
    metricsTitle: string
    sourcePrefix: string
    metrics: AiEuActMetric[]
    painsTitle: string
    pains: AiEuActPainItem[]
  }
  practicalSteps: {
    title: string
    subtitle: string
    items: AiEuActStepItem[]
  }
  unlockOffer: {
    title: string
    subtitle: string
    items: string[]
  }
  toolkitPreviewTabs: {
    title: string
    subtitle: string
    unlockMessage: string
    cta: string
    ui: {
      lockedLabel: string
      previousPageAria: string
      nextPageAria: string
      goToPageAriaPrefix: string
    }
    tabs: AiEuActToolkitTab[]
  }
  form: {
    title: string
    subtitle: string
    fields: {
      name: string
      email: string
      company: string
      role: string
      roleOptions: string[]
    }
    consent: {
      privacyPolicyPrefix: string
      privacyPolicyLabel: string
      dataProcessing: string
      marketing: string
      helper: string
    }
    submit: string
    loading: string
    success: string
    error: string
  }
  faqTitle: string
  faqItems: Array<{ question: string; answer: string }>
  finalCta: {
    prefix: string
    button: string
  }
}

export const aiEuActTranslations: Record<AiEuActLocale, AiEuActTranslations> = {
  it: {
    meta: {
      title: 'AI EU Act: guida pratica per mettersi in regola | stAItuned',
      description:
        'Scopri cosa comporta davvero l\'AI Act UE e quali passi pratici fare ora: mappatura sistemi AI, classificazione del rischio, governance, alfabetizzazione AI e roadmap operativa.',
      keywords: [
        'AI Act UE',
        'compliance AI',
        'AI governance',
        'AI inventory',
        'Regolamento UE 2024/1689',
        'AI literacy',
      ],
      openGraphLocale: 'it_IT',
      imageAlt: 'AI EU Act: strategia operativa per la compliance',
    },
    localeToggle: {
      label: 'Lingua pagina AI EU Act',
      italian: 'Italiano',
      english: 'English',
    },
    hero: {
      badge: 'Regolamento UE 2024/1689',
      title: 'AI EU Act: comprendi gli obblighi e avvia subito il piano operativo.',
      subtitle: 'Toolkit pratico con roadmap, mappatura AI e priorita operative per i prossimi 90 giorni.',
      cta: 'Sblocca le risorse',
      trustLine: 'Fonti ufficiali UE · Approccio pratico per business e tecnologia · Strumenti pronti all\'uso',
    },
    whyNow: {
      title: 'Perche agire ora',
      subtitle: 'Ritardare aumenta rischio sanzionatorio e complessita operativa.',
      metricsTitle: 'Dati chiave',
      sourcePrefix: 'Fonte',
      metrics: [
        {
          value: '68%',
          label: 'delle aziende UE fatica a interpretare il regolamento.',
          sourceLabel: 'AWS / Strand Partners, 2025',
          sourceUrl: 'https://aws.amazon.com/blogs/machine-learning/building-trust-in-ai-the-aws-approach-to-the-eu-ai-act/',
        },
        {
          value: 'EUR 35M o 7%',
          label: 'sanzione massima per pratiche vietate (Art. 99).',
          sourceLabel: 'Reg. UE 2024/1689',
          sourceUrl: 'https://artificialintelligenceact.eu/article/99/',
        },
      ],
      painsTitle: 'Rischi pratici',
      pains: [
        {
          title: 'Inventario AI incompleto',
          description: 'I sistemi AI sono distribuiti tra tool esterni e flussi interni.',
          risk: 'Rischio pratico: audit incompleto e responsabilita non tracciate.',
        },
        {
          title: 'Governance non assegnata',
          description: 'Legal, CTO, HR e procurement lavorano senza una regia unica.',
          risk: 'Rischio pratico: ritardi su policy, controlli e formazione obbligatoria.',
        },
        {
          title: 'Esecuzione troppo teorica',
          description: 'Le policy esistono, ma manca una roadmap operativa.',
          risk: 'Rischio pratico: gap aperti vicino alle scadenze di applicazione.',
        },
      ],
    },
    practicalSteps: {
      title: 'Piano operativo in 90 giorni',
      subtitle: 'Cinque passaggi per passare dalla teoria all\'esecuzione.',
      items: [
        {
          title: '1. Mappa i sistemi AI',
          outcome: 'Risultato: mappa completa di strumenti, responsabili e casi d\'uso.',
          action: 'Azione: censisci sistemi, dati trattati e impatto sulle persone.',
        },
        {
          title: '2. Classifica il rischio',
          outcome: 'Risultato: priorita definite e ruolo deployer/provider chiarito.',
          action: 'Azione: identifica sistemi ad alto rischio e usi vietati.',
        },
        {
          title: '3. Definisci la governance',
          outcome: 'Risultato: responsabilita e controlli formalizzati.',
          action: 'Azione: definisci policy, monitoraggio e gestione incidenti.',
        },
        {
          title: '4. Attiva l\'alfabetizzazione AI',
          outcome: 'Risultato: piano formativo coerente con ruoli e rischio.',
          action: 'Azione: attiva training obbligatorio per i team coinvolti.',
        },
        {
          title: '5. Esegui la roadmap a 90 giorni',
          outcome: 'Risultato: backlog compliance con milestone verificabili.',
          action: 'Azione: assegna owner, priorita e scadenze esecutive.',
        },
      ],
    },
    unlockOffer: {
      title: 'Cosa ricevi subito',
      subtitle: 'Un pacchetto unico per partire senza perdere settimane.',
      items: [
        'Playbook operativo AI Act (PDF)',
        'Roadmap italiana di adeguamento AI (PDF)',
        'Template mappatura AI e triage rischio (Excel)',
      ],
    },
    toolkitPreviewTabs: {
      title: 'Anteprima toolkit',
      subtitle: 'Un unico visualizzatore a schede: sfoglia le anteprime e sblocca la versione completa.',
      unlockMessage: 'Compila il form per sbloccare i contenuti completi.',
      cta: 'Vai al form di sblocco',
      ui: {
        lockedLabel: 'Bloccato',
        previousPageAria: 'Pagina precedente dell\'anteprima',
        nextPageAria: 'Pagina successiva dell\'anteprima',
        goToPageAriaPrefix: 'Vai a',
      },
      tabs: [
        {
          id: 'playbook',
          kind: 'pdf',
          tabLabel: 'Guida operativa',
          title: 'Playbook operativo AI Act',
          description: 'Timeline, ruoli e checklist operative.',
          locked: 'Sezioni avanzate bloccate',
          pages: [
            {
              id: 'playbook-1',
              label: 'Playbook - Pagina 1',
              src: '/assets/ai-eu-act/AI_Act_Operational_Playbook.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit',
            },
            {
              id: 'playbook-2',
              label: 'Playbook - Pagina 2',
              src: '/assets/ai-eu-act/AI_Act_Operational_Playbook.pdf#page=2&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit',
            },
          ],
        },
        {
          id: 'roadmap',
          kind: 'pdf',
          tabLabel: 'Roadmap',
          title: 'Roadmap italiana di adeguamento AI',
          description: 'Sequenza operativa per il contesto italiano.',
          locked: 'Roadmap completa bloccata',
          pages: [
            {
              id: 'roadmap-1',
              label: 'Roadmap - Pagina 1',
              src: '/assets/ai-eu-act/Italian_AI_Compliance_Roadmap.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit',
            },
            {
              id: 'roadmap-2',
              label: 'Roadmap - Pagina 2',
              src: '/assets/ai-eu-act/Italian_AI_Compliance_Roadmap.pdf#page=2&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit',
            },
          ],
        },
        {
          id: 'template',
          kind: 'excel',
          tabLabel: 'Modello',
          title: 'Template mappatura AI e triage rischio',
          description: 'Template per mappatura e triage in formato Excel.',
          locked: 'Template completo bloccato',
          sheets: [
            {
              id: 'template-1',
              label: 'Modello - Scheda Inventario',
              rows: [
                ['Sistema', 'Responsabile', 'Uso', 'Rischio'],
                ['Assistente CRM', 'Sales', 'Interno', 'Medio'],
                ['Valutatore CV', 'HR', 'Supporto decisionale', 'Alto'],
                ['Bot Assistenza', 'CX', 'Pubblico', 'Basso'],
              ],
            },
            {
              id: 'template-2',
              label: 'Modello - Scheda Triage Rischio',
              rows: [
                ['Controllo', 'Stato', 'Responsabile', 'Scadenza'],
                ['Inventario AI', 'In corso', 'CTO', '10g'],
                ['Piano formazione', 'Pianificato', 'HR', '21g'],
                ['Revisione rischio', 'Aperto', 'Legal', '14g'],
              ],
            },
          ],
        },
      ],
    },
    form: {
      title: 'Sblocca il toolkit operativo AI EU Act',
      subtitle: 'Compila il form e accedi subito alla libreria risorse dedicata.',
      fields: {
        name: 'Nome',
        email: 'Email',
        company: 'Azienda (opzionale)',
        role: 'Ruolo',
        roleOptions: ['CEO', 'CTO', 'Legal & Compliance', 'HR', 'Consulente', 'Altro'],
      },
      consent: {
        privacyPolicyPrefix: 'Ho letto e accetto la',
        privacyPolicyLabel: 'Privacy Policy',
        dataProcessing: 'Acconsento al trattamento dati per ricevere le risorse richieste.',
        marketing: 'Acconsento a ricevere aggiornamenti e contenuti marketing (opzionale).',
        helper: 'Trattamento dati conforme GDPR; consenso revocabile in ogni momento.',
      },
      submit: 'Sblocca le risorse',
      loading: 'Invio in corso...',
      success: 'Perfetto, reindirizzamento alle risorse in corso.',
      error: 'Invio non riuscito. Riprova tra qualche istante.',
    },
    faqTitle: 'FAQ rapide',
    faqItems: [
      {
        question: 'L\'AI Act si applica anche a societa extra-UE?',
        answer: 'Si, se offri sistemi o servizi AI nel mercato UE, si applica il perimetro extraterritoriale.',
      },
      {
        question: 'Qual e il massimo rischio sanzionatorio?',
        answer: 'Fino a EUR 35M o 7% del fatturato globale, in base alla tipologia di violazione.',
      },
      {
        question: 'Da dove conviene partire operativamente?',
        answer: 'Dall\'AI Inventory: abilita classificazione rischio, priorita e roadmap di adeguamento.',
      },
    ],
    finalCta: {
      prefix: 'Hai gia il link di accesso?',
      button: 'Apri risorse AI EU Act',
    },
  },
  en: {
    meta: {
      title: 'EU AI Act: practical compliance landing page | stAItuned',
      description:
        'Understand what the EU AI Act means in practice and follow concrete compliance steps: AI inventory, risk triage, governance, AI literacy, and execution roadmap.',
      keywords: ['EU AI Act', 'AI compliance', 'AI governance', 'AI inventory', 'Regulation (EU) 2024/1689', 'AI literacy'],
      openGraphLocale: 'en_US',
      imageAlt: 'EU AI Act: practical operational compliance framework',
    },
    localeToggle: {
      label: 'AI EU Act page language',
      italian: 'Italiano',
      english: 'English',
    },
    hero: {
      badge: 'Regulation (EU) 2024/1689',
      title: 'EU AI Act: understand obligations and launch an execution plan now.',
      subtitle: 'Practical toolkit with roadmap, inventory and priorities for the next 90 days.',
      cta: 'Unlock toolkit',
      trustLine: 'Official EU sources · Practical for business and tech · Execution-ready outputs',
    },
    whyNow: {
      title: 'Why act now',
      subtitle: 'Delay increases enforcement exposure and operational complexity.',
      metricsTitle: 'Key data points',
      sourcePrefix: 'Source',
      metrics: [
        {
          value: '68%',
          label: 'of EU companies report high difficulty interpreting the regulation.',
          sourceLabel: 'AWS / Strand Partners, 2025',
          sourceUrl: 'https://aws.amazon.com/blogs/machine-learning/building-trust-in-ai-the-aws-approach-to-the-eu-ai-act/',
        },
        {
          value: 'EUR 35M or 7%',
          label: 'maximum fine for prohibited practices (Art. 99).',
          sourceLabel: 'Regulation (EU) 2024/1689',
          sourceUrl: 'https://artificialintelligenceact.eu/article/99/',
        },
      ],
      painsTitle: 'Practical risks',
      pains: [
        {
          title: 'Incomplete AI inventory',
          description: 'AI systems are spread across external tools and internal workflows.',
          risk: 'Risk: incomplete audits and unclear accountability.',
        },
        {
          title: 'Governance not assigned',
          description: 'Legal, CTO, HR, and procurement operate without a single owner.',
          risk: 'Risk: delays on policies, controls, and mandatory literacy.',
        },
        {
          title: 'Execution remains theoretical',
          description: 'Policies exist, but operational roadmap and sequencing are missing.',
          risk: 'Risk: open compliance gaps close to enforcement milestones.',
        },
      ],
    },
    practicalSteps: {
      title: '90-day operational plan',
      subtitle: 'Five steps to move from policy to execution.',
      items: [
        {
          title: '1. AI inventory',
          outcome: 'Outcome: complete map of tools, owners, and use cases.',
          action: 'Action: track systems, processed data, and impact on people.',
        },
        {
          title: '2. Risk triage',
          outcome: 'Outcome: priority ranking and deployer/provider role mapping.',
          action: 'Action: flag high-risk systems and prohibited uses early.',
        },
        {
          title: '3. Governance',
          outcome: 'Outcome: formal responsibilities and control framework.',
          action: 'Action: define policies, monitoring, and incident flow.',
        },
        {
          title: '4. AI literacy',
          outcome: 'Outcome: role-based training plan aligned with risk.',
          action: 'Action: launch mandatory literacy for impacted teams.',
        },
        {
          title: '5. 90-day roadmap',
          outcome: 'Outcome: measurable compliance backlog and milestones.',
          action: 'Action: assign owners, priorities, and due dates.',
        },
      ],
    },
    unlockOffer: {
      title: 'What you get immediately',
      subtitle: 'One package to start execution without losing weeks.',
      items: [
        'AI Act Operational Playbook (PDF)',
        'Italian AI Compliance Roadmap (PDF)',
        'AI Inventory Risk Triage Template (Excel)',
      ],
    },
    toolkitPreviewTabs: {
      title: 'Toolkit preview',
      subtitle: 'Single tabbed viewer: browse previews and unlock full versions.',
      unlockMessage: 'Submit the form to unlock complete resources.',
      cta: 'Go to unlock form',
      ui: {
        lockedLabel: 'Locked',
        previousPageAria: 'Previous preview page',
        nextPageAria: 'Next preview page',
        goToPageAriaPrefix: 'Go to',
      },
      tabs: [
        {
          id: 'playbook',
          kind: 'pdf',
          tabLabel: 'Playbook',
          title: 'AI Act Operational Playbook',
          description: 'Timeline, responsibilities, and execution checklist.',
          locked: 'Advanced sections locked',
          pages: [
            {
              id: 'playbook-1',
              label: 'Playbook - Page 1',
              src: '/assets/ai-eu-act/AI_Act_Operational_Playbook.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit',
            },
            {
              id: 'playbook-2',
              label: 'Playbook - Page 2',
              src: '/assets/ai-eu-act/AI_Act_Operational_Playbook.pdf#page=2&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit',
            },
          ],
        },
        {
          id: 'roadmap',
          kind: 'pdf',
          tabLabel: 'Roadmap',
          title: 'Italian AI Compliance Roadmap',
          description: 'Step-by-step plan for the Italian context.',
          locked: 'Full roadmap locked',
          pages: [
            {
              id: 'roadmap-1',
              label: 'Roadmap - Page 1',
              src: '/assets/ai-eu-act/Italian_AI_Compliance_Roadmap.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit',
            },
            {
              id: 'roadmap-2',
              label: 'Roadmap - Page 2',
              src: '/assets/ai-eu-act/Italian_AI_Compliance_Roadmap.pdf#page=2&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit',
            },
          ],
        },
        {
          id: 'template',
          kind: 'excel',
          tabLabel: 'Template',
          title: 'AI Inventory Risk Triage Template',
          description: 'Inventory and triage template in Excel format.',
          locked: 'Full template locked',
          sheets: [
            {
              id: 'template-1',
              label: 'Template - Inventory tab',
              rows: [
                ['System', 'Owner', 'Usage', 'Risk'],
                ['CRM Assistant', 'Sales', 'Internal', 'Medium'],
                ['Hiring Scorer', 'HR', 'Decision Support', 'High'],
                ['Support Bot', 'CX', 'Public', 'Low'],
              ],
            },
            {
              id: 'template-2',
              label: 'Template - Risk Triage tab',
              rows: [
                ['Control', 'Status', 'Owner', 'Due'],
                ['AI Inventory', 'In progress', 'CTO', '10d'],
                ['Literacy Plan', 'Planned', 'HR', '21d'],
                ['Risk Review', 'Open', 'Legal', '14d'],
              ],
            },
          ],
        },
      ],
    },
    form: {
      title: 'Unlock the AI EU Act operational toolkit',
      subtitle: 'Submit the form and access the dedicated resources library.',
      fields: {
        name: 'Name',
        email: 'Email',
        company: 'Company (optional)',
        role: 'Role',
        roleOptions: ['CEO', 'CTO', 'Legal & Compliance', 'HR', 'Consultant', 'Other'],
      },
      consent: {
        privacyPolicyPrefix: 'I have read and accept the',
        privacyPolicyLabel: 'Privacy Policy',
        dataProcessing: 'I consent to data processing to receive the requested resources.',
        marketing: 'I consent to receive updates and marketing content (optional).',
        helper: 'Data processing is GDPR-compliant; consent can be revoked at any time.',
      },
      submit: 'Unlock toolkit',
      loading: 'Submitting...',
      success: 'Success, redirecting you to resources.',
      error: 'Submission failed. Please try again shortly.',
    },
    faqTitle: 'Quick FAQ',
    faqItems: [
      {
        question: 'Does the AI Act apply to non-EU companies?',
        answer: 'Yes, if you offer AI systems or services in the EU market, extraterritorial scope applies.',
      },
      {
        question: 'What is the maximum enforcement risk?',
        answer: 'Up to EUR 35M or 7% of global turnover, depending on the violation type.',
      },
      {
        question: 'What is the best operational starting point?',
        answer: 'Start with an AI inventory to enable risk classification and roadmap decisions.',
      },
    ],
    finalCta: {
      prefix: 'Already have your access link?',
      button: 'Open EU AI Act resources',
    },
  },
}
