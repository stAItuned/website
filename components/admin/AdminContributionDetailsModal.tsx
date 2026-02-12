'use client'

import { Contribution } from '@/lib/types/contributor'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface AdminContributionDetailsModalProps {
    contribution: Contribution | null
    onClose: () => void
}

/**
 * Admin modal showing full contribution details with audit history.
 */
export function AdminContributionDetailsModal({ contribution, onClose }: AdminContributionDetailsModalProps) {
    if (!contribution) return null

    const statusHistory = (contribution.statusHistory ?? []).slice().reverse()
    const reviewHistory = (contribution.reviewHistory ?? []).slice().reverse()

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
                        <div>
                            <div className="flex gap-2 mb-2">
                                <span className="px-2 py-0.5 text-xs font-black rounded uppercase bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                    {contribution.status}
                                </span>
                                <span className="px-2 py-0.5 text-xs font-black rounded uppercase border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                    {contribution.path}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                {contribution.brief?.topic || 'Untitled Contribution'}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                By {contribution.contributorEmail} • ID: {contribution.id}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                        {/* Agreement Section - Highlighted */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </span>
                                Contributor Agreement
                            </h3>
                            {contribution.agreement?.agreed ? (
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem label="Legal Name" value={contribution.agreement.author_name || 'N/A'} />
                                        <InfoItem label="Fiscal Code / Tax ID" value={contribution.agreement.fiscal_code || 'N/A'} />
                                        <InfoItem
                                            label="Signed At"
                                            value={contribution.agreement.accepted_at ? new Date(contribution.agreement.accepted_at).toLocaleString() : 'N/A'}
                                        />
                                        <InfoItem label="Agreement Version" value={contribution.agreement.agreement_version || 'N/A'} />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Legally Signed and Binding
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 italic flex items-center justify-center">
                                    Agreement pending or not recorded.
                                </div>
                            )}
                        </div>

                        {/* Brief Section */}
                        {contribution.brief && (
                            <Section title="Brief & Pitch">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <InfoItem label="Target" value={contribution.brief.target} />
                                    <InfoItem label="Format" value={contribution.brief.format} />
                                    <InfoItem label="Has Example" value={contribution.brief.hasExample ? 'Yes' : 'No'} />
                                    <InfoItem label="Sources" value={`${contribution.brief.sources?.length || 0} Listed`} />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Thesis</span>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded">{contribution.brief.thesis}</p>
                                    </div>
                                    {contribution.brief.context && (
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Context</span>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded">{contribution.brief.context}</p>
                                        </div>
                                    )}
                                </div>
                            </Section>
                        )}

                        {/* Interview History */}
                        {contribution.interviewHistory && contribution.interviewHistory.length > 0 && (
                            <Section title="Interview Q&A">
                                <div className="space-y-4">
                                    {contribution.interviewHistory.map((qna, idx) => (
                                        <div key={idx} className="border-l-4 border-slate-200 dark:border-slate-700 pl-4 py-1">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">{qna.question}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded">"{qna.answer}"</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Generated Outline */}
                        {contribution.generatedOutline && (
                            <Section title="Generated Outline">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{contribution.generatedOutline.title}</h4>
                                    {contribution.generatedOutline.sections.map((section, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <span className="text-primary-500 font-mono text-xs">{idx + 1}.</span>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium dark:text-slate-200 block">{section.heading}</span>
                                                <span className="text-xs text-slate-400 capitalize">{section.type} • {section.suggestedWords} words</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Draft Content */}
                        {contribution.draftContent && (
                            <Section title="Draft Content">
                                <div className="bg-white dark:bg-slate-950 p-4 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                                    {contribution.draftContent}
                                </div>
                            </Section>
                        )}

                        {/* Status History */}
                        <Section title="Status History" highlight>
                            {statusHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {statusHistory.map((entry, idx) => (
                                        <HistoryItem
                                            key={`${entry.changedAt}-${idx}`}
                                            title={`${entry.status} • ${entry.currentStep}`}
                                            meta={`${formatDateTime(entry.changedAt)}${entry.changedBy ? ` • ${entry.changedBy}` : ''}`}
                                            note={entry.note}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="No status changes recorded yet." />
                            )}
                        </Section>

                        {/* Review History */}
                        <Section title="Review History" highlight>
                            {reviewHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {reviewHistory.map((entry, idx) => (
                                        <HistoryItem
                                            key={`${entry.updatedAt}-${idx}`}
                                            title={`${entry.action.replace('_', ' ')} • ${entry.status}`}
                                            meta={`${formatDateTime(entry.updatedAt)} • ${entry.reviewerEmail}`}
                                            note={entry.note}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="No review actions recorded yet." />
                            )}
                        </Section>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Close Details
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

function Section({ title, children, highlight = false }: { title: string, children: ReactNode, highlight?: boolean }) {
    return (
        <section className={highlight ? 'bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800' : ''}>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                {title}
            </h4>
            {children}
        </section>
    )
}

function InfoItem({ label, value }: { label: string, value: string | number }) {
    return (
        <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{label}</span>
            <span className="text-sm font-semibold dark:text-white break-all">{value}</span>
        </div>
    )
}

function HistoryItem({ title, meta, note }: { title: string, meta: string, note?: string }) {
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
                <div className="text-xs text-slate-400 font-mono">{meta}</div>
            </div>
            {note ? (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{note}</p>
            ) : null}
        </div>
    )
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            {text}
        </div>
    )
}

function formatDateTime(value: string) {
    if (!value) return 'Unknown date'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString()
}
