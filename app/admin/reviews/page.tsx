'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { useAuth } from '@/components/auth/AuthContext';
import { Contribution } from '@/lib/types/contributor';

export default function AdminReviewsPage() {
    return (
        <AdminGuard>
            <AdminReviewsContent />
        </AdminGuard>
    );
}

function AdminReviewsContent() {
    const { user } = useAuth();
    const [reviewItems, setReviewItems] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContributions = async () => {
            if (!user) return;

            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/admin/contributions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch contributions');
                }

                const data = await response.json();
                if (data.success) {
                    setReviewItems(data.contributions);
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            } catch (err) {
                console.error('Error fetching admin reviews:', err);
                setError('Failed to load review queue');
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 pt-32 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 pt-32 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 pt-32">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Review Queue
                    </h1>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                        {reviewItems.length} Pending
                    </span>
                </div>

                <div className="grid gap-6">
                    {reviewItems.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">No drafts pending review.</p>
                        </div>
                    ) : (
                        reviewItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === 'review'
                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                                }`}>
                                                {item.status}
                                            </span>
                                            {item.review?.status && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    Review: {item.review.status}
                                                </span>
                                            )}
                                            <span className="text-xs text-slate-400">
                                                {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {item.brief?.topic || 'Untitled Draft'}
                                        </h2>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                            <span>Format: {item.brief?.format}</span>
                                            <span>•</span>
                                            <span>User: {item.contributorEmail}</span>
                                        </div>
                                    </div>

                                        <div className="flex items-center gap-3">
                                            <Link
                                            href={`/admin/reviews/${item.id}`}
                                            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            View Draft
                                        </Link>
                                        <Link
                                            href={`/admin/reviews/${item.id}`}
                                            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
                                        >
                                            Review
                                        </Link>
                                    </div>
                                </div>
                                {item.draftContent && (
                                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl max-h-32 overflow-hidden text-sm text-slate-500 dark:text-slate-400 font-mono">
                                        {item.draftContent.substring(0, 300)}...
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
