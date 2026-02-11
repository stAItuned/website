
export interface AccountTranslations {
    nav: {
        overview: string
        writer: string
        badges: string
        contributions: string
        admin: string
        data: string
        legal: string
        danger: string
        actions: {
            bookmarks: string
            newDraft: string
            becomeWriter: string
        }
        jumpToSection: string
    }
    header: {
        backToHome: string
        title: string
        subtitle: string
        roles: {
            member: string
            checking: string
            writer: string
            reader: string
            admin: string
        }
        memberSince: string
        bookmarks: string
        buttons: {
            newDraft: string
            becomeWriter: string
        }
    }
    writerWorkspace: {
        title: string
        description: string
        active: {
            text: string
            contributorArea: string
            createDraft: string
            editProfile: string
        }
        inactive: {
            text: string
            becomeWriter: string
        }
    }
    personalbadges: {
        title: string
        description: string
        earned: string
        becomeWriter: string
        loading: string
        progress: {
            title: string
            notWriter: string
            noBadges: string
            earnedStructure: string
        }
    }
    overview: {
        title: string
        description: string
        status: string
        bookmarks: string
        writerStatus: {
            checking: string
            writer: string
            reader: string
        }
    }
    dataPrivacy: {
        title: string
        description: string
        bookmarks: string
        savedArticles: string
        view: string
        deleteData: {
            title: string
            description: string
            button: string
        }
    }
    legal: {
        title: string
        description: string
        contributorAgreement: {
            title: string
            description: string
            button: string
        }
    }
    danger: {
        title: string
        description: string
        deleteAccount: {
            title: string
            description: string
            button: string
        }
    }
    articles: {
        title: string
        description: string
    }
    adminTools: {
        title: string
        description: string
        costMonitoring: string
        submissionsReview: string
        contributorPath: string
        roleFitAudit: string
        emailQueue: string
    }
}

