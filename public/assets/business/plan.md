# Plan modifiche pagina /business

## Obiettivo
Tradurre il brainstorming in un piano operativo di modifica della pagina `/business`, mantenendo coerenza con lo stile stAItuned e con la chiarezza del `role-fit-audit`.

Obiettivo di prodotto:
- aprire con un messaggio generale sul problema;
- subito dopo evidenziare il problema con dati/statistiche di mercato;
- accompagnare rapidamente l'utente verso uno use case concreto;
- rendere piu chiari i concetti chiave;
- semplificare la UX/UI;
- valutare interazioni leggere solo dove migliorano la comprensione.
- mantenere ogni sezione il piu possibile entro una schermata leggibile senza lungo scrolling interno.

## Outcome atteso
La pagina deve risultare:
- piu chiara per un utente nuovo;
- piu focalizzata sui concetti di frammentazione, riconciliazione e sistema unico;
- piu coerente con il linguaggio visuale stAItuned;
- piu guidata nel passaggio da problema generale a use case concreto.

## Stato avanzamento

### 2026-03-21
- Completato: primo blocco di implementazione su hero e primo scroll.
- Completato: aggiornamento copy bilingue `it/en` per hero e pain points.
- Completato: semplificazione della hero (meno elementi in competizione above the fold).
- Completato: nuova sezione ponte subito sotto hero per atterrare sul caso concreto HR/Admin.
- Completato: inserita sezione proof layer con evidenze di mercato/statistiche subito dopo la hero.
- Completato: anticipata la sezione `Ti suona familiare?` subito dopo il proof layer.
- Completato: riorganizzata la sequenza reale della pagina in `hero -> evidenze -> approccio concreto -> demo`.
- Completato: spostata la prova concreta fuori dalla hero e dentro la sezione del caso reale.
- Completato: primo refactor del use case in una lettura piu lineare con intro dedicata.
- Completato: introdotto il primo pattern interattivo previsto, toggle `Prima / Dopo`.
- Completato: modularizzazione della pagina in componenti dedicati per sezione.
- Verificato: lint pulito sui file toccati nelle iterazioni principali.
- In corso: revisione forte della UI del use case.
- In corso: compattazione del blocco `Prima / Dopo` per rispettare il vincolo "one screen per section".
- Completato: selettore per ruolo nella demo per guidare la lettura delle schermate.
- Completato: separazione di `use cases` e `benefits` in due sezioni distinte e piu pulite.

## Priorita

### Priorita 1
- Aggiornare il messaging della hero.
- Inserire subito dopo la hero una sezione proof layer con evidenze di mercato.
- Ridurre la densita above the fold.
- Rafforzare il concetto di "riconciliazione affidabile".
- Rendere piu evidente la progressione mission -> problema con evidenze -> use case -> demo.

### Priorita 2
- Rivedere pain points e sezione as-is/to-be per enfatizzare meglio i concetti chiave.
- Allineare meglio la gerarchia visiva alla chiarezza del `role-fit-audit`.
- Rendere trust signals e proof elements piu essenziali.

### Priorita 3
- Valutare introduzione di 1 o 2 componenti interattivi leggeri.
- Rifinire FAQ e CTA in chiave piu concreta e orientata all'azione.

## Piano di lavoro

### 1. Hero
Obiettivo:
- partire generica sul problema;
- non sembrare una pagina solo "inserimento ore";
- accompagnare verso il caso concreto immediatamente sotto.

Modifiche previste:
- riscrivere headline e subheadline;
- mantenere una CTA primaria dominante;
- ridurre peso visivo di elementi secondari;
- valutare se alleggerire o spostare priority card e dashboard cards;
- mantenere trust signals piu corti e piu netti.

Deliverable:
- nuova proposta di copy hero in `lib/i18n/business-translations.ts`;
- eventuale semplificazione del layout hero in [`app/(public)/business/page.tsx`](/Users/moltisantid/Personal/website/app/(public)/business/page.tsx).

### 2. Primo atterraggio sullo use case
Obiettivo:
- mostrare subito dopo il proof layer come il problema generale si manifesta in un caso reale HR/Admin.

Modifiche previste:
- inserire prima dello use case una sezione breve con evidenze/dati sul problema;
- rendere piu esplicito il collegamento tra proof layer e caso concreto;
- aumentare la leggibilita del blocco introduttivo allo use case;
- verificare se l'as-is infographic deve essere preceduta da una frase ponte piu forte.

Deliverable:
- nuova sezione proof layer dopo hero;
- revisione del testo introduttivo alla sezione current state;
- eventuale micro-copy di collegamento tra hero e as-is.

