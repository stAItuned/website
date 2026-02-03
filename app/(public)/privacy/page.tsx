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
          <p className="text-sm text-slate-500">
            Il titolare del trattamento è Daniele Moltisanti. Email di contatto: <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>.
          </p>
          <p className="text-xs text-slate-400">Ultimo aggiornamento: 16 gennaio 2026</p>
        </header>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">A chi è rivolta questa informativa</h2>
          <p className="text-sm text-slate-600">
            Per chiarezza, la rendiamo disponibile a quattro gruppi principali:
          </p>
          <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
            <li>i lettori del blog e i membri della community che consumano contenuti pubblici;</li>
            <li>le PMI e i team che richiedono una call o una consulenza personalizzata;</li>
            <li>chi si iscrive alla newsletter o alle comunicazioni di aggiornamento (marketing) con consenso esplicito;</li>
            <li>chi si candida a collaborare con stAItuned o propone una partnership.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Quali dati raccogliamo e perché</h2>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/50 p-6 text-sm text-slate-600 shadow-sm">
            <div>
              <h3 className="font-semibold text-slate-900">Visite al blog e alle pagine pubbliche</h3>
              <p className="mt-1">
                Registriamo solo dati tecnici necessari per mantenere il sito online (es. richieste HTTP, informazioni sul browser). I cookie non tecnici (es. Google Analytics) e le misurazioni di performance lato client (es. Core Web Vitals) sono attivati solo dopo il tuo consenso. Alcune risorse (es. font) possono essere caricate da fornitori terzi per motivi di resa grafica. Consulta la <Link href="/cookie-policy" className="text-amber-600 underline">Cookie Policy</Link> per maggiori dettagli.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Autenticazione e funzionalità personalizzate</h3>
              <p className="mt-1">
                Se decidi di registrarti al sito tramite Google Sign-In, raccogliamo e conserviamo i seguenti dati dal tuo profilo Google:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>indirizzo email;</li>
                <li>nome e cognome (display name);</li>
                <li>foto profilo (se disponibile);</li>
                <li>identificativo utente univoco (User ID).</li>
              </ul>
              <p className="mt-3">
                Questi dati ci permettono di offrire funzionalità personalizzate come:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>salvare i tuoi articoli preferiti (bookmarks);</li>
                <li>sincronizzare le tue preferenze su più dispositivi;</li>
                <li>fornirti raccomandazioni di contenuti basate sui tuoi interessi;</li>
                <li>consentirti di lasciare commenti o interagire con la community.</li>
              </ul>
              <p className="mt-3">
                La base giuridica è il tuo consenso esplicito (art. 6.1.a GDPR), espresso al momento della registrazione. I dati vengono conservati in Firebase Authentication e Firestore (Google Cloud) con crittografia e misure di sicurezza appropriate. Puoi richiedere la cancellazione del tuo account in qualsiasi momento scrivendo a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Richieste di contatto e &quot;Prenota la call&quot;</h3>
              <p className="mt-1">
                Quando compili il modulo di contatto raccogliamo nome, email, eventuale numero di telefono (facoltativo), azienda, messaggio e la tua preferenza sul marketing. Il consenso esplicito al trattamento dei dati ci serve per risponderti e per organizzare un appuntamento. Inviare la richiesta equivale ad accettare la presente informativa.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Newsletter, community e aggiornamenti</h3>
              <p className="mt-1">
                Se scegli di ricevere aggiornamenti o contenuti di marketing, li inviamo via email solo previa autorizzazione separata. Puoi revocare il consenso in qualsiasi momento cliccando sul link di disiscrizione presente nelle comunicazioni o scrivendo a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Notifiche push</h3>
              <p className="mt-1">
                Se abiliti le notifiche push nel browser o nell&apos;app, generiamo un token identificativo del dispositivo tramite Firebase Cloud Messaging (Google LLC). Questo token ci permette di inviarti avvisi su nuovi articoli o contenuti rilevanti. Non raccogliamo dati personali aggiuntivi attraverso le notifiche.
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>il token è un identificativo tecnico, non associato alla tua identità personale;</li>
                <li>puoi disabilitare le notifiche in qualsiasi momento dalle impostazioni del browser o del dispositivo;</li>
                <li>i token vengono conservati finché l&apos;utente non revoca il permesso o disinstalla l&apos;app.</li>
              </ul>
              <p className="mt-3">
                La base giuridica è il consenso esplicito (art. 6.1.a GDPR), espresso quando accetti di ricevere le notifiche.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Contenuti offline (PWA)</h3>
              <p className="mt-1">
                La funzionalità &quot;Salva per offline&quot; memorizza articoli localmente sul tuo dispositivo utilizzando le API del browser (Cache API, IndexedDB). Questi dati non vengono trasmessi ai nostri server e restano sotto il tuo controllo. Puoi eliminarli rimuovendo gli articoli salvati o cancellando i dati del sito dalle impostazioni del browser.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Candidature per collaborazioni</h3>
              <p className="mt-1">
                Quando compili un modulo di candidatura o ci contatti per possibili collaborazioni, raccogliamo i dati necessari a valutare il tuo profilo, ad esempio:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>nome e cognome;</li>
                <li>email di contatto;</li>
                <li>eventuale ruolo attuale o area di competenza (es. data science, sviluppo web, UX);</li>
                <li>link a portfolio, GitHub, LinkedIn o CV;</li>
                <li>livello di esperienza dichiarato e interessi;</li>
                <li>disponibilità di tempo e note che decidi di condividere.</li>
              </ul>
              <p className="mt-3">
                Utilizziamo questi dati esclusivamente per:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>valutare la tua candidatura e proporti eventuali attività o progetti;</li>
                <li>organizzare colloqui, task di prova o percorsi formativi interni;</li>
                <li>tenerti aggiornato su opportunità di collaborazione in linea con il tuo profilo (solo se lo richiedi esplicitamente).</li>
              </ul>
              <p className="mt-3">
                La base giuridica del trattamento è l&apos;esecuzione di misure precontrattuali su tua richiesta (art. 6.1.b GDPR) quando analizziamo la tua candidatura, e il consenso quando ti chiediamo di ricevere comunicazioni aggiuntive non strettamente legate alla candidatura.
              </p>
              <p className="mt-2">
                I dati possono essere trattati con l&apos;aiuto di strumenti che usiamo per gestire candidature e collaborazione (es. Google Workspace, Notion, Trello), sempre nel rispetto di adeguate misure di sicurezza.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Dati dei Contributor (Programma Editoriale)</h3>
              <p className="mt-1">
                Quando partecipi al Contributor Program di stAItuned per scrivere o proporre articoli, raccogliamo e trattiamo:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Informazioni account (nome, email, foto profilo via OAuth);</li>
                <li>I tuoi contributi editoriali (bozze, idee, outline generate);</li>
                <li>Le risposte alle interviste (chat) utilizzate per generare i contenuti;</li>
                <li>Preferenze di pubblicazione e stato delle submission.</li>
              </ul>
              <p className="mt-3">
                <strong>Finalità:</strong>
              </p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Facilitare la creazione, revisione e pubblicazione degli articoli;</li>
                <li>Comunicare con te in merito allo stato dei tuoi contributi;</li>
                <li>Attribuire correttamente la paternità (byline) degli articoli pubblicati.</li>
              </ul>
              <p className="mt-3">
                <strong>Conservazione:</strong>
              </p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Bozze non pubblicate: conservate fino a 90 giorni di inattività, poi archiviate;</li>
                <li>Articoli pubblicati: conservati a tempo indeterminato con la tua firma;</li>
                <li>Dati account: conservati fino alla richiesta di cancellazione.</li>
              </ul>
              <p className="mt-3">
                <strong>I tuoi diritti spefici:</strong>
              </p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Richiedere la cancellazione delle bozze non pubblicate in qualsiasi momento;</li>
                <li>Rimuovere il tuo nome dagli articoli pubblicati (il contenuto resta all&apos;editore come da accordo);</li>
                <li>Esportare la cronologia dei tuoi contributi.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Role Fit Audit</h3>
              <p className="mt-1">
                Quando compili il questionario &quot;Role Fit Audit&quot; raccogliamo:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>indirizzo email (obbligatorio per l&apos;invio del report);</li>
                <li>nome (opzionale);</li>
                <li>link LinkedIn o GitHub (opzionale, per una review più accurata);</li>
                <li>le risposte alle domande del questionario (skill assessment);</li>
                <li>i risultati calcolati (score, archetipo, raccomandazioni).</li>
              </ul>
              <p className="mt-3">
                Utilizziamo questi dati per:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>generare e inviarti il report personalizzato;</li>
                <li>analizzare in forma aggregata i profili degli utenti per migliorare il prodotto;</li>
                <li>contattarti per offerte relative al Career OS (solo se selezioni la checkbox facoltativa di consenso marketing).</li>
              </ul>
              <p className="mt-3">
                <strong>Nota AI:</strong> Le risposte fornite vengono elaborate da servizi di Intelligenza Artificiale (Google Gemini) al solo scopo di generare il contenuto del report. Tali dati non vengono utilizzati per l&apos;addestramento dei modelli pubblici.
              </p>
              <p className="mt-3">
                <strong>Nota sul dispositivo:</strong> per evitare che tu perda il progresso, alcune informazioni del questionario possono essere memorizzate localmente nel browser (es. localStorage) finché non le cancelli dalle impostazioni del browser.
              </p>
              <p className="mt-3">
                La base giuridica è il consenso esplicito (art. 6.1.a GDPR), espresso al momento dell&apos;invio del questionario. I dati vengono conservati in Firebase (Firestore) con crittografia e misure di sicurezza appropriate. Puoi richiedere la cancellazione dei tuoi dati in qualsiasi momento scrivendo a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Base giuridica, trasferimenti e destinatari</h2>
          <p>
            Il trattamento avviene su base di consenso (art. 6 GDPR) per marketing e analisi, mentre per la risposta alle richieste commerciali e per l&apos;erogazione dei servizi ci basiamo sul legittimo interesse di fornire informazioni personalizzate. Alcuni fornitori (es. Google, Telegram) possono trattare dati da Paesi extra UE: in questi casi il trasferimento avviene sulla base delle Clausole Contrattuali Standard (SCC) o di altri strumenti riconosciuti dal GDPR. Per maggiori dettagli puoi consultare le rispettive privacy policy o scriverci.
          </p>
          <p>
            Non vendiamo dati a terzi e condividiamo informazioni solo con categorie di soggetti necessari al funzionamento del sito o alla comunicazione, come i servizi email e di automazione che ci aiutano a gestire le prenotazioni.
          </p>
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/50 p-6 text-sm text-slate-600 shadow-sm">
            <p className="font-semibold text-slate-900">Possibili destinatari/categorie:</p>
            <ul className="list-disc pl-4">
              <li>fornitori di hosting e infrastruttura (es. Firebase, Firestore);</li>
              <li>servizi di email e newsletter per gestire iscrizioni e invii (es. Resend);</li>
              <li>servizi di Intelligenza Artificiale (Google Gemini) per la generazione automatica dei report;</li>
              <li>strumenti di analytics (es. Google Analytics), attivati solo previo consenso esplicito;</li>
              <li>Firebase Cloud Messaging (Google LLC) per l&apos;invio di notifiche push;</li>
              <li>servizi di prenotazione call (es. Calendly) quando decidi di prenotare un appuntamento;</li>
              <li>provider di pagamento (es. Stripe) quando acquisti servizi tramite checkout/link esterni;</li>
              <li>strumenti di raccolta e gestione feedback (es. Telegram e, se configurato, Slack) quando invii un feedback;</li>
              <li>fornitori di risorse statiche (es. Google Fonts) per font e asset.</li>
              <li>strumenti di messaggistica, automazione o task management necessari per coordinare progetti o rispondere alle richieste.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Conservazione e cancellazione</h2>
          <p>
            Le richieste di contatto vengono archiviate per 12–24 mesi per garantire il follow-up, mentre i dati per newsletter o community sono conservati finché il consenso resta attivo o finché non richiedi la cancellazione. La cronologia dei messaggi viene mantenuta per garantire continuità nei progetti in corso.
          </p>
          <p>
            Le candidature e le richieste di collaborazione vengono conservate per un periodo massimo di 12–24 mesi dalla loro ricezione, salvo tua richiesta di cancellazione anticipata, per poter valutare il profilo anche in vista di opportunità future. Puoi chiederci in qualsiasi momento di eliminare definitivamente la tua candidatura scrivendo a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>.
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
            Per chiarimenti o per cancellare definitivamente i tuoi dati, scrivi a <Link href="mailto:info@staituned.com" className="text-amber-600 underline">info@staituned.com</Link>. Aggiorniamo questa informativa periodicamente, quindi ti suggeriamo di verificarla ogni volta che prenoti una call o ti iscrivi alla community. Consulta anche i nostri <Link href="/terms" className="text-amber-600 underline">Termini e Condizioni</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
