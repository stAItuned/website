# Brainstorming pagina /business

## Obiettivo strategico
Rendere la pagina una transizione netta da caos operativo a controllo operativo.

Messaggio chiave:
"Applicativi sparsi, Excel, file, email, WhatsApp e riconciliazioni spesso sbagliate. Con un sistema automatizzato riduci la manualita, centralizzi le informazioni e semplifichi i processi."

Missione da far emergere all'inizio:
"Aiutiamo le aziende a trasformare processi frammentati in workflow chiari, tracciati e affidabili."

Principio guida:
- All'inizio la cosa primaria non e mostrare tutte le feature.
- All'inizio la cosa primaria e mostrare la mission.
- La mission deve chiarire subito perche esiste questa soluzione e quale cambiamento produce.
- Solo dopo si scende nello use case concreto.
- Ogni sezione deve stare dentro una schermata o comunque dentro un blocco visibile senza dover scorrere per "finire la stessa idea".

## Stato attuale

### Gia implementato
- Hero piu orientata alla mission e meno centrata sul solo caso inserimento ore.
- Proof layer con evidenze di mercato/statistiche subito dopo la hero.
- Sezione use case ripensata come area distinta rispetto alla hero.
- Prima interazione introdotta: toggle `Prima / Dopo`.
- Refactor del codice in componenti piu modulari.

### Gia chiarito a livello strategico
- Sequenza corretta della pagina: mission -> evidenze -> use case concreto -> demo -> CTA.
- I dati devono sostenere il problema, non sostituire la mission.
- Il caso HR/Admin e il caso dimostrativo principale.
- L'interattivita deve aiutare la comprensione, non stupire.

### Ancora aperto / non risolto bene
- Il blocco `Use case` non ha ancora una UI convincente.
- `Prima / Dopo` e ancora troppo lungo, troppo denso e poco mobile-first.
- Il principio "one screen per section" non e ancora rispettato bene nel confronto `Prima / Dopo`.
- La demo non e ancora abbastanza collegata al caso in modo fluido.
- Manca ancora la seconda interazione utile: selettore per ruolo nella demo.

Decisione di posizionamento:
- Hero piu generica del caso "inserimento ore".
- Specifico forte subito sotto con esempio concreto HR/Admin.
- La pagina non deve sembrare un semplice timesheet tool.
- La pagina deve far capire che il caso ore/assenze/paghe e la prova concreta di un problema piu ampio: workflow frammentati e riconciliazioni fragili.
- La progressione narrativa corretta e: apertura generica -> discesa guidata nello use case concreto.
- La sequenza attesa subito dopo la hero e: highlight del problema con evidenze di mercato -> prova concreta del metodo con use case gia testato.

## Analisi rapida della pagina attuale

### Punti di forza
- Problema espresso bene: il testo distingue chiaramente "avere strumenti digitali" da "avere un workflow governato".
- Struttura narrativa gia buona: hero -> pain points -> as-is/to-be -> flow demo -> FAQ -> CTA.
- Sezione as-is efficace: 3 ruoli, 3 app, merge manuali, assenze su canali diversi, payroll su Excel.
- Demo visuale presente: aiuta a rendere concreta la parte to-be.
- CTA finale chiara e breve (20 minuti), orientata all'azione.

### Gap/miglioramenti
- Il messaggio "riconciliazioni spesso sbagliate" e implicito ma non abbastanza esplicito nelle headline principali.
- Manca una promessa forte sopra la piega su "errori ridotti + tempi ridotti + controllo continuo".
- Benefici molto positivi (+85%, -70%, +60%) ma da trattare con prudenza: utile ancorarli a "target/benchmark" o "range" per credibilita.
- Alcuni blocchi sono ricchi di testo: si puo aumentare la scansione con frasi piu nette e outcome immediati.
- Va resa ancora piu visibile la continuita tra canali sparsi (oggi) e stato unico tracciato (domani).
- La hero attuale e gia piu ampia del solo timesheet, ma puo essere resa ancora piu chiaramente "business workflow" invece che "pagina su inserimento ore".

## Analisi specifica della sezione Use case

### Problema generale
La sezione oggi non e chiara perche prova a fare troppe cose nello stesso blocco.

In un unico punto della pagina sta cercando di essere:
- introduzione al caso concreto;
- prova del metodo;
- before/after;
- summary del flusso;
- anticipo della demo.

Questo produce confusione sia lato messaggio sia lato layout.

### Problemi di messaggio
- Non e subito chiaro qual e la tesi della sezione.
- Non e chiaro se stiamo leggendo un caso reale, una demo, un concept o un riepilogo.
- Il messaggio "come lo abbiamo gia provato" si mescola con "come funziona la soluzione".
- Alcuni contenuti ripetono concetti gia presenti altrove, senza aggiungere una progressione netta.

### Problemi di layout
- La sezione mescola blocchi introduttivi, card informative, infographic e confronto prima/dopo senza una gerarchia forte.
- Ci sono troppi elementi equivalenti sullo stesso livello visivo.
- L'occhio non capisce cosa leggere per primo.
- Il before/after attuale e ricco, ma anche denso: badge, chip, meta-label, lane, frecce e footer competono tra loro.
- La demo vive in una sezione separata, ma la sezione use case non la prepara in modo abbastanza lineare.
- Il componente e troppo alto: per vedere tutta la stessa sezione bisogna scorrere troppo.
- La sezione non rispetta un principio di "one screen per section".

### Problemi di UX
- Un utente nuovo non capisce in 3 secondi "che caso stiamo guardando".
- Non capisce subito dov e il "prima" e dov e il "dopo".
- Non capisce se la demo che segue e parte dello stesso caso o un blocco a parte.
- La lettura richiede troppo parsing visivo.
- Su mobile il problema peggiora: troppo testo, troppe card, troppo stacking verticale.

### Diagnosi sintetica
La sezione use case oggi e:
- troppo ibrida;
- troppo densa;
- poco gerarchica;
- non abbastanza lineare.
- non abbastanza compatta;
- non abbastanza mobile-first.

### Cosa dovrebbe fare davvero questa sezione
La sezione use case dovrebbe fare una sola cosa:
- dimostrare nel concreto come il metodo si traduce in un caso reale.

Per farlo deve accompagnare la lettura in modo molto semplice:
- 1. Che caso e.
- 2. Come funziona oggi.
- 3. Come cambia domani.
- 4. Come lo si vede nella demo.

### Struttura consigliata del use case

#### Blocco 1: contesto del caso
Contenuto:
- titolo molto chiaro;
- una frase che spiega il caso;
- una mini sintesi del problema.

Obiettivo:
- fare capire subito "di cosa stiamo parlando".

#### Blocco 2: prima
Contenuto:
- visual as-is;
- pochi punti chiave sul perche il processo e fragile;
- evidenza dei rischi.