### 3. Sezione "approccio gia provato"
Obiettivo:
- far leggere use case, prima/dopo e demo come un'unica dimostrazione del metodo.

Modifiche previste:
- introdurre una sezione con titolo orientato alla prova concreta dell'approccio;
- spezzare meglio la narrativa interna in intro caso -> prima/dopo -> demo;
- evitare che i blocchi sembrino scollegati.
- separare l'implementazione in piu componenti invece di concentrare tutto in un solo blocco.

Deliverable:
- naming definitivo della sezione;
- revisione della gerarchia delle sezioni `current state` e `workflow`;
- micro-copy di collegamento tra as-is/to-be e demo.
- proposta di split componenti: `UseCaseIntroSection`, `UseCaseBeforeAfterSection`, `UseCaseDemoSection`.

Stato attuale:
- naming e direzione narrativa chiariti;
- split tecnico avviato;
- UI del blocco non ancora soddisfacente.

### 4. Pain points
Obiettivo:
- far emergere meglio i concetti che oggi sono presenti ma non sempre evidenziati.

Modifiche previste:
- inserire o rinforzare un pain point esplicito su "riconciliazioni sbagliate";
- rendere le card piu nette e meno descrittive;
- verificare se il numero di card e corretto o se conviene semplificare.

Deliverable:
- aggiornamento copy dei pain points in `lib/i18n/business-translations.ts`.

### 5. As-is / To-be
Obiettivo:
- rendere piu evidente il salto da frammentazione a controllo.

Modifiche previste:
- rafforzare il concetto di "fonte unica di verita";
- rendere piu misurabile il delta tra prima e dopo;
- verificare se il confronto puo essere piu immediato con segnali visivi migliori.

Deliverable:
- aggiornamento copy di current state;
- eventuali ritocchi a [`components/business/AsIsInfographic.tsx`](/Users/moltisantid/Personal/website/components/business/AsIsInfographic.tsx);
- eventuale revisione della resa visiva delle righe `before/after` in [`app/(public)/business/page.tsx`](/Users/moltisantid/Personal/website/app/(public)/business/page.tsx).

Stato attuale:
- confronto presente e toggle introdotto;
- contenuto ancora troppo lungo e troppo denso;
- da ripensare in chiave piu compatta, piu netta, piu mobile-first.

Spec operativa aggiornata:
- header fisso del blocco con titolo, sottotitolo e toggle `Prima / Dopo`;
- un solo stato visibile alla volta;
- ogni stato deve contenere: 1 titolo, 1 sottotitolo breve, 1 visual principale, 3 messaggi chiave, 1 takeaway finale;
- `Prima` deve evidenziare caos, frammentazione e ricostruzione manuale;
- `Dopo` deve evidenziare flusso unico, ruoli chiari e controllo immediato;
- la demo successiva non deve piu spiegare il delta, ma mostrare come funziona il `Dopo`.

### 6. Demo / Workflow
Obiettivo:
- usare la demo come prova operativa, non come semplice gallery.

Modifiche previste:
- rendere piu chiara la narrativa "dove nasce il dato -> chi approva -> chi controlla -> cosa viene esportato";
- verificare se il carosello e il formato migliore o se va contestualizzato meglio;
- semplificare eventuali etichette non indispensabili.

Deliverable:
- revisione copy della sezione flow;
- eventuali aggiustamenti in [`components/business/WorkflowScreensCarousel.tsx`](/Users/moltisantid/Personal/website/components/business/WorkflowScreensCarousel.tsx).

### 7. UX/UI allineata a stAItuned
Obiettivo:
- mantenere uno stile premium, minimal, moderno e professionale.

Modifiche previste:
- ridurre elementi in competizione above the fold;
- mantenere pattern visivi coerenti con `role-fit-audit`;
- evitare sottosistemi visivi nuovi o troppo decorativi;
- preservare accessibilita e leggibilita mobile-first.
- comprimere il contenuto di ogni sezione per stare dentro una schermata o quasi.

Deliverable:
- revisione gerarchia visiva della pagina;
- verifica dei principali blocchi a livello `xs`, `md`, `xl`.
- revisione specifica della densita verticale del blocco `Prima / Dopo`.

### 8. Interattivita leggera
Obiettivo:
- introdurre interazione solo se aumenta comprensione.

Ipotesi da valutare:
- toggle semplice `Prima / Dopo`;
- selettore per ruolo `Operatore / Manager / Admin`;
- mini workflow step-by-step.

