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

    // Common
    common: {
        exploreArticles: string
        articles: string
        free: string
    }
}

export const translations: Record<LearnLocale, LearnTranslations> = {
    en: {
        hero: {
            title: "AI is everywhere. Execution is rare.",
            subtitle: "Read what works. Then write or build with review — until it ships.",
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
        }
    },
    it: {
        hero: {
            title: "L’AI è ovunque. I risultati no.",
            subtitle: "Leggi cosa funziona davvero. Poi scrivi o costruisci con review — fino al deploy.",
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
        }
    }
}