Obiettivo:
- rendere leggibile il problema, non esaustivo.

#### Blocco 3: dopo
Contenuto:
- una spiegazione semplice del workflow centralizzato;
- pochi punti forti;
- messaggio di controllo e affidabilita.

Obiettivo:
- far vedere il salto di qualita senza sovraccaricare.

#### Blocco 4: demo
Contenuto:
- schermate;
- step del flusso;
- legame esplicito con il caso mostrato sopra.

Obiettivo:
- chiudere il cerchio tra concetto e operativita.

### Regole UI per sistemarla
- Un solo messaggio principale per blocco.
- Meno card riassuntive nello stesso punto.
- Prima e dopo devono essere immediatamente distinguibili anche senza leggere tutto.
- La demo deve essere presentata come continuazione del use case, non come sezione parallela.
- Ridurre meta-label, chip e micro-elementi quando non aiutano la comprensione immediata.
- Ogni stato (`Prima` o `Dopo`) deve stare idealmente in una schermata.
- Il contenuto principale deve essere leggibile senza scroll interno e senza lunghi paragrafi.
- Mobile first: il layout deve restare chiaro anche con stacking verticale.

### Cosa togliere o ridurre
- Doppie card introduttive se raccontano concetti gia leggibili nel titolo/lead.
- Pattern troppo ricchi dentro il before/after.
- Micro-copie secondarie che competono con il messaggio principale.
- Elementi "status / focus / cards KPI" se non sono essenziali al primo colpo d occhio.
- Testi descrittivi troppo lunghi.
- Blocchi secondari che allungano la sezione senza aumentare chiarezza.
- Ridondanze tra titolo, descrizione, bullet e chip.

### Direzione consigliata
- Use case piu lineare.
- Layout piu pulito.
- Before e after piu netti.
- Demo piu chiaramente collegata al caso.
- Meno densita cognitiva, piu accompagnamento.
- Ogni stato piu compatto e piu sintetico.
- Poche parole, elementi forti, priorita visiva esplicita.

## Revisione specifica di Prima / Dopo

### Problemi attuali osservati
- UI non buona: il contenuto appare piatto, lungo e senza una chiara gerarchia.
- UI non responsive: su mobile il blocco esplode in altezza e perde leggibilita.
- Il componente e troppo lungo e non puo stare dentro una schermata.
- Troppo testo: l'utente deve leggere troppo per capire il messaggio.
- Le cose importanti non emergono subito.

### Vincolo forte da applicare
Il blocco `Prima` e il blocco `Dopo` devono essere pensati come due schermate concise.

Questo significa:
- headline chiara;
- una sola frase di supporto breve;
- 3 elementi forti massimo;
- 1 visual principale;
- 1 messaggio finale o takeaway.

### Struttura consigliata per `Prima`
- Label: `Prima`
- Titolo molto chiaro: es. `Processo frammentato`
- Sottotitolo breve: una frase, non un paragrafo lungo
- Visual principale: infographic o schema sintetico
- 3 problemi chiave al massimo
- Takeaway finale: `controllo tardivo, errori frequenti`

### Struttura consigliata per `Dopo`
- Label: `Dopo`
- Titolo molto chiaro: es. `Workflow centralizzato`
- Sottotitolo breve: una frase, non un blocco di testo
- Visual principale: struttura del workflow o viste per ruolo
- 3 benefici chiave al massimo
- Takeaway finale: `stesso dato, piu controllo, meno manualita`

## Revisione hero: come dare piu impatto ai 3 messaggi chiave

### Messaggi da valorizzare
- Dati centralizzati in un flusso unico
- Stati e approvazioni sempre tracciati
- Riconciliazioni affidabili prima della chiusura

### Diagnosi della hero attuale
I 3 messaggi sono giusti, ma oggi sono percepiti come semplici trust signals.

Questo li rende:
- corretti a livello contenutistico;
- deboli a livello percettivo;
- troppo simili a bullet card standard;
- poco memorabili subito dopo headline e CTA.

Il problema non e il copy. Il problema e il pattern visivo.

### Perche oggi hanno poco impatto
- Stanno in 3 card uguali e quindi nessuno dei 3 emerge davvero.
- Hanno lo stesso peso visivo di tanti altri elementi della hero.
- Non c e una parola chiave che resta impressa a colpo d occhio.
- Sembrano rassicurazioni generiche, non pilastri del valore promesso.

### Obiettivo corretto
Questi 3 messaggi non devono sembrare note a margine.

Devono diventare:
- i 3 pilastri del cambiamento promesso;
- il ponte tra mission e use case;
- il layer visivo che fa capire "cosa cambia davvero" prima di scendere nella pagina.

### Direzione consigliata
Trasformarli da `3 card informative` a `3 pillar statements`.

Principi:
- una sola riga forte per messaggio;
- keyword dominante;
- testo secondario ridotto al minimo o assente;
- piu contrasto visivo;
- meno trattamento da card generica.

### Pattern visivi possibili

#### Opzione 1: Pillar strip orizzontale
Una fascia subito sotto CTA con 3 blocchi allineati.

Ogni blocco contiene:
- una keyword dominante;
- una micro-riga di supporto;
- separazione visiva netta tra i 3 pillar.

Esempio logico:
- `Flusso unico` -> dati centralizzati
- `Stati tracciati` -> approvazioni sempre visibili
- `Chiusura affidabile` -> riconciliazioni prima del payroll

Percezione:
- piu premium;
- piu sintetica;
- piu memorizzabile.

#### Opzione 2: Checklist ad alto contrasto
Tre righe stacked, ognuna con:
- icona forte o marker;
- keyword in evidenza;
- micro-frase.

Percezione:
- molto chiara;
- leggibile anche su mobile;
- meno elegante della strip, ma piu diretta.

#### Opzione 3: 3 micro-card numerate
Tre mini-card con numerazione o ordine logico:
- 01 centralizza
- 02 traccia
- 03 riconcilia

Percezione:
- da evitare se sembra troppo "process step";
- utile solo se vogliamo suggerire una progressione.

### Raccomandazione
La soluzione piu adatta a questa pagina e la `pillar strip orizzontale`, con fallback stacked su mobile.

Motivo:
- resta minimale;
- non introduce rumore;
- valorizza molto meglio i 3 concetti;
- si integra bene con una hero stAItuned premium e pulita.

### Regole di copy per i 3 pillar
- massimo 2 livelli: keyword + micro-spiegazione;
- no frasi lunghe;
- no tono descrittivo;
- no card verbose.

### Riscrittura consigliata in forma piu visiva

#### Variante A
- `Flusso unico`
  Tutti i dati nello stesso sistema
- `Stati tracciati`
  Ogni passaggio resta visibile
- `Chiusura affidabile`
  Riconciliazioni prima dell export

#### Variante B
- `Un solo flusso`
  Niente copie sparse e merge finali
