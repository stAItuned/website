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
                title: "L'era della GenAI non aspetta.",
                subtitle: "Ricevi ogni settimana deep-dive tecnici e strategie per scalare la tua carriera nell'AI.",
                cta: "Unisciti alla Newsletter",
                socialProof: "Unisciti a +2.000 AI Builder"
            },
            wantDeeper: "Vuoi approfondire un percorso specifico?"
        },
        leadMagnet: {
            title: "Non sai quale ruolo AI fa per te?",
            description: "Smetti di tirare a indovinare. Fai il **Role Fit Audit**: 15 domande per scoprire il tuo percorso ideale in ambito AI/GenAI",
            cta: "Fai l'Audit Gratuito",
            disclaimer: "Riceverai un report PDF personalizzato con il tuo piano d'azione."
        },
        intermezzo: {
            badge: "Cohort #1 — Italia — Posti Limitati",
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
                title: "The GenAI era won't wait.",
                subtitle: "Get weekly technical deep-dives and strategies to scale your AI career.",
                cta: "Join the Newsletter",
                socialProof: "Join 2,000+ AI Builders"
            },
            wantDeeper: "Want to go deep on a specific path?"
        },
        leadMagnet: {
            title: "Not sure which AI role fits you?",
            description: "Stop guessing. Take the **Role Fit Audit**: 15 questions to find your ideal path among AI/GenAI roles",
            cta: "Start Free Audit",
            disclaimer: "You'll receive a personalized PDF report with your action plan."
        },
        intermezzo: {
            badge: "Cohort #1 — Italy Only — Limited Spots",
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
        }
    }
}
