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
          <p className="text-xs text-slate-400">Ultimo aggiornamento: 11 dicembre 2024</p>
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
                Consentono la navigazione e la performance base del sito. Non raccolgono dati personali oltre a quelli tecnici e rimangono attivi anche senza consenso. Esempi: Next.js, session manager e protezioni da bot.
              </p>
              <dl className="mt-2 grid gap-2 text-xs text-slate-500">
                <div>
                  <dt className="font-semibold text-slate-700">Esempi</dt>
                  <dd>Session cookie di Next.js / 15 minuti, cookie CSRF o di autenticazione per funzionalità dell'app.</dd>
                </div>
              </dl>
            </article>
            <article>
              <h3 className="text-base font-semibold text-slate-900">Archiviazione locale per funzionalità offline</h3>
              <p className="mt-1">
                La funzione &quot;Salva per offline&quot; consente di memorizzare articoli nel browser (IndexedDB/Cache API) per la lettura senza connessione. Questi dati restano sul tuo dispositivo e non vengono trasmessi a terzi. Puoi eliminarli manualmente dalle impostazioni del browser o rimuovendo gli articoli salvati dall&apos;app.
              </p>
              <dl className="mt-2 grid gap-2 text-xs text-slate-500">
                <div>
                  <dt className="font-semibold text-slate-700">Tecnologie</dt>
                  <dd>Service Worker, Cache API, IndexedDB (persistenza locale controllata dall&apos;utente).</dd>
                </div>
              </dl>
            </article>
            <article>
              <h3 className="text-base font-semibold text-slate-900">Cookie di analisi (Google Analytics)</h3>
              <p className="mt-1">
                Misurano visite e interazioni, aiutandoci a capire quali contenuti funzionano meglio. Utilizziamo Google Analytics (_ga, _gid, _gat) e attiviamo questi cookie solo dopo il consenso registrato dal banner. I dati sono anonimizzati e non vengono combinati con altri identificatori interni.
              </p>
              <dl className="mt-2 grid gap-2 text-xs text-slate-500">
                <div>
                  <dt className="font-semibold text-slate-700">Cookie principali</dt>
                  <dd>_ga (24 mesi), _gid (24 ore), _gat (1 minuto); gestiti da Google LLC.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Informazioni aggiuntive</dt>
                  <dd>
                    Maggiori dettagli sulla privacy di Google Analytics sono disponibili su{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-600 underline"
                    >
                      policies.google.com
                    </a>
                    .
                  </dd>
                </div>
              </dl>
            </article>
            <article>
              <h3 className="text-base font-semibold text-slate-900">Notifiche push (Firebase Cloud Messaging)</h3>
              <p className="mt-1">
                Se accetti di ricevere notifiche push, il tuo browser genera un token univoco che ci consente di inviarti avvisi su nuovi articoli o aggiornamenti. Il token è gestito tramite Firebase Cloud Messaging (Google LLC) e non contiene dati personali identificabili. Puoi disattivare le notifiche in qualsiasi momento dalle impostazioni del browser o del dispositivo.
              </p>
              <dl className="mt-2 grid gap-2 text-xs text-slate-500">
                <div>
                  <dt className="font-semibold text-slate-700">Dati raccolti</dt>
                  <dd>Token di registrazione FCM (identificativo tecnico del dispositivo, non dell&apos;utente).</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Come disattivare</dt>
                  <dd>Revoca il permesso notifiche dal browser, oppure dalle impostazioni del tuo dispositivo mobile.</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Gestione e revoca del consenso</h2>
          <p>
            Il consenso viene salvato localmente (localStorage) con la chiave <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">staituned_cookie_consent</code>. Se desideri cambiare idea, elimina questo valore dal tuo browser e ricarica la pagina per far riapparire il banner. Oppure puoi aprire la <Link href="/privacy" className="text-amber-600 underline">Privacy Policy</Link> e scriverci a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link> per una richiesta diretta.
          </p>
          <p>
            Puoi anche cliccare sul pulsante “Gestisci i cookie” nel footer per riaprire immediatamente il banner e modificare la tua scelta (Accetta/Rifiuta) senza dover cancellare manualmente il localStorage.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Terze parti</h2>
          <p>
            Oltre a Google Analytics, possiamo avvalerci di servizi esterni per la consegna delle newsletter, l&apos;invio di notifiche e l&apos;hosting dei contenuti media (es. Google LLC, Telegram). Questi partner trattano i dati sulla base delle loro policy e, dove previsto, applicano strumenti come le Clausole Contrattuali Standard per i trasferimenti UE/extra UE. Non vendiamo le informazioni e limitiamo gli scambi solo a quanto necessario per offrire il servizio.
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