- `Approvazioni tracciate`
  Stato e responsabilita sempre chiari
- `Dati pronti in chiusura`
  Meno errori, meno rincorse

### Decisione consigliata
In hero questi 3 messaggi devono:
- restare subito sotto CTA;
- non sembrare un blocco secondario;
- avere un pattern unico e piu forte delle card standard;
- essere pensati come `pillars`, non come `trust signals`.

### Numero massimo di elementi
Per ogni stato:
- 1 titolo
- 1 sottotitolo
- 1 visual principale
- 3 bullet o card
- 1 takeaway finale

Oltre questo limite la sezione torna a diventare troppo lunga e poco leggibile.

### Cosa NON fare
- Non mettere 6-8 chip.
- Non mettere due colonne dense piu un blocco finale.
- Non usare paragrafi lunghi.
- Non duplicare le stesse informazioni in piu formati.
- Non affidarsi solo a card tutte uguali: appiattiscono la gerarchia.

### Cosa deve emergere a colpo d occhio
Nel `Prima`:
- caos
- frammentazione
- ricostruzione manuale

Nel `Dopo`:
- un solo flusso
- ruoli chiari
- controllo immediato

### Direzione visuale consigliata
- Una composizione molto piu compatta.
- Meno contenitori interni.
- Più spazio bianco.
- Tipografia piu gerarchica.
- Pochi accenti cromatici molto leggibili.
- Ogni schermata deve avere un focus visivo principale.

## Proposta concreta nuovo layout `Prima / Dopo`

### Obiettivo
Ridisegnare il blocco `Prima / Dopo` come confronto molto piu compatto, leggibile e mobile-first.

Il principio e:
- un solo stato visibile alla volta;
- una sola idea forte per schermata;
- massimo 3 messaggi chiave;
- un visual principale;
- un takeaway finale.

### Struttura del blocco

#### Header fisso del componente
Contenuto:
- eyebrow: `Prima / Dopo`
- titolo: `Dal caos operativo al controllo quotidiano`
- sottotitolo breve: una sola frase che spiega cosa si sta confrontando
- toggle `Prima / Dopo`

Obiettivo:
- far capire subito che si tratta di un confronto;
- separare il contenitore dal contenuto dei due stati;
- evitare che il titolo si ripeta dentro ogni pannello.

### Stato `Prima`

#### Composizione consigliata
- label piccola: `Prima`
- titolo: `Processo frammentato`
- sottotitolo breve:
  `Dati, richieste e approvazioni vivono in canali diversi. Il controllo arriva tardi.`

- visual principale:
  as-is infographic oppure una sua versione piu compatta

- 3 punti chiave:
  - `3 ruoli su sistemi diversi`
  - `Merge e ricostruzioni manuali`
  - `Errori scoperti solo a fine processo`

- takeaway finale:
  `Risultato: piu manualita, piu rischio, meno controllo`

### Stato `Dopo`

#### Composizione consigliata
- label piccola: `Dopo`
- titolo: `Workflow centralizzato`
- sottotitolo breve:
  `Un solo flusso coordina inserimento, approvazione, controllo ed export.`

- visual principale:
  schema sintetico del workflow o mini mappa dei ruoli sullo stesso flusso

- 3 punti chiave:
  - `Un solo dato condiviso`
  - `Ruoli e stati chiari`
  - `Export finale da dati gia verificati`

- takeaway finale:
  `Risultato: meno coordinamento, piu affidabilita operativa`

### Regole di copy
- Frasi brevi.
- Nessun paragrafo lungo.
- Nessuna ripetizione dello stesso concetto in 2 o 3 posti.
- Ogni bullet deve essere autoesplicativo.
- Il takeaway finale deve essere leggibile in un colpo d'occhio.

### Regole di layout
- Header del blocco sempre visibile e leggero.
- Un solo pannello attivo alla volta.
- Visual dominante sopra o al centro.
- Bullet e takeaway sotto il visual.
- Niente colonne troppo dense su mobile.
- Altezza contenuta: la schermata deve restare leggibile senza lungo scroll.

### Versione desktop
- Header in alto
- Toggle vicino al titolo o subito sotto
- Pannello attivo centrato
- Visual + messaggi chiave nello stesso viewport

### Versione mobile
- Header molto compatto
- Toggle subito leggibile
- Visual in alto
- 3 bullet sotto
- takeaway finale come fascia o card conclusiva

### Elementi da togliere rispetto alla versione attuale
- card introduttive doppie nello stesso blocco;
- troppe chip secondarie;
- lane troppo dettagliate nel `Dopo`;
- descrizioni troppo lunghe;
- elementi che fanno sembrare il blocco un mini-dashboard.

### Cosa puo restare ma semplificato
- il visual `AsIsInfographic`, se viene compattato;
- il concetto di ruoli nel `Dopo`, ma in forma piu sintetica;
- il toggle `Prima / Dopo`, come interazione principale.

### Cosa spostare altrove
- il dettaglio piu ricco dei ruoli;
- gli step completi del workflow;
- le schermate della demo.

Questi contenuti devono vivere nel blocco successivo `Demo`, non nel confronto `Prima / Dopo`.

### Relazione con la demo
Il blocco `Prima / Dopo` deve rispondere a:
- `qual e il cambiamento`

La demo deve rispondere a:
- `come si vede e come funziona questo cambiamento`

Questa separazione deve essere netta.

### Formula finale del nuovo use case
- Intro caso
- `Prima / Dopo` compatto con toggle
- Demo del workflow

Non:
- intro + prova + dashboard + confronto + demo tutto nello stesso blocco

### Esito atteso
- comprensione piu rapida;
- meno rumore visivo;
- migliore resa mobile;
- sezione leggibile dentro una schermata;
- maggiore chiarezza del passaggio da problema a soluzione.

## Spec implementativa del nuovo `Prima / Dopo`

### Wireframe testuale del componente

#### Struttura generale
```text
[Eyebrow]
[Titolo del blocco]
[Sottotitolo breve]
[Toggle Prima | Dopo]

[Pannello attivo]
  [Label stato]
  [Titolo stato]
  [Sottotitolo stato]
  [Visual principale]
  [3 messaggi chiave]
  [Takeaway finale]
```

### Wireframe stato `Prima`
```text
PRIMA
Processo frammentato
Dati, richieste e approvazioni vivono in canali diversi. Il controllo arriva tardi.

[Visual as-is]

- 3 ruoli su sistemi diversi
- Merge e ricostruzioni manuali
- Errori scoperti a fine processo

Risultato: piu manualita, piu rischio, meno controllo
```

### Wireframe stato `Dopo`
```text
DOPO
Workflow centralizzato
Un solo flusso coordina inserimento, approvazione, controllo ed export.

[Visual sintetico del workflow]

- Un solo dato condiviso
- Ruoli e stati chiari
- Export finale da dati gia verificati

Risultato: meno coordinamento, piu affidabilita operativa
```

