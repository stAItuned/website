/**
 * Legal Pages Translations (Terms, Privacy, Cookie Policy)
 * 
 * Bilingual support for IT/EN on legal pages.
 */

export interface LegalTranslations {
    terms: {
        title: string
        metaTitle: string
        metaDescription: string
        badge: string
        intro: string
        lastUpdate: string
        sections: Array<{
            title: string
            content?: string
            items?: string[]
            subsections?: Array<{
                title: string
                content: string | string[]
            }>
        }>
        footerTitle: string
        footerText: string
    }
    privacy: {
        title: string
        metaTitle: string
        metaDescription: string
        badge: string
        intro: string
        controller: string
        lastUpdate: string
        audience: {
            title: string
            intro: string
            items: string[]
        }
        dataCollection: {
            title: string
            sections: Array<{
                title: string
                content: string
                items?: string[]
                subsections?: Array<{
                    title: string
                    content: string
                    items?: string[]
                }>
            }>
        }
        legalBase: {
            title: string
            content1: string
            content2: string
            recipientsTitle: string
            recipients: string[]
        }
        retention: {
            title: string
            content1: string
            content2: string
        }
        rights: {
            title: string
            content: string
        }
        footerTitle: string
        footerText: string
    }
    cookie: {
        title: string
        metaTitle: string
        metaDescription: string
        badge: string
        intro: string
        lastUpdate: string
        technicalSection: {
            title: string
            content: string
        }
        categoriesSection: {
            title: string
            categories: Array<{
                title: string
                content: string
                details?: {
                    label: string
                    value: string
                }
            }>
        }
        managementSection: {
            title: string
            content1: string
            content2: string
            content3: string
        }
        thirdPartiesSection: {
            title: string
            content1: string
            content2: string
        }
        footerTitle: string
        footerText: string
    }
}

