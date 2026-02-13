import { AlertTriangle, Trash2 } from 'lucide-react'

interface DeleteDataModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  deleting: boolean
  error?: string
  bookmarksCount: number
}

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  deleting: boolean
  error?: string
  confirmText: string
  onConfirmTextChange: (value: string) => void
}

/**
 * Confirmation modal for deleting user data while keeping the account active.
 */
export function DeleteDataModal({
  isOpen,
  onClose,
  onConfirm,
  deleting,
  error,
  bookmarksCount,
}: DeleteDataModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-2xl dark:border-slate-700/70 dark:bg-slate-900/95"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300">
            <Trash2 className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete your data</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This action removes your personal data from Firestore while keeping your account active.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-300">
          <p className="font-semibold text-slate-700 dark:text-slate-100">This will delete:</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>All bookmarks ({bookmarksCount})</li>
            <li>User preferences</li>
            <li>Contributor drafts, interview data, and signed agreements</li>
            <li>Writer profile metadata and related badges</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Your account remains active and published articles are preserved.
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete data'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Confirmation modal for deleting the user account permanently.
 */
export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  deleting,
  error,
  confirmText,
  onConfirmTextChange,
}: DeleteAccountModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-red-200/70 bg-white/95 p-6 shadow-2xl dark:border-red-900/40 dark:bg-slate-900/95"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-300">Delete account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-red-200/70 bg-red-50/70 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          <p className="font-semibold">This will permanently delete:</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Your account and authentication</li>
            <li>All personal data on Firestore (including contributor agreements)</li>
            <li>Writer profile metadata and related badges</li>
            <li>Published articles are preserved</li>
          </ul>
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Type DELETE to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(event) => onConfirmTextChange(event.target.value)}
            placeholder="DELETE"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting || confirmText !== 'DELETE'}
            className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete forever'}
          </button>
        </div>
      </div>
    </div>
  )
}
