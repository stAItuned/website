'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';

interface User {
    uid: string;
    email: string;
    displayName: string;
    createdAt: string | null;
    lastLoginAt: string | null;
    isWriter: boolean;
    agreement: {
        version: string;
        agreedAt: string;
        accepted_at?: string;
        ip?: string;
        user_agent?: string;
        fiscal_code?: string;
        author_name?: string;
        author_email?: string;
        agreement_hash_sha256?: string;
        agreement_view_url?: string;
    } | null;
    writerProfile?: {
        slug: string;
        displayName: string;
        title?: string;
        image?: unknown;
        published: boolean;
    } | null;
}

/**
 * Admin users table with writer agreement details modal.
 */
export default function AdminUsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [agreementPreviewUrl, setAgreementPreviewUrl] = useState<string | null>(null);
    const [agreementPreviewError, setAgreementPreviewError] = useState<string | null>(null);
    const [agreementPreviewLoading, setAgreementPreviewLoading] = useState(false);
    const [previewZoom, setPreviewZoom] = useState(1);
    const lastAgreementSourceRef = useRef<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const res = await fetch('/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setUsers(json.users);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user]);

    const formatDate = (value?: string | null) => {
        if (!value) return '-';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
    };

    const getAgreementDate = (agreement?: User['agreement']) => {
        if (!agreement) return '-';
        return formatDate(agreement.accepted_at);
    };

    useEffect(() => {
        if (!selectedUser?.agreement?.agreement_view_url || !user) {
            if (agreementPreviewUrl) {
                URL.revokeObjectURL(agreementPreviewUrl);
            }
            lastAgreementSourceRef.current = null;
            setAgreementPreviewUrl(null);
            setAgreementPreviewError(null);
            setAgreementPreviewLoading(false);
            setPreviewZoom(1);
            return;
        }

        let isActive = true;
        const controller = new AbortController();
        const agreementViewUrl = selectedUser.agreement?.agreement_view_url as string;
        const localAgreementPath = (() => {
            try {
                const url = new URL(agreementViewUrl);
                if (url.pathname.startsWith('/api/admin/agreement/')) {
                    return url.pathname;
                }
            } catch {
                // Ignore invalid URL, fallback to raw string below
            }
            return agreementViewUrl;
        })();

        if (lastAgreementSourceRef.current === localAgreementPath) {
            return () => {
                isActive = false;
                controller.abort();
            };
        }

        lastAgreementSourceRef.current = localAgreementPath;
        setPreviewZoom(1);

        const loadAgreementPreview = async () => {
            setAgreementPreviewLoading(true);
            setAgreementPreviewError(null);

            try {
                const token = await user.getIdToken();
                const res = await fetch(localAgreementPath, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error(`Failed to load agreement (${res.status})`);
                }

                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);

                if (!isActive) {
                    URL.revokeObjectURL(objectUrl);
                    return;
                }

                if (agreementPreviewUrl) {
                    URL.revokeObjectURL(agreementPreviewUrl);
                }

                setAgreementPreviewUrl(objectUrl);
            } catch (error) {
                if (!isActive) return;
                const message = error instanceof Error ? error.message : 'Unable to load agreement preview.';
                setAgreementPreviewError(message);
                if (agreementPreviewUrl) {
                    URL.revokeObjectURL(agreementPreviewUrl);
                }
                setAgreementPreviewUrl(null);
            } finally {
                if (isActive) setAgreementPreviewLoading(false);
            }
        };

        void loadAgreementPreview();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [agreementPreviewUrl, selectedUser?.agreement?.agreement_view_url, user]);

    if (loading) {
        return (
            <div className="flex animate-pulse flex-col space-y-4">
                <div className="h-12 rounded bg-slate-200 dark:bg-slate-700"></div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded bg-slate-200 dark:bg-slate-700"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-slate-900 dark:text-white">Users</h1>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                        A list of all users in your account including their name, title, email and role.
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="md:hidden space-y-3">
                    {users.map((person) => (
                        <article
                            key={person.uid}
                            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {person.displayName || 'No Name'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 break-all">{person.email}</p>
                                </div>
                                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-700/30 dark:text-slate-300">
                                    Joined {formatDate(person.createdAt)}
                                </span>
                            </div>

                            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
                                <div>
                                    <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Writer Status</dt>
                                    <dd className="mt-1">
                                        {person.writerProfile ? (
                                            <div className="flex flex-col">
                                                <a href={`/author/${person.writerProfile.slug}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium dark:text-indigo-400">
                                                    {person.writerProfile.displayName}
                                                </a>
                                                <span className="text-xs text-slate-500">{person.writerProfile.title}</span>
                                            </div>
                                        ) : person.isWriter ? (
                                            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400">
                                                Writer (No Profile)
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-700/30 dark:text-slate-400">
                                                User
                                            </span>
                                        )}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Agreement</dt>
                                    <dd className="text-sm text-slate-700 dark:text-slate-200">
                                        {person.agreement ? (
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                v{person.agreement.version} ({formatDate(person.agreement.accepted_at)})
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Writer</dt>
                                    <dd>
                                        {person.isWriter ? (
                                            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                Writer
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-700/30 dark:text-slate-400">
                                                No
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-4">
                                {person.isWriter ? (
                                    <button
                                        onClick={() => setSelectedUser(person)}
                                        className="inline-flex w-full items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                                    >
                                        View Agreement
                                    </button>
                                ) : (
                                    <p className="text-xs text-slate-400">Agreement not available for non-writer users.</p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="hidden md:block">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                Writer Status
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                Agreement
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                Writer
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                Joined
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                                        {users.map((person) => (
                                            <tr key={person.uid}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="font-medium text-slate-900 dark:text-white">{person.displayName || 'No Name'}</div>
                                                    <div className="text-slate-500 dark:text-slate-400">{person.email}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {person.writerProfile ? (
                                                        <div className="flex flex-col">
                                                            <a href={`/author/${person.writerProfile.slug}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium dark:text-indigo-400">
                                                                {person.writerProfile.displayName}
                                                            </a>
                                                            <span className="text-xs text-slate-500">{person.writerProfile.title}</span>
                                                        </div>
                                                    ) : person.isWriter ? (
                                                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400">
                                                            Writer (No Profile)
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-700/30 dark:text-slate-400">
                                                            User
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {person.agreement ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-900 dark:text-white">v{person.agreement.version}</span>
                                                            <span className="text-xs">{formatDate(person.agreement.accepted_at)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {person.isWriter ? (
                                                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                            Writer
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-700/30 dark:text-slate-400">
                                                            No
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {formatDate(person.createdAt)}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    {person.isWriter ? (
                                                        <button
                                                            onClick={() => setSelectedUser(person)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            Agreement<span className="sr-only">, {person.displayName}</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedUser ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedUser(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Writer Agreement</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {selectedUser.displayName || 'User'} • {selectedUser.email}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-5 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                            {selectedUser.agreement ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Version</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">v{selectedUser.agreement.version}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Accepted At</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {getAgreementDate(selectedUser.agreement)}
                                        </span>
                                    </div>
                                    {selectedUser.agreement.agreement_view_url ? (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Agreement Preview</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewZoom((prev) => Math.max(0.75, Math.round((prev - 0.25) * 100) / 100))}
                                                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="min-w-[48px] text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                        {Math.round(previewZoom * 100)}%
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewZoom((prev) => Math.min(2.5, Math.round((prev + 0.25) * 100) / 100))}
                                                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewZoom(1)}
                                                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                                    >
                                                        Reset
                                                    </button>
                                                </div>
                                            </div>
                                            {agreementPreviewLoading ? (
                                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                                                    Loading preview...
                                                </div>
                                            ) : agreementPreviewError ? (
                                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
                                                    {agreementPreviewError}
                                                </div>
                                            ) : agreementPreviewUrl ? (
                                                <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                                    <div className="h-80 w-full overflow-auto">
                                                        <div
                                                            className="origin-top-left"
                                                            style={{ transform: `scale(${previewZoom})`, width: `${Math.max(100, previewZoom * 100)}%` }}
                                                        >
                                                            <object
                                                                data={agreementPreviewUrl}
                                                                type="application/pdf"
                                                                className="h-80 w-full"
                                                            >
                                                                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                                                                    PDF preview not available.
                                                                </div>
                                                            </object>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                                                    No preview available.
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                    {selectedUser.agreement.agreement_hash_sha256 ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500">Agreement Hash (SHA-256)</span>
                                            <span className="break-words font-mono text-xs text-slate-900 dark:text-white">
                                                {selectedUser.agreement.agreement_hash_sha256}
                                            </span>
                                        </div>
                                    ) : null}
                                    {selectedUser.agreement.author_name ? (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">Legal Name</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedUser.agreement.author_name}
                                            </span>
                                        </div>
                                    ) : null}
                                    {selectedUser.agreement.fiscal_code ? (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">Fiscal Code</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedUser.agreement.fiscal_code}
                                            </span>
                                        </div>
                                    ) : null}
                                    {selectedUser.agreement.ip ? (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">IP</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedUser.agreement.ip}
                                            </span>
                                        </div>
                                    ) : null}
                                    {selectedUser.agreement.user_agent ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500">User Agent</span>
                                            <span className="break-words font-medium text-slate-900 dark:text-white">
                                                {selectedUser.agreement.user_agent}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
                                    No agreement found for this writer.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
