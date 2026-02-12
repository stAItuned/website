'use client'

import { AdminRoleFitSubmissions } from '@/components/admin/AdminRoleFitSubmissions'

export default function AdminRoleFitPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold leading-6 text-slate-900 dark:text-white">Role Fit Submissions</h1>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                    Review submissions from the Role Fit assessment.
                </p>
            </div>
            <AdminRoleFitSubmissions />
        </div>
    )
}