export const legalTranslations: Record<'en' | 'it', LegalTranslations> = {
    it: {
        terms: {
            title: 'Termini e Condizioni dei Servizi stAItuned',
            metaTitle: 'Termini e Condizioni | stAItuned',
            metaDescription: 'Contratto di licenza e termini d’uso per Career OS.',
            badge: 'stAItuned',
            intro: "Il presente contratto regola l'accesso e l'utilizzo di Career OS, il percorso formativo avanzato per carriere in ambito AI. Acquistando il servizio o accedendo ai materiali, l'utente accetta integralmente le seguenti condizioni.",
            lastUpdate: 'Ultimo aggiornamento: 16 gennaio 2026',
            sections: [
                {
                    title: '1. Oggetto del Servizio',
                    content: 'Career OS è un programma educativo strutturato in 8 settimane, diviso in due fasi principali (Starter Track e Advanced Track). Il servizio include l\'accesso a:',
                    items: [
                        'Materiali didattici: Video lezioni, guide, playbook e roadmap.',
                        'Asset digitali: Template (CV, Cover Letter, README), database e strumenti di produttività.',
                        'Community (se prevista dal piano): Accesso ai canali di supporto e networking.',
                        'Review & Feedback: Valutazioni basate sui "Quality Gates" (standard minimi di eccellenza) definiti nel percorso.'
                    ]
                },
                {
                    title: '2. Licenza d\'uso e Proprietà Intellettuale',
                    content: 'Tutti i contenuti forniti (inclusi testi, codici, grafiche e metodologie) sono proprietà esclusiva di stAItuned e sono protetti dalle leggi sul diritto d\'autore.',
                    subsections: [
                        {
                            title: 'Diritti concessi:',
                            content: 'Viene concessa una licenza personale, non esclusiva e non trasferibile per utilizzare i materiali a scopo di formazione individuale e per la costruzione dei propri asset di carriera personali.'
                        },
                        {
                            title: 'Divieti espliciti:',
                            content: [
                                'Condividere le proprie credenziali di accesso con terzi ("account sharing").',
                                'Scaricare, copiare, distribuire o rivendere il materiale del corso.',
                                'Utilizzare i template o le metodologie per creare prodotti concorrenti o per scopi commerciali (es. consulenza conto terzi) senza autorizzazione scritta.'
                            ]
                        }
                    ]
                },
                {
                    title: '3. Natura del Percorso e Risultati',
                    content: 'Career OS è un acceleratore di carriera progettato per fornire strategia, strumenti e competenze avanzate. Tuttavia:',
                    items: [
                        'Nessuna garanzia di assunzione: stAItuned non garantisce l\'ottenimento di un posto di lavoro, aumenti salariali o specifiche opportunità. Il successo dipende dall\'impegno individuale, dalle condizioni di mercato e dalle competenze pregresse dell\'utente.',
                        'Impegno richiesto: Il percorso richiede partecipazione attiva. Il superamento dei "Quality Gates" (es. CV Score > 90, Progetto Live) è condizione necessaria per accedere alle fasi successive o ai servizi avanzati, come da descrizione tecnica del percorso.',
                        'Scopo educativo: Le informazioni fornite (fiscali, legali, tecniche) hanno scopo puramente educativo e non sostituiscono consulenze professionali specialistiche.'
                    ]
                },
                {
                    title: '4. Pagamenti, Rimborsi e Garanzie',
                    content: 'L\'accesso al corso è garantito a seguito del pagamento della quota prevista.',
                    subsections: [
                        {
                            title: 'Provider di pagamento:',
                            content: 'i pagamenti possono essere gestiti tramite fornitori terzi (es. Stripe) attraverso link o checkout esterni. In questi casi, alcuni dati necessari alla transazione (es. importo, identificativi tecnici e dati di pagamento) sono trattati dal provider secondo i propri termini e informative.'
                        },
                        {
                            title: 'Garanzia Soddisfatti o Rimborsati (ove applicabile):',
                            content: 'Se specificato esplicitamente nell\'offerta di acquisto (es. "Garanzia 14 giorni"), l\'utente ha diritto al rimborso integrale entro i termini indicati, a condizione che abbia visionato meno del 20% del materiale totale e non abbia scaricato gli asset proprietari. In assenza di specifica menzione, vale il diritto di recesso di legge per i prodotti digitali, che decade al momento dell\'inizio del download o streaming del contenuto.'
                        }
                    ]
                },
                {
                    title: '5. Limitazione di Responsabilità',
                    content: 'In nessun caso stAItuned sarà responsabile per danni diretti, indiretti, incidentali o consequenziali derivanti dall\'uso o dall\'impossibilità di usare il servizio, inclusi, a titolo esemplificativo, danni per perdita di profitti, dati o altre perdite intangibili.'
                },
                {
                    title: '6. Strumenti, Audit e Lead Magnet',
                    content: 'stAItuned offre strumenti come il Role Fit Audit e altri contenuti orientativi, che possono essere offerti gratuitamente o a pagamento a seconda dell\'offerta disponibile. Questi strumenti:',
                    items: [
                        'Forniscono valutazioni indicative basate sulle risposte dell\'utente;',
                        'Non costituiscono consulenza professionale, legale o lavorativa;',
                        'Offrono suggerimenti generici che devono essere valutati criticamente dall\'utente;',
                        'Non garantiscono risultati specifici in termini di carriera o occupazione;',
                        'Generazione AI: Alcuni report (es. AI Audit) sono generati tramite modelli di Intelligenza Artificiale. Sebbene curati, potrebbero contenere inesattezze o "allucinazioni". L\'utente è invitato a verificare sempre le informazioni critiche.'
                    ]
                },
                {
                    title: '7. Servizio di Newsletter',
                    content: 'Iscrivendosi alla newsletter di stAItuned, l\'utente accetta di ricevere comunicazioni periodiche via email riguardanti:',
                    items: [
                        'Aggiornamenti sui nuovi articoli e contenuti tecnici del blog;',
                        'Approfondimenti su strategie di carriera e trend del mercato AI;',
                        'Informazioni su nuovi prodotti, servizi o iniziative di stAItuned.'
                    ],
                    subsections: [
                        {
                            title: 'Frequenza e Cancellazione:',
                            content: 'La frequenza standard è di un invio settimanale. L\'utente ha il diritto di disiscriversi in qualsiasi momento cliccando sul link "Unsubscribe" presente in calce a ogni email o contattando l\'assistenza.'
                        }
                    ]
                },
                {
                    title: '8. Accesso Amministrativo e Trattamento Dati',
                    content: 'Utilizzando i servizi di stAItuned, l\'utente prende atto e accetta che il team amministrativo abbia accesso ai dati sottomessi per garantire la qualità del servizio:',
                    items: [
                        'Dati di autenticazione: email, nome, foto profilo e identificativi tecnici;',
                        'Dati Role Fit Audit: risposte al questionario, risultati, archetipo e suggerimenti di carriera generati;',
                        'Dati Contributor Path: pitch, bozze, interviste, outline e accordo legale firmato (nome legale, codice fiscale, data di firma);',
                        'Questi dati sono utilizzati esclusivamente per migliorare il servizio, fornire supporto e gestire le funzionalità della piattaforma.'
                    ]
                }
            ],
            footerTitle: 'Assistenza e Supporto',
            footerText: 'Per dubbi tecnici, amministrativi o per questioni relative alla privacy, contattaci a info@staituned.com.'
        },
        privacy: {
            title: 'Informativa sulla privacy',
            metaTitle: 'Privacy Policy | stAItuned',
            metaDescription: 'Come raccogliamo e utilizziamo i dati di chi visita il blog, richiede una call o desidera ricevere aggiornamenti.',
            badge: 'stAItuned',
            intro: 'Tutte le interazioni con il sito stAItuned sono gestite con rispetto per la tua riservatezza. Questa pagina spiega come trattiamo i dati raccolti dai visitatori del blog, dalle aziende interessate ai nostri servizi AI, dalle persone che prenotano una call e da chi decide di unirsi alla nostra community o newsletter.',
            controller: 'Il titolare del trattamento è Daniele Moltisanti. Email di contatto: info@staituned.com.',
            lastUpdate: 'Ultimo aggiornamento: 16 gennaio 2026',
            audience: {
                title: 'A chi è rivolta questa informativa',
                intro: 'Per chiarezza, la rendiamo disponibile a quattro gruppi principali:',
                items: [
                    'i lettori del blog e i membri della community che consumano contenuti pubblici;',
                    'le PMI e i team che richiedono una call o una consulenza personalizzata;',
                    'chi si iscrive alla newsletter o alle comunicazioni di aggiornamento (marketing) con consenso esplicito;',
                    'chi si candida a collaborare con stAItuned o propone una partnership.'
                ]
            },
            dataCollection: {
                title: 'Quali dati raccogliamo e perché',
                sections: [
                    {
                        title: 'Visite al blog e alle pagine pubbliche',
                        content: 'Registriamo solo dati tecnici necessari per mantenere il sito online (es. richieste HTTP, informazioni sul browser). I cookie non tecnici (es. Google Analytics) e le misurazioni di performance lato client (es. Core Web Vitals) sono attivati solo dopo il tuo consenso. Alcune risorse (es. font) possono essere caricate da fornitori terzi per motivi di resa grafica.'
                    },
                    {
                        title: 'Autenticazione e funzionalità personalizzate',
                        content: 'Se decidi di registrarti al sito tramite Google Sign-In, raccogliamo e conserviamo i seguenti dati dal tuo profilo Google: indirizzo email, nome e cognome, foto profilo, User ID.',
                        subsections: [
                            {
                                title: 'Finalità:',
                                content: 'Personalizzazione dell\'esperienza, bookmarking, raccomandazioni e commenti.'
                            }
                        ]
                    },
                    {
                        title: 'Richieste di contatto e "Prenota la call"',
                        content: 'Quando compili il modulo di contatto raccogliamo nome, email, eventuale numero di telefono, azienda, messaggio e la tua preferenza sul marketing. Inviare la richiesta equivale ad accettare la presente informativa.'
                    },
                    {
                        title: 'Newsletter, community e aggiornamenti',
                        content: 'Se scegli di ricevere aggiornamenti, li inviamo via email solo previa autorizzazione separatata. Puoi revocare il consenso in qualsiasi momento.'
                    },
                    {
                        title: 'Notifiche push',
                        content: 'Se abiliti le notifiche push, generiamo un token identificativo del dispositivo tramite Firebase Cloud Messaging (Google LLC). Il token è un identificativo tecnico, non associato alla tua identità personale.'
                    },
                    {
                        title: 'Contenuti offline (PWA)',
                        content: 'La funzionalità "Salva per offline" memorizza articoli localmente sul tuo dispositivo (Cache API, IndexedDB). Questi dati non vengono trasmessi ai nostri server.'
                    },
                    {
                        title: 'Candidature per collaborazioni',
                        content: 'Raccogliamo nome, email, ruolo, portfolio/LinkedIn e note per valutare la candidatura e organizzare l\'eventuale collaborazione.'
                    },
                    {
                        title: 'Dati dei Contributor (Programma Editoriale)',
                        content: 'Raccogliamo informazioni account, contributi editoriali, risposte alle interviste e preferenze di pubblicazione per gestire il ciclo di vita dell\'articolo. I tuoi contributi, le risposte alle interviste e lo stato dell\'accordo legale sono visibili al team amministrativo di stAItuned per garantire la qualità editoriale e gestire correttamente il processo di pubblicazione.'
                    },
                    {
                        title: 'Role Fit Audit',
                        content: 'Raccogliamo email, nome (opzionale), link social (opzionale) e le risposte al questionario per generare il report personalizzato. Le tue risposte e i risultati dell\'audit sono accessibili al team amministrativo di stAItuned per migliorare il servizio, personalizzare eventuali comunicazioni di follow-up e analizzare tendenze aggregate.'
                    },
                    {
                        title: 'Accesso Amministrativo ai Dati',
                        content: 'Per garantire la qualità del servizio e gestire efficacemente le funzionalità della piattaforma, il team amministrativo di stAItuned ha accesso ai seguenti dati:',
                        items: [
                            'Dati di autenticazione: email, nome, foto profilo e User ID associati al tuo account;',
                            'Dati Role Fit Audit: risposte al questionario, risultati dell\'analisi, archetipo assegnato e suggerimenti di carriera;',
                            'Dati Contributor Path: pitch, bozze, risposte alle interviste, outline generati e stato dell\'accordo legale firmato (nome legale, codice fiscale, data di firma).'
                        ]
                    }
                ]
            },
            legalBase: {
                title: 'Base giuridica, trasferimenti e destinatari',
                content1: 'Il trattamento avviene su base di consenso (art. 6 GDPR) per marketing e analisi, mentre per la risposta alle richieste commerciali e per l\'erogazione dei servizi ci basiamo sul legittimo interesse.',
                content2: 'Non vendiamo dati a terzi e li condividiamo solo con fornitori necessari al funzionamento del sito.',
                recipientsTitle: 'Possibili destinatari/categorie:',
                recipients: [
                    'Fornitori di hosting (Firebase)',
                    'Servizi email (Resend)',
                    'AI Services (Google Gemini)',
                    'Analytics (Google Analytics)',
                    'Push Notifications (FCM)',
                    'Booking (Calendly)',
                    'Payments (Stripe)',
                    'Feedback tools (Telegram/Slack)',
                    'Static resources (Google Fonts)'
                ]
            },
            retention: {
                title: 'Conservazione e cancellazione',
                content1: 'Le richieste di contatto sono archiviate per 12-24 mesi. I dati newsletter sono conservati finché il consenso è attivo.',
                content2: 'Candidature e collaborazioni vengono conservate per 12-24 mesi per valutazioni future.'
            },
            rights: {
                title: 'Diritti dell’interessato',
                content: 'Puoi esercitare i diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione scrivendo a info@staituned.com.'
            },
            footerTitle: 'Domande o richieste specifiche',
            footerText: 'Per chiarimenti o per cancellare definitivamente i tuoi dati, scrivi a info@staituned.com.'
        },
        cookie: {
            title: 'Cookie Policy',
            metaTitle: 'Cookie Policy | stAItuned',
            metaDescription: 'Dettagli sui cookie tecnici e analitici usati da stAItuned e su come gestire il consenso.',
            badge: 'stAItuned',
            intro: 'Il banner di consenso gestisce i cookie non essenziali e mantiene attivo solo quanto serve a far funzionare il sito. Qui trovi le informazioni dettagliate su quali cookie usiamo e perché.',
            lastUpdate: 'Ultimo aggiornamento: 16 gennaio 2026',
            technicalSection: {
                title: 'Cookie tecnici e banner',
                content: 'Alcuni cookie sono indispensabili per garantire la sicurezza e la navigazione (es. Next.js). Gli altri vengono attivati solo dopo il consenso esplicito dal banner.'
            },
            categoriesSection: {
                title: 'Categorie di cookie',
                categories: [
                    {
                        title: 'Cookie strettamente necessari',
                        content: 'Consentono la performance base del sito. Esempi: Next.js session, CSRF, protezione bot.',
                        details: { label: 'Durata', value: '15 minuti / sessione' }
                    },
                    {
                        title: 'Archiviazione locale per funzionalità offline',
                        content: 'Memorizzano articoli nel browser (IndexedDB) per la lettura senza connessione. Restano sul dispositivo.',
                        details: { label: 'Tecnologie', value: 'Service Worker, Cache API, IndexedDB' }
                    },
                    {
                        title: 'Cookie di analisi (Google Analytics)',
                        content: 'Misurano visite e interazioni in forma anonimizzata.',
                        details: { label: 'Cookie principali', value: '_ga (24 mesi), _gid (24 ore)' }
                    },
                    {
                        title: 'Notifiche push (Firebase Cloud Messaging)',
                        content: 'Generano un token univoco per inviare avvisi su nuovi contenuti.',
                        details: { label: 'Dati raccolti', value: 'Token FCM (identificativo tecnico)' }
                    }
                ]
            },
            managementSection: {
                title: 'Gestione e revoca del consenso',
                content1: 'Il consenso viene salvato in localStorage (staituned_cookie_consent).',
                content2: 'Puoi cambiare idea eliminando questo valore o tramite il pulsante "Gestisci i cookie" nel footer.',
                content3: 'L\'archiviazione locale è usata anche per preferenze (tema, token notifiche).'
            },
            thirdPartiesSection: {
                title: 'Terze parti',
                content1: 'Collaboriamo con partner come Google, Telegram e Stripe per offrire i nostri servizi.',
                content2: 'Non vendiamo informazioni e limitiamo gli scambi al minimo necessario.'
            },
            footerTitle: 'Hai bisogno di altri dettagli?',
            footerText: 'Scrivi a info@staituned.com per sapere quali cookie specifici sono attivi sul tuo browser.'
        }
    },
    en: {
        terms: {
            title: 'stAItuned Service Terms and Conditions',
            metaTitle: 'Terms and Conditions | stAItuned',
            metaDescription: 'License agreement and terms of use for Career OS.',
            badge: 'stAItuned',
            intro: "This agreement governs access to and use of Career OS, the advanced training path for AI careers. By purchasing the service or accessing the materials, the user fully accepts the following conditions.",
            lastUpdate: 'Last update: January 16, 2026',
            sections: [
                {
                    title: '1. Subject of the Service',
                    content: 'Career OS is an 8-week structured educational program, divided into two main phases (Starter Track and Advanced Track). The service includes access to:',
                    items: [
                        'Educational materials: Video lessons, guides, playbooks, and roadmaps.',
                        'Digital assets: Templates (CV, Cover Letter, README), databases, and productivity tools.',
                        'Community (if included in the plan): Access to support and networking channels.',
                        'Review & Feedback: Evaluations based on "Quality Gates" (minimum standards of excellence) defined in the path.'
                    ]
                },
                {
                    title: '2. License of Use and Intellectual Property',
                    content: 'All content provided (including texts, codes, graphics, and methodologies) is the exclusive property of stAItuned and is protected by copyright laws.',
                    subsections: [
                        {
                            title: 'Rights granted:',
                            content: 'A personal, non-exclusive, and non-transferable license is granted to use the materials for individual training purposes and for building personal career assets.'
                        },
                        {
                            title: 'Explicit prohibitions:',
                            content: [
                                'Sharing access credentials with third parties ("account sharing").',
                                'Downloading, copying, distributing, or reselling course material.',
                                'Using templates or methodologies to create competing products or for commercial purposes (e.g., third-party consulting) without written authorization.'
                            ]
                        }
                    ]
                },
                {
                    title: '3. Nature of the Path and Results',
                    content: 'Career OS is a career accelerator designed to provide strategy, tools, and advanced skills. However:',
                    items: [
                        'No employment guarantee: stAItuned does not guarantee job placement, salary increases, or specific opportunities. Success depends on individual effort, market conditions, and the user\'s prior skills.',
                        'Required commitment: The path requires active participation. Passing "Quality Gates" (e.g., CV Score > 90, Live Project) is a necessary condition to access subsequent phases or advanced services.',
                        'Educational purpose: The information provided (tax, legal, technical) is for purely educational purposes and does not replace specialist professional advice.'
                    ]
                },
                {
                    title: '4. Payments, Refunds, and Guarantees',
                    content: 'Access to the course is guaranteed following payment of the required fee.',
                    subsections: [
                        {
                            title: 'Payment Providers:',
                            content: 'Payments may be handled through third-party providers (e.g., Stripe) via external links or checkouts. In these cases, some data necessary for the transaction (e.g., amount, technical identifiers, and payment data) are processed by the provider according to their own terms.'
                        },
                        {
                            title: 'Money-Back Guarantee (where applicable):',
                            content: 'If explicitly stated in the purchase offer (e.g., "14-day Guarantee"), the user is entitled to a full refund within the specified terms, provided they have viewed less than 20% of the total material and have not downloaded proprietary assets.'
                        }
                    ]
                },
                {
                    title: '5. Limitation of Liability',
                    content: 'In no event shall stAItuned be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the service, including loss of profits, data, or other intangible losses.'
                },
                {
                    title: '6. Tools, Audits, and Lead Magnets',
                    content: 'stAItuned offers tools like the Role Fit Audit and other orientation content, which may be offered free or for a fee. These tools:',
                    items: [
                        'Provide indicative evaluations based on user responses;',
                        'Do not constitute professional, legal, or occupational advice;',
                        'Offer generic suggestions that must be critically evaluated by the user;',
                        'Do not guarantee specific career or employment results;',
                        'AI Generation: Some reports (e.g., AI Audit) are generated through AI models and may contain inaccuracies or "hallucinations".'
                    ]
                },
                {
                    title: '7. Newsletter Service',
                    content: 'By subscribing to the stAItuned newsletter, the user agrees to receive periodic email communications regarding:',
                    items: [
                        'Updates on new articles and technical blog content;',
                        'Insights into career strategies and AI market trends;',
                        'Information about new stAItuned products, services, or initiatives.'
                    ],
                    subsections: [
                        {
                            title: 'Frequency and Cancellation:',
                            content: 'Standard frequency is once a week. The user has the right to unsubscribe at any time via the "Unsubscribe" link or by contacting support.'
                        }
                    ]
                },
                {
                    title: '8. Administrative Access and Data Processing',
                    content: 'By using stAItuned services, the user acknowledges and agrees that the administrative team has access to submitted data to ensure service quality:',
                    items: [
                        'Authentication data: email, name, profile picture, and technical identifiers;',
                        'Role Fit Audit data: questionnaire responses, results, archetype, and generated career suggestions;',
                        'Contributor Path data: pitches, drafts, interviews, outlines, and signed legal agreement (legal name, tax ID, signing date);',
                        'This data is used exclusively to improve the service, provide support, and manage platform features.'
                    ]
                }
            ],
            footerTitle: 'Assistance and Support',
            footerText: 'For technical, administrative, or privacy-related questions, contact us at info@staituned.com.'
        },
        privacy: {
            title: 'Privacy Policy',
            metaTitle: 'Privacy Policy | stAItuned',
            metaDescription: 'How we collect and use data from visitors, call requests, and update subscribers.',
            badge: 'stAItuned',
            intro: 'All interactions with the stAItuned site are managed with respect for your privacy. This page explains how we process data collected from blog visitors, businesses interested in our AI services, people booking calls, and those joining our community or newsletter.',
            controller: 'The data controller is Daniele Moltisanti. Contact email: info@staituned.com.',
            lastUpdate: 'Last update: January 16, 2026',
            audience: {
                title: 'Who this policy is for',
                intro: 'For clarity, we make it available to four main groups:',
                items: [
                    'blog readers and community members consuming public content;',
                    'SMEs and teams requesting calls or personalized consulting;',
                    'those subscribing to the newsletter or marketing updates with explicit consent;',
                    'those applying to collaborate with stAItuned or proposing a partnership.'
                ]
            },
            dataCollection: {
                title: 'What data we collect and why',
                sections: [
                    {
                        title: 'Blog Visits and Public Pages',
                        content: 'We record only technical data necessary to keep the site online. Non-technical cookies (e.g., Google Analytics) and client-side performance measurements are activated only after your consent.'
                    },
                    {
                        title: 'Authentication and Personalized Features',
                        content: 'If you register via Google Sign-In, we collect your email, name, profile picture, and User ID.',
                        subsections: [
                            {
                                title: 'Purpose:',
                                content: 'Experience personalization, bookmarking, recommendations, and comments.'
                            }
                        ]
                    },
                    {
                        title: 'Contact Requests and "Book a Call"',
                        content: 'When you fill out a contact form, we collect name, email, phone (optional), company, message, and marketing preference. Sending the request implies acceptance of this policy.'
                    },
                    {
                        title: 'Newsletter, Community, and Updates',
                        content: 'Marketing updates are sent via email only with separate authorization. You can revoke consent at any time.'
                    },
                    {
                        title: 'Push Notifications',
                        content: 'If enabled, we generate a device identification token via Firebase Cloud Messaging. This is a technical identifier, not linked to your personal identity.'
                    },
                    {
                        title: 'Offline Content (PWA)',
                        content: '"Save for offline" stores articles locally on your device (Cache API, IndexedDB). This data is not transmitted to our servers.'
                    },
                    {
                        title: 'Collaboration Applications',
                        content: 'We collect name, email, role, portfolio/LinkedIn, and notes to evaluate applications and organize collaboration.'
                    },
                    {
                        title: 'Contributor Data (Editorial Program)',
                        content: 'We collect account info, editorial contributions, interview responses, and publishing preferences to manage the article lifecycle. Your contributions, interview responses, and agreement status are visible to the stAItuned administrative team to ensure editorial quality and properly manage the publication process.'
                    },
                    {
                        title: 'Role Fit Audit',
                        content: 'We collect email, name (optional), social links (optional), and questionnaire responses to generate the personalized report. Your responses and audit results are accessible to the stAItuned administrative team to improve the service, personalize any follow-up communications, and analyze aggregate trends.'
                    },
                    {
                        title: 'Administrative Access to Data',
                        content: 'To ensure service quality and effectively manage platform features, the stAItuned administrative team has access to the following data:',
                        items: [
                            'Authentication data: email, name, profile picture, and User ID associated with your account;',
                            'Role Fit Audit data: questionnaire responses, analysis results, assigned archetype, and career suggestions;',
                            'Contributor Path data: pitches, drafts, interview responses, generated outlines, and signed legal agreement status (legal name, tax ID, signing date).'
                        ]
                    }
                ]
            },
            legalBase: {
                title: 'Legal Basis, Transfers, and Recipients',
                content1: 'Processing is based on consent (Art. 6 GDPR) for marketing and analysis, and legitimate interest for responding to business requests and service delivery.',
                content2: 'We do not sell data to third parties and share it only with providers necessary for site operations.',
                recipientsTitle: 'Possible recipients/categories:',
                recipients: [
                    'Hosting providers (Firebase)',
                    'Email services (Resend)',
                    'AI Services (Google Gemini)',
                    'Analytics (Google Analytics)',
                    'Push Notifications (FCM)',
                    'Booking (Calendly)',
                    'Payments (Stripe)',
                    'Feedback tools (Telegram/Slack)',
                    'Static resources (Google Fonts)'
                ]
            },
            retention: {
                title: 'Retention and Deletion',
                content1: 'Contact requests are stored for 12-24 months. Newsletter data is kept as long as consent is active.',
                content2: 'Applications and collaborations are kept for 12-24 months for future evaluations.'
            },
            rights: {
                title: 'Data Subject Rights',
                content: 'You can exercise rights of access, rectification, erasure, restriction, portability, and objection by writing to info@staituned.com.'
            },
            footerTitle: 'Questions or Specific Requests',
            footerText: 'For clarifications or to permanently delete your data, write to info@staituned.com.'
        },
        cookie: {
            title: 'Cookie Policy',
            metaTitle: 'Cookie Policy | stAItuned',
            metaDescription: 'Details on technical and analytical cookies used by stAItuned and how to manage consent.',
            badge: 'stAItuned',
            intro: 'The consent banner manages non-essential cookies and keeps active only what is needed for the site to function. Here you will find detailed information on which cookies we use and why.',
            lastUpdate: 'Last update: January 16, 2026',
            technicalSection: {
                title: 'Technical Cookies and Banner',
                content: 'Some cookies are essential for security and navigation (e.g., Next.js). Others are activated only after explicit consent from the banner.'
            },
            categoriesSection: {
                title: 'Cookie Categories',
                categories: [
                    {
                        title: 'Strictly Necessary Cookies',
                        content: 'Allow basic site performance. Examples: Next.js session, CSRF, bot protection.',
                        details: { label: 'Duration', value: '15 minutes / session' }
                    },
                    {
                        title: 'Local Storage for Offline Features',
                        content: 'Store articles in the browser (IndexedDB) for reading without connection. They remain on the device.',
                        details: { label: 'Technologies', value: 'Service Worker, Cache API, IndexedDB' }
                    },
                    {
                        title: 'Analytical Cookies (Google Analytics)',
                        content: 'Measure visits and interactions anonymously.',
                        details: { label: 'Main cookies', value: '_ga (24 months), _gid (24 hours)' }
                    },
                    {
                        title: 'Push Notifications (Firebase Cloud Messaging)',
                        content: 'Generate a unique token to send alerts about new content.',
                        details: { label: 'Collected data', value: 'FCM Token (technical identifier)' }
                    }
                ]
            },
            managementSection: {
                title: 'Consent Management and Revocation',
                content1: 'Consent is saved in localStorage (staituned_cookie_consent).',
                content2: 'You can change your mind by deleting this value or via the "Manage cookies" button in the footer.',
                content3: 'Local storage is also used for preferences (theme, notification tokens).'
            },
            thirdPartiesSection: {
                title: 'Third Parties',
                content1: 'We collaborate with partners like Google, Telegram, and Stripe to offer our services.',
                content2: 'We do not sell information and limit exchanges to the minimum necessary.'
            },
            footerTitle: 'Need More Details?',
            footerText: 'Write to info@staituned.com to find out which specific cookies are active in your browser.'
        }
    }
}