### Gerarchia visiva da rispettare
- Livello 1: titolo del blocco
- Livello 2: titolo dello stato attivo
- Livello 3: visual principale
- Livello 4: 3 messaggi chiave
- Livello 5: takeaway finale

Non devono avere lo stesso peso:
- toggle
- chip
- label secondarie
- elementi decorativi

### Checklist di implementazione
- Ridurre il numero totale di contenitori interni.
- Togliere card ridondanti introduttive.
- Togliere lane dense nel `Dopo` e sostituirle con una forma piu sintetica.
- Usare il visual come contenuto principale, non come uno dei tanti elementi.
- Limitare i messaggi chiave a 3 per stato.
- Rendere il takeaway finale molto leggibile.
- Assicurarsi che su mobile tutto il blocco resti chiaro senza scroll eccessivo.

### Decisioni sui contenuti

#### Nel `Prima` tenere
- AsIsInfographic o sua variante compattata
- 3 rischi chiave
- 1 takeaway finale

#### Nel `Prima` togliere
- meta-label ripetute
- troppi chip
- descrizioni lunghe
- blocchi secondari che raccontano lo stesso problema in un altro modo

#### Nel `Dopo` tenere
- un mini visual del workflow centralizzato
- 3 benefici chiave
- 1 takeaway finale

#### Nel `Dopo` togliere
- elenco troppo ricco di ruoli
- pannelli troppo dettagliati
- duplicazioni con la demo successiva

### Cosa deve fare la demo dopo questo blocco
Se il `Prima / Dopo` chiarisce il delta, la demo puo concentrarsi su:
- flusso per ruolo;
- schermate reali;
- comprensione operativa.

Quindi la demo non deve piu spiegare il "prima vs dopo".
Deve spiegare "come funziona il dopo".

### Criterio di valutazione del risultato
Se guardando il blocco per 5 secondi si capisce:
- qual e il problema prima,
- qual e il miglioramento dopo,
- perche il passaggio conta,

allora il blocco funziona.

Se invece bisogna leggere troppo per orientarsi, il blocco e ancora sbagliato.

## Come implementarlo

### Obiettivo implementativo
Trasformare il use case da blocco confuso a percorso guidato in 4 step:
- contesto del caso;
- prima;
- dopo;
- demo.

### Architettura consigliata
Non tenere tutto in un solo componente.

Spezzare in:
- `UseCaseIntroSection`
- `UseCaseBeforeAfterSection`
- `UseCaseDemoSection`
- eventuale componente interattivo dedicato e piccolo, non onnivoro

### Sequenza consigliata nel codice
- `BusinessEvidenceSection`
- `UseCaseIntroSection`
- `UseCaseBeforeAfterSection`
- `UseCaseDemoSection`

Questo aiuta a:
- mantenere il file piu leggibile;
- dare a ogni blocco una responsabilita chiara;
- evitare che layout e messaggio si mescolino nello stesso componente.

## Interattivita mancante

### Diagnosi
La pagina oggi racconta il caso, ma non aiuta ancora l'utente a esplorarlo in modo guidato.

In particolare manca:
- un'interazione chiara tra prima e dopo;
- un modo semplice per vedere il flusso per ruolo;
- un ponte interattivo tra caso concreto e demo.

### Interazione prioritaria consigliata
La prima interazione da introdurre non deve essere il carosello.

La prima interazione da introdurre deve essere:
- un toggle molto semplice `Prima / Dopo`

Perche:
- rende immediato il confronto;
- riduce densita visiva;
- crea un gesto minimo ma utile;
- aiuta a capire che stiamo guardando due versioni dello stesso processo.

### Come usarlo
Nel blocco `UseCaseBeforeAfterSection`:
- header con titolo del caso;
- toggle `Prima / Dopo`;
- il contenuto principale cambia restando nello stesso contenitore;
- sotto resta visibile una sintesi costante del caso.

### Contenuto del toggle

#### Stato `Prima`
- visual as-is;
- 3-4 rischi chiave;
- microcopy sul perche il processo e fragile.

#### Stato `Dopo`
- workflow centralizzato;
- 3-4 benefici/leve chiave;
- microcopy sul perche il controllo migliora.

### Vantaggio UX
Il toggle evita di mostrare contemporaneamente troppi blocchi equivalenti.

Questo aiuta:
- chi arriva per la prima volta;
- la lettura mobile;
- la chiarezza del delta.

## Seconda interazione consigliata

### Selettore per ruolo
Dopo il toggle `Prima / Dopo`, la seconda interazione piu utile e:
- un selettore `Operatore / Manager / Admin`

Da usare nel blocco demo o subito prima della demo.

### Obiettivo
Far vedere che il workflow unico non e una vista unica per tutti, ma un sistema con viste diverse sullo stesso dato.

### Comportamento atteso
- l'utente sceglie il ruolo;
- cambia la schermata principale mostrata;
- cambia il testo di supporto;
- restano visibili gli step del workflow.

### Perche e migliore di altre idee
- e piu utile di una semplice gallery;
- collega direttamente il concetto di ruoli al valore del sistema unico;
- non richiede interazioni complesse.

## Interazioni da NON implementare per prime
- caroselli piu ricchi;
- timeline troppo animate;
- before/after affiancati piu toggle simultanei;
- dashboard interattive tipo prodotto completo.

### Motivo
Prima serve chiarezza strutturale.
Solo dopo ha senso arricchire.

## Proposta concreta di implementazione

### Fase 1
- Ripulire il use case in 3 sezioni distinte.
- Inserire toggle `Prima / Dopo`.
- Lasciare la demo lineare ma piu chiaramente collegata al caso.

### Fase 2
- Aggiungere selettore per ruolo nella demo.
- Mappare 3 schermate principali a 3 ruoli.
- Collegare testo e visual al ruolo selezionato.

### Fase 3
- Valutare se mantenere il carosello completo come supporto secondario.
- Tenere solo cio che aggiunge comprensione reale.

## Criterio decisionale per l'implementazione
Ogni elemento del nuovo use case deve rispondere a una domanda:
- "Riduce il tempo necessario a capire il caso?"
- "Rende piu chiaro il prima/dopo?"
- "Aiuta a collegare il caso alla demo?"

Se la risposta e no, va tolto.

## Analisi UX/UI rispetto a stAItuned e role-fit-audit

### Obiettivo UX/UI
La pagina `/business` deve risultare:
- semplice,
- chiara anche per un utente nuovo,
- minimal,
- professionale,
- moderna,
- coerente con il linguaggio visivo stAItuned.

### Cosa funziona oggi
- La base visiva e gia compatibile con stAItuned: dark hero, gradienti caldi, accenti amber/gold, card pulite, bordi soft.
- La pagina usa gia un linguaggio premium/professionale vicino a `role-fit-audit`.
- La progressione sezionale e ordinata e non appare caotica a livello di macro-layout.
- Il contrasto tra hero scura e sezioni chiare aiuta a separare i momenti narrativi.

