'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';

interface ComplianceDocSummary {
  id: string;
  title: string;
  description: string;
  relativePath: string;
  updatedAt: string;
}

interface ComplianceDocDetail extends ComplianceDocSummary {
  content: string;
}

export function AdminComplianceDocs() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<ComplianceDocSummary[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ComplianceDocDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [error, setError] = useState('');

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

    loadDocs();
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

    loadDoc();
  }, [selectedDocId, user]);

  const formatDateTime = (value: string) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
  };

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
          <div className="space-y-2">
            {docs.map((doc) => {
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
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{doc.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{doc.description}</p>
                  <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">{doc.relativePath}</p>
                </button>
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
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{selectedDoc.relativePath}</span>
                  <span>Updated: {formatDateTime(selectedDoc.updatedAt)}</span>
                </div>
              </header>
              <div className="max-h-[70vh] overflow-auto p-5">
                <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-700 dark:text-slate-200">
                  {selectedDoc.content}
                </pre>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
