import { UserX, FileQuestion, VideoOff } from 'lucide-react'

/**
 * ProblemSection - 3 pain cards explaining why candidates fail
 */
export default function ProblemSection() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-[#151925]">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1A1E3B] dark:text-white mb-4">
                        Perché non ti chiamano (anche se sai programmare)
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        I candidati AI-ready commettono sempre gli stessi 3 errori.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1: No Target */}
                    <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">01</div>
                        <div className="mb-6 w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <UserX className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                            Nessun target chiaro
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            &quot;Cerco un ruolo AI&quot; non è una strategia. Gli hiring manager cercano: <strong>RAG Engineer</strong>, <strong>Agent Engineer</strong>, <strong>GenAI Product Engineer</strong>.
                        </p>
                    </div>

                    {/* Card 2: CV Invisibility */}
                    <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">02</div>
                        <div className="mb-6 w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <FileQuestion className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                            Il CV dice &quot;entusiasta&quot;, non &quot;engineer&quot;
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            I recruiter cercano keyword specifiche: <strong>RAG, Agents, Evaluation</strong>. Se scrivi &quot;appassionato di AI&quot;, finisci nel cestino.
                        </p>
                    </div>

                    {/* Card 3: No Proof */}
                    <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">03</div>
                        <div className="mb-6 w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <VideoOff className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                            Nessuna prova pubblica
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            Gli hiring manager vogliono vedere: <strong>demo funzionante, repo pulita, evaluation con metriche</strong>. Non un altro &quot;progetto Kaggle&quot;.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
