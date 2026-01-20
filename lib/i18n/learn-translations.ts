/**
 * Learn Page Translations
 * 
 * Bilingual support for IT/EN on UI elements only.
 * Articles remain in their original language.
 */

export type LearnLocale = 'en' | 'it'

export interface LearnTranslations {
    // Hero Section
    hero: {
        title: string
        subtitle: string
        slogan?: string
        ctaContributor: string
        ctaLab: string
        microProof: {
            free: string
            noPaywall: string
            review: string
            endToEnd: string
        }
    }

    // Router Section (decision point)
    router: {
        title: string
        subtitle: string
        read: {
            badge: string
            title: string
            description: string
            features: string[]
            ctaPrimary: string
            ctaSecondary: string
        }
        build: {
            badge: string
            title: string
            description: string
            features: string[]
            ctaPrimary: string
            ctaSecondary: string
        }
    }

    // Audience Section
    audience: {
        title: string
        forWho: string[]
        notForWho: {
            title: string
            description: string
        }
    }

    // Path Cards Section
    pathCards: {
        write: {
            badge: string
            title: string
            description: string
            features: string[]
            cta: string
        }
        build: {
            badge: string
            title: string
            description: string
            features: string[]
            cta: string
        }
    }

    // How It Works Section
    howItWorks: {
        title: string
        contributor: {
            title: string
            steps: Array<{ title: string; description: string }>
        }
        lab: {
            title: string
            steps: Array<{ title: string; description: string }>
        }
    }

    // Featured Section
    featured: {
        title: string
        cta: string
    }

    // Learning Paths Section
    learningPaths: {
        title: string
        subtitle: string
        paths: {
            foundation: { name: string; description: string }
            applied: { name: string; description: string }
            advanced: { name: string; description: string }
        }
        cta: string
    }

    // Articles Page
    articlesPage: {
        title: string
        highlight: string
        description: string
        stats: {
            articles: string
            content: string
            levels: string
        }
        filter: string
        searchPlaceholder: string
        sort: {
            trending: string
            recent: string
        }
        all: string
        noArticles: string
        noResults: string
        clearFilters: string
        previous: string
        next: string
        writeCTA: string
        writingTitle: string
        writingSubtitle: string
        writingBenefit1: string
        writingBenefit2: string
        writingBenefit3: string
        writingStart: string
        writingResponseTime: string
        writingSend: string
        writingSending: string
        privacyNote: string
    }

    common: {
        exploreArticles: string
        articles: string
        free: string
    }

    // Topic Hub Section
    topicHub: {
        breadcrumbs: {
            home: string
            topics: string
        }
        stats: {
            article: string
            articles: string
        }
        sections: {
            strategies: string
            pitfalls: string
            faq: string
        }
        deepDives: {
            title: string
            sort: {
                trending: string
                newest: string
            }
        }
        sidebar: {
            startHere: string
            viewAll: string
        }
        card: {
            minRead: string
            readArticle: string
            level: {
                newbie: string
                midway: string
                expert: string
            }
        }
    }
    topicsIndex: {
        hero: {
            badge: string
            titlePrefix: string
            titleHighlight: string
            subtitle: string
            stats: {
                hubs: string
                articles: string
                free: string
            }
        }
        categories: {
            core: string
            applications: string
            career: string
            operations: string
        }
        card: {
            explore: string
            article: string
            articles: string
        }
    }

    topicGrid: {
        browseByTopic: string
        explore: string
        allTopics: string
        viewFullCatalog: string
        seeAll: string
        fallbackDescription: string
    }
}

