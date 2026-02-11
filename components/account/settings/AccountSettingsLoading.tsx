/**
 * Loading state for the account settings experience.
 */
export function AccountSettingsLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-32 pb-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your account...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
