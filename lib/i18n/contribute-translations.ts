export const contributeTranslations = {
    it: {
        // Landing Page
        landing: {
            hero: {
                title: 'Condividi la tua competenza',
                subtitle: 'Trasforma le tue conoscenze in impatto. Noi gestiamo SEO, distribuzione e design. Tu mantieni la piena paternità.',
                cta: 'Scegli il tuo percorso'
            },
            paths: {
                autonomy: {
                    title: 'Autonomia',
                    description: 'Scrivi liberamente, noi ottimizziamo',
                    time: '1-3 ore',
                    cta: 'Inizia'
                },
                guided: {
                    title: 'Guidato',
                    description: 'Rispondi alle domande, noi suggeriamo la struttura',
                    time: '15-30 minuti',
                    cta: 'Inizia'
                },
                interview: {
                    title: 'Intervista',
                    description: 'Condividi le tue intuizioni, noi scriviamo le bozze',
                    time: '20 minuti',
                    cta: 'Inizia'
                }
            },
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
                review: 'Revisione'
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
                cta: 'Accetta e Continua'
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
                submit: 'Invia Risposta'
            },
            review: {
                title: 'Valutazione Intervista',
                subtitle: 'Ecco un riepilogo delle informazioni raccolte per il tuo articolo.',
                coverageScore: 'Punteggio Copertura',
                covered: 'Coperto',
                missing: 'Da approfondire',
                dataPoints: {
                    thesis: 'Tesi centrale',
                    key_points: 'Punti chiave',
                    examples: 'Esempi pratici',
                    sources: 'Fonti autorevoli',
                    claims: 'Claim specifici'
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
            sourceDiscovery: {
                title: 'Ricerca Fonti Autorevoli',
                subtitle: 'Per garantire la massima autorevolezza, abbiamo identificato fonti verificate pertinenti al tuo argomento con Perplexity Sonar. Seleziona quelle che vuoi utilizzare e scegli i claim da integrare nella struttura.',
                searching: 'Analisi Autorevolezza in corso...',
                searchingDesc: 'Stiamo interrogando Perplexity Sonar per trovare paper e report che validano la tua tesi. Questo potrebbe richiedere fino a 30 secondi.',
                sourcesSelected: 'fonti selezionate',
                continueToOutline: 'Genera Outline con Fonti',
                claimsLabel: 'Claim Utili (seleziona quelli da includere)',
                error: 'Impossibile completare la ricerca. Riprova più tardi.'
            },
            outline: {
                title: 'Outline Generato',
                desc: 'Ecco la struttura suggerita basata sulle tue risposte.',
                approve: 'Approva e Salva',
                regenerate: 'Rigenera'
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
                title: 'Share Your Expertise',
                subtitle: 'Turn your knowledge into impact. We handle SEO, distribution, and design. You keep full authorship.',
                cta: 'Choose Your Path'
            },
            paths: {
                autonomy: {
                    title: 'Autonomy',
                    description: 'Write freely, we optimize',
                    time: '1-3 hours',
                    cta: 'Start'
                },
                guided: {
                    title: 'Guided',
                    description: 'Answer questions, we suggest structure',
                    time: '15-30 mins',
                    cta: 'Start'
                },
                interview: {
                    title: 'Interview',
                    description: 'Share insights, we draft',
                    time: '20 mins',
                    cta: 'Start'
                }
            },
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
                review: 'Review'
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
                cta: 'Accept & Continue'
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
                submit: 'Submit Answer'
            },
            review: {
                title: 'Interview Assessment',
                subtitle: 'Here\'s a summary of the information gathered for your article.',
                coverageScore: 'Coverage Score',
                covered: 'Covered',
                missing: 'Needs more detail',
                dataPoints: {
                    thesis: 'Core thesis',
                    key_points: 'Key points',
                    examples: 'Practical examples',
                    sources: 'Authoritative sources',
                    claims: 'Specific claims'
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
            sourceDiscovery: {
                title: 'Source Discovery',
                subtitle: 'To ensure maximum authority, we identified verified sources relevant to your topic with Perplexity Sonar. Select the ones you want to use and pick claims to integrate into the outline.',
                searching: 'Analyzing Authority...',
                searchingDesc: 'Querying Perplexity Sonar to find papers and reports validating your thesis. This may take up to 30 seconds.',
                sourcesSelected: 'sources selected',
                continueToOutline: 'Generate Outline with Sources',
                claimsLabel: 'Useful Claims (select to include)',
                error: 'Could not complete search. Please try again later.'
            },
            outline: {
                title: 'Generated Outline',
                desc: 'Here is the suggested structure based on your answers.',
                approve: 'Approve & Save',
                regenerate: 'Regenerate'
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