Vincoli:
- il contenuto deve restare comprensibile anche senza interazione;
- nessuna interazione deve nascondere informazioni essenziali;
- evitare componenti troppo complessi o troppo "demo-first".

Deliverable:
- decisione se introdurre o meno un componente interattivo;
- se si, scegliere un solo pattern prioritario per la prima iterazione.

Decisione aggiornata:
- primo pattern da implementare: toggle `Prima / Dopo` nel use case;
- secondo pattern, solo dopo: selettore per ruolo nella demo.

Stato attuale:
- toggle `Prima / Dopo` introdotto;
- da rifinire lato UX/UI;
- selettore per ruolo implementato nella demo;
- prossimo focus: compattare ulteriormente la demo per farla leggere ancora meglio su mobile.

### 9. FAQ e CTA
Obiettivo:
- chiudere la pagina in modo concreto e coerente con il percorso narrativo.

Modifiche previste:
- aggiungere FAQ che sciolgono dubbi reali di adozione;
- rendere la CTA ancora piu ancorata a un risultato pratico;
- mantenere tono semplice e non consulenziale.

Deliverable:
- revisione copy FAQ e final CTA in `lib/i18n/business-translations.ts`.

## Ordine di esecuzione consigliato
1. Definizione nuova hero mission-first.
2. Inserimento proof layer con evidenze di mercato/statistiche.
3. Revisione current state come sezione "come l abbiamo gia provato nel concreto".
4. Split tecnico in `UseCaseIntroSection`, `UseCaseBeforeAfterSection`, `UseCaseDemoSection`.
5. Implementazione toggle `Prima / Dopo`.
6. Revisione demo/workflow.
7. Eventuale introduzione del selettore per ruolo.
8. Revisione CTA e FAQ.
9. Passata finale di UX/UI e pulizia visuale.

## Strategia implementativa del use case
1. Ridurre il blocco attuale a una intro molto semplice del caso.
2. Spostare il vero confronto in una sezione dedicata `Before / After`.
3. Introdurre un toggle unico per alternare i due stati.
4. Usare la demo come step successivo e non come parte ibrida del blocco precedente.
5. Solo dopo collegare la demo a un selettore per ruolo.

Stato attuale:
- punti 1, 2 e 3 avviati/implementati;
- punto 4 ancora da rifinire bene;
- punto 5 ancora da fare.

Vincoli di implementazione:
- il blocco `Prima / Dopo` deve stare il piu possibile dentro una schermata;
- niente testi lunghi o duplicati;
- massimo 3 messaggi chiave per stato;
- pochi contenitori interni;
- mobile-first obbligatorio.

## Sequenza sezioni target
1. Hero mission-first
2. Proof layer: "Perche questo problema conta"
3. Sezione prova concreta: "Come questo approccio lo abbiamo gia tradotto in un workflow concreto"
4. Blocco "Prima / Dopo"
5. Demo del workflow
6. Impatto / use cases
7. FAQ
8. CTA finale

## File principali coinvolti
- [`public/assets/business/brainstorming.md`](/Users/moltisantid/Personal/website/public/assets/business/brainstorming.md)
- [`lib/i18n/business-translations.ts`](/Users/moltisantid/Personal/website/lib/i18n/business-translations.ts)
- [`app/(public)/business/page.tsx`](/Users/moltisantid/Personal/website/app/(public)/business/page.tsx)
- [`components/business/AsIsInfographic.tsx`](/Users/moltisantid/Personal/website/components/business/AsIsInfographic.tsx)
- [`components/business/WorkflowScreensCarousel.tsx`](/Users/moltisantid/Personal/website/components/business/WorkflowScreensCarousel.tsx)

## Criteri di accettazione
- Un utente nuovo capisce in pochi secondi il problema che la pagina risolve.
- La hero apre con la mission e non con i dettagli di feature.
- Subito dopo la hero il problema viene rafforzato da evidenze di mercato/statistiche.
- Lo use case concreto arriva come prova dell'approccio gia messo a terra.
- I concetti chiave sono evidenziati meglio sia nel copy sia nella gerarchia visiva.
- La pagina appare piu semplice e meno densa sopra la piega.
- La UX/UI e coerente con stAItuned e con la chiarezza del `role-fit-audit`.
- Eventuali interazioni migliorano la comprensione e non aumentano il rumore.
- Ogni sezione principale resta leggibile dentro una schermata, senza costringere a lunghi scroll per completare la stessa idea.

## Note
- Questo file e il piano operativo derivato dal brainstorming.
- Il brainstorming resta il documento di analisi e decisione.
- Il plan resta il documento di esecuzione.
