# Business Landing

## Scopo
Pagina pubblica su `/business` per presentare in modo diretto la capacità di stAItuned di automatizzare processi manuali, centralizzare dati e ridurre il lavoro operativo disperso.

Il focus iniziale è il caso HR/Admin:
- raccolta ore e note operative;
- approvazioni del manager;
- controllo e verifica finale da parte dell'admin;
- export verso paghe, reporting o contabilità.

## Architettura
- Route: `app/(public)/business/page.tsx`
- Traduzioni: `lib/i18n/business-translations.ts`
- Test parità i18n: `lib/i18n/business-i18n.test.ts`

La pagina è server-rendered e usa query param `?lang=it|en` per mantenere la parità bilingue senza duplicare route separate.
Il selettore lingua è mostrato solo nell'header globale; la hero non contiene controlli duplicati. Il default resta `it`.

## UX States
- `default`: hero business con CTA verso `/demo` e `/meet`
- `starting-point`: confronto visivo tra processo frammentato attuale e workflow centralizzato stAI tuned con sync web/mobile e viste per ruolo
  Il lato problema usa come riferimento esplicito l'esempio `public/assets/business/as-is.md` e il flowchart as-is in `components/business/AsIsInfographic.tsx`; il lato dopo usa il flowchart centralizzato in `components/business/ToBeInfographic.tsx`.
  La testata del confronto è stata compattata: toggle inline al titolo, badge sintetici per evidenziare i punti chiave di ciascun workflow e cue visivo con freccia per guidare la lettura da as-is a to-be.
  Nel diagramma `to-be` il nodo admin centrale è trattato come motore del sistema, con enfasi esplicita su dato unico condiviso, sincronizzazione continua tra ruoli e export letto come conseguenza diretta del flusso invece che come file ricostruito a valle. Una micro-riga anti-caos esplicita quali attriti spariscono: niente copia-incolla tra file, niente passaggi persi in chat/email, niente riallineamenti manuali.
- `evidence`: blocco problema con 3 evidenze esterne e link fonte autorevoli
  La sezione è stata compressa per lettura da colpo d'occhio: titolo netto, sottotitolo breve, 3 card dati asciutte e una sola riga finale che esplicita il costo della frammentazione.
- `workflow`: sezione centrale con confronto prima/dopo, carosello di 5 screenshot (2 operatore, 1 manager/approvatore, 2 admin) e workflow map testuale in 5 step
- `starting-point` e `impact` seguono una regola di scansione rapida: due righe chiave per capire il cambiamento, massimo 3 bullet per leggere il "dopo" e card beneficio con una sola frase operativa ciascuna.
- `bridge-to-other-processes`: blocco ponte che chiarisce che HR/Admin è solo il caso dimostrativo; il valore sta nel pattern di richieste sparse, approvazioni fuori sistema, file duplicati e controllo tardivo, applicabile anche ad altri workflow
- `business-request`: form dedicato inline per richiedere una demo business contestualizzata al processo descritto dall azienda
- `faq`: chiarisce onboarding, scope del pilot e impatto operativo

## Accessibilità e Mobile
- Layout mobile-first con verifiche previste per `xs`, `md`, `xl`
- CTA principali sempre visibili above-the-fold
- Hero compattata con scala tipografica ridotta per evitare oversizing iniziale e migliorare scansione rapida
- Ritmo visivo delle sezioni intenzionale anche in dark mode: alternanza tra superfici neutre, superfici leggermente tinte e blocchi ad alto contrasto per migliorare la separazione percettiva tra i contenuti
- Toggle lingua navigabile via tastiera
- Struttura heading semantica `h1 -> h2 -> h3`
- Carosello workflow con autoplay, swipe touch, frecce e dots navigabili da tastiera
- Le schermate restano leggibili su mobile senza nascondere i 5 step del flusso

## SEO/GEO
- Metadata localizzati `it/en` con canonical e alternates
- JSON-LD per `BreadcrumbList`, `FAQPage` e `Service`
- Copy orientato a intent business con claim concreti e sezioni scansionabili
- Blocco evidenze con fonti esterne esplicite per rafforzare trust e contesto fattuale

## Bilingual Parity
- Tutte le sezioni principali esistono in italiano e inglese con stessa struttura
- La nuova sezione `starting-point` mantiene la stessa struttura in `it/en`: tool frammentati, lane per ruolo e benefici del workflow centralizzato
- La parità minima viene verificata da `lib/i18n/business-i18n.test.ts`
- Eccezione esplicita: gli screenshot workflow sono un set unico IT (`public/assets/business/screens/it`) condiviso anche nella versione EN

## Estensioni Future
- Collegare CTA a un funnel dedicato aziende invece di riusare `/demo` e `/meet`
- Aggiungere prova sociale reale o mini case study quando disponibile
- Valutare una seconda variante verticale oltre HR/Admin se emergono altri casi forti
