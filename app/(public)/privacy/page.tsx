import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | stAItuned',
  description: 'Come raccogliamo e utilizziamo i dati di chi visita il blog, richiede una call o desidera ricevere aggiornamenti.',
}

export default function PrivacyPage() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wider text-amber-600">stAItuned</p>
          <h1 className="text-3xl font-semibold text-slate-900">Informativa sulla privacy</h1>
          <p className="text-base text-slate-600">
            Tutte le interazioni con il sito stAItuned sono gestite con rispetto per la tua riservatezza. Questa pagina spiega come trattiamo i dati raccolti dai visitatori del blog, dalle aziende interessate ai nostri servizi AI, dalle persone che prenotano una call e da chi decide di unirsi alla nostra community o newsletter.
          </p>
        </header>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">A chi è rivolta questa informativa</h2>
          <p className="text-sm text-slate-600">
            Per chiarezza, la rendiamo disponibile a tre gruppi principali:
          </p>
          <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
            <li>i lettori del blog e i membri della community che consumano contenuti pubblici;</li>
            <li>le PMI e i team che richiedono una call o una consulenza personalizzata;</li>
            <li>chi si iscrive alla newsletter o alle comunicazioni di aggiornamento (marketing) con consenso esplicito.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Quali dati raccogliamo e perché</h2>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/50 p-6 text-sm text-slate-600 shadow-sm">
            <div>
              <h3 className="font-semibold text-slate-900">Visite al blog e alle pagine pubbliche</h3>
              <p className="mt-1">
                Registriamo solo dati tecnici necessari per mantenere il sito online (es. richieste HTTP, indirizzo IP anonimizzato, informazioni sul browser). I cookie non tecnici, come quelli di Google Analytics, sono attivati solo dopo il tuo consenso. Consulta la <Link href="/cookie-policy" className="text-amber-600 underline">Cookie Policy</Link> per maggiori dettagli.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Richieste di contatto e &quot;Prenota la call&quot;</h3>
              <p className="mt-1">
                Quando compili il modulo di contatto raccogliamo nome, email, azienda, messaggio e la tua preferenza sul marketing. Il consenso esplicito al trattamento dei dati ci serve per risponderti e per organizzare un appuntamento. Inviare la richiesta equivale ad accettare la presente informativa.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Newsletter, community e aggiornamenti</h3>
              <p className="mt-1">
                Se scegli di ricevere aggiornamenti o contenuti di marketing, li inviamo via email solo previa autorizzazione separata. Puoi revocare il consenso in qualsiasi momento cliccando sul link di disiscrizione presente nelle comunicazioni o scrivendo a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Base giuridica e trasferimento dei dati</h2>
          <p>
            Il trattamento avviene su base di consenso (art. 6 GDPR) per marketing e analisi, mentre per la risposta alle richieste commerciali e per l&apos;erogazione dei servizi ci basiamo sul legittimo interesse di fornire informazioni personalizzate. I dati possono essere ospitati su fornitori terzi come Vercel (UE/USA) e Telegram (servizio notifiche), che adottano misure adeguate per la protezione dei dati.
          </p>
          <p>
            Non vendiamo dati a terzi e condividiamo informazioni solo con strumenti necessari al funzionamento del sito o alla comunicazione, come i servizi email e di automazione che ci aiutano a gestire le prenotazioni.</p>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Conservazione e cancellazione</h2>
          <p>
            Le richieste di contatto vengono archiviate per 12–24 mesi per garantire il follow-up, mentre i dati per newsletter o community sono conservati finché il consenso resta attivo o finché non richiedi la cancellazione. La cronologia dei messaggi viene mantenuta per garantire continuità nei progetti in corso.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Diritti dell’interessato</h2>
          <p>
            Puoi esercitare i diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione scrivendo a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>. Se ritieni che il trattamento non sia corretto, hai diritto di proporre reclamo presso il Garante per la protezione dei dati personali.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/60 p-6 text-sm text-slate-600 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Domande o richieste specifiche</h2>
          <p>
            Per chiarimenti o per cancellare definitivamente i tuoi dati, scrivi a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>. Aggiorniamo questa informativa periodicamente, quindi ti suggeriamo di verificarla ogni volta che prenoti una call o ti iscrivi alla community.
          </p>
        </section>
      </div>
    </div>
  )
}
