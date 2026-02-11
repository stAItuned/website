/**
 * Home Page Translations
 * 
 * Bilingual support for IT/EN on Home Page UI elements.
 */

export interface HomeTranslations {
    hero: {
        headline: string
        pain: string
        mission: string
        ctaArticles: string
        ctaCareerOS: string
        stats: {
            articles: string
            contributors: string
            careerFocused: string
        }
    }
    whoWeAre: {
        badge: string
        title: string
        subtitle: string
        pillars: {
            learn: {
                title: string
                description: string
                cta: string
            }
            careerOS: {
                title: string
                description: string
                cta: string
            }
            practitionerLed: {
                title: string
                description: string
                cta: string
            }
        }
    }
    differentiators: {
        badge: string
        title: string
        items: {
            practitioner: {
                title: string
                description: string
            }
            noHype: {
                title: string
                description: string
            }
            practical: {
                title: string
                description: string
            }
        }
    }
    articles: {
        title: string
        subtitle: string
        viewAll: string
        trending: string
        recent: string
        pathBeginner: string
        pathExpert: string
        midSection: {
            title: string
            subtitle: string
            cta: string
            socialProof: string
        }
        wantDeeper: string
    }
    leadMagnet: {
        title: string
        description: string
        cta: string
        disclaimer: string
    }
    intermezzo: {
        badge: string
        headline: string
        subtext: string
        ctaCareerOS: string
        ctaLeadMagnet: string
        dismiss: string
        keepReading: string
    }
    newsletter: {
        title: string
        description: string
        placeholder: string
        button: string
        loading: string
        success: string
        error: string
        consent: string
        privacyPolicy: string
        termsConditions: string
        benefits: string[]
    }
    pwa: {
        title: string
        subtitle: string
        install: string
        dismiss: string
        offline: string
        offline_desc: string
        fast: string
        fast_desc: string
        home: string
        native: string
        native_desc: string
        app_label: string
        free_app: string
        browser_hint: string
        title_desktop: string
    }
    meet: {
        hero: {
            badge: string
            headline: string
            description: string
        }
        story: {
            badge: string
            title: string
            p1: string
            p2: string
            quote: string
            quoteLabel: string
        }
        mission: {
            badge: string
            title: string
            description: string
        }
        values: {
            badge: string
            title: string
            items: Array<{
                title: string
                description: string
            }>
        }
        contributors: {
            badge: string
            title: string
            description: string
            cta: string
            stats: string
        }
        join: {
            badge: string
            title: string
            description: string
            ctaProgram: string
            ctaArticles: string
        }
        footer: {
            text: string
            ctaArticles: string
            ctaCareer: string
        }
    }
    footer: {
        explore: string
        resources: string
        legal: string
        blog: string
        contribute: string
        careeros: string
        meet: string
        audit: string
        rss: string
        manageCookies: string
        disclaimer: string
        stayUpdated: string
        noSpam: string
        privacyPolicy: string
        termsConditions: string
        cookiePolicy: string
    }
}

