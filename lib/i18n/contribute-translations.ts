export const contributeTranslations = {
    it: {
        // Landing Page
        landing: {
            hero: {
                title: 'Diffondiamo insieme la cultura dell\'AI.',
                painStat: {
                    text: 'Il *78%* delle aziende usa l\'AI, ma solo il #6%# è riuscito a scalare.',
                    source: 'McKinsey 2025',
                    url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai'
                },
                subtitle: 'Il problema? Manca la *cultura AI*. *Unisciti agli esperti* che stanno costruendo con stAI tuned il *punto di riferimento italiano* per l\'*innovazione data-driven*.',
                cta: 'Contribuisci'
            },
            evidence: {
                title: 'Perché il tuo contributo conta',
                items: [
                    { value: '78%', label: 'Aziende che usano l\'AI', source: 'McKinsey 2025', desc: 'Ma solo il 6% ha scalato. Serve competenza vera per colmare il gap.', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
                    { value: '2x', label: 'Velocità di Innovazione', source: 'Stanford HAI', desc: 'Per le organizzazioni che democratizzano l\'accesso alla conoscenza AI.', url: 'https://hai.stanford.edu/research/ai-index-report' },
                    { value: '+20%', label: 'Produttività', source: 'Deloitte', desc: 'Nelle aziende che promuovono attivamente il knowledge sharing tecnico.', url: 'https://www2.deloitte.com/us/en/insights/focus/cognitive-technologies/artificial-intelligence-impact-on-workforce.html' }
                ]
            },
            paths: {
                autonomy: {
                    title: 'Autonomia',
                    description: '**Tu scrivi, noi ottimizziamo.** Carica la tua bozza e la trasformiamo in articolo pronto per SEO e distribuzione.',
                    bestFor: ['Hai già un articolo pronto', 'Preferisci scrivere offline', 'Vuoi il controllo totale'],
                    time: '1-3 ore',
                    cta: 'Carica la bozza'
                },
                guided: {
                    title: 'Guidato',
                    description: '**Dall\'idea all\'outline in 20 minuti.** Rispondi a 5 domande e ottieni una struttura con fonti verificate.',
                    bestFor: ['Hai l\'idea ma non l\'outline', 'Vuoi una traccia da seguire', 'Temi il foglio bianco'],
                    time: '15-30 minuti',
                    cta: 'Genera Outline'
                },
                interview: {
                    title: 'Intervista',
                    description: '**Parla, noi scriviamo.** Una conversazione di 20 minuti diventa un articolo professionale firmato da te.',
                    bestFor: ['Esperti con poco tempo', 'Preferisci parlare che scrivere', 'Argomenti molto tecnici'],
                    time: '20 minuti',
                    cta: 'Avvia Intervista'
                }
            },
            quickSelector: {
                title: 'Non sai quale scegliere?',
                question1: 'Hai già una bozza pronta?',
                question2: 'Preferisci...',
                question3: 'Hai bisogno di aiuto per strutturare le idee?',
                yes: 'Sì, ho il testo',
                no: 'No, solo l\'idea',
                write: 'Scrivere direttamente tu',
                talk: 'Raccontare a voce',
                needHelp: 'Sì, temo il foglio bianco',
                noHelp: 'No, so già cosa scrivere',
                resultLabel: 'Il percorso ideale per te è:',
                reset: 'Ricomincia',
                back: 'Indietro'
            },
            valueSectionTitle: 'Perché scrivere su stAI tuned',
            value: {
                authority: { title: 'Posizionati come esperto', desc: 'Raggiungi una audience tecnica e business qualificata.' },
                distribution: { title: 'Distribuzione Amplificata', desc: 'Newsletter, LinkedIn e ottimizzazione SEO/GEO inclusa.' },
                ownership: { title: 'Piena Paternità', desc: 'Tu mantieni i diritti morali e la firma. Noi siamo la piattaforma.' }
            },
            pathSection: {
                title: 'La tua competenza, il nostro Standard',
                subtitle: 'Scegli il livello di autonomia che preferisci. In ogni caso, ti forniremo gli strumenti e l\'esperienza editoriale per elevare la qualità del tuo contenuto e garantire la massima autorevolezza.'
            },
            pillars: {
                title: 'I Nostri Pilastri Editoriali',
                subtitle: 'Cosa rende un contenuto stAItuned autorevole',
                items: [
                    { title: 'Sostanza Reale', desc: 'Insegna qualcosa di nuovo. Niente "introduzioni" generiche, solo insight unici e meccanismi concreti.' },
                    { title: 'Autorità Verificabile', desc: 'Ogni claim ha una fonte. Usiamo paper, documenti ufficiali e dati primari, non il "sentito dire".' },
                    { title: 'Utilità Immediata', desc: 'Riduci il tempo di decisione. Forniamo checklist, metriche e template pronti per l\'uso.' }
                ]
            },
            feedbackWidget: {
                badge: 'Feedback diretto',
                title: 'Raccontaci cosa non va',
                subtitle: 'Non è una chat. Il tuo messaggio arriva al team e rispondiamo solo se serve.',
                cta: 'Lascia feedback',
                closeLabel: 'Chiudi',
                typeLabel: 'Tipo',
                messageLabel: 'Il tuo messaggio',
                messagePlaceholder: 'Descrivi il problema o il tuo commento...',
                emailLabel: 'Email (opzionale)',
                emailPlaceholder: 'nome@azienda.com',
                consentTitle: 'Consenso privacy',
                consentDescription: 'Accetto che il messaggio venga analizzato per migliorare il servizio.',
                categoryLabel: 'Tipo:',
                submit: 'Invia feedback',
                sending: 'Invio...',
                success: 'Grazie. Feedback ricevuto.',
                errors: {
                    consent: 'Devi accettare il consenso per inviare il feedback.',
                    message: 'Scrivi almeno 6 caratteri di dettaglio.',
                    email: 'Inserisci un indirizzo email valido o lascia vuoto.',
                    generic: 'Controlla i campi e riprova.',
                    network: 'Invio non riuscito. Riprova tra poco.'
                },
                categories: {
                    bug: { label: 'Bug', description: 'Qualcosa non funziona' },
                    comment: { label: 'Commento', description: 'Nota o suggerimento' },
                    idea: { label: 'Idea', description: 'Nuova proposta' }
                }
            }
        },

        // Wizard
        wizard: {
            steps: {
                pitch: 'Idea',
                agreement: 'Accordo',
                interview: 'Intervista',
                coverage_review: 'Valutazione',
                source_discovery: 'Fonti',
                outline: 'Outline',
                draft_submission: 'Invio Bozza',
                review: 'Revisione',
                resume_selection: 'Selezione',
                path_intro: 'Introduzione',
                guidelines: 'Linee Guida'
            },
            pathIntro: {
                guided: {
                    title: 'Percorso Guidato',
                    subtitle: 'Trasforma la tua esperienza in un articolo di alta qualità con il supporto del nostro sistema editoriale.',
                    steps: [
                        { title: 'Definizione del Brief', desc: 'Dovrai indicare il tema, descriverlo, specificare il tipo di articolo (es. Deep Dive), il taglio che vuoi dare e l’audience.' },
                        { title: 'Intervista di approfondimento', desc: 'Riceverai 5 domande mirate sui meccanismi chiave, prove e dati. Ti aiuteremo a estrarre il valore tecnico.' },
                        { title: 'Supporto e Ispirazione', desc: 'Non sei solo: puoi chiedere all\'AI esempi reali, dati statistici o fonti autorevoli se ti blocchi.' },
                        { title: 'Outline e Fonti', desc: 'Concluderemo con una struttura pronta per la scrittura, arricchita da fonti verificate con Perplexity.' }
                    ],
                    why: {
                        title: 'Perché questo processo?',
                        desc: 'Uniamo la tua visione strategica con l\'accuratezza dei dati per creare contenuti che costruiscono autorità.'
                    },
                    inspiration: {
                        title: 'Ricerca e Prove',
                        desc: 'Accediamo a paper e report per validare i tuoi claim, rendendo il tuo articolo inattaccabile.'
                    },
                    fiveQuestionsGoals: {
                        title: 'I 5 Obiettivi (Data Points)',
                        description: 'Trasformiamo la tua idea in un articolo autorevole colmando le lacune su questi 5 punti chiave:',
                        items: [
                            { label: 'Tesi', fullLabel: 'Profondità della Tesi', key: 'thesis_depth', desc: 'Qual è il claim specifico che stai facendo? Definiamo l\'angolo unico.' },
                            { label: 'Contesto', fullLabel: 'Rilevanza del Contesto', key: 'context_relevance', desc: 'Perché ora? Spieghiamo l\'urgenza e il timing.' },
                            { label: 'Esperienza', fullLabel: 'Esperienza dell\'Autore', key: 'author_expertise', desc: 'Che esperienza diretta hai sul tema? Costruiamo credibilità.' },
                            { label: 'Meccanismi', fullLabel: 'Meccanismi Chiave', key: 'key_mechanisms', desc: 'Come funziona tecnicamente? Oltre le buzzword.' },
                            { label: 'Prove', fullLabel: 'Prove e Dati', key: 'evidence', desc: 'Hai esempi reali o fonti? Validiamo la tesi.' }
                        ]
                    },
                    cta: 'Inizia il Brief'
                },
                autonomy: {
                    title: 'Percorso Autonomia',
                    subtitle: 'Hai già una bozza? Definiamo insieme il perimetro prima di passare alla scrittura o al caricamento.',
                    steps: [
                        { title: 'Definizione del Brief', desc: 'Dovrai indicare il tema, descriverlo, specificare il tipo di articolo (es. Deep Dive), il taglio che vuoi dare e l’audience.' },
                        { title: 'Consultazione Linee Guida', desc: 'Ti mostreremo i nostri standard editoriali (Sostanza, Accuratezza, Autorità) per orientare la tua scrittura.' },
                        { title: 'Invio Bozza', desc: 'Copia il tuo testo o caricalo. Valuteremo la coerenza con i nostri standard editoriali.' },
                        { title: 'Ottimizzazione', desc: 'Se approvato, ti aiuteremo con la revisione finale, la SEO e la distribuzione.' }
                    ],
                    why: {
                        title: 'Allineamento e Agilità',
                        desc: 'Il brief iniziale ci assicura di essere sulla stessa pagina prima di lavorare sul contenuto completo.'
                    },
                    cta: 'Inizia il Brief'
                },
                interview: {
                    title: 'Percorso Intervista',
                    subtitle: 'Diventa autore senza scrivere una riga. Raccontaci la tua competenza.',
                    steps: [
                        { title: 'Definizione del Brief', desc: 'Dovrai indicare il tema, descriverlo, specificare il tipo di articolo (es. Deep Dive), il taglio che vuoi dare e l’audience.' },
                        { title: 'Intervista di approfondimento', desc: 'Riceverai 5 domande mirate sui meccanismi chiave, prove e dati. Ti aiuteremo a estrarre il valore tecnico.' },
                        { title: 'Supporto e Ispirazione', desc: 'Non sei solo: puoi chiedere all\'AI esempi reali, dati statistici o fonti autorevoli se ti blocchi durante la chat.' },
                        { title: 'Proposta di Articolo', desc: 'Sulla base dell\'intervista e dei dati raccolti, elaboreremo una proposta di articolo completa e professionale, pronta per la tua firma.' }
                    ],
                    why: {
                        title: 'Efficienza Totale',
                        desc: 'Perfetto per esperti che hanno molti insight ma poco tempo per la stesura manuale.'
                    },
                    fiveQuestionsGoals: {
                        title: 'I 5 Obiettivi (Data Points)',
                        description: 'Trasformiamo la tua idea in un articolo autorevole colmando le lacune su questi 5 punti chiave:',
                        items: [
                            { label: 'Tesi', fullLabel: 'Profondità della Tesi', key: 'thesis_depth', desc: 'Qual è il claim specifico che stai facendo? Definiamo l\'angolo unico.' },
                            { label: 'Contesto', fullLabel: 'Rilevanza del Contesto', key: 'context_relevance', desc: 'Perché ora? Spieghiamo l\'urgenza e il timing.' },
                            { label: 'Esperienza', fullLabel: 'Esperienza dell\'Autore', key: 'author_expertise', desc: 'Che esperienza diretta hai sul tema? Costruiamo credibilità.' },
                            { label: 'Meccanismi', fullLabel: 'Meccanismi Chiave', key: 'key_mechanisms', desc: 'Come funziona tecnicamente? Oltre le buzzword.' },
                            { label: 'Prove', fullLabel: 'Prove e Dati', key: 'evidence', desc: 'Hai esempi reali o fonti? Validiamo la tesi.' }
                        ]
                    },
                    cta: 'Inizia l\'Intervista'
                }
            },
            pitch: {
                title: 'Proponi la tua idea',
                subtitle: 'Raccontaci brevemente di cosa vuoi scrivere.',
                topic: { label: 'Argomento', placeholder: 'Es. Agentic AI Patterns' },
                target: {
                    label: 'Target Audience',
                    options: { newbie: 'Principiante', midway: 'Intermedio', expert: 'Esperto' },
                    descriptions: {
                        newbie: 'Chi si avvicina al tema per la prima volta. Focus su basi, definizioni e why.',
                        midway: 'Chi ha basi solide e cerca applicazioni pratiche. Focus su how-to e workflow.',
                        expert: 'Chi cerca sfumature, edge-cases e strategie avanzate. Focus su architettura e trade-off.'
                    }
                },
                format: {
                    label: 'Formato',
                    options: {
                        tutorial: 'Tutorial / How-To',
                        deep_dive: 'Analisi Tecnica (Deep Dive)',
                        case_study: 'Case Study',
                        trend_analysis: 'Analisi Trend',
                        comparative: 'Confronto (A vs B)',
                        framework: 'Framework / Metodologia',
                        best_practices: 'Best Practices',
                        tool_review: 'Tool Review',
                        opinion: 'Opinione / Vision',
                        other: 'Altro'
                    },
                    otherPlaceholder: 'Specifica il formato...'
                },
                thesis: { label: 'Tesi Principale', placeholder: 'Qual è il messaggio chiave?' },
                sources: { label: 'Fonti (opzionale)', placeholder: 'Link utili' },
                cta: 'Inizia il percorso'
            },
            agreement: {
                title: 'Accordo di Collaborazione',
                desc: 'Prima di procedere, accetta i termini per garantire la tutela dei tuoi diritti.',
                link: 'Leggi accordo completo',
                legalName: 'Nome e Cognome Legale (Firma Digitale)',
                fiscalCode: 'Codice Fiscale (o P.IVA)',
                checkbox: 'Ho letto e accetto l\'accordo di collaborazione',
                adminDisclaimer: 'I tuoi dati (contributi, interviste, accordo firmato) saranno visibili al team amministrativo di stAItuned per garantire la qualità editoriale.',
                cta: 'Accetta e Continua'
            },
            guidelines: {
                title: 'Linee Guida Editoriali',
                subtitle: 'Segui questi principi per garantire che il tuo contenuto venga pubblicato.',
                cta: 'Ho letto e accetto di seguire le linee guida',
                sections: [
                    {
                        title: 'Sostanza (Substance)',
                        desc: 'Insegna qualcosa di reale? Richiediamo una tesi chiara, insight non ovvi e meccanismi concreti.',
                        rules: [
                            'Tesi chiara: una frase che dice cosa il lettore imparerà.',
                            'Insight non ovvi: non solo "l\'AI sta cambiando X", ma cosa cambia specificamente e perché ora.',
                            'Meccanismi concreti: spiega come funziona (architettura, workflow, processo).',
                            'Risultato azionabile: il lettore può fare qualcosa dopo (template, checklist, metriche).'
                        ],
                        redFlag: 'Red flag: Tante "vibes", pochi meccanismi.'
                    },
                    {
                        title: 'Accuratezza (Accuracy)',
                        desc: 'È corretto e falsificabile? Le affermazioni devono essere testabili e supportate.',
                        rules: [
                            'Statistiche verificate: ogni statistica ha una fonte e non è mal interpretata.',
                            'Fatti vs Inferenza: distingue "DCSA dice X" (fatto) da "Questo implica Y" (inferenza).',
                            'Evita esagerazioni: usa "potrebbe / tende a" quando l\'evidenza è correlazionale.'
                        ],
                        redFlag: 'Red flag: Affermazioni assolute senza prove.'
                    },
                    {
                        title: 'Autorità (Authority)',
                        desc: 'Un lettore scettico può fidarsi?',
                        rules: [
                            'Fonti primarie: Paper, standard body, documenti ufficiali, dataset originali.',
                            'Citazioni dirette: citazioni allegate alla specifica affermazione (non una lista in fondo).',
                            'Nessun segnale debole: evita blog senza metodologia o marketing di vendor.'
                        ],
                        redFlag: 'Red flag: "Spesso citato basandosi su..." senza tracciare l\'origine.'
                    },
                    {
                        title: 'Chiarezza (Clarity)',
                        desc: 'Può essere compreso al livello inteso?',
                        rules: [
                            'Match con la Persona: Executive (ROI), Midway (how-to), Expert (esperimenti).',
                            'Struttura scansionabile: Header che rispondono a domande, non titoli poetici.',
                            'Esempi concreti: almeno un walkthrough concreto, non solo astrazione.'
                        ],
                        redFlag: 'Red flag: Contenuto corretto, ma scritto come una nota di ricerca senza narrativa.'
                    },
                    {
                        title: 'Utilità (Usefulness)',
                        desc: 'Riduce il tempo di decisione?',
                        rules: [
                            'Regole decisionali: logica "se X allora Y" che guida le scelte.',
                            'Pitfalls & Mitigations: errori comuni e come evitarli.',
                            'Checklist, Template, Metriche: artefatti riutilizzabili.'
                        ],
                        redFlag: 'Red flag: Il lettore finisce e chiede "ok, ma cosa faccio lunedì?".'
                    },
                    {
                        title: 'Fit stAItuned',
                        desc: 'Rispecchia il nostro stile?',
                        rules: [
                            'Posizionamento: Pratico, moderno, no hype. Business outcome supportati da realtà tecnica.',
                            'Voce: Diretta, leggermente opinionated, ma guidata dall\'evidenza.',
                            'Formato: Uso corretto dei blocchi YAML (quickAnswer, decisionRules, etc.).'
                        ],
                        redFlag: 'Red flag: Hype generico senza claim ancorati.'
                    },
                    {
                        title: 'GEO Readiness',
                        desc: 'Ottimizzato per LLM/answer engines?',
                        rules: [
                            'Risposta in 30 secondi: ha una risposta autonoma che può essere estratta.',
                            'Definizioni anticipate: usa definizioni "X è..." vicino all\'inizio.',
                            'Dati strutturati: usa liste, tabelle, regole decisionali parsabili dalle macchine.'
                        ],
                        redFlag: 'Red flag: Grande narrativa, ma nessun blocco di risposta "estraibile".'
                    }
                ]
            },
            interview: {
                title: 'Intervista Guidata',
                thinking: 'Stiamo elaborando le domande giuste per approfondire il tuo argomento...',
                inputPlaceholder: 'Scrivi la tua risposta...',
                skip: 'Non sono sicuro',
                next: 'Avanti',
                imDone: 'Ho detto tutto',
                questionProgress: 'Domanda {current} di {max}',
                back: 'Indietro',
                submit: 'Invia Risposta',
                yourAnswer: 'La tua risposta',
                rateLimitTitle: 'Limite Giornaliero Raggiunto',
                rateLimitDesc: 'Hai terminato le domande disponibili per oggi. <br />Il limite verrà reimpostato alle {resetTime}.',
                proceedAnyway: 'Procedi comunque (concludi qui)',
                whyAsk: 'Perché te lo chiedo?',
                suggestion: 'Suggerimento',
                briefExpander: {
                    title: 'Il tuo Brief',
                    topic: 'Argomento',
                    thesis: 'Tesi',
                    target: 'Target',
                    format: 'Formato',
                    context: 'Contesto'
                },
                dataPointLabels: {
                    thesis_depth: 'Profondità Tesi',
                    context_relevance: 'Rilevanza Contesto',
                    author_expertise: 'Esperienza Autore',
                    key_mechanisms: 'Meccanismi Chiave',
                    evidence: 'Prove e Dati'
                },
                assistance: {
                    buttonLabel: 'Non ho esempi? Ti aiuto io 🔍',
                    draftButtonLabel: 'Suggeriscimi una risposta ✨',
                    panelTitle: 'Suggerimenti',
                    loading: 'Cerco fonti autorevoli...',
                    draftLoading: 'Sto producendo fonti di ispirazione per te',
                    generateAnswerButton: 'Genera risposta dalle fonti',
                    generatingAnswer: 'Sto generando una risposta dalle fonti...',
                    generatedAnswerTitle: 'Risposta suggerita',
                    generatedAnswerUse: 'Usa questa risposta',
                    cachedLabel: 'Da cache',
                    relevanceLabel: 'Rilevanza',
                    fitLabel: 'Fit con la tua tesi',
                    useThis: 'Usa questo',
                    noResults: 'Nessun risultato trovato. Prova a rispondere con le tue parole.',
                    rateLimitReached: 'Limite ricerche raggiunto per oggi.',
                    types: {
                        examples: 'esempi',
                        claims: 'dati e statistiche',
                        sources: 'fonti autorevoli',
                        definition: 'definizioni'
                    }
                }
            },
            review: {
                title: 'Valutazione Intervista',
                subtitle: 'Ecco un riepilogo delle informazioni raccolte per il tuo articolo.',
                coverageScore: 'Punteggio Copertura',
                responsesCollected: 'risposte raccolte',
                covered: 'Coperto',
                missing: 'Da approfondire',
                dataPoints: {
                    thesis_depth: 'Profondità Tesi',
                    context_relevance: 'Rilevanza Contesto',
                    author_expertise: 'Esperienza Autore',
                    key_mechanisms: 'Meccanismi Chiave',
                    evidence: 'Prove e Dati'
                },
                recommendation: {
                    strong: 'Ottima copertura! Sei pronto per generare l\'outline.',
                    acceptable: 'Buona copertura. Puoi procedere o rispondere a qualche altra domanda.',
                    weak: 'Copertura limitata. Ti consigliamo di rispondere a qualche altra domanda.'
                },
                proceedAnyway: 'Procedi comunque',
                answerMore: 'Rispondi altre domande',
                generateOutline: 'Procedi: Analisi Fonti'
            },
            draftSubmission: {
                title: 'Hai già la bozza?',
                desc: 'Se hai già scritto il contenuto, puoi incollarlo qui direttamente. Altrimenti, nessun problema! Torna quando sei pronto.',
                yesOption: 'Sì, ho il testo pronto',
                noOption: 'No, devo ancora scriverlo',
                placeholder: 'Incolla qui il contenuto del tuo articolo...',
                submitDraft: 'Invia Bozza',
                saveForLater: 'Tornerò più tardi',
                successPending: 'Perfetto! Abbiamo salvato il tuo progresso. Quando sei pronto, torna qui per inserire la tua bozza.',
                successSubmitted: 'Bozza ricevuta! Il nostro team la revisionerà a breve.'
            },
            sourceDiscovery: {
                title: 'Ricerca Fonti Autorevoli',
                subtitle: 'Per garantire la massima autorevolezza, abbiamo identificato fonti verificate pertinenti al tuo argomento con Perplexity Sonar. Seleziona quelle che vuoi utilizzare e scegli i claim da integrare nella struttura.',
                searching: 'Analisi Autorevolezza in corso...',
                searchingDesc: 'Stiamo interrogando Perplexity Sonar per trovare paper e report che validano la tua tesi. Questo potrebbe richiedere fino a 30 secondi.',
                sourcesSelected: 'fonti selezionate',
                continueToOutline: 'Genera Outline con Fonti',
                claimsLabel: 'Claim Utili (seleziona quelli da includere)',
                error: 'Impossibile completare la ricerca. Riprova più tardi.',
                rateLimitTitle: 'Limite Giornaliero Raggiunto',
                rateLimitDesc: 'Hai raggiunto il limite di ricerche fonti per oggi. <br />Riprova alle {resetTime}.',
                skipSource: 'Salta questo passaggio'
            },
            outline: {
                title: 'Outline Generato',
                desc: 'Ecco la struttura suggerita basata sulle tue risposte.',
                approve: 'Approva e Salva',
                regenerate: 'Rigenera',
                exportMD: 'Esporta in MD'
            },
            success: {
                autonomy: {
                    title: 'Ottimo! Buon lavoro.',
                    message: 'Grazie per aver proposto questo argomento. Ora sappiamo che ci stai lavorando.\n\nSe hai bisogno di supporto, dubbi o domande durante la stesura, scrivici a:',
                    email: 'info@staituned.com',
                    cta: 'Torna alla Dashboard'
                },
                interview: {
                    title: 'Intervista Completata!',
                    message: 'Grazie per il tuo contributo. Un esperto di stAItuned analizzerà le tue risposte e ti contatterà a breve per procedere con la stesura dell\'articolo.',
                    cta: 'Torna alla Dashboard'
                },
                guided: {
                    title: 'Outline Salvato!',
                    message: 'La tua struttura è pronta. Puoi trovarla nella dashboard per iniziare a scrivere.',
                    cta: 'Vai alla Dashboard'
                }
            },
            resumeSelection: {
                title: 'Ci sono altre tue sottomissioni, eccole qua:',
                subtitle: 'Vuoi ripartire o vedere una di queste oppure aprire un nuovo processo di sottomissione per un articolo?',
                resume: 'Riprendi',
                view: 'Vedi',
                startNew: 'Apri nuovo processo di sottomissione',
                updatedAt: 'Aggiornato il',
                untitled: 'Nuovo Articolo (Senza Titolo)'
            }
        },

        // Dashboard
        dashboard: {
            title: 'I tuoi Contributi',
            tabs: {
                published: 'Pubblicati',
                in_progress: 'In Corso'
            },
            newBtn: 'Nuovo Articolo',
            empty: 'Non hai ancora scritto nulla. Inizia oggi!',
            status: {
                pitch: 'Idea',
                interview: 'Intervista',
                outline: 'Outline',
                draft: 'Bozza',
                review: 'In Revisione',
                scheduled: 'Programmato',
                published: 'Pubblicato'
            }
        }
    },

    en: {
        landing: {
            hero: {
                title: 'Let\'s spread AI culture together.',
                painStat: {
                    text: '*78%* of companies use AI, but only #6%# have managed to scale.',
                    source: 'McKinsey 2025',
                    url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai'
                },
                subtitle: 'The problem? Lack of *AI culture*. *Join the experts* building the *reference point* for *data-driven innovation* with stAI tuned.',
                cta: 'Contribute'
            },
            evidence: {
                title: 'Why your contribution matters',
                items: [
                    { value: '78%', label: 'Companies adopting AI', source: 'McKinsey 2025', desc: 'Yet only 6% have scaled. Real expertise is needed to bridge the gap.', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
                    { value: '2x', label: 'Innovation Rate', source: 'Stanford HAI', desc: 'For organizations that democratize access to AI knowledge.', url: 'https://hai.stanford.edu/research/ai-index-report' },
                    { value: '+20%', label: 'Productivity', source: 'Deloitte', desc: 'In companies that actively promote technical knowledge sharing.', url: 'https://www2.deloitte.com/us/en/insights/focus/cognitive-technologies/artificial-intelligence-impact-on-workforce.html' }
                ]
            },
            paths: {
                autonomy: {
                    title: 'Autonomy',
                    description: '**You write, we optimize.** Upload your draft and we turn it into a SEO/GEO ready article.',
                    bestFor: ['You have a draft ready', 'Prefer offline writing', 'Want full control'],
                    time: '1-3 hours',
                    cta: 'Upload Draft'
                },
                guided: {
                    title: 'Guided',
                    description: '**Idea to outline in 20 mins.** Answer 5 questions and get a structure backed by verified sources.',
                    bestFor: ['Have the idea but no outline', 'Need a roadmap to follow', 'Fear the page'],
                    time: '15-30 mins',
                    cta: 'Generate Outline'
                },
                interview: {
                    title: 'Interview',
                    description: '**Talk, we write.** A 20-minute conversation becomes a professional signed article.',
                    bestFor: ['Experts short on time', 'Prefer talking over writing', 'Highly technical topics'],
                    time: '20 mins',
                    cta: 'Start Interview'
                }
            },
            quickSelector: {
                title: 'Not sure which to choose?',
                question1: 'Do you have a draft ready?',
                question2: 'Do you prefer...',
                question3: 'Need help structuring your ideas?',
                yes: 'Yes, I have it',
                no: 'No, just the idea',
                write: 'Writing myself',
                talk: 'Talking via chat',
                needHelp: 'Yes, I fear the blank page',
                noHelp: 'No, I know what to write',
                resultLabel: 'Ideal path for you:',
                reset: 'Start over',
                back: 'Back'
            },
            valueSectionTitle: 'Why write on stAItuned',
            value: {
                authority: { title: 'Position yourself as expert', desc: 'Reach a qualified technical and business audience.' },
                distribution: { title: 'Amplified Distribution', desc: 'Newsletter, LinkedIn, and SEO/GEO optimization included.' },
                ownership: { title: 'Full Ownership', desc: 'You keep moral rights and byline. We are the platform.' }
            },
            pathSection: {
                title: 'Your Expertise, Our Standard',
                subtitle: 'Choose your preferred level of autonomy. We provide the tools and editorial experience to elevate your content quality and ensure maximum authority.'
            },
            pillars: {
                title: 'Our Editorial Pillars',
                subtitle: 'What makes stAItuned content authoritative',
                items: [
                    { title: 'Real Substance', desc: 'Teach something new. No generic "intros", just unique insights and concrete mechanisms.' },
                    { title: 'Verifiable Authority', desc: 'Every claim has a source. We use papers, official docs, and primary data, not hearsay.' },
                    { title: 'Immediate Usefulness', desc: 'Reduce time-to-decision. We provide checklists, metrics, and ready-to-use templates.' }
                ]
            },
            feedbackWidget: {
                badge: 'Direct feedback',
                title: 'Tell us what is not working',
                subtitle: 'This is not a chat. Your message goes to the team and we reply only if needed.',
                cta: 'Leave feedback',
                closeLabel: 'Close',
                typeLabel: 'Type',
                messageLabel: 'Your message',
                messagePlaceholder: 'Describe the issue or your comment...',
                emailLabel: 'Email (optional)',
                emailPlaceholder: 'name@company.com',
                consentTitle: 'Privacy consent',
                consentDescription: 'I agree that the message is reviewed to improve the service.',
                categoryLabel: 'Type:',
                submit: 'Send feedback',
                sending: 'Sending...',
                success: 'Thanks. Feedback received.',
                errors: {
                    consent: 'You must accept the consent to send feedback.',
                    message: 'Please write at least 6 characters.',
                    email: 'Enter a valid email or leave it empty.',
                    generic: 'Please check the fields and try again.',
                    network: 'Send failed. Please try again shortly.'
                },
                categories: {
                    bug: { label: 'Bug', description: 'Something is not working' },
                    comment: { label: 'Comment', description: 'Note or suggestion' },
                    idea: { label: 'Idea', description: 'New proposal' }
                }
            }
        },

        wizard: {
            steps: {
                pitch: 'Pitch',
                agreement: 'Agreement',
                interview: 'Interview',
                coverage_review: 'Assessment',
                source_discovery: 'Sources',
                outline: 'Outline',
                draft_submission: 'Draft Submission',
                review: 'Review',
                resume_selection: 'Selection',
                path_intro: 'Introduction',
                guidelines: 'Guidelines'
            },
            pathIntro: {
                guided: {
                    title: 'Guided Path',
                    subtitle: 'Turn your experience into a high-quality article with our editorial system support.',
                    steps: [
                        { title: 'Brief Definition', desc: 'You\'ll need to specify the topic, describe it, choose the article type (e.g. Deep Dive), the angle, and the audience.' },
                        { title: 'In-depth Interview', desc: 'You\'ll get 5 targeted questions on key mechanisms, evidence, and data. We\'ll help extract technical value.' },
                        { title: 'Support & Inspiration', desc: 'You\'re not alone: ask the AI for real examples, stats, or authoritative sources if you get stuck.' },
                        { title: 'Outline & Sources', desc: 'We\'ll conclude with a structure ready for writing, enriched by sources verified via Perplexity.' }
                    ],
                    why: {
                        title: 'Why this process?',
                        desc: 'We combine your strategic vision with data accuracy to create content that builds authority.'
                    },
                    inspiration: {
                        title: 'Research & Evidence',
                        desc: 'We access papers and reports to validate your claims, making your article bulletproof.'
                    },
                    fiveQuestionsGoals: {
                        title: 'The 5 Goals (Data Points)',
                        description: 'We turn your idea into an authoritative article by filling gaps on these 5 key points:',
                        items: [
                            { label: 'Thesis', fullLabel: 'Thesis Depth', key: 'thesis_depth', desc: 'What specific claim are you making? Let\'s define the unique angle.' },
                            { label: 'Context', fullLabel: 'Context Relevance', key: 'context_relevance', desc: 'Why now? Let\'s explain the urgency and timing.' },
                            { label: 'Expertise', fullLabel: 'Author Expertise', key: 'author_expertise', desc: 'What direct experience do you have? Let\'s build credibility.' },
                            { label: 'Mechanisms', fullLabel: 'Key Mechanisms', key: 'key_mechanisms', desc: 'How does it work technically? Beyond buzzwords.' },
                            { label: 'Evidence', fullLabel: 'Evidence & Data', key: 'evidence', desc: 'Do you have real examples or sources? Let\'s validate the thesis.' }
                        ]
                    },
                    cta: 'Start Brief'
                },
                autonomy: {
                    title: 'Autonomy Path',
                    subtitle: 'Have a draft or an idea? Let\'s define the scope before writing or uploading.',
                    steps: [
                        { title: 'Brief Definition', desc: 'You\'ll need to specify the topic, describe it, choose the article type (e.g. Deep Dive), the angle, and the audience.' },
                        { title: 'Guidelines Consultation', desc: 'We\'ll show you our editorial standards (Substance, Accuracy, Authority) to guide your writing.' },
                        { title: 'Submit Draft', desc: 'Paste your text or upload it. We\'ll assess alignment with our editorial standards.' },
                        { title: 'Optimization', desc: 'If approved, we\'ll help with final review, SEO, and distribution.' }
                    ],
                    why: {
                        title: 'Alignment & Agility',
                        desc: 'The initial brief ensures we are on the same page before working on the full content.'
                    },
                    cta: 'Start Brief'
                },
                interview: {
                    title: 'Interview Path',
                    subtitle: 'Become an author without writing a line. Tell us your expertise.',
                    steps: [
                        { title: 'Brief Definition', desc: 'You\'ll need to specify the topic, describe it, choose the article type (e.g. Deep Dive), the angle, and the audience.' },
                        { title: 'In-depth Interview', desc: 'You\'ll get 5 targeted questions on key mechanisms, evidence, and data. We\'ll help extract technical value.' },
                        { title: 'Support & Inspiration', desc: 'You\'re not alone: ask the AI for real examples, stats, or authoritative sources if you get stuck during the chat.' },
                        { title: 'Editorial Proposal', desc: 'Based on the interview and gathered data, we\'ll draft a complete and professional article proposal, ready for your review and signature.' }
                    ],
                    why: {
                        title: 'Total Efficiency',
                        desc: 'Perfect for experts with many insights but little time for manual drafting.'
                    },
                    fiveQuestionsGoals: {
                        title: 'The 5 Goals (Data Points)',
                        description: 'We turn your idea into an authoritative article by filling gaps on these 5 key points:',
                        items: [
                            { label: 'Thesis', fullLabel: 'Thesis Depth', key: 'thesis_depth', desc: 'What specific claim are you making? Let\'s define the unique angle.' },
                            { label: 'Context', fullLabel: 'Context Relevance', key: 'context_relevance', desc: 'Why now? Let\'s explain the urgency and timing.' },
                            { label: 'Expertise', fullLabel: 'Author Expertise', key: 'author_expertise', desc: 'What direct experience do you have? Let\'s build credibility.' },
                            { label: 'Mechanisms', fullLabel: 'Key Mechanisms', key: 'key_mechanisms', desc: 'How does it work technically? Beyond buzzwords.' },
                            { label: 'Evidence', fullLabel: 'Evidence & Data', key: 'evidence', desc: 'Do you have real examples or sources? Let\'s validate the thesis.' }
                        ]
                    },
                    cta: 'Start Interview'
                }
            },
            pitch: {
                title: 'Pitch Your Idea',
                subtitle: 'Tell us briefly what you want to write about.',
                topic: { label: 'Topic', placeholder: 'Ex. Agentic AI Patterns' },
                target: {
                    label: 'Target Audience',
                    options: { newbie: 'Newbie', midway: 'Intermediate', expert: 'Expert' },
                    descriptions: {
                        newbie: 'First-time learners. Focus on basics, definitions, and the "why".',
                        midway: 'Solid basics, looking for practical applications. Focus on "how-to" and workflows.',
                        expert: 'Deep tech understanding. Focus on nuances, edge-cases, and architecture.'
                    }
                },
                format: {
                    label: 'Format',
                    options: {
                        tutorial: 'Tutorial / How-To',
                        deep_dive: 'Technical Deep Dive',
                        case_study: 'Case Study',
                        trend_analysis: 'Trend Analysis',
                        comparative: 'Comparison (A vs B)',
                        framework: 'Framework / Methodology',
                        best_practices: 'Best Practices',
                        tool_review: 'Tool Review',
                        opinion: 'Opinion / Vision',
                        other: 'Other'
                    },
                    otherPlaceholder: 'Specify format...'
                },
                thesis: { label: 'Main Thesis', placeholder: 'What is the key message?' },
                sources: { label: 'Sources (optional)', placeholder: 'Useful links' },
                cta: 'Start Journey'
            },
            agreement: {
                title: 'Contributor Agreement',
                desc: 'Before proceeding, accept the terms to ensure your rights are protected.',
                link: 'Read full agreement',
                legalName: 'Legal Full Name (Digital Signature)',
                fiscalCode: 'Tax ID / National ID',
                checkbox: 'I have read and accept the contributor agreement',
                adminDisclaimer: 'Your data (contributions, interviews, signed agreement) will be visible to the stAItuned administrative team to ensure editorial quality.',
                cta: 'Accept & Continue'
            },
            guidelines: {
                title: 'Editorial Guidelines',
                subtitle: 'Follow these principles to ensure your content gets published.',
                cta: 'I understand, proceed',
                sections: [
                    {
                        title: 'Substance',
                        desc: 'Does it teach something real? We require a clear thesis, non-obvious insights, and concrete mechanisms.',
                        rules: [
                            'Clear Thesis: One sentence that says what the reader will learn / believe by the end.',
                            'Non-Obvious Insight: Not just "AI is changing X," but what specifically changes and why now.',
                            'Concrete Mechanisms: Explains how the thing works (architecture, workflow, process).',
                            'Actionable Outcome: Reader can do something afterward (template, checklist, metrics).'
                        ],
                        redFlag: 'Red flag: Lots of vibes, few mechanisms.'
                    },
                    {
                        title: 'Accuracy',
                        desc: 'Is it correct and falsifiable?',
                        rules: [
                            'Testable Claims: Numbers have dates, scope, and definitions.',
                            'No Floating Stats: Every statistic has a source and isn\'t misinterpreted.',
                            'Facts vs Inference: Distinguishes "DCSA says X" (fact) from "This implies Y" (inference).',
                            'Avoids Overstating: Uses "could / may / tends to" when evidence is correlational.'
                        ],
                        redFlag: 'Red flag: Confident absolute statements without evidence.'
                    },
                    {
                        title: 'Authority',
                        desc: 'Can a skeptical reader trust it?',
                        rules: [
                            'Primary Sources First: Papers, standards bodies, official docs, original datasets.',
                            'Direct Citations: Citations attached to the exact claim, not a list of links at the bottom.',
                            'No Weak Authority Signals: Avoid blogs without methodology, vendor marketing.'
                        ],
                        redFlag: 'Red flag: "Often cited based on..." without tracing to the actual origin.'
                    },
                    {
                        title: 'Clarity',
                        desc: 'Can it be understood at the intended level?',
                        rules: [
                            'Matches Target Persona: Executive (ROI), Midway (how-to), Expert (definitions).',
                            'Scannable Structure: Headers that answer questions, not poetic titles.',
                            'Concrete Examples: At least one concrete walkthrough, not only abstraction.'
                        ],
                        redFlag: 'Red flag: Correct content, but written like a research note with no narrative.'
                    },
                    {
                        title: 'Usefulness',
                        desc: 'Does it reduce time-to-decision?',
                        rules: [
                            'Decision Rules: If X then Y logic that guides choices.',
                            'Pitfalls & Mitigations: Common mistakes and how to avoid them.',
                            'Checklist, Templates, Metrics: Reusable artifacts.'
                        ],
                        redFlag: 'Red flag: Reader finishes and still asks "ok but what should I do Monday?".'
                    },
                    {
                        title: 'stAItuned Fit',
                        desc: 'Does it match our house style and positioning?',
                        rules: [
                            'Positioning Fit: Practical, modern, not hype. Engineering-aware business content.',
                            'Voice: Direct, slightly opinionated, but evidence-led.',
                            'Format Fit: Correct use of YAML blocks (quickAnswer, decisionRules, etc.).'
                        ],
                        redFlag: 'Red flag: Generic AI hype without anchored claims.'
                    },
                    {
                        title: 'GEO Readiness',
                        desc: 'Is it optimized for LLM/answer engines?',
                        rules: [
                            'Answer in 30 Seconds: Has a self-contained answer that can be extracted.',
                            'Early Definitions: Uses "X is..." definitions near the top.',
                            'Structured Data: Uses lists, tables, decision rules that are machine-parseable.'
                        ],
                        redFlag: 'Red flag: Great narrative, but no "extractable" answer blocks.'
                    }
                ]
            },
            interview: {
                title: 'Guided Interview',
                thinking: 'The editor is analyzing your insights to dive deeper into the topic...',
                inputPlaceholder: 'Type your answer...',
                skip: 'Not sure',
                next: 'Next',
                imDone: 'I\'m done',
                questionProgress: 'Question {current} of {max}',
                back: 'Back',
                submit: 'Submit Answer',
                yourAnswer: 'Your Answer',
                rateLimitTitle: 'Daily Limit Reached',
                rateLimitDesc: 'You have reached the question limit for today. <br />Limit resets at {resetTime}.',
                proceedAnyway: 'Proceed anyway (finish here)',
                whyAsk: 'Why am I asking?',
                suggestion: 'Suggestion',
                briefExpander: {
                    title: 'Your Brief',
                    topic: 'Topic',
                    thesis: 'Thesis',
                    target: 'Target',
                    format: 'Format',
                    context: 'Context'
                },
                dataPointLabels: {
                    thesis_depth: 'Thesis Depth',
                    context_relevance: 'Context Relevance',
                    author_expertise: 'Author Expertise',
                    key_mechanisms: 'Key Mechanisms',
                    evidence: 'Evidence & Data'
                },
                assistance: {
                    buttonLabel: 'Need help finding this? 🔍',
                    draftButtonLabel: 'Suggest an answer ✨',
                    panelTitle: 'Suggestions',
                    loading: 'Searching authoritative sources...',
                    draftLoading: 'Generating inspiration for you...',
                    generateAnswerButton: 'Generate answer from sources',
                    generatingAnswer: 'Generating an answer from sources...',
                    generatedAnswerTitle: 'Suggested answer',
                    generatedAnswerUse: 'Use this answer',
                    cachedLabel: 'Cached',
                    relevanceLabel: 'Relevance',
                    fitLabel: 'Fit with your thesis',
                    useThis: 'Use this',
                    noResults: 'No results found. Try answering in your own words.',
                    rateLimitReached: 'Search limit reached for today.',
                    types: {
                        examples: 'examples',
                        claims: 'claims & stats',
                        sources: 'authoritative sources',
                        definition: 'definitions'
                    }
                }
            },
            review: {
                title: 'Interview Assessment',
                subtitle: 'Here\'s a summary of the information gathered for your article.',
                coverageScore: 'Coverage Score',
                responsesCollected: 'responses collected',
                covered: 'Covered',
                missing: 'Needs more detail',
                dataPoints: {
                    thesis_depth: 'Thesis Depth',
                    context_relevance: 'Context Relevance',
                    author_expertise: 'Author Expertise',
                    key_mechanisms: 'Key Mechanisms',
                    evidence: 'Evidence & Data'
                },
                recommendation: {
                    strong: 'Great coverage! You\'re ready to generate the outline.',
                    acceptable: 'Good coverage. You can proceed or answer a few more questions.',
                    weak: 'Limited coverage. We recommend answering a few more questions.'
                },
                proceedAnyway: 'Proceed anyway',
                answerMore: 'Answer more questions',
                generateOutline: 'Next: Analyze Sources'
            },
            draftSubmission: {
                title: 'Do you have the draft ready?',
                desc: 'If you have already written the content, you can paste it here directly. Otherwise, no problem! Come back when you are ready.',
                yesOption: 'Yes, I have the text',
                noOption: 'No, I need to write it',
                placeholder: 'Paste your article content here...',
                submitDraft: 'Submit Draft',
                saveForLater: 'I\'ll come back later',
                successPending: 'Perfect! We saved your progress. When you are ready, come back here to submit your draft.',
                successSubmitted: 'Draft received! Our team will review it shortly.'
            },
            sourceDiscovery: {
                title: 'Source Discovery',
                subtitle: 'To ensure maximum authority, we identified verified sources relevant to your topic with Perplexity Sonar. Select the ones you want to use and pick claims to integrate into the outline.',
                searching: 'Analyzing Authority...',
                searchingDesc: 'Querying Perplexity Sonar to find papers and reports validating your thesis. This may take up to 30 seconds.',
                sourcesSelected: 'sources selected',
                continueToOutline: 'Generate Outline with Sources',
                claimsLabel: 'Useful Claims (select to include)',
                error: 'Could not complete search. Please try again later.',
                rateLimitTitle: 'Daily Limit Reached',
                rateLimitDesc: 'You have reached the source search limit for today. <br />Retry at {resetTime}.',
                skipSource: 'Skip this step'
            },
            outline: {
                title: 'Generated Outline',
                desc: 'Here is the suggested structure based on your answers.',
                approve: 'Approve & Save',
                regenerate: 'Regenerate',
                exportMD: 'Export to MD'
            },
            success: {
                autonomy: {
                    title: 'Great work!',
                    message: 'Thanks for proposing this topic. We now know you are working on it.\n\nIf you need support, have doubts or questions, email us at:',
                    email: 'info@staituned.com',
                    cta: 'Back to Dashboard'
                },
                interview: {
                    title: 'Interview Completed!',
                    message: 'Thanks for your contribution. A stAItuned expert will analyze your answers and contact you shortly to proceed with drafting the article.',
                    cta: 'Back to Dashboard'
                },
                guided: {
                    title: 'Outline Saved!',
                    message: 'Your structure is ready. You can find it in your dashboard to start writing.',
                    cta: 'Go to Dashboard'
                }
            },
            resumeSelection: {
                title: 'You have existing submissions:',
                subtitle: 'Would you like to resume one of these or start a new article submission?',
                resume: 'Resume',
                view: 'View',
                startNew: 'Start new article submission',
                updatedAt: 'Updated on',
                untitled: 'New Article (Untitled)'
            }
        },

        dashboard: {
            title: 'Your Contributions',
            tabs: {
                published: 'Published',
                in_progress: 'In Progress'
            },
            newBtn: 'New Article',
            empty: 'You haven\'t written anything yet. Start today!',
            status: {
                pitch: 'Pitch',
                interview: 'Interview',
                outline: 'Outline',
                draft: 'Draft',
                review: 'In Review',
                scheduled: 'Scheduled',
                published: 'Published'
            }
        }
    }
};

export type ContributeLanguage = keyof typeof contributeTranslations;
