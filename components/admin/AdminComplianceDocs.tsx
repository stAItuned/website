'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/components/auth/AuthContext';

type ComplianceDocCategory =
  | 'gdpr-shared-baseline'
  | 'gdpr-repo-governance'
  | 'gdpr-operations'
  | 'gdpr-evidence'
  | 'ai-act-related';

interface ComplianceDocSummary {
  id: string;
  title: string;
  description: string;
  focus: string;
  objective: string;
  path: string;
  category: ComplianceDocCategory;
  source: 'shared-baseline' | 'repo';
  updatedAt: string;
}

interface ComplianceDocDetail extends ComplianceDocSummary {
  content: string;
}

const CATEGORY_LABELS: Record<ComplianceDocCategory, string> = {
  'gdpr-shared-baseline': 'GDPR Shared Baseline',
  'gdpr-repo-governance': 'GDPR Repo Governance',
  'gdpr-operations': 'GDPR Operations',
  'gdpr-evidence': 'GDPR Evidence',
  'ai-act-related': 'AI Act Related',
};

const SOURCE_LABELS: Record<ComplianceDocSummary['source'], string> = {
  'shared-baseline': 'Shared baseline',
  repo: 'Repo',
};

export function AdminComplianceDocs() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<ComplianceDocSummary[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ComplianceDocDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle');

  useEffect(() => {
    const loadDocs = async () => {
      if (!user) return;

      setLoadingList(true);
      setError('');
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/admin/compliance-docs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await response.json()) as {
          success: boolean;
          docs?: ComplianceDocSummary[];
          error?: string;
        };

        if (!data.success || !data.docs) {
          throw new Error(data.error || 'Failed to load compliance documents');
        }

        setDocs(data.docs);
        if (data.docs.length > 0) {
          setSelectedDocId(data.docs[0].id);
        }
      } catch (loadError) {
        console.error('Failed to fetch compliance docs list:', loadError);
        setError('Failed to load compliance documents.');
      } finally {
        setLoadingList(false);
      }
    };

    void loadDocs();
  }, [user]);

  useEffect(() => {
    const loadDoc = async () => {
      if (!user || !selectedDocId) return;

      setLoadingDoc(true);
      setError('');
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/admin/compliance-docs?doc=${encodeURIComponent(selectedDocId)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await response.json()) as {
          success: boolean;
          doc?: ComplianceDocDetail;
          error?: string;
        };

        if (!data.success || !data.doc) {
          throw new Error(data.error || 'Failed to load compliance document');
        }

        setSelectedDoc(data.doc);
      } catch (loadError) {
        console.error('Failed to fetch compliance doc:', loadError);
        setError('Failed to load selected document.');
      } finally {
        setLoadingDoc(false);
      }
    };

    void loadDoc();
  }, [selectedDocId, user]);

  useEffect(() => {
    setCopyState('idle');
  }, [selectedDocId]);

  const handleDownloadMarkdown = () => {
    if (!selectedDoc) return;

    const blob = new Blob([selectedDoc.content], { type: 'text/markdown;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const fallbackFileName = `${selectedDoc.id}.md`;
    const markdownFileName = selectedDoc.path.split('/').pop() || fallbackFileName;

    anchor.href = objectUrl;
    anchor.download = markdownFileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  };

  const handleCopyMarkdown = async () => {
    if (!selectedDoc) return;

    try {
      await navigator.clipboard.writeText(selectedDoc.content);
      setCopyState('done');
      window.setTimeout(() => setCopyState('idle'), 1500);
    } catch (copyError) {
      console.error('Failed to copy markdown:', copyError);
      setCopyState('error');
      window.setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  const formatDateTime = (value: string) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
  };

  const docsByCategory = docs.reduce<Record<ComplianceDocCategory, ComplianceDocSummary[]>>(
    (groups, doc) => {
      groups[doc.category].push(doc);
      return groups;
    },
    {
      'gdpr-shared-baseline': [],
      'gdpr-repo-governance': [],
      'gdpr-operations': [],
      'gdpr-evidence': [],
      'ai-act-related': [],
    },
  );

  if (loadingList) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <aside className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 lg:col-span-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Compliance Docs
          </h2>
          <div className="space-y-4">
            {Object.entries(docsByCategory).map(([category, categoryDocs]) => {
              if (categoryDocs.length === 0) return null;

              return (
                <section key={category} className="space-y-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    {CATEGORY_LABELS[category as ComplianceDocCategory]}
                  </h3>
                  <div className="space-y-2">
                    {categoryDocs.map((doc) => {
                      const selected = selectedDocId === doc.id;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => setSelectedDocId(doc.id)}
                          className={[
                            'w-full rounded-lg border p-3 text-left transition',
                            selected
                              ? 'border-primary-600 bg-primary-50 dark:border-primary-400 dark:bg-primary-500/10'
                              : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50',
                          ].join(' ')}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{doc.title}</p>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                              {SOURCE_LABELS[doc.source]}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{doc.description}</p>
                          <p className="mt-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                            Focus: <span className="font-normal">{doc.focus}</span>
                          </p>
                          <p className="mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                            Objective: <span className="font-normal">{doc.objective}</span>
                          </p>
                          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">{doc.path}</p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 lg:col-span-8">
          {loadingDoc || !selectedDoc ? (
            <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
              Loading document...
            </div>
          ) : (
            <>
              <header className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{selectedDoc.title}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{selectedDoc.description}</p>
                <div className="mt-3 grid gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                  <p>
                    <span className="font-semibold">Focus:</span> {selectedDoc.focus}
                  </p>
                  <p>
                    <span className="font-semibold">Objective:</span> {selectedDoc.objective}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{selectedDoc.path}</span>
                  <span>{CATEGORY_LABELS[selectedDoc.category]}</span>
                  <span>{SOURCE_LABELS[selectedDoc.source]}</span>
                  <span>Updated: {formatDateTime(selectedDoc.updatedAt)}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadMarkdown}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Download .md
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void handleCopyMarkdown();
                    }}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Copy markdown
                  </button>
                  {copyState === 'done' && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Copied</span>
                  )}
                  {copyState === 'error' && (
                    <span className="text-xs text-red-600 dark:text-red-400">Copy failed</span>
                  )}
                </div>
              </header>
              <div className="max-h-[70vh] overflow-auto p-5">
                <article className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedDoc.content}
                  </ReactMarkdown>
                </article>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
