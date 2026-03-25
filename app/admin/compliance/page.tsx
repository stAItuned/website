'use client';

import { AdminComplianceDocs } from '@/components/admin/AdminComplianceDocs';

export default function AdminCompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold leading-6 text-slate-900 dark:text-white">
          Compliance Documents
        </h1>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
          Access GDPR and AI Act artifacts (checklists, audits, runbooks, evidence) from one protected admin section.
        </p>
      </div>
      <AdminComplianceDocs />
    </div>
  );
}
