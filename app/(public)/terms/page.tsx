import Link from 'next/link'

export const metadata = {
    title: 'Termini e Condizioni | stAItuned',
    description: 'Contratto di licenza e termini d’uso per Career OS.',
}

export default function TermsPage() {
    return (
        <div className="px-4 py-16">
            <div className="mx-auto max-w-5xl space-y-10">
                <header className="space-y-3">
                    <p className="text-sm uppercase tracking-wider text-amber-600">stAItuned</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Termini e Condizioni dei Servizi stAItuned</h1>
                    <p className="text-base text-slate-600">
                        Il presente contratto regola l'accesso e l'utilizzo di <strong>Career OS</strong>, il percorso formativo avanzato per carriere in ambito AI. Acquistando il servizio o accedendo ai materiali, l'utente accetta integralmente le seguenti condizioni.
                    </p>
                    <p className="text-xs text-slate-400">Ultimo aggiornamento: 13 gennaio 2026</p>
                </header>

                <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/50 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">1. Oggetto del Servizio</h2>
                    <p className="text-sm text-slate-600">
                        Career OS è un programma educativo strutturato in 8 settimane, diviso in due fasi principali (Starter Track e Advanced Track). Il servizio include l'accesso a:
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
                        <li><strong>Materiali didattici:</strong> Video lezioni, guide, playbook e roadmap.</li>
                        <li><strong>Asset digitali:</strong> Template (CV, Cover Letter, README), database e strumenti di produttività.</li>
                        <li><strong>Community (se prevista dal piano):</strong> Accesso ai canali di supporto e networking.</li>
                        <li><strong>Review & Feedback:</strong> Valutazioni basate sui "Quality Gates" (standard minimi di eccellenza) definiti nel percorso.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-900">2. Licenza d'uso e Proprietà Intellettuale</h2>
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/50 p-6 text-sm text-slate-600 shadow-sm">
                        <p>
                            Tutti i contenuti forniti (inclusi testi, codici, grafiche e metodologie) sono proprietà esclusiva di stAItuned e sono protetti dalle leggi sul diritto d'autore.
                        </p>
                        <p className="font-semibold text-slate-900">Diritti concessi:</p>
                        <p>
                            Viene concessa una licenza <strong>personale, non esclusiva e non trasferibile</strong> per utilizzare i materiali a scopo di formazione individuale e per la costruzione dei propri asset di carriera personali.
                        </p>
                        <p className="font-semibold text-slate-900">Divieti espliciti:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Condividere le proprie credenziali di accesso con terzi ("account sharing").</li>
                            <li>Scaricare, copiare, distribuire o rivendere il materiale del corso.</li>
                            <li>Utilizzare i template o le metodologie per creare prodotti concorrenti o per scopi commerciali (es. consulenza conto terzi) senza autorizzazione scritta.</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4 text-sm text-slate-600">
                    <h2 className="text-2xl font-semibold text-slate-900">3. Natura del Percorso e Risultati</h2>
                    <p>
                        Career OS è un acceleratore di carriera progettato per fornire strategia, strumenti e competenze avanzate. Tuttavia:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Nessuna garanzia di assunzione:</strong> stAItuned non garantisce l'ottenimento di un posto di lavoro, aumenti salariali o specifiche opportunità. Il successo dipende dall'impegno individuale, dalle condizioni di mercato e dalle competenze pregresse dell'utente.</li>
                        <li><strong>Impegno richiesto:</strong> Il percorso richiede partecipazione attiva. Il superamento dei "Quality Gates" (es. CV Score &gt; 90, Progetto Live) è condizione necessaria per accedere alle fasi successive o ai servizi avanzati, come da descrizione tecnica del percorso.</li>
                        <li><strong>Scopo educativo:</strong> Le informazioni fornite (fiscali, legali, tecniche) hanno scopo puramente educativo e non sostituiscono consulenze professionali specialistiche.</li>
                    </ul>
                </section>

                <section className="space-y-4 text-sm text-slate-600">
                    <h2 className="text-2xl font-semibold text-slate-900">4. Pagamenti, Rimborsi e Garanzie</h2>
                    <p>
                        L'accesso al corso è garantito a seguito del pagamento della quota prevista.
                    </p>
                    <p>
                        <strong>Garanzia Soddisfatti o Rimborsati (ove applicabile):</strong> Se specificato esplicitamente nell'offerta di acquisto (es. "Garanzia 14 giorni"), l'utente ha diritto al rimborso integrale entro i termini indicati, a condizione che abbia visionato meno del 20% del materiale totale e non abbia scaricato gli asset proprietari. In assenza di specifica menzione, vale il diritto di recesso di legge per i prodotti digitali, che decade al momento dell'inizio del download o streaming del contenuto.
                    </p>
                </section>

                <section className="space-y-4 text-sm text-slate-600">
                    <h2 className="text-2xl font-semibold text-slate-900">5. Limitazione di Responsabilità</h2>
                    <p>
                        In nessun caso stAItuned sarà responsabile per danni diretti, indiretti, incidentali o consequenziali derivanti dall'uso o dall'impossibilità di usare il servizio, inclusi, a titolo esemplificativo, danni per perdita di profitti, dati o altre perdite intangibili.
                    </p>
                </section>

                <section className="space-y-4 text-sm text-slate-600">
                    <h2 className="text-2xl font-semibold text-slate-900">6. Contenuti Gratuiti e Lead Magnet</h2>
                    <p>
                        stAItuned offre strumenti gratuiti come il <strong>Role Fit Audit</strong> e altri lead magnet a scopo informativo e orientativo. Questi strumenti:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Forniscono valutazioni indicative basate sulle risposte dell&apos;utente;</li>
                        <li>Non costituiscono consulenza professionale, legale o lavorativa;</li>
                        <li>Offrono suggerimenti generici che devono essere valutati criticamente dall&apos;utente;</li>
                        <li>Non garantiscono risultati specifici in termini di carriera o occupazione;</li>
                        <li><strong>Generazione AI:</strong> Alcuni report (es. AI Audit) sono generati tramite modelli di Intelligenza Artificiale. Sebbene curati, potrebbero contenere inesattezze o ",allucinazioni". L'utente è invitato a verificare sempre le informazioni critiche.</li>
                    </ul>
                    <p>
                        Le informazioni raccolte tramite questi strumenti sono trattate secondo la nostra <Link href="/privacy" className="text-amber-600 underline">Privacy Policy</Link>.
                    </p>
                </section>

                <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/60 p-6 text-sm text-slate-600 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Assistenza e Supporto</h2>
                    <p>
                        Per dubbi tecnici, amministrativi o per questioni relative alla privacy, contattaci a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>.
                    </p>
                </section>
            </div>
        </div>
    )
}
