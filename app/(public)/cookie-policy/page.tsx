import Link from 'next/link'

export const metadata = {
  title: 'Cookie Policy | stAItuned',
  description: 'Dettagli sui cookie tecnici e analitici usati da stAItuned e su come gestire il consenso.',
}

export default function CookiePolicyPage() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wider text-amber-600">stAItuned</p>
          <h1 className="text-3xl font-semibold text-slate-900">Cookie Policy</h1>
          <p className="text-base text-slate-600">
            Il banner di consenso gestisce i cookie non essenziali e mantiene attivo solo quanto serve a far funzionare il sito. Qui trovi le informazioni dettagliate su quali cookie usiamo e perché.
          </p>
        </header>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Cookie tecnici e banner</h2>
          <p>
            Alcuni cookie sono indispensabili per garantire la sicurezza e la navigazione (es. quelli utilizzati da Next.js e dalla sessione di autenticazione). Rimangono attivi anche senza consenso e non raccolgono dati identificativi. Gli altri cookie vengono attivati solo dopo il consenso esplicito dal banner mostrato la prima volta che visiti il sito. Il banner contiene le azioni <strong>Accetta</strong> e <strong>Rifiuta</strong>, e include un link a questa pagina insieme a un breve riassunto delle <em>Cookie Information</em>. L&apos;indicazione <strong>Cookie Information +1</strong> ricorda che puoi approfondire ogni categoria in questa stessa pagina.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Categorie di cookie</h2>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/50 p-6 shadow-sm">
            <article>
              <h3 className="text-base font-semibold text-slate-900">Cookie strettamente necessari</h3>
              <p className="mt-1">
                Consentono la navigazione e la performance base del sito. Non raccolgono dati personali oltre a quelli tecnici e rimangono attivi anche senza consenso. Esempi: Next.js, session manager e protezioni da bot.</p>
            </article>
            <article>
              <h3 className="text-base font-semibold text-slate-900">Cookie di analisi (Google Analytics)</h3>
              <p className="mt-1">
                Misurano visite e interazioni, aiutandoci a capire quali contenuti funzionano meglio. Utilizziamo Google Analytics (_ga, _gid, _gat) e attiviamo questi cookie solo dopo il consenso registrato dal banner. I dati sono anonimizzati e non vengono combinati con altri identificatori interni.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Gestione e revoca del consenso</h2>
          <p>
            Il consenso viene salvato localmente (localStorage) con la chiave <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">staituned_cookie_consent</code>. Se desideri cambiare idea, elimina questo valore dal tuo browser e ricarica la pagina per far riapparire il banner. Oppure puoi aprire la <Link href="/privacy" className="text-amber-600 underline">Privacy Policy</Link> e scriverci a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link> per una richiesta diretta.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Terze parti</h2>
          <p>
            Oltre a Google, possiamo avvalerci di servizi esterni per la consegna delle newsletter o per ospitare i contenuti media. Questi partner trattano i dati sulla base delle loro policy (es. Google LLC e i suoi data center). Non vendiamo le informazioni e limitiamo gli scambi solo a quanto necessario per offrire il servizio.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/60 p-6 text-sm text-slate-600 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Hai bisogno di altri dettagli?</h2>
          <p>
            Scrivi a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link> per sapere quali cookie specifici sono attivi sul tuo browser, oppure visita la <Link href="/privacy" className="text-amber-600 underline">Privacy Policy</Link> per conoscere tutte le pratiche sul trattamento dei dati.
          </p>
        </section>
      </div>
    </div>
  )
}
