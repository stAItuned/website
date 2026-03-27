import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

type ComplianceDocCategory =
  | 'gdpr-shared-baseline'
  | 'gdpr-repo-governance'
  | 'gdpr-operations'
  | 'gdpr-evidence'
  | 'ai-act-related';

type ComplianceDocSource = 'shared-baseline' | 'repo';

interface ComplianceDocDefinition {
  id: string;
  title: string;
  description: string;
  focus: string;
  objective: string;
  path: string;
  category: ComplianceDocCategory;
  source: ComplianceDocSource;
}

export interface ComplianceDocSummary {
  id: string;
  title: string;
  description: string;
  focus: string;
  objective: string;
  path: string;
  category: ComplianceDocCategory;
  source: ComplianceDocSource;
  updatedAt: string;
}

export interface ComplianceDocDetail extends ComplianceDocSummary {
  content: string;
}

const SHARED_GDPR_DOCS_ROOT = '/Users/moltisantid/Personal/repo_template/docs/04-privacy-gdpr';

const COMPLIANCE_DOCS: ComplianceDocDefinition[] = [
  {
    id: 'gdpr-docs-pack-overview',
    title: 'GDPR Docs Pack Overview',
    description: 'Indice del pacchetto baseline condiviso usato come sorgente normativa-operativa.',
    focus: 'Perimetro della baseline GDPR condivisa e artefatti previsti.',
    objective: 'Orientare la review verso il set completo di documenti richiesti prima di guardare gli artefatti repo-specifici.',
    path: `${SHARED_GDPR_DOCS_ROOT}/README.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'privacy-baseline',
    title: 'Privacy Baseline',
    description: 'Principi minimi di privacy by design, minimizzazione e retention.',
    focus: 'Default di progettazione privacy, trigger di review e artefatti companion.',
    objective: 'Definire il baseline minimo che ogni change GDPR deve rispettare.',
    path: `${SHARED_GDPR_DOCS_ROOT}/privacy-baseline.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'gdpr-control-matrix',
    title: 'GDPR Control Matrix',
    description: 'Matrice di controllo interna per applicabilita, evidenze richieste ed escalation.',
    focus: 'Controlli GDPR da coprire per scope, ruoli, basi giuridiche, diritti, retention e trasferimenti.',
    objective: 'Valutare se un progetto o una modifica coprono i controlli obbligatori senza lasciare red flag aperte.',
    path: `${SHARED_GDPR_DOCS_ROOT}/gdpr-control-matrix.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'gdpr-reference-guide',
    title: 'GDPR Reference Guide',
    description: 'Guida interna ai concetti GDPR rilevanti per prodotto e engineering.',
    focus: 'Definizioni, principi, ruoli, diritti e trigger di escalation.',
    objective: 'Allineare le review tecniche a un quadro comune prima di decidere posture o remediation.',
    path: `${SHARED_GDPR_DOCS_ROOT}/gdpr-reference-guide.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'gdpr-project-applicability-template',
    title: 'GDPR Project Applicability Template',
    description: 'Template per valutare se e come il GDPR si applica a un progetto.',
    focus: 'Applicabilita del GDPR, contesto del progetto e assunzioni di ruolo.',
    objective: 'Rendere esplicito se un progetto/processo ricade davvero nel perimetro GDPR e con quale postura.',
    path: `${SHARED_GDPR_DOCS_ROOT}/gdpr-project-applicability-template.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'data-inventory-template',
    title: 'Data Inventory Template',
    description: 'Template baseline per censire attivita, categorie dati e sistemi.',
    focus: 'Inventario dei trattamenti e mappatura delle categorie di dati personali.',
    objective: 'Garantire che ogni processing activity abbia una scheda minima verificabile.',
    path: `${SHARED_GDPR_DOCS_ROOT}/data-inventory.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'lawful-basis-matrix-template',
    title: 'Lawful Basis Matrix',
    description: 'Template per mappare basi giuridiche e rationale per ciascun trattamento.',
    focus: 'Base giuridica, finalita, aspettative dell\'interessato e dipendenza dal consenso.',
    objective: 'Evitare trattamenti o disclosure con lawful basis implicita o non dimostrabile.',
    path: `${SHARED_GDPR_DOCS_ROOT}/lawful-basis-matrix.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'retention-policy-template',
    title: 'Retention Policy Template',
    description: 'Template baseline per TTL, trigger di cancellazione e owner dei dati.',
    focus: 'Finestra di conservazione, trigger di purge e metodo di eliminazione.',
    objective: 'Standardizzare la retention per dataset e rendere verificabile il lifecycle dei record.',
    path: `${SHARED_GDPR_DOCS_ROOT}/retention-policy.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'data-subject-rights-template',
    title: 'Data Subject Rights Template',
    description: 'Template per modellare access, export, rectification e deletion workflows.',
    focus: 'Diritti dell\'interessato, intake, verifiche, SLA e audit trail.',
    objective: 'Rendere operativi i percorsi DSAR e verificare dove servono step manuali.',
    path: `${SHARED_GDPR_DOCS_ROOT}/data-subject-rights.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'end-of-contract-data-handling-template',
    title: 'End-of-Contract Data Handling',
    description: 'Template per return/delete e residual retention a fine rapporto.',
    focus: 'Offboarding, delete/return paths, backup e follow-up verso subprocessors.',
    objective: 'Evitare che la chiusura di un rapporto o servizio lasci dataset senza ownership di deletion.',
    path: `${SHARED_GDPR_DOCS_ROOT}/end-of-contract-data-handling.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'subprocessors-template',
    title: 'Subprocessors Register Template',
    description: 'Template baseline per tracciare vendor, regioni, DPA e security review.',
    focus: 'Elenco subprocessors, categorie dati trattate e implicazioni di trasferimento.',
    objective: 'Centralizzare l\'accountability sui vendor che processano dati personali.',
    path: `${SHARED_GDPR_DOCS_ROOT}/subprocessors.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'transfer-assessment-template',
    title: 'Transfer Assessment Template',
    description: 'Template baseline per analizzare trasferimenti extra-EEA e accesso in chiaro.',
    focus: 'Origine/destinazione dei dati, meccanismo di trasferimento e controlli supplementari.',
    objective: 'Valutare se i trasferimenti verso vendor esterni sono documentati e difendibili.',
    path: `${SHARED_GDPR_DOCS_ROOT}/transfer-assessment.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'dpia-template',
    title: 'DPIA Template',
    description: 'Template baseline per valutare trattamenti ad alto rischio.',
    focus: 'Criteri di rischio elevato, misure mitigative e decisione di escalation.',
    objective: 'Supportare screening o DPIA formali quando il trattamento lo richiede.',
    path: `${SHARED_GDPR_DOCS_ROOT}/dpia-template.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'dpa-checklist',
    title: 'DPA Checklist',
    description: 'Checklist baseline per relazioni controller-processor e contratti enterprise.',
    focus: 'Ruoli, istruzioni, subprocessors, trasferimenti, breach e delete/return expectations.',
    objective: 'Verificare se la governance contrattuale con clienti enterprise e processor chain e sufficiente.',
    path: `${SHARED_GDPR_DOCS_ROOT}/dpa-checklist.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'ropa-processor-template',
    title: 'Processor RoPA Template',
    description: 'Template baseline per record of processing activities in ruolo processor.',
    focus: 'Attivita trattate per conto terzi, categorie dati, recipienti e TOMs.',
    objective: 'Esplicitare la postura processor quando il prodotto opera per conto di clienti o tenant.',
    path: `${SHARED_GDPR_DOCS_ROOT}/ropa-processor.md`,
    category: 'gdpr-shared-baseline',
    source: 'shared-baseline',
  },
  {
    id: 'gdpr-review-source-stack',
    title: 'GDPR Review Source Stack',
    description: 'Gerarchia formale delle fonti da consultare in ogni review GDPR.',
    focus: 'Ordine di consultazione tra baseline condivisa, docs repo-driven e codice.',
    objective: 'Impedire review deboli basate solo su checklist locali o su una singola pagina legale.',
    path: 'docs/gdpr-review-source-stack.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'gdpr-management-review-2026-03-26',
    title: 'GDPR Management Review 2026-03-26',
    description: 'Analisi end-to-end dello stato GDPR del repo con gap e priorita operative.',
    focus: 'Valutazione complessiva di governance, accountability, diritti, retention e vendor posture.',
    objective: 'Fornire una vista sintetica ma completa dello stato attuale e delle lacune residue.',
    path: 'docs/gdpr-management-review-2026-03-26.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'gdpr-management-execution-plan-2026-03-26',
    title: 'GDPR Management Execution Plan 2026-03-26',
    description: 'Piano operativo per chiudere i gap emersi dalla management review GDPR.',
    focus: 'Tracking workstream-by-workstream delle modifiche da fare, dello stato e delle evidenze.',
    objective: 'Tenere un piano aggiornato passo passo fino alla chiusura dei gap documentali e di accountability.',
    path: 'docs/gdpr-management-execution-plan-2026-03-26.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'privacy-lawful-basis-matrix',
    title: 'Privacy Lawful Basis Matrix',
    description: 'Matrice repo-specifica purpose-level delle basi giuridiche per i principali processing activity.',
    focus: 'Finalita distinte, base giuridica primaria, dipendenza dal consenso e linked artifacts per ogni flow.',
    objective: 'Rendere auditabile in un singolo documento la lawful basis dei trattamenti senza formule ibride a livello di flow.',
    path: 'docs/privacy-lawful-basis-matrix.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'privacy-subprocessors-register',
    title: 'Privacy Subprocessors Register',
    description: 'Registro repo-specifico dei vendor e subprocessors con ruolo, transfer implication e DPA status.',
    focus: 'Vendor reali del repo, categorie dati coinvolte, regioni, owner e stato documentale.',
    objective: 'Centralizzare l accountability vendor prima del successivo workstream sulla transfer assessment.',
    path: 'docs/privacy-subprocessors-register.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'privacy-transfer-assessment',
    title: 'Privacy Transfer Assessment',
    description: 'Assessment scenario-based dei trasferimenti, dell accesso in chiaro e del rischio residuo.',
    focus: 'Scenari reali di trasferimento per hosting, auth, analytics, AI, email, notifications, scheduling, payments e static assets.',
    objective: 'Rendere espliciti per scenario i `TBD`, i controlli supplementari e le escalation richieste senza duplicare il registro vendor.',
    path: 'docs/privacy-transfer-assessment.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'privacy-end-of-contract-data-handling',
    title: 'Privacy End-Of-Contract Data Handling',
    description: 'Raccordo repo-specifico tra account deletion, retention expiry, channel offboarding e legal exception.',
    focus: 'Trigger di chiusura, delete path, residual retention, backup posture e follow-up verso subprocessors.',
    objective: 'Rendere verificabile cosa succede ai dati quando termina l account, il purpose o un rapporto operativo senza lasciare zone grigie sul lifecycle finale.',
    path: 'docs/privacy-end-of-contract-data-handling.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'privacy-dpia-index',
    title: 'Privacy DPIA Index',
    description: 'Indice repo-specifico degli screening DPIA attivi e dei trigger di riapertura per flow.',
    focus: 'Flow coperti, stato screening, source artifact e condizioni che richiedono riapertura o nuova valutazione.',
    objective: 'Evitare che gli screening DPIA restino dispersi e rendere auditabile quando un flow deve essere rivalutato.',
    path: 'docs/privacy-dpia-index.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'privacy-breach-escalation',
    title: 'Privacy Breach Escalation Runbook',
    description: 'Runbook repo-specifico per incidenti privacy e breach candidate nel perimetro GDPR.',
    focus: 'Trigger di escalation, owner, incident record minimo, containment e decision path privacy/legal.',
    objective: 'Evitare che un incidente con impatto sui dati personali resti un problema tecnico locale senza triage e accountability GDPR.',
    path: 'docs/privacy-breach-escalation.md',
    category: 'gdpr-operations',
    source: 'repo',
  },
  {
    id: 'firestore-default-legacy-decommission-plan',
    title: 'Firestore Legacy Decommission Plan',
    description: 'Piano operativo per audit, export finale e decommission del Firestore `(default)` legacy.',
    focus: 'Freeze, legacy audit, export verificato, go/no-go e finestra distruttiva del database US non piu usato dal main runtime.',
    objective: 'Evitare che il datastore legacy in `NAM5` venga lasciato indefinitamente aperto o cancellato senza rollback ed evidenza operativa.',
    path: 'docs/firestore-default-legacy-decommission-plan.md',
    category: 'gdpr-operations',
    source: 'repo',
  },
  {
    id: 'gdpr-feature-checklist',
    title: 'GDPR Feature Checklist',
    description: 'Gate operativo GDPR con review dei workstream e decisioni di approvazione.',
    focus: 'Review change-by-change, con blocchi, mitigazioni e decisione finale del gate.',
    objective: 'Far fallire in modo esplicito le modifiche privacy-related che non hanno artefatti ed evidenze sufficienti.',
    path: 'docs/gdpr-feature-checklist.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'gdpr-audit-2026-03-22',
    title: 'GDPR Audit Webapp 2026-03-22',
    description: 'Audit storico baseline del repository web con ranking dei rilievi.',
    focus: 'Fotografia iniziale dei rischi GDPR della webapp e dei principali disallineamenti codice/policy.',
    objective: 'Mantenere la baseline storica dei rilievi da cui sono partiti i workstream di remediation.',
    path: 'docs/gdpr-audit-webapp-2026-03-22.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'gdpr-remediation-plan',
    title: 'GDPR Remediation Plan',
    description: 'Piano operativo per workstream, esecuzioni e attivita residue.',
    focus: 'Roadmap di remediation, stato avanzamento e pacchetti di rollout.',
    objective: 'Tenere allineati implementazione, runbook e decisioni operative sui gap GDPR.',
    path: 'plan.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'privacy-processing-inventory',
    title: 'Privacy Processing Inventory',
    description: 'Registro trattamenti repo-driven con mapping flow/vendor/retention/notice.',
    focus: 'Flussi reali, categorie dati, vendor, retention e layered notices.',
    objective: 'Allineare codice, policy e disclosure con un inventario operativo verificabile.',
    path: 'docs/privacy-processing-inventory.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'compliance-changelog',
    title: 'Compliance Changelog',
    description: 'Registro temporale delle wave GDPR e delle modifiche di accountability.',
    focus: 'Cronologia delle remediation, dei gate e degli aggiornamenti di compliance.',
    objective: 'Conservare evidenza sintetica e auditabile di cosa e cambiato nel tempo.',
    path: 'docs/compliance-changelog.md',
    category: 'gdpr-repo-governance',
    source: 'repo',
  },
  {
    id: 'privacy-retention-schedule',
    title: 'Privacy Retention Schedule',
    description: 'Schedule centrale dei TTL dataset e delle eccezioni legali.',
    focus: 'Retention policy applicata ai dataset reali del repo.',
    objective: 'Tradurre il template di retention in un contratto operativo eseguibile da codice e runbook.',
    path: 'docs/privacy-retention-schedule.md',
    category: 'gdpr-operations',
    source: 'repo',
  },
  {
    id: 'dsar-account-deletion-runbook',
    title: 'DSAR and Account Deletion Matrix',
    description: 'Matrice operativa tra self-service deletion, export e assisted DSAR.',
    focus: 'Coverage reale dei diritti per dataset e distinzione tra automatico e assistito.',
    objective: 'Rendere esplicito cosa succede quando un utente chiede deletion o export.',
    path: 'docs/runbooks/dsar-account-deletion.md',
    category: 'gdpr-operations',
    source: 'repo',
  },
  {
    id: 'retention-lifecycle-runbook',
    title: 'Retention Lifecycle Runbook',
    description: 'Procedura operativa per dry-run/apply retention e audit evidence.',
    focus: 'Esecuzione tecnica del purge lifecycle e controlli prima/dopo il job.',
    objective: 'Trasformare la retention policy in una procedura ripetibile e verificabile.',
    path: 'docs/runbooks/retention-lifecycle.md',
    category: 'gdpr-operations',
    source: 'repo',
  },
  {
    id: 'gdpr-ws1-ws7-test-report',
    title: 'GDPR WS1-WS7 Test Report (2026-03-23)',
    description: 'Evidenze di test per la wave GDPR WS1-WS7.',
    focus: 'Verifiche tecniche eseguite su route, lint e smoke package GDPR.',
    objective: 'Collegare remediation e controlli privacy a evidenze tecniche ripetibili.',
    path: 'docs/runbooks/gdpr-ws1-ws7-test-report-2026-03-23.md',
    category: 'gdpr-evidence',
    source: 'repo',
  },
  {
    id: 'dpia-role-fit-audit',
    title: 'DPIA Screening - Role Fit Audit',
    description: 'Screening DPIA dedicato al flow Role Fit Audit.',
    focus: 'Valutazione del trigger DPIA per un assessment career-oriented con output AI personalizzato.',
    objective: 'Dimostrare che il flusso ad impatto piu sensibile ha almeno uno screening rischio dedicato.',
    path: 'docs/dpia-screening-role-fit-audit.md',
    category: 'gdpr-evidence',
    source: 'repo',
  },
  {
    id: 'ws7-smoke-test-test-env',
    title: 'WS7 Smoke Test (Test Env, 2026-03-23)',
    description: 'Risultati smoke test su ambiente test per i workflow WS7.',
    focus: 'Comportamento runtime delle route/privacy flows in ambiente di test.',
    objective: 'Aggiungere evidenza operativa oltre al test report unit/integration.',
    path: 'docs/runbooks/ws7-smoke-test-test-env-2026-03-23.md',
    category: 'gdpr-evidence',
    source: 'repo',
  },
  {
    id: 'ws7e-go-no-go-prod',
    title: 'WS7-E Go/No-Go Production',
    description: 'Gate pre-produzione per chiudere la wave WS7-E.',
    focus: 'Decisione finale di rollout e prerequisiti operativi per la produzione.',
    objective: 'Impedire go-live privacy-sensitive senza sign-off operativo esplicito.',
    path: 'docs/runbooks/ws7e-go-no-go-prod.md',
    category: 'gdpr-evidence',
    source: 'repo',
  },
  {
    id: 'ai-act-feature-checklist',
    title: 'AI Act Feature Checklist',
    description: 'Gate AI Act mantenuto in hub per i flussi che intersecano anche dati personali.',
    focus: 'Classificazione AI, transparency, human oversight e dipendenze modello.',
    objective: 'Mostrare i documenti AI correlati quando il trattamento GDPR tocca anche sistemi AI.',
    path: 'docs/ai-act-feature-checklist.md',
    category: 'ai-act-related',
    source: 'repo',
  },
  {
    id: 'ai-eu-act-landing-doc',
    title: 'AI EU Act Landing Spec',
    description: 'Spec del flow AI EU Act lead, mantenuta come artefatto correlato GDPR/AI.',
    focus: 'Lead flow, consensi, token lifecycle e disclosure AI correlate.',
    objective: 'Fornire contesto funzionale ai documenti GDPR quando il trattamento riguarda anche claim o risorse AI.',
    path: 'docs/ai-eu-act-landing.md',
    category: 'ai-act-related',
    source: 'repo',
  },
];

function resolveDocPath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}

async function getSummaryFromDefinition(definition: ComplianceDocDefinition): Promise<ComplianceDocSummary> {
  const absolutePath = resolveDocPath(definition.path);
  const fileStat = await stat(absolutePath);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    focus: definition.focus,
    objective: definition.objective,
    path: definition.path,
    category: definition.category,
    source: definition.source,
    updatedAt: fileStat.mtime.toISOString(),
  };
}

export async function listComplianceDocs(): Promise<ComplianceDocSummary[]> {
  const summaries = await Promise.all(COMPLIANCE_DOCS.map((doc) => getSummaryFromDefinition(doc)));
  return summaries;
}

export async function getComplianceDocById(docId: string): Promise<ComplianceDocDetail | null> {
  const definition = COMPLIANCE_DOCS.find((doc) => doc.id === docId);
  if (!definition) return null;

  const absolutePath = resolveDocPath(definition.path);
  const [content, fileStat] = await Promise.all([
    readFile(absolutePath, 'utf8'),
    stat(absolutePath),
  ]);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    focus: definition.focus,
    objective: definition.objective,
    path: definition.path,
    category: definition.category,
    source: definition.source,
    updatedAt: fileStat.mtime.toISOString(),
    content,
  };
}