export const homeTranslations: Record<'en' | 'it', HomeTranslations> = {
    it: {
        hero: {
            headline: "Dove l'AI diventa pratica",
            pain: "Contenuti pratici scritti da chi lavora con l'AI ogni giorno. **Zero hype**, solo ciò che funziona davvero",
            mission: "Aggiornati. Specializzati. Costruisci.",
            ctaArticles: "Inizia a leggere",
            ctaCareerOS: "Scopri come Contribuire",
            stats: {
                articles: "Articoli",
                contributors: "Contributors",
                careerFocused: "Practitioner-led"
            }
        },
        whoWeAre: {
            badge: "L'ecosistema stAItuned",
            title: "Tutto ciò che ti serve per capire e usare l'AI",
            subtitle: "Non siamo un corso online. Siamo una community di professionisti che condivide ciò che funziona davvero.",
            pillars: {
                learn: {
                    title: "📚 stAI tuned Learn",
                    description: "Non ti serve l'ennesimo corso teorico. Ti serve **sapere cosa fare**. Oltre 85 articoli per passare dalla teoria alla *produzione*.",
                    cta: "Inizia a leggere"
                },
                careerOS: {
                    title: "🚀 Lancia la tua carriera con Career OS",
                    description: "Smetti di inviare CV nel vuoto. Un percorso di **mentoring pratico** per costruire la tua carriera nell'AI in *8 settimane*, con **prove concrete** da aggiungere al tuo portfolio.",
                    cta: "Contribuisci"
                },
                practitionerLed: {
                    title: "✍️ Practitioner-led",
                    description: "Basta fuffa. Qui scrive solo **chi si sporca le mani** con il codice ogni giorno. Esperienza reale, *zero hype*.",
                    cta: "Conosci stAI tuned"
                }
            }
        },
        differentiators: {
            badge: "Cosa ci rende diversi",
            title: "Perché stAI tuned?",
            items: {
                practitioner: {
                    title: "Practitioner-led",
                    description: "Chi scrive e insegna lavora con l'AI ogni giorno. Non ricicliamo teoria, condividiamo esperienza."
                },
                noHype: {
                    title: "Zero hype",
                    description: "Diciamo cosa funziona e cosa no. Niente promesse esagerate, solo onestà e trasparenza."
                },
                practical: {
                    title: "Praticità first",
                    description: "Se non puoi applicarlo domani, non lo pubblichiamo. Ogni contenuto ha un obiettivo concreto."
                }
            }
        },
        articles: {
            title: "Ultimi Approfondimenti",
            subtitle: "Guide pratiche e deep-dive scritti da professionisti AI.",
            viewAll: "Scopri tutti gli articoli",
            trending: "Popolari",
            recent: "Recenti",
            pathBeginner: "Percorso Beginner",
            pathExpert: "Percorso Expert",
            midSection: {
                title: "L'era della GenAI non aspetta.",
                subtitle: "Ricevi contenuti pratici su AI e GenAI, scritti da chi lavora nel settore.",
                cta: "Unisciti alla Newsletter",
                socialProof: "Unisciti a +2.000 AI Builder"
            },
            wantDeeper: "Vuoi approfondire un percorso specifico?"
        },
        leadMagnet: {
            title: "Qual è il mio fit GenAI?",
            description: "Smetti di tirare a indovinare. In 5 minuti ottieni il tuo **Score 0-100**, i **gap chiari** e il tuo **piano d'azione di 7 giorni**.",
            cta: "Scopri il mio fit",
            disclaimer: "Riceverai un report PDF personalizzato con il tuo piano d'azione."
        },
        intermezzo: {
            badge: "Cohort #1, Italia, Posti Limitati",
            headline: "Stai cercando lavoro nell'AI ma nessuno risponde?",
            subtext: "Le aziende non assumono 'appassionati di AI'. Assumono builder con proof. Career OS ti aiuta a costruirlo in 8 settimane.",
            ctaCareerOS: "Scopri Career OS",
            ctaLeadMagnet: "Scarica CV Rubric Gratis",
            dismiss: "Non ora",
            keepReading: "Continua a leggere"
        },
        newsletter: {
            title: "📬 Resta aggiornato",
            description: "Nuovi articoli, tool e casi d'uso AI direttamente nella tua inbox.",
            placeholder: "La tua email",
            button: "Iscriviti alla newsletter",
            loading: "Un momento...",
            success: "🎉 Iscrizione completata!",
            error: "Errore. Riprova.",
            consent: "Iscrivendomi accetto i ",
            privacyPolicy: "Privacy Policy",
            termsConditions: "Termini e Condizioni",
            benefits: [
                "Deep-dive tecnici settimanali",
                "Strategie di carriera per AI Engineers",
                "Casi studio reali di implementazione"
            ]
        },
        pwa: {
            title: "Porta stAI tuned su mobile",
            subtitle: "Installa l'app per leggere offline",
            install: "Installa",
            dismiss: "Forse dopo",
            offline: "Leggi offline",
            offline_desc: "Accedi agli articoli senza internet",
            fast: "Velocità estrema",
            fast_desc: "Caricamento istantaneo",
            home: "Accesso dalla home",
            native: "Esperienza Nativa",
            native_desc: "Proprio come un'app reale",
            app_label: "La tua app per imparare l'AI",
            free_app: "App Gratuita",
            browser_hint: "Apri in Chrome o Safari per installare l'app",
            title_desktop: "Installa l'app desktop"
        },
        meet: {
            hero: {
                badge: "Chi siamo",
                headline: "Dove l'AI diventa **pratica**",
                description: "**stAItuned** nasce per chi vuole capire l'AI senza perdersi nell'hype. Contenuti *pratici*, scritti da chi lavora con l'AI *ogni giorno*."
            },
            story: {
                badge: "La nostra storia",
                title: "Da **junior frustrati** a practitioner che condividono",
                p1: "Prima di creare stAItuned, eravamo junior confusi. L'AI esplodeva, ma le risorse erano frammentate, piene di **hype**, scritte da chi non lavorava davvero nel campo.",
                p2: "Ci siamo chiesti: *cosa succederebbe se i practitioner condividessero ciò che sanno?*",
                quote: "Se chi lavora nell'AI ogni giorno condividesse ciò che sa, quante persone potrebbero crescere più velocemente?",
                quoteLabel: "L'idea che ha dato vita a stAItuned"
            },
            mission: {
                badge: "La nostra mission",
                title: "Portare la **cultura AI a tutti**, con contenuti **pratici** e senza hype, per accelerare l'innovazione.",
                description: "Crediamo che quando più persone capiscono l'AI, le aziende innovano più velocemente, i professionisti crescono più rapidamente, e la società ne beneficia."
            },
            values: {
                badge: "I nostri valori",
                title: "I principi che ci guidano",
                items: [
                    {
                        title: "Praticità prima di tutto",
                        description: "Se non puoi applicarlo domani, non lo pubblichiamo. Ogni contenuto ha un **obiettivo concreto**."
                    },
                    {
                        title: "Zero hype",
                        description: "Diciamo cosa funziona e cosa no. **Niente promesse esagerate**, solo onestà e trasparenza."
                    },
                    {
                        title: "Chiarezza senza semplificazioni",
                        description: "Spieghiamo il complesso in modo semplice, **senza banalizzarlo**. Profondità accessibile."
                    },
                    {
                        title: "Qualità non negoziabile",
                        description: "**Meglio meno, ma meglio**. Non pubblichiamo per fare numero, pubblichiamo per fare la differenza."
                    }
                ]
            },
            contributors: {
                badge: "I nostri contributor",
                title: "Chi scrive su stAItuned",
                description: "Professionals che lavorano con l'AI **ogni giorno** e condividono la loro esperienza.",
                cta: "Scopri tutti i contributor",
                stats: "articol" // singular/plural handled logic in client
            },
            join: {
                badge: "Contributor Program",
                title: "Vuoi scrivere su AI?",
                description: "I contenuti di stAItuned sono scritti da professionisti che lavorano con l'AI. Se hai **esperienza pratica** da condividere, potresti diventare contributor.",
                ctaProgram: "Scopri il Contributor Program →",
                ctaArticles: "Esplora gli articoli"
            },
            footer: {
                text: "Pronto a iniziare?",
                ctaArticles: "Esplora gli articoli",
                ctaCareer: "Scopri Career OS"
            }
        },
        footer: {
            explore: "Esplora",
            resources: "Risorse",
            legal: "Legale",
            blog: "Blog",
            contribute: "Diventa Contributor",
            careeros: "Career OS",
            meet: "Chi siamo",
            audit: "Role Fit Audit",
            rss: "RSS Feed",
            manageCookies: "Gestisci cookie",
            disclaimer: "stAItuned è un progetto indipendente di formazione e sperimentazione su AI. Le attività vengono svolte al di fuori dell'orario di lavoro dipendente e senza utilizzo di informazioni riservate o progetti interni ad altri datori di lavoro.",
            stayUpdated: "Resta aggiornato",
            noSpam: "Niente spam · Disiscriviti quando vuoi",
            privacyPolicy: "Privacy Policy",
            termsConditions: "Termini e Condizioni",
            cookiePolicy: "Cookie Policy"
        }
    },
    en: {
        hero: {
            headline: "Where AI Gets Practical.",
            pain: "Practical content written by AI practitioners. **Zero hype**, only what actually works.",
            mission: "Stay Updated. Specialize. Build.",
            ctaArticles: "Start Reading",
            ctaCareerOS: "Discover how to Contribute",
            stats: {
                articles: "Articles",
                contributors: "Contributors",
                careerFocused: "Practitioner-led"
            }
        },
        whoWeAre: {
            badge: "The stAItuned Ecosystem",
            title: "Everything you need to understand and use AI",
            subtitle: "We're not an online course. We're a community of practitioners sharing what actually works.",
            pillars: {
                learn: {
                    title: "📚 stAI tuned Learn",
                    description: "You don't need another theory course. You need to **know what to do**. 85+ practical guides to go from theory to *production*.",
                    cta: "Start Reading"
                },
                careerOS: {
                    title: "🚀 Career OS",
                    description: "Stop sending CVs into the void. A **practical mentoring** path to build your AI career in *8 weeks*.",
                    cta: "Launch Your Career"
                },
                practitionerLed: {
                    title: "✍️ Practitioner-led",
                    description: "No fluff. Written only by those who **get their hands dirty** with code every day. Real experience, *zero hype*.",
                    cta: "Meet the Team"
                }
            }
        },
        differentiators: {
            badge: "What makes us different",
            title: "Why stAI tuned?",
            items: {
                practitioner: {
                    title: "Practitioner-led",
                    description: "Those who write and teach work with AI every day. We don't recycle theory, we share experience."
                },
                noHype: {
                    title: "Zero hype",
                    description: "We say what works and what doesn't. No exaggerated promises, just honesty and transparency."
                },
                practical: {
                    title: "Practical first",
                    description: "If you can't apply it tomorrow, we don't publish it. Every piece of content has a concrete goal."
                }
            }
        },
        articles: {
            title: "Latest Insights",
            subtitle: "Practical guides and deep-dives written by AI practitioners.",
            viewAll: "Discover all articles",
            trending: "Trending",
            recent: "Recent",
            pathBeginner: "Beginner Path",
            pathExpert: "Expert Path",
            midSection: {
                title: "The GenAI era won't wait.",
                subtitle: "Get practical AI and GenAI content, written by industry practitioners.",
                cta: "Join the Newsletter",
                socialProof: "Join 2,000+ AI Builders"
            },
            wantDeeper: "Want to go deep on a specific path?"
        },
        leadMagnet: {
            title: "What's your GenAI fit?",
            description: "Stop guessing. In 5 minutes get your **0-100 Score**, clear **skills gaps**, and your **7-day action plan**.",
            cta: "Discover my fit",
            disclaimer: "You'll receive a personalized PDF report with your action plan."
        },
        intermezzo: {
            badge: "Cohort #1, Italy Only, Limited Spots",
            headline: "Looking for an AI job but getting no responses?",
            subtext: "Companies don't hire 'AI enthusiasts'. They hire builders with proof. Career OS helps you build it in 8 weeks.",
            ctaCareerOS: "Discover Career OS",
            ctaLeadMagnet: "Download Free CV Rubric",
            dismiss: "Not now",
            keepReading: "Keep Reading"
        },
        newsletter: {
            title: "📬 Stay updated",
            description: "New articles, tools, and AI use cases directly in your inbox.",
            placeholder: "Your email",
            button: "Subscribe to newsletter",
            loading: "One moment...",
            success: "🎉 Subscription complete!",
            error: "Error. Try again.",
            consent: "By subscribing I accept the ",
            privacyPolicy: "Privacy Policy",
            termsConditions: "Terms and Conditions",
            benefits: [
                "Weekly technical deep-dives",
                "Career strategies for AI Engineers",
                "Real implementation case studies"
            ]
        },
        pwa: {
            title: "Take stAI tuned on mobile",
            subtitle: "Install for offline reading",
            install: "Install",
            dismiss: "Maybe later",
            offline: "Read Offline",
            offline_desc: "Access articles without internet",
            fast: "Lightning Fast",
            fast_desc: "Instant loading experience",
            home: "Home screen access",
            native: "Native Feel",
            native_desc: "Just like a real app",
            app_label: "Your pocket AI learning companion",
            free_app: "Free App",
            browser_hint: "Open in Chrome or Safari to install the app",
            title_desktop: "Install desktop app"
        },
        meet: {
            hero: {
                badge: "Who We Are",
                headline: "Where AI Gets **Practical**",
                description: "**stAItuned** is for those who want to understand AI without getting lost in result. *Practical* content, written by those who work with AI *every day*."
            },
            story: {
                badge: "Our Story",
                title: "From **Frustrated Juniors** to Practitioners Who Share",
                p1: "Before founding stAItuned, we were confused juniors. AI was exploding, but resources were fragmented, full of **hype**, written by people who didn't really work in the field.",
                p2: "We asked ourselves: *what would happen if practitioners shared what they know?*",
                quote: "If those who work in AI every day shared what they know, how many people could grow faster?",
                quoteLabel: "The idea that sparked stAItuned"
            },
            mission: {
                badge: "Our Mission",
                title: "Bringing **AI culture to everyone**, with **practical** content and no hype, to accelerate innovation.",
                description: "We believe that when more people understand AI, companies innovate faster, professionals grow more quickly, and society benefits."
            },
            values: {
                badge: "Our Values",
                title: "Principles That Guide Us",
                items: [
                    {
                        title: "Practicality First",
                        description: "If you can't apply it tomorrow, we don't publish it. Every piece of content has a **concrete goal**."
                    },
                    {
                        title: "Zero Hype",
                        description: "We say what works and what doesn't. **No exaggerated promises**, just honesty and transparency."
                    },
                    {
                        title: "Clarity Without Simplification",
                        description: "We explain the complex simply, **without trivializing it**. Accessible depth."
                    },
                    {
                        title: "Non-Negotiable Quality",
                        description: "**Better less, but better**. We don't publish to hit numbers, we publish to make a difference."
                    }
                ]
            },
            contributors: {
                badge: "Our Contributors",
                title: "Who Writes on stAItuned",
                description: "Professionals who work with AI **every day** and share their experience.",
                cta: "Discover all contributors",
                stats: "article"
            },
            join: {
                badge: "Contributor Program",
                title: "Want to Write About AI?",
                description: "stAItuned content is written by professionals working with AI. If you have **practical experience** to share, you could become a contributor.",
                ctaProgram: "Discover Contributor Program →",
                ctaArticles: "Explore Articles"
            },
            footer: {
                text: "Ready to Start?",
                ctaArticles: "Explore Articles",
                ctaCareer: "Discover Career OS"
            }
        },
        footer: {
            explore: "Explore",
            resources: "Resources",
            legal: "Legal",
            blog: "Blog",
            contribute: "Become a Contributor",
            careeros: "Career OS",
            meet: "About Us",
            audit: "Role Fit Audit",
            rss: "RSS Feed",
            manageCookies: "Manage Cookies",
            disclaimer: "stAItuned is an independent project for training and experimentation on AI. Activities are carried out outside of employee working hours and without the use of confidential information or internal projects of other employers.",
            stayUpdated: "Stay Updated",
            noSpam: "No spam · Unsubscribe anytime",
            privacyPolicy: "Privacy Policy",
            termsConditions: "Terms and Conditions",
            cookiePolicy: "Cookie Policy"
        }
    }
}