### Differenza chiave rispetto a role-fit-audit
`role-fit-audit` risulta piu immediata per 3 motivi:
- sopra la piega ha una gerarchia piu netta;
- ha meno elementi che competono tra loro nello stesso momento;
- rende il primo passo dell'utente piu ovvio.

### Criticita UX/UI attuali di /business
- Hero un po' densa: badge, breadcrumb, titolo, priority card, due CTA, trust signals e dashboard cards convivono tutti subito.
- Troppe "scatole" nella parte alta: il rischio e ridurre la chiarezza iniziale per un utente freddo.
- La promessa e buona, ma l'occhio non capisce immediatamente qual e l'elemento principale da seguire.
- Manca una sensazione di "percorso guidato" forte come quella del `role-fit-audit`.
- La pagina e professionale, ma in alcuni punti meno minimal del target desiderato.

### Principi da prendere da role-fit-audit
- Una hero con una gerarchia molto leggibile: badge piccolo, headline forte, una spiegazione chiara, una CTA primaria dominante.
- Un uso controllato degli accenti: pochi colori forti, ben concentrati sui punti importanti.
- Card con funzione chiara: ogni box deve guadagnarsi il suo spazio.
- Pochi pattern visivi ricorrenti ma coerenti: rounded card, border soft, glow leggero, gradienti caldi.
- Onboarding implicito: chi arriva capisce subito cosa sta guardando, perche conta e qual e il prossimo passo.

### Direzione UX/UI consigliata per /business
- Semplificare la hero.
- Ridurre il numero di elementi visivi contemporanei above the fold.
- Rendere piu chiara la sequenza: mission -> problema con evidenze -> use case concreto -> demo -> CTA.
- Dare piu peso a un solo elemento di prova iniziale, non a piu elementi equivalenti.
- Far percepire subito che la pagina e pensata per un decision maker che non conosce ancora stAItuned.

### Hero: raccomandazioni UX/UI
- Un solo focus visivo principale: headline + subheadline + CTA primaria.
- CTA secondaria meno dominante della primaria.
- Trust signals ridotti e piu secchi.
- Valutare se tenere o alleggerire le dashboard cards nella prima viewport.
- La priority card deve essere molto utile; se compete con headline e CTA, va semplificata o spostata.

### Tono visivo desiderato
- Minimal ma non freddo.
- Premium ma non lussuoso/artificiale.
- Moderno ma non carico di effetti.
- Professionale senza sembrare enterprise pesante.
- Chiaro anche per chi arriva per la prima volta e non conosce il contesto.

### Regole pratiche per le prossime iterazioni
- Ogni sezione deve avere una sola idea principale.
- Ogni blocco deve rispondere a una domanda dell'utente nuovo.
- Meno testo decorativo, piu testo orientato a comprensione e decisione.
- Meno elementi "dimostrativi" simultanei, piu progressione guidata.
- Riutilizzare i pattern forti gia presenti in `role-fit-audit` invece di introdurre un sottosistema visivo nuovo.

### Domande UX da usare come check
- Un utente nuovo capisce in 5 secondi che problema risolve la pagina?
- Capisce in 10-15 secondi che esiste uno use case concreto?
- Capisce qual e il prossimo passo da fare?
- La hero aiuta a decidere o crea solo atmosfera?
- Ogni card aggiunge chiarezza o aggiunge rumore?

## Valorizzazione dei concetti chiave

### Concetti chiave da far emergere
- Dati sparsi.
- Passaggi manuali.
- Riconciliazioni fragili o sbagliate.
- Sistema unico.
- Stati tracciati.
- Riduzione errori e tempi.

### Valutazione attuale
Oggi i concetti ci sono, ma non sempre sono valorizzati con sufficiente priorita visiva.

In particolare:
- il messaggio generale c'e, ma compete con molti elementi contemporaneamente;
- alcuni concetti forti sono piu "letti" che "visti";
- la UX/UI oggi racconta bene, ma non sempre enfatizza con immediatezza.

### Dove la valorizzazione funziona
- L'as-is infographic rende bene il concetto di frammentazione.
- Il confronto prima/dopo aiuta a capire il salto di qualita.
- La demo visuale rende concreta la parte "sistema unico con ruoli".

### Dove la valorizzazione e migliorabile
- "Riconciliazioni sbagliate" dovrebbe essere ancora piu frontale.
- "Unica fonte di verita" dovrebbe diventare un concetto quasi visivo, non solo testuale.
- "Riduzione di manualita" oggi emerge, ma puo essere resa piu netta con micro-copy e gerarchia.
- Alcuni insight importanti sono dispersi tra card, chips e blocchi testuali.

### Conclusione
La UX/UI attuale comunica i concetti chiave in modo corretto, ma non li mette ancora tutti sotto il giusto riflettore.

Il lavoro da fare non e aggiungere piu contenuto, ma:
- aumentare la gerarchia;
- ridurre competizione tra elementi;
- trasformare i concetti piu forti in segnali visivi piu immediati.

## Interattivita: utile o no?

### Conclusione
Si, una UX con componenti interattivi puo essere interessante e piu ingaggiante, ma solo se aumenta comprensione e non complessita.

Per questa pagina la regola deve essere:
- interattivita per spiegare meglio;
- non interattivita per stupire.

### Quando l'interattivita ha senso
- Per far vedere il passaggio da as-is a to-be.
- Per mostrare i diversi ruoli della soluzione.
- Per far capire come si muove un dato da inserimento a controllo finale.
- Per aiutare un utente nuovo a esplorare il caso concreto senza sentirsi sopraffatto.

### Quando NON ha senso
- Se introduce attrito prima che l'utente abbia capito il problema.
- Se nasconde informazioni importanti dietro click non necessari.
- Se rende la pagina piu "demo product" che "business landing chiara".
- Se crea pattern troppo diversi dal resto del sito stAItuned.

### Tipi di interazione che possono funzionare bene
- Toggle semplice "Prima / Dopo".
- Stepper o tabs per i ruoli: operatore / manager / admin.
- Mini flow interattivo: inserimento -> approvazione -> controllo -> export.
- Highlight progressivo di un use case concreto.

### Tipi di interazione da evitare
- Caroselli troppo complessi come elemento principale di comprensione.
- Animazioni continue o troppo decorative.
- Componenti che chiedono troppe azioni per arrivare al punto.
- Interazioni che fanno perdere il focus sulla CTA.

### Direzione consigliata
- Tenere la pagina prevalentemente lineare e leggibile.
- Usare 1 o 2 componenti interattivi ad alto valore esplicativo.
- Fare in modo che il contenuto principale sia comprensibile anche senza interazione.
- Usare l'interazione per rinforzare i concetti chiave, non per sostituirli.

