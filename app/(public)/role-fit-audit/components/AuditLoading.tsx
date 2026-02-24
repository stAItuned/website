'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { roleFitAuditTranslations, type RoleFitLocale } from '@/lib/i18n/role-fit-audit-translations'

export default function AuditLoading({ locale = 'it' }: { locale?: RoleFitLocale }) {
  const t = roleFitAuditTranslations[locale].loading
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % t.steps.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [t.steps.length])

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[400px] flex flex-col items-center justify-center p-8 bg-white dark:bg-[#151925] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-[#F59E0B] border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {t.steps[currentStep].icon}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="h-20 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.steps[currentStep].text}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.caption}
              <br />
              {t.almostDone}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 12, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
