import Link from 'next/link'
import { PageTransition } from '@/components/ui/PageTransition'

export default function ProductNotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="text-8xl">🔍</div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-50">
              Prodotto non trovato
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Il prodotto che stai cercando non esiste o è stato rimosso.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/prodotti"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg transition-all shadow-lg hover:scale-105"
            >
              <span>Vedi tutti i prodotti</span>
              <span>→</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border-2 border-slate-300 hover:border-amber-400 text-slate-700 font-bold text-lg transition-all shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-500"
            >
              <span>Torna alla home</span>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
