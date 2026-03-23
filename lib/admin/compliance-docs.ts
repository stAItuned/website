import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

interface ComplianceDocDefinition {
  id: string;
  title: string;
  description: string;
  relativePath: string;
}

export interface ComplianceDocSummary {
  id: string;
  title: string;
  description: string;
  relativePath: string;
  updatedAt: string;
}

export interface ComplianceDocDetail extends ComplianceDocSummary {
  content: string;
}

const COMPLIANCE_DOCS: ComplianceDocDefinition[] = [
  {
    id: 'gdpr-feature-checklist',
    title: 'GDPR Feature Checklist',
    description: 'Gate operativo GDPR con decisioni, rischi e approvazioni per workstream.',
    relativePath: 'docs/gdpr-feature-checklist.md',
  },
  {
    id: 'dpia-role-fit-audit',
    title: 'DPIA Screening - Role Fit Audit',
    description: 'Screening DPIA interno per Workstream 3 (Strategia A).',
    relativePath: 'docs/dpia-screening-role-fit-audit.md',
  },
  {
    id: 'gdpr-audit-2026-03-22',
    title: 'GDPR Audit Webapp 2026-03-22',
    description: 'Audit GDPR completo baseline con rischi ordinati per severita.',
    relativePath: 'docs/gdpr-audit-webapp-2026-03-22.md',
  },
  {
    id: 'gdpr-remediation-plan',
    title: 'GDPR Remediation Plan',
    description: 'Piano operativo per workstream, stato avanzamento e backlog.',
    relativePath: 'plan.md',
  },
  {
    id: 'privacy-processing-inventory',
    title: 'Privacy Processing Inventory',
    description: 'Inventario trattamenti repo-driven per controllo continuo codice/policy.',
    relativePath: 'docs/privacy-processing-inventory.md',
  },
  {
    id: 'compliance-changelog',
    title: 'Compliance Changelog',
    description: 'Registro sintetico degli aggiornamenti GDPR/compliance nel tempo.',
    relativePath: 'docs/compliance-changelog.md',
  },
];

function resolveWorkspacePath(relativePath: string): string {
  return path.resolve(process.cwd(), relativePath);
}

async function getSummaryFromDefinition(definition: ComplianceDocDefinition): Promise<ComplianceDocSummary> {
  const absolutePath = resolveWorkspacePath(definition.relativePath);
  const fileStat = await stat(absolutePath);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    relativePath: definition.relativePath,
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

  const absolutePath = resolveWorkspacePath(definition.relativePath);
  const [content, fileStat] = await Promise.all([
    readFile(absolutePath, 'utf8'),
    stat(absolutePath),
  ]);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    relativePath: definition.relativePath,
    updatedAt: fileStat.mtime.toISOString(),
    content,
  };
}