export const accountTranslations: Record<'en' | 'it', AccountTranslations> = {
    it: {
        nav: {
            overview: 'Panoramica',
            writer: 'Writer',
            badges: 'Badge',
            contributions: 'Contributi',
            admin: 'Admin',
            data: 'Dati e Privacy',
            legal: 'Accordi',
            danger: 'Zona Pericolosa',
            actions: {
                bookmarks: 'Segnalibri salvati',
                newDraft: 'Nuova bozza',
                becomeWriter: 'Diventa writer'
            },
            jumpToSection: 'Vai alla sezione'
        },
        header: {
            backToHome: 'Torna alla Home',
            title: 'Impostazioni Account',
            subtitle: 'Gestisci profilo, contributi, privacy e accordi in un unico posto.',
            roles: {
                member: 'Membro',
                checking: 'Verifica stato writer',
                writer: 'Writer',
                reader: 'Lettore',
                admin: 'Admin'
            },
            memberSince: 'Membro dal',
            bookmarks: 'Segnalibri',
            buttons: {
                newDraft: 'Nuova Bozza',
                becomeWriter: 'Diventa un Writer'
            }
        },
        writerWorkspace: {
            title: 'Area Writer',
            description: 'Crea bozze, gestisci il tuo profilo e monitora i tuoi contributi.',
            active: {
                text: 'Hai un profilo writer attivo. Condividi nuove idee, invia bozze e collabora con il team di stAItuned.',
                contributorArea: 'Area Contributor',
                createDraft: 'Crea Nuova Bozza',
                editProfile: 'Modifica Profilo'
            },
            inactive: {
                text: 'Non hai ancora un profilo writer. Completa il tuo profilo per iniziare a contribuire con articoli e condividere la tua esperienza.',
                becomeWriter: 'Diventa un Writer'
            }
        },
        personalbadges: {
            title: 'Programma Badge Personale',
            description: 'Guadagna badge contribuendo alla community e leggendo articoli.',
            earned: 'guadagnati',
            becomeWriter: 'Diventa un writer',
            loading: 'Caricamento badge...',
            progress: {
                title: 'I tuoi progressi',
                notWriter: 'Completa il tuo profilo writer per iniziare a guadagnare badge.',
                noBadges: 'Inizia a contribuire per sbloccare il tuo primo badge.',
                earnedStructure: 'Hai guadagnato {earned} su {total} badge.'
            }
        },
        overview: {
            title: 'Panoramica Account',
            description: 'Mantieni aggiornati i tuoi dettagli personali e lo stato del profilo.',
            status: 'Stato',
            bookmarks: 'Segnalibri',
            writerStatus: {
                checking: 'Verifica stato writer',
                writer: 'Writer',
                reader: 'Lettore'
            }
        },
        dataPrivacy: {
            title: 'Dati e Privacy',
            description: 'Gestisci i contenuti salvati e i tuoi dati personali.',
            bookmarks: 'Segnalibri',
            savedArticles: '{count} articoli salvati',
            view: 'Vedi',
            deleteData: {
                title: 'Elimina i tuoi dati',
                description: 'Rimuovi permanentemente segnalibri e preferenze mantenendo attivo il tuo account.',
                button: 'Elimina dati'
            }
        },
        legal: {
            title: 'Legale e Accordi',
            description: 'Accedi ai termini per i contributor e agli accordi di partnership.',
            contributorAgreement: {
                title: 'Accordo per Contributor',
                description: 'Visualizza e scarica i termini più recenti per inviare articoli a stAItuned.',
                button: 'Leggi Accordo'
            }
        },
        danger: {
            title: 'Zona Pericolosa',
            description: 'Azioni permanenti che non possono essere annullate.',
            deleteAccount: {
                title: 'Elimina Account',
                description: 'Questo eliminerà permanentemente il tuo account e tutti i dati associati.',
                button: 'Elimina Account'
            }
        },
        articles: {
            title: 'I Miei Contributi',
            description: 'Gestisci i tuoi articoli pubblicati e le bozze in corso.'
        },
        adminTools: {
            title: 'Strumenti Admin',
            description: 'Monitora i costi, revisiona le sottoscrizioni e gestisci i badge.',
            costMonitoring: 'Dashboard Monitoraggio Costi',
            submissionsReview: 'Revisione Sottoscrizioni',
            contributorPath: 'Percorso Contributor',
            roleFitAudit: 'Audit Role Fit',
            emailQueue: 'Coda Email'
        }
    },
    en: {
        nav: {
            overview: 'Overview',
            writer: 'Writer',
            badges: 'Badges',
            contributions: 'Contributions',
            admin: 'Admin',
            data: 'Data & Privacy',
            legal: 'Agreements',
            danger: 'Danger Zone',
            actions: {
                bookmarks: 'Saved bookmarks',
                newDraft: 'New draft',
                becomeWriter: 'Become a writer'
            },
            jumpToSection: 'Jump to section'
        },
        header: {
            backToHome: 'Back to Home',
            title: 'Account Settings',
            subtitle: 'Manage profile, contributions, data privacy, and agreements in one place.',
            roles: {
                member: 'Member',
                checking: 'Checking writer status',
                writer: 'Writer',
                reader: 'Reader',
                admin: 'Admin'
            },
            memberSince: 'Member since',
            bookmarks: 'Bookmarks',
            buttons: {
                newDraft: 'New Draft',
                becomeWriter: 'Become a Writer'
            }
        },
        writerWorkspace: {
            title: 'Writer Workspace',
            description: 'Create drafts, manage your profile, and track your contributions.',
            active: {
                text: 'You have an active writer profile. Share new ideas, submit drafts, and collaborate with the stAItuned team.',
                contributorArea: 'Contributor Area',
                createDraft: 'Create New Draft',
                editProfile: 'Edit Profile'
            },
            inactive: {
                text: 'You do not have a writer profile yet. Complete your profile to start contributing articles and sharing your expertise.',
                becomeWriter: 'Become a Writer'
            }
        },
        personalbadges: {
            title: 'Personal Badge Program',
            description: 'Earn badges by contributing to the community and reading articles.',
            earned: 'earned',
            becomeWriter: 'Become a writer',
            loading: 'Loading badges...',
            progress: {
                title: 'Your progress',
                notWriter: 'Complete your writer profile to start earning badges.',
                noBadges: 'Start contributing to unlock your first badge.',
                earnedStructure: 'You have earned {earned} out of {total} badges.'
            }
        },
        overview: {
            title: 'Account Overview',
            description: 'Keep your personal details and profile status up to date.',
            status: 'Status',
            bookmarks: 'Bookmarks',
            writerStatus: {
                checking: 'Checking writer status',
                writer: 'Writer',
                reader: 'Reader'
            }
        },
        dataPrivacy: {
            title: 'Data & Privacy',
            description: 'Review saved content and manage your personal data.',
            bookmarks: 'Bookmarks',
            savedArticles: '{count} saved articles',
            view: 'View',
            deleteData: {
                title: 'Delete Your Data',
                description: 'Permanently remove bookmarks and preferences while keeping your account active.',
                button: 'Delete data'
            }
        },
        legal: {
            title: 'Legal & Agreements',
            description: 'Access contributor terms and partnership agreements.',
            contributorAgreement: {
                title: 'Contributor Agreement',
                description: 'View and download the latest terms for submitting articles to stAItuned.',
                button: 'Read Agreement'
            }
        },
        danger: {
            title: 'Danger Zone',
            description: 'Permanent actions that cannot be undone.',
            deleteAccount: {
                title: 'Delete Account',
                description: 'This will permanently delete your account and all associated data.',
                button: 'Delete Account'
            }
        },
        articles: {
            title: 'My Contributions',
            description: 'Manage your published articles and ongoing drafts.'
        },
        adminTools: {
            title: 'Admin Tools',
            description: 'Monitor costs, review submissions, and manage badges.',
            costMonitoring: 'Cost Monitoring Dashboard',
            submissionsReview: 'Submissions Review',
            contributorPath: 'Contributor Path',
            roleFitAudit: 'Role Fit Audit',
            emailQueue: 'Email Queue'
        }
    }
}