### Componenti interattivi candidati migliori
- Un toggle as-is / to-be subito molto leggibile.
- Un selettore per ruolo con 3 viste della stessa soluzione.
- Una mini sequenza guidata del workflow con stati chiari.

### Criterio decisionale
Ogni componente interattivo deve rispondere a una domanda:
"Aiuta un utente nuovo a capire meglio il problema e la soluzione in meno tempo?"

Se la risposta e no, non va inserito.

## Mission first

### Perche e importante
Se la pagina parte subito da dettagli operativi, rischia di sembrare una pagina di prodotto verticale.

Se invece parte dalla mission:
- alza il posizionamento;
- chiarisce l'intento;
- rende piu credibile lo use case come esempio applicativo e non come unico caso possibile.

### Cosa deve comunicare la mission
- Riduciamo la frammentazione dei processi.
- Rendiamo i passaggi chiari e tracciati.
- Centralizziamo i dati operativi.
- Riduciamo errori, rincorse e riconciliazioni sbagliate.

### Formula utile
- Mission: "trasformare processi frammentati in workflow affidabili".
- Problema: "oggi i dati vivono tra canali e file separati".
- Soluzione: "domani il flusso vive in un solo sistema".
- Prova: "ecco un caso concreto HR/Admin".

### Direzione di copy possibile
- "Trasformiamo processi frammentati in workflow chiari, tracciati e affidabili."
- "Quando dati, richieste e approvazioni vivono in strumenti diversi, il problema non e solo operativo: e strutturale."
- "Partiamo da un caso concreto per mostrarti come questo cambio prende forma."

## Evidenze statistiche e dati

### Obiettivo delle evidenze
Le evidenze non devono solo "abbellire" la pagina.

Devono servire a:
- confermare che il problema esiste davvero;
- far percepire il costo della frammentazione;
- rendere piu razionale e credibile la soluzione;
- sostenere la mission con dati esterni e non solo con opinioni.

### Dove usarle
- Non come apertura principale della hero.
- Si come supporto immediatamente sotto la mission.
- Si dentro una sezione "Perche questo problema conta".
- Si come proof layer breve, leggibile e molto selettivo.

### Evidenze candidate forti

#### 1. Digitalizzazione di base non equivale a workflow governato
Rilevanza:
- utile per dire che il problema non e raro;
- rafforza il contesto di mercato.

Dato candidato:
- Eurostat 2025: nel 2024 il 73% delle PMI UE ha raggiunto almeno un livello base di intensita digitale.

Uso possibile:
- "Avere strumenti digitali non significa avere un workflow governato."
- "Molte PMI hanno software, ma non ancora un flusso unico affidabile."

Fonte:
- Eurostat, Digitalisation in Europe 2025
- https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025

#### 2. Il lavoro viene assorbito da coordinamento e work about work
Rilevanza:
- utile per dire che il problema non e solo tecnico ma organizzativo;
- collega bene rincorse, follow-up, verifiche e ricostruzioni.

Dato candidato:
- Asana Anatomy of Work: circa il 58% del tempo di lavoro e assorbito da "work about work".

Uso possibile:
- "Quando manca uno stato condiviso, il lavoro si sposta dal fare al coordinare."
- "Il problema non e solo il file: e tutto il lavoro invisibile che nasce intorno."

Fonte:
- Asana, Anatomy of Work
- https://asana.com/id/resources/pandemic-paradigm-shift

#### 3. Molto tempo si perde a cercare informazioni
Rilevanza:
- forte per sostenere il messaggio di file sparsi, canali separati e dati difficili da ricostruire;
- collega la frammentazione a un costo operativo diretto.

Dato candidato:
- McKinsey: i dipendenti spendono in media circa 1,8 ore al giorno cercando e raccogliendo informazioni.

Uso possibile:
- "Se il dato vive in troppi posti, il team non lavora sul processo: lavora per ritrovare il processo."
- "La frammentazione costa tempo ogni giorno, prima ancora di costare errori."

Nota:
- dato utile come candidato di brainstorming, ma da verificare bene in fonte primaria prima di metterlo live.

#### 4. Non basta aggiungere strumenti
Rilevanza:
- aiuta a sostenere la mission: non basta digitalizzare un pezzo, bisogna governare il workflow.

Uso possibile:
- "Il vero salto non e passare dalla carta al software. E passare da strumenti isolati a un flusso coordinato."

Fonte:
- Eurostat, Digitalisation in Europe 2024 e 2025
- https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2024
- https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025

### Criteri per scegliere i dati da mostrare
- Devono essere facili da capire in 5 secondi.
- Devono sostenere la mission, non distrarre.
- Devono parlare di frammentazione, coordinamento, inefficienza o maturita digitale.
- Meglio 2-3 evidenze forti che 6 numeri deboli.

### Set minimo consigliato
- 1 dato di contesto mercato: digitalizzazione PMI.
- 1 dato di inefficienza operativa: work about work.
- 1 dato di frammentazione informativa: tempo perso a cercare informazioni.

### Selezione consigliata per la pagina

#### Dato 1: maturita digitale PMI
- 73% delle PMI UE ha raggiunto almeno un livello base di intensita digitale nel 2024.
- Ma la maggior parte resta su livelli low o very low: 40% low, 27% very low.

Perche tenerlo:
- spiega bene che "avere strumenti" non significa "avere un workflow governato";
- sostiene il messaggio che il problema non e l'assenza di software, ma la frammentazione del flusso.

Fonte:
- Eurostat, Digitalisation in Europe 2025
- https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025

#### Dato 2: costo organizzativo del coordinamento
- Circa il 58% del tempo di lavoro viene assorbito da "work about work" secondo Asana.

Perche tenerlo:
- collega bene rincorse, follow-up, approvazioni sparse e ricostruzioni finali;
- fa leva sul fatto che il problema e di organizzazione del lavoro, non solo di tool.

Fonte:
- Asana, Anatomy of Work
- https://asana.com/id/resources/pandemic-paradigm-shift

#### Dato 3: tempo perso nella ricerca di informazioni
- I knowledge worker spendono in media circa 5 ore a settimana, cioe circa il 12% del tempo, per cercare informazioni.

Perche tenerlo:
- e piu difendibile del dato "1,8 ore al giorno";
- sostiene bene il messaggio di file, canali e dati sparsi;
- parla direttamente del costo operativo della frammentazione informativa.

Fonte:
- McKinsey / High Tech Practice, impact of search in enterprises
- https://www.mckinsey.com/~/media/mckinsey/dotcom/client_service/high%20tech/pdfs/impact_of_internet_technologies_search_final2.ashx

### Dati da NON mettere in prima selezione
- Numeri troppo derivati o non facilmente verificabili.
- Dati spettacolari ma poco coerenti con il problema della pagina.
- Dati troppo orientati a AI adoption e non al problema di workflow, coordinamento e riconciliazione.

