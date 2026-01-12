'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type ObjectiveType = 'start' | 'pro' | null
export type PricingMode = 'classe' | '1to1'
export type PricingHighlight = 'starter' | 'pro' | 'elite' | null

interface CareerOSContextType {
    // Objective Selection (Journey)
    objective: ObjectiveType
    setObjective: (obj: ObjectiveType) => void

    // Delivery Mode (Journey -> Pricing)
    mode: PricingMode
    setMode: (mode: PricingMode) => void

    // Scroll helpers
    scrollToSection: (id: string) => void
}

const CareerOSContext = createContext<CareerOSContextType | undefined>(undefined)

export function CareerOSProvider({ children }: { children: ReactNode }) {
    const [objective, setObjective] = useState<ObjectiveType>(null) // Default null as requested
    const [mode, setMode] = useState<PricingMode>('classe') // Default classe

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            // Offset for sticky header/stepper
            const offset = 120
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    return (
        <CareerOSContext.Provider value={{
            objective,
            setObjective,
            mode,
            setMode,
            scrollToSection
        }}>
            {children}
        </CareerOSContext.Provider>
    )
}

export function useCareerOS() {
    const context = useContext(CareerOSContext)
    if (context === undefined) {
        throw new Error('useCareerOS must be used within a CareerOSProvider')
    }
    return context
}
