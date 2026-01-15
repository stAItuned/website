'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOADING_STEPS = [
    { text: 'Analisi delle risposte in corso...', icon: '🔍' },
    { text: 'Confronto con gli Archetipi AI...', icon: '🧠' },
    { text: 'Identificazione dei Gap critici...', icon: '⚡️' },
    { text: 'Generazione strategia personalizzata...', icon: '🎯' },
    { text: 'Impaginazione e invio PDF...', icon: '📄' },
]

export default function AuditLoading() {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length)
        }, 2500) // Change step every 2.5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-full max-w-2xl mx-auto min-h-[400px] flex flex-col items-center justify-center p-8 bg-white dark:bg-[#151925] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            {/* Animated Spinner with Gradient */}
            <div className="relative w-24 h-24 mb-10">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
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
                            {LOADING_STEPS[currentStep].icon}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            {/* Text Rotation */}
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
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {LOADING_STEPS[currentStep].text}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Stiamo usando Gemini 3 Pro per analizzare il tuo profilo.
                            <br />
                            Manca poco...
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar (Visual only) */}
            <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-8 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 12, ease: "linear" }} // Approx total wait time
                />
            </div>
        </div>
    )
}
