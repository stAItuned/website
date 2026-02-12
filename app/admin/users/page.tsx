'use client';

import { useEffect, useState } from 'react';
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
    } | null;
    writerProfile?: {
        slug: string;
        displayName: string;
        title?: string;
        image?: unknown;
        published: boolean;
    } | null;
}

export default function AdminUsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

    const formatDate = (value?: string | null) => {
        if (!value) return '-';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
    };

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
                                                        <span className="text-xs">{formatDate(person.agreement.agreedAt)}</span>
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
                                        <span className="text-slate-500">Agreed At</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {formatDate(selectedUser.agreement.agreedAt)}
                                        </span>
                                    </div>
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