export const translations: Record<LearnLocale, LearnTranslations> = {
    en: {
        hero: {
            title: "AI is everywhere. Execution is rare.",
            subtitle: "Read what works. Then write or build with review, until it ships.",
            slogan: "Less hype. More shipped work.",
            ctaContributor: "✍️ Become a Contributor",
            ctaLab: "🚀 Join the Lab",
            microProof: {
                free: "No paywalls",
                noPaywall: "Review included",
                review: "End-to-end projects",
                endToEnd: "Data → prototype → demo"
            }
        },
        router: {
            title: "Start here",
            subtitle: "Choose your path.",
            read: {
                badge: "📚 Blog",
                title: "Learn What Actually Works",
                description: "No fluff. No hype. Just practical AI content you can apply today.",
                features: [
                    "30+ curated, battle-tested articles",
                    "From newbie to expert paths",
                    "100% free, no paywall ever"
                ],
                ctaPrimary: "Start Reading →",
                ctaSecondary: "Write for us →"
            },
            build: {
                badge: "🧪 Lab",
                title: "Ship Real Projects",
                description: "Stop tutorials. Build something real with feedback from experts.",
                features: [
                    "Real data → Real code → Real demo",
                    "Architecture and UX review",
                    "Potential team collaborations"
                ],
                ctaPrimary: "Apply to Lab →",
                ctaSecondary: "See how it works →"
            }
        },
        audience: {
            title: "Who is stAItuned Learn for",
            forWho: [
                "AI/ML engineers, data scientists, product builders",
                "People who want to write benchmarks, guides, experiments",
                "Those who want to build serious webapps/PoCs and receive feedback"
            ],
            notForWho: {
                title: "Not for those looking for:",
                description: "This isn't a collection of news or generic content: we publish actionable stuff."
            }
        },
        pathCards: {
            write: {
                badge: "✍️ Write",
                title: "Write on stAItuned",
                description: "Practical articles, benchmarks, teardowns, guides: content that helps others decide and implement.",
                features: [
                    "Clear brief + guidelines",
                    "Editorial + technical review",
                    "Distribution: homepage + newsletter + LinkedIn"
                ],
                cta: "Apply as contributor →"
            },
            build: {
                badge: "🚀 Build",
                title: "Build in the Lab",
                description: "Real projects, small teams, rapid feedback: from feature to demo.",
                features: [
                    "Real use cases (data → pipeline → UI)",
                    "Review on architecture, eval, UX",
                    "Potential collaborations (when there's fit)"
                ],
                cta: "Discover the Lab →"
            }
        },
        howItWorks: {
            title: "How it works",
            contributor: {
                title: "Contributor Path",
                steps: [
                    { title: "Propose a topic", description: "Or choose from backlog" },
                    { title: "Outline + draft", description: "Write with our guidelines" },
                    { title: "Review + publish", description: "Editorial feedback, then live" }
                ]
            },
            lab: {
                title: "Lab Path",
                steps: [
                    { title: "Application", description: "Skill match + project fit" },
                    { title: "Sprint", description: "Work on real project" },
                    { title: "Demo + retro", description: "Present + next steps" }
                ]
            }
        },
        featured: {
            title: "Featured Articles",
            cta: "Explore all articles →"
        },
        learningPaths: {
            title: "Learning Paths",
            subtitle: "Navigate content by your experience level",
            paths: {
                foundation: { name: "Foundation", description: "Getting started with AI fundamentals" },
                applied: { name: "Applied", description: "Building real systems" },
                advanced: { name: "Advanced", description: "Optimizing and scaling" }
            },
            cta: "Explore articles"
        },
        common: {
            exploreArticles: "Explore articles",
            articles: "articles",
            free: "Free"
        },
        topicHub: {
            breadcrumbs: {
                home: "Home",
                topics: "Topics"
            },
            stats: {
                article: "Article",
                articles: "Articles"
            },
            sections: {
                strategies: "Strategies",
                pitfalls: "Risks / Pitfalls",
                faq: "FAQ"
            },
            deepDives: {
                title: "Deep Dives & Guides",
                sort: {
                    trending: "Trending",
                    newest: "Newest"
                }
            },
            sidebar: {
                startHere: "Start Here",
                viewAll: "View all articles"
            },
            card: {
                minRead: "min read",
                readArticle: "Read article",
                level: {
                    newbie: "Newbie",
                    midway: "Midway",
                    expert: "Expert"
                }
            }
        },
        articlesPage: {
            title: "AI Knowledge, ",
            highlight: "Distilled",
            description: "<strong>Practical guides, benchmarks, and deep dives.</strong> Written by <strong>practitioners</strong>, reviewed by <strong>experts</strong>. No fluff, just <strong>actionable knowledge</strong>.",
            stats: {
                articles: "Articles",
                content: "Content",
                levels: "Levels"
            },
            filter: "Filter",
            searchPlaceholder: "Search articles...",
            sort: {
                trending: "Trending",
                recent: "Recent"
            },
            all: "All",
            noArticles: "No articles found",
            noResults: 'No results for "{query}"',
            clearFilters: "Clear filters",
            previous: "Previous",
            next: "Next",
            writeCTA: "✍️ Write for us",
            writingTitle: "Build Your AI Reputation",
            writingSubtitle: "Write for stAItuned and join a growing community of AI practitioners. Gain visibility, build your portfolio, and connect with professionals who share your passion.",
            writingBenefit1: "10k+ LinkedIn reach",
            writingBenefit2: "Editorial support",
            writingBenefit3: "Portfolio builder",
            writingStart: "Start Writing",
            writingResponseTime: "We'll get back to you within 48h",
            writingSend: "Send",
            writingSending: "Sending...",
            privacyNote: "I agree to the Privacy Policy. We'll only use your data to contact you about contributing."
        },
        topicGrid: {
            browseByTopic: "Browse by Topic",
            explore: "Explore",
            allTopics: "All Topics",
            viewFullCatalog: "Browse the full catalog",
            seeAll: "See all",
            fallbackDescription: "Explore articles on this topic."
        },
        topicsIndex: {
            hero: {
                badge: 'stAItuned Topics',
                titlePrefix: 'Explore Your',
                titleHighlight: 'Learning Path',
                subtitle: 'Structured learning paths and deep dives into the most critical areas of AI Engineering and Research.',
                stats: {
                    hubs: 'Topic Hubs',
                    articles: 'Articles',
                    free: 'Free & Open'
                }
            },
            categories: {
                core: 'Core',
                applications: 'Applications',
                career: 'Career',
                operations: 'Operations'
            },
            card: {
                explore: 'Explore Path',
                article: 'article',
                articles: 'articles'
            }
        }
    },
    it: {
        hero: {
            title: "L’AI è ovunque. I risultati no.",
            subtitle: "Leggi cosa funziona davvero. Poi scrivi o costruisci con review, fino al deploy.",
            slogan: "Meno hype. Più lavoro che va live.",
            ctaContributor: "✍️ Diventa Contributor",
            ctaLab: "🚀 Entra nel Lab",
            microProof: {
                free: "Nessun paywall",
                noPaywall: "Review inclusa",
                review: "Progetti end-to-end",
                endToEnd: "Dati → prototipo → demo"
            }
        },
        router: {
            title: "Inizia qui",
            subtitle: "Scegli il tuo percorso.",
            read: {
                badge: "📚 Blog",
                title: "Impara Cosa Funziona Davvero",
                description: "Zero fuffa. Zero hype. Solo contenuti AI pratici che puoi applicare oggi.",
                features: [
                    "30+ articoli curati e testati sul campo",
                    "Percorsi da newbie a expert",
                    "100% gratis, nessun paywall mai"
                ],
                ctaPrimary: "Inizia a Leggere",
                ctaSecondary: "Scrivi per noi →"
            },
            build: {
                badge: "🧪 Lab",
                title: "Costruisci Progetti Veri",
                description: "Basta tutorial. Costruisci qualcosa di reale con feedback da esperti.",
                features: [
                    "Dati reali → Codice reale → Demo reale",
                    "Review su architettura e UX",
                    "Potenziali collaborazioni in team"
                ],
                ctaPrimary: "Candidati al Lab →",
                ctaSecondary: "Come funziona →"
            }
        },
        audience: {
            title: "Per chi è stAItuned Learn",
            forWho: [
                "AI/ML engineer, data scientist, product builder",
                "Persone che vogliono scrivere benchmark, guide, esperimenti",
                "Chi vuole costruire webapp/PoC seri e ricevere feedback"
            ],
            notForWho: {
                title: "Non per chi cerca:",
                description: "Non è una raccolta di news o contenuti generalisti: pubblichiamo roba applicabile."
            }
        },
        pathCards: {
            write: {
                badge: "✍️ Scrivi",
                title: "Scrivi su stAItuned",
                description: "Articoli pratici, benchmark, teardown, guide: contenuti che aiutano altri a decidere e implementare.",
                features: [
                    "Brief chiaro + linee guida",
                    "Review editoriale + tecnica",
                    "Distribuzione: homepage + newsletter + LinkedIn"
                ],
                cta: "Candidati come contributor →"
            },
            build: {
                badge: "🚀 Costruisci",
                title: "Costruisci nel Lab",
                description: "Progetti reali, piccoli team, feedback rapido: dalla feature alla demo.",
                features: [
                    "Use case reali (data → pipeline → UI)",
                    "Review su architettura, eval, UX",
                    "Possibili collaborazioni (quando c'è fit)"
                ],
                cta: "Scopri il Lab →"
            }
        },
        howItWorks: {
            title: "Come funziona",
            contributor: {
                title: "Percorso Contributor",
                steps: [
                    { title: "Proponi un topic", description: "O scegli dal backlog" },
                    { title: "Outline + draft", description: "Scrivi con le nostre linee guida" },
                    { title: "Review + pubblicazione", description: "Feedback editoriale, poi live" }
                ]
            },
            lab: {
                title: "Percorso Lab",
                steps: [
                    { title: "Candidatura", description: "Skill match + fit progetto" },
                    { title: "Sprint", description: "Lavora sul progetto reale" },
                    { title: "Demo + retro", description: "Presenta + next steps" }
                ]
            }
        },
        featured: {
            title: "Articoli in Evidenza",
            cta: "Esplora tutti gli articoli →"
        },
        learningPaths: {
            title: "Percorsi di Apprendimento",
            subtitle: "Naviga i contenuti per livello di esperienza",
            paths: {
                foundation: { name: "Foundation", description: "Per orientarsi sui fondamentali AI" },
                applied: { name: "Applied", description: "Costruire sistemi reali" },
                advanced: { name: "Advanced", description: "Ottimizzare e scalare" }
            },
            cta: "Esplora articoli"
        },
        common: {
            exploreArticles: "Esplora articoli",
            articles: "articoli",
            free: "Gratis"
        },
        topicHub: {
            breadcrumbs: {
                home: "Home",
                topics: "Argomenti"
            },
            stats: {
                article: "Articolo",
                articles: "Articoli"
            },
            sections: {
                strategies: "Strategie",
                pitfalls: "Rischi / Errori comuni",
                faq: "FAQ"
            },
            deepDives: {
                title: "Guide & Approfondimenti",
                sort: {
                    trending: "Popolari",
                    newest: "Recenti"
                }
            },
            sidebar: {
                startHere: "Inizia Qui",
                viewAll: "Vedi tutti"
            },
            card: {
                minRead: "min lettura",
                readArticle: "Leggi articolo",
                level: {
                    newbie: "Base",
                    midway: "Intermedio",
                    expert: "Avanzato"
                }
            }
        },
        articlesPage: {
            title: "Conoscenza AI, ",
            highlight: "Distillata",
            description: "<strong>Guide pratiche, benchmark e approfondimenti.</strong> Scritto da <strong>professionisti</strong>, revisionato da <strong>esperti</strong>. Niente fuffa, solo <strong>conoscenza pragmatica</strong>.",
            stats: {
                articles: "Articoli",
                content: "Contenuti",
                levels: "Livelli"
            },
            filter: "Filtra",
            searchPlaceholder: "Cerca articoli...",
            sort: {
                trending: "Popolari",
                recent: "Recenti"
            },
            all: "Tutti",
            noArticles: "Nessun articolo trovato",
            noResults: 'Nessun risultato per "{query}"',
            clearFilters: "Rimuovi filtri",
            previous: "Precedente",
            next: "Successivo",
            writeCTA: "✍️ Scrivi per noi",
            writingTitle: "Costruisci la tua reputazione AI",
            writingSubtitle: "Scrivi per stAItuned e unisciti a una community in crescita di professionisti AI. Guadagna visibilità, costruisci il tuo portfolio e connettiti con esperti che condividono la tua passione.",
            writingBenefit1: "10k+ reach su LinkedIn",
            writingBenefit2: "Supporto editoriale",
            writingBenefit3: "Portfolio builder",
            writingStart: "Inizia a scrivere",
            writingResponseTime: "Ti risponderemo entro 48 ore",
            writingSend: "Invia",
            writingSending: "Invio in corso...",
            privacyNote: "Accetto la Privacy Policy. Useremo i tuoi dati solo per contattarti riguardo alla collaborazione."
        },
        topicGrid: {
            browseByTopic: "Esplora per Argomento",
            explore: "Esplora",
            allTopics: "Tutti i Topic",
            viewFullCatalog: "Sfoglia l'intero catalogo",
            seeAll: "Vedi tutto",
            fallbackDescription: "Esplora articoli su questo argomento."
        },
        topicsIndex: {
            hero: {
                badge: 'stAItuned Topics',
                titlePrefix: 'Esplora il tuo',
                titleHighlight: 'Percorso di Apprendimento',
                subtitle: 'Percorsi di apprendimento strutturati e approfondimenti sulle aree più critiche dell\'Ingegneria e Ricerca AI.',
                stats: {
                    hubs: 'Topic Hub',
                    articles: 'Articoli',
                    free: 'Gratis & Open'
                }
            },
            categories: {
                core: 'Fondamentali',
                applications: 'Applicazioni',
                career: 'Carriera',
                operations: 'Operazioni'
            },
            card: {
                explore: 'Esplora Percorso',
                article: 'articolo',
                articles: 'articoli'
            }
        }
    }
}
