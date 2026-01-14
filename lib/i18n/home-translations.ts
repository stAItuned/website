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
    articles: {
        title: string
        subtitle: string
        viewAll: string
        trending: string
        recent: string
        pathBeginner: string
        pathExpert: string
        midSection: {
            text: string
            cta: string
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
}

export const homeTranslations: Record<'en' | 'it', HomeTranslations> = {
    it: {
        hero: {
            headline: "Il futuro succede mentre leggi.",
            pain: "L'AI sta plasmando il **mondo reale**. Non restare indietro: trasformiamo il rumore in **Vantaggio Competitivo**. Un articolo alla volta.",
            mission: "Non restare a guardare.",
            ctaArticles: "Aggiornati con gli articoli",
            ctaCareerOS: "Scopri Career OS",
            stats: {
                articles: "Articoli Tecnici",
                contributors: "Esperti AI",
                careerFocused: "Focus Engineer"
            }
        },
        articles: {
            title: "Ultimi Approfondimenti",
            subtitle: "Deep-dive tecnici e strategie di carriera per AI Engineers.",
            viewAll: "Scopri tutti gli articoli",
            trending: "Popolari",
            recent: "Recenti",
            pathBeginner: "Percorso Beginner",
            pathExpert: "Percorso Expert",
            midSection: {
                text: "Ti piace quello che leggi? Iscriviti alla newsletter.",
                cta: "Resta aggiornato"
            },
            wantDeeper: "Vuoi approfondire un percorso specifico?"
        },
        leadMagnet: {
            title: "Non sai quale ruolo AI fa per te?",
            description: "ML Engineer? AI Ops? Data Scientist? Scarica la guida gratuita AI Career Role-Fit e trova il tuo percorso.",
            cta: "Scarica la Guida Gratis",
            disclaimer: "Zero spam. Solo chiarezza sulla tua direzione AI."
        },
        intermezzo: {
            badge: "Cohort #1 — Italia — Posti Limitati",
            headline: "Stai cercando lavoro nell'AI ma nessuno risponde?",
            subtext: "Le aziende non assumono 'appassionati di AI'. Assumono builder con proof. Career OS ti aiuta a costruirlo in 8 settimane.",
            ctaCareerOS: "Scopri Career OS",
            ctaLeadMagnet: "Scarica CV Rubric Gratis",
            dismiss: "Non ora",
            keepReading: "Continua a leggere"
        }
    },
    en: {
        hero: {
            headline: "The future happens while you read.",
            pain: "AI is shaping the **real world**. Don't get left behind: we turn noise into **Competitive Advantage**. One article at a time.",
            mission: "Don't just watch.",
            ctaArticles: "Get updated with articles",
            ctaCareerOS: "Discover Career OS",
            stats: {
                articles: "Technical Articles",
                contributors: "AI Experts",
                careerFocused: "Engineer Focus"
            }
        },
        articles: {
            title: "Latest Insights",
            subtitle: "Technical deep-dives and career strategy for AI Engineers.",
            viewAll: "Discover all articles",
            trending: "Trending",
            recent: "Recent",
            pathBeginner: "Beginner Path",
            pathExpert: "Expert Path",
            midSection: {
                text: "Like what you're reading? Join the newsletter.",
                cta: "Stay updated"
            },
            wantDeeper: "Want to go deep on a specific path?"
        },
        leadMagnet: {
            title: "Not sure which AI role fits you?",
            description: "ML Engineer? AI Ops? Data Scientist? Download the free AI Career Role-Fit Guide and find your path.",
            cta: "Get the Free Guide",
            disclaimer: "No spam. Just clarity on your AI career direction."
        },
        intermezzo: {
            badge: "Cohort #1 — Italy Only — Limited Spots",
            headline: "Looking for an AI job but getting no responses?",
            subtext: "Companies don't hire 'AI enthusiasts'. They hire builders with proof. Career OS helps you build it in 8 weeks.",
            ctaCareerOS: "Discover Career OS",
            ctaLeadMagnet: "Download Free CV Rubric",
            dismiss: "Not now",
            keepReading: "Keep Reading"
        }
    }
}
