import { Clock, Lightbulb, Target } from 'lucide-react'
import { careerOSTranslations, type CareerOSLocale } from '@/lib/i18n/career-os-translations'

interface FaqItem {
  question: string
  answer: string
}

export default function FAQ({ locale }: { locale: CareerOSLocale }) {
  const t = careerOSTranslations[locale].faq

  const categories: Array<{
    id: 'fit' | 'method' | 'logistics'
    label: string
    icon: typeof Target
    items: FaqItem[]
  }> = [
    { id: 'fit', label: t.categories.fit, icon: Target, items: t.items.fit },
    { id: 'method', label: t.categories.method, icon: Lightbulb, items: t.items.method },
    { id: 'logistics', label: t.categories.logistics, icon: Clock, items: t.items.logistics },
  ]

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto" aria-labelledby="career-os-faq-title">
      <h2 id="career-os-faq-title" className="text-3xl font-bold text-center mb-10 text-[#1A1E3B] dark:text-white">
        {t.title}
      </h2>

      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category.id} aria-labelledby={`career-os-faq-${category.id}`}>
            <h3
              id={`career-os-faq-${category.id}`}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-white/5 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              <category.icon className="h-4 w-4" aria-hidden />
              {category.label}
            </h3>

            <div className="space-y-4">
              {category.items.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl bg-white dark:bg-[#151925] border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
                >
                  <h4 className="font-bold text-lg text-[#1A1E3B] dark:text-white">{item.question}</h4>
                  <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t.contactPrefix}{' '}
          <a href="mailto:info@staituned.com" className="text-rose-500 font-bold hover:underline">
            {t.contactLink}
          </a>{' '}
          {t.contactSuffix}
        </p>
      </div>
    </section>
  )
}