### Rischi da evitare
- Inserire troppi dati nella hero.
- Usare dati impressionanti ma scollegati dal problema reale della pagina.
- Usare numeri non verificati o troppo derivati.
- Far percepire la pagina come un report, invece che come una business landing.

### Uso consigliato nella pagina
- Hero: mission.
- Subito dopo: proof layer breve con 2-3 evidenze di mercato/statistiche sul problema.
- Poi: sezione "come questo approccio nel concreto l abbiamo gia provato".
- Dentro questa sezione: use case concreto HR/Admin + prima/dopo + demo.
- Poi: demo della soluzione.

### Formula delle 3 card del proof layer
- Card 1: "Molte PMI hanno strumenti, ma non ancora un flusso governato."
- Card 2: "Il costo invisibile e il lavoro di coordinamento."
- Card 3: "Quando il dato e sparso, il team perde tempo prima ancora di sbagliare."

## Sequenza narrativa desiderata

### 1. Hero
Deve aprire con:
- mission;
- problema generale;
- promessa operativa.

Non deve aprire con:
- dettagli di feature;
- troppi numeri;
- un caso d'uso gia troppo specifico.

### 2. Highlight del problema con evidenze
Questa e la prima sezione dopo la hero.

Obiettivo:
- far capire che il problema non e episodico ma sistemico;
- mostrare che frammentazione, coordinamento e inefficienza sono problemi reali e diffusi;
- creare leva razionale per la soluzione.

Contenuto atteso:
- 2-3 evidenze statistiche molto forti;
- micro-copy che lega i dati al problema operativo;
- tono da business insight, non da report lungo.

Messaggio implicito:
- "non e solo un tuo problema";
- "e un problema comune e costoso";
- "quindi vale la pena intervenire in modo strutturale".

### 3. Prova concreta dell'approccio
Subito dopo le evidenze ci deve essere una sezione del tipo:
"Come questo approccio nel concreto l abbiamo gia provato".

Obiettivo:
- trasformare la credibilita teorica in credibilita operativa;
- mostrare che il metodo non e solo concettuale;
- far vedere una declinazione reale e gia ragionata della soluzione.

Contenuto atteso:
- use case concreto HR/Admin;
- situazione prima;
- situazione dopo;
- demo del flusso.

Messaggio implicito:
- "non stiamo solo descrivendo un problema";
- "abbiamo gia tradotto questo approccio in un workflow concreto".

### Formula narrativa completa
- Hero: ecco la mission.
- Proof layer: ecco perche il problema conta davvero.
- Use case: ecco dove lo abbiamo gia affrontato nel concreto.
- Prima/dopo: ecco il cambiamento.
- Demo: ecco come prende forma operativamente.
- CTA: ecco il prossimo passo per il tuo caso.

## Sezione "come l abbiamo gia provato"

### Ruolo della sezione
Questa sezione non deve sembrare un portfolio generico.

Deve funzionare come:
- prova del metodo;
- ponte tra insight e soluzione;
- dimostrazione che il framework e applicabile nella realta.

### Componenti ideali della sezione
- Titolo orientato alla prova concreta.
- Breve introduzione che spiega il contesto del caso.
- As-is chiaro.
- To-be chiaro.
- Demo o schermate che mostrano il flusso.

### Direzione di copy possibile
- "Come questo approccio l abbiamo gia tradotto in un workflow concreto."
- "Un esempio reale: da ore, assenze e approvazioni sparse a un flusso unico."
- "Prima processi frammentati, poi un sistema unico con ruoli, stati e controllo finale."

### Nome sezione consigliato
Opzione preferita:
- "Come questo approccio lo abbiamo gia tradotto in un workflow concreto"

Alternative valide:
- "Un esempio concreto di questo approccio"
- "Dalla teoria al flusso reale"
- "Come questo metodo prende forma nel concreto"

### Sequenza interna consigliata
- Intro breve: "partiamo da un caso reale gia modellato".
- Prima: as-is del processo HR/Admin.
- Dopo: to-be con sistema unico.
- Demo: schermate che mostrano come funziona.

### Split consigliato delle sezioni attuali
- Sezione 1 dopo hero:
  "Perche questo problema conta"
  Contenuto: 3 evidenze statistiche / di mercato.

- Sezione 2:
  "Come questo approccio lo abbiamo gia tradotto in un workflow concreto"
  Contenuto: introduzione al caso d'uso.

- Sezione 3:
  "Prima / Dopo"
  Contenuto: as-is infographic + confronto before/after.

- Sezione 4:
  "Demo del workflow"
  Contenuto: carousel/schermate + step del flusso.

### Obiettivo di questo split
- evitare che as-is, to-be e demo sembrino blocchi separati senza una tesi unica;
- trasformarli in una dimostrazione progressiva del metodo;
- far leggere tutto come "approccio gia provato" invece che come semplice raccolta di sezioni.

### Cosa evitare
- Tono autoreferenziale o troppo celebrativo.
- Uso case troppo lungo o troppo tecnico troppo presto.
- Demo scollegata dal prima/dopo.
- Sezione che sembra una gallery di schermate senza una tesi chiara.

## Decisione su genericita della hero

### Conclusione
Ha senso stare piu generici nella hero, ma non generici in modo astratto.

Approccio corretto:
- Hero: mission + problema ampio + promessa operativa.
- Primo scroll: caso concreto + schermate + as-is/to-be.
- CTA: collegata al processo reale del cliente.
- La pagina deve accompagnare l'utente dal concetto generale alla sua traduzione pratica.

### Perche funziona
- Allarga il posizionamento: non vendiamo solo inserimento ore, ma centralizzazione di workflow operativi.
- Evita l'effetto "tool verticale troppo stretto".
- Mantiene credibilita perche il caso specifico compare subito dopo.
- Consente di usare il caso HR/Admin come esempio forte, non come limite del posizionamento.
- Aiuta l'utente a riconoscersi prima nel problema generale e poi nel caso concreto.

### Rischio da evitare
Se la hero diventa troppo generica, la pagina scivola nel linguaggio da consulenza vaga.

Quindi:
- no messaggi tipo "digitalizziamo i tuoi processi";
- si messaggi tipo "riduciamo passaggi manuali, errori di riconciliazione e rincorse operative".

## Tesi narrativa consigliata

### Formula semplice
- Prima: dati dispersi + passaggi manuali + approvazioni informali.
- Effetto: riconciliazioni fragili, errori frequenti, chiusure lente.
- Dopo: workflow unico con stati, ruoli e storico.
- Risultato: riconciliazioni affidabili, meno manualita, tempi sotto controllo.

### Frase guida (hero)
"Se oggi chiudi ore, assenze e paghe tra chat, mail ed Excel, il problema non e il file: e la riconciliazione manuale. Con un workflow unico centralizzi i dati, automatizzi i passaggi critici e riduci gli errori."

