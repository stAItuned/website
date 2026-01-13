import { Code2, FileText, FileCheck2, CheckCircle2, Users } from 'lucide-react'
import Image from 'next/image'

/**
 * SocialProofSection - Process Proof & Output Standards
 * Shows tangible outputs with REAL visual examples
 */

interface ProcessProofItem {
    icon: React.ElementType
    title: string
    description: string
    mediaType: 'gif' | 'image' | 'video'
    mediaSrc: string
    mediaAlt: string
    articleLink?: string
    articleLabel?: string
}

const PROCESS_PROOF: ProcessProofItem[] = [
    {
        icon: Code2,
        title: 'Repo + Demo',
        description: 'GitHub pubblico con demo riproducibile. Esempio: progetto "HairStyle Try-On" con AI generativa.',
        mediaType: 'gif',
        mediaSrc: '/assets/products/my-smart-haircut/demo.gif',
        mediaAlt: 'Demo HairStyle Try-On - progetto AI generativa',
    },
    {
        icon: FileCheck2,
        title: 'CV Personalizzato su JD',
        description: 'CV tailored automatico su ogni job description, con keyword match e formatting ottimizzato.',
        mediaType: 'video',
        mediaSrc: '/assets/career-os/Video_Demo_Without_Explanation.mp4',
        mediaAlt: 'Demo CV personalizzato su Job Description',
    },
    {
        icon: FileText,
        title: 'Write-up Tecnico',
        description: 'Articolo pubblicato su stAItuned che dimostra le tue competenze.',
        mediaType: 'image',
        mediaSrc: '/assets/career-os/articolo_screen.png',
        mediaAlt: 'Esempio articolo tecnico pubblicato',
        articleLink: 'https://staituned.com/learn/expert/cag-vs-rag',
        articleLabel: 'CAG vs RAG: Which Enterprise AI Approach Wins?',
    },
]

const QUALITY_STANDARDS = [
    'Definition of Done',
    'Evaluation Harness',
    'Decision Log',
    'Peer Review',
]

/**
 * ProofCard - Individual proof item with visual media
 */
function ProofCard({ item }: { item: ProcessProofItem }) {
    const Icon = item.icon

    return (
        <div className="group p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-[#151925] dark:to-[#1A1E3B] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-lg transition-all">
            {/* Media Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                {item.mediaType === 'gif' && (
                    <img
                        src={item.mediaSrc}
                        alt={item.mediaAlt}
                        className="w-full h-full object-cover"
                    />
                )}
                {item.mediaType === 'image' && (
                    <Image
                        src={item.mediaSrc}
                        alt={item.mediaAlt}
                        fill
                        className="object-cover"
                    />
                )}
                {item.mediaType === 'video' && (
                    <video
                        src={item.mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white mb-1">
                        {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.description}
                    </p>
                    {/* Article Link for Write-up */}
                    {item.articleLink && (
                        <a
                            href={item.articleLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            <span>→</span>
                            <span className="line-clamp-1">{item.articleLabel}</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function SocialProofSection() {
    return (
        <section id="social-proof" className="py-16 md:py-20 px-6 bg-white dark:bg-[#0F1117]">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4">
                        🎯 Cosa Costruirai
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A1E3B] dark:text-white mb-3">
                        Output tangibili, non slide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Ogni partecipante esce con asset verificabili che riducono il rischio percepito per l'hiring manager.
                    </p>
                </div>

                {/* Process Proof Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {PROCESS_PROOF.map((item, i) => (
                        <ProofCard key={i} item={item} />
                    ))}
                </div>

                {/* Quality Standards Checklist */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-[#151925] dark:to-[#1A1E3B]/80 border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white mb-1">
                                Standard di qualità inclusi
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Ogni progetto segue checklist da engineering professionale.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {QUALITY_STANDARDS.map((standard, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#0F1117] border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    {standard}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cohort Badge */}
                {/* <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-[#151925] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <Users className="w-5 h-5 text-[#FFF272]" />
                        <div>
                            <p className="text-sm font-bold text-[#1A1E3B] dark:text-white">
                                Cohort 8–10 persone
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Max 2 classi/mese • Qualità &gt; quantità
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* CTA to Journey */}
                <div className="mt-10 text-center">
                    <a
                        href="#journey"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1E3B] dark:bg-white/10 text-white font-semibold hover:bg-[#383F74] dark:hover:bg-white/20 transition-colors"
                    >
                        Scopri il percorso →
                    </a>
                </div>
            </div>
        </section>
    )
}