### Nuova direzione consigliata per la hero
La hero deve parlare di:
- mission,
- processi frammentati,
- dati dispersi,
- manualita amministrativa,
- riconciliazioni inaffidabili.

Il caso "ore / assenze / paghe" deve entrare:
- come esempio reale nel blocco subito sotto,
- nell'as-is infographic,
- nella demo,
- nella FAQ/CTA.

Sequenza ideale:
- 1. L'utente si riconosce nel problema generale.
- 2. Subito dopo vede uno use case concreto che rende la promessa credibile.
- 3. La demo mostra come la soluzione prende forma operativamente.

### Hero: struttura consigliata
- Headline: mission + problema trasversale di frammentazione e riconciliazione.
- Subheadline: sistema unico che centralizza, traccia e semplifica.
- Trust signals: meno passaggi manuali, stati tracciati, dati allineati.
- Priority card o proof card: esempio concreto HR/Admin.

Traduzione pratica:
- Hero = "questa e la mission e questo e il problema che risolve".
- Blocco successivo = "ecco come questo problema si manifesta davvero in un caso reale".
- Demo = "ecco come lo risolvi operativamente".

## As-is vs To-be (versione focalizzata)

### As-is (oggi)
- 3 ruoli su strumenti separati (dipendente, manager, HR admin).
- Ore su app diverse, approvazioni fuori sistema, assenze tra WhatsApp/email/Excel.
- Merge manuali tra export multipli e file dipendenti.
- Payroll generato da ulteriore foglio.
- Nessuna "fonte unica di verita".

Conseguenze:
- Riconciliazioni spesso sbagliate.
- Errori scoperti tardi (a fine mese).
- Tempi lunghi di chiusura.
- Dipendenza da persone chiave che "sanno dove sono i file".

### To-be (domani)
- Un unico sistema con viste per ruolo (operatore, manager, admin).
- Stati espliciti per ogni passaggio (inserito, in approvazione, corretto, consolidato).
- Regole di approvazione tracciate e storico consultabile.
- Export finale da dati gia verificati.

Benefici attesi:
- Riconciliazioni corrette e ripetibili.
- Riduzione di copia/incolla e rework amministrativo.
- Riduzione tempi di approvazione e chiusura.
- Maggiore controllo operativo quotidiano.

## Blocchi di contenuto da rinforzare

### 1) Hero
Obiettivo: rendere esplicito il passaggio da "caos" a "riconciliazione affidabile".

Proposta asse:
- Headline: problema di riconciliazione.
- Subheadline: soluzione in un sistema unico.
- Proof bullets: "stato tracciato", "dati centralizzati", "export affidabile".

Nota strategica:
- Tenere la hero piu ampia del solo inserimento ore.
- Evitare pero headline troppo astratte o istituzionali.
- Il livello giusto e: abbastanza ampia da coprire piu workflow, abbastanza concreta da far percepire il problema subito.
- Il compito della hero non e chiudere tutta la spiegazione, ma aprire il problema e portare naturalmente allo use case.

Esempi di direzione corretta:
- "Quando dati, richieste e approvazioni vivono tra strumenti diversi, il problema non e il lavoro: e la riconciliazione."
- "Centralizza i passaggi critici del processo e riduci errori, rincorse e chiusure lente."

### 2) Pain points
Inserire una card esplicita su:
- "Riconciliazioni sbagliate": numeri non allineati tra ore, assenze, straordinari, paghe.

### 3) As-is/To-be
Rendere il delta piu "misurabile" con 3 indicatori semplici:
- numero di canali usati,
- numero di passaggi manuali,
- numero di riconciliazioni a fine mese.

### 4) Demo
Narrativa demo consigliata:
- "Dove nasce il dato" -> "Chi approva" -> "Chi controlla" -> "Cosa viene esportato".

### 5) FAQ
Aggiungere FAQ su:
- "Come gestite i casi eccezione?"
- "Come evitiamo doppio lavoro nel passaggio iniziale?"
- "Come misuriamo se la riconciliazione migliora davvero?"

## Ipotesi di copy sintetico (test veloci)

### Variante A (diretta)
"Meno Excel da rincorrere. Piu controllo su ore, assenze e paghe."

### Variante B (problema -> soluzione)
"Se le riconciliazioni si rompono ogni mese, non ti serve un altro file: ti serve un workflow unico."

### Variante C (outcome)
"Da chat e fogli sparsi a un processo tracciato: meno errori, meno manualita, chiusure piu veloci."

## KPI da monitorare (per validare il messaggio)
- Tempo medio di chiusura mensile (prima/dopo).
- Numero riconciliazioni manuali per ciclo.
- Numero errori corretti post-chiusura.
- Tempo medio approvazione manager.
- Ticket/chiamate interne per "dove trovo il dato giusto?".

## Direzione operativa consigliata
- Mantenere l'impianto attuale della pagina.
- Mantenere hero generica sul problema e non iper-legata al solo caso inserimento ore.
- Usare il blocco immediatamente successivo per far atterrare l'utente su uno use case concreto.
- Allineare la UX/UI al modello di chiarezza del `role-fit-audit`: meno densita, piu gerarchia.
- Rinforzare in alto il concetto "riconciliazione affidabile".
- Ridurre testo ridondante e aumentare frasi outcome-oriented.
- Lasciare la demo come ponte tra promessa e prova concreta.
- Agganciare CTA a un risultato concreto: "ti mostro dove oggi perdi allineamento e come lo chiudi".

## Log decisioni pagina /business

### 2026-03-21
- Confermato che la hero deve stare su un livello piu generale del singolo caso "inserimento ore".
- Confermato che lo specifico della soluzione deve emergere subito sotto la hero, non essere nascosto.
- Confermato che la progressione narrativa desiderata e: messaggio generale -> use case concreto -> demo della soluzione.
- Aggiunta analisi UX/UI: la pagina deve convergere verso un linguaggio piu minimal, chiaro e guidato, in linea con stAItuned e con la chiarezza del `role-fit-audit`.
- Aggiunta valutazione sulla valorizzazione dei concetti chiave: i messaggi sono giusti, ma alcuni non hanno ancora sufficiente enfasi visiva.
- Aggiunta decisione sui componenti interattivi: si, ma solo come supporto alla comprensione; pochi, semplici e coerenti con una landing business lineare.
- Aggiunta decisione "mission first": la pagina deve aprire chiarendo la mission prima delle feature o dello use case.
- Aggiunta traccia sulle evidenze statistiche: usare 2-3 dati forti come proof layer sotto la mission, non dentro la hero come elemento dominante.
- Il caso HR/Admin su ore, assenze, approvazioni e paghe resta il caso dimostrativo principale della pagina.
- Questo file diventa il punto di raccolta per analisi, decisioni di messaggio e possibili iterazioni della pagina `/business`.
