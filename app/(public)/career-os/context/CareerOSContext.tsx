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

    // Modals State
    isAppModalOpen: boolean
    appModalData: { source?: string; tier?: string } | null
    openAppModal: (data?: { source?: string; tier?: string }) => void
    closeAppModal: () => void

    isAuditModalOpen: boolean
    openAuditModal: () => void
    closeAuditModal: () => void

    // Scroll helpers
    scrollToSection: (id: string) => void
}

const CareerOSContext = createContext<CareerOSContextType | undefined>(undefined)

export function CareerOSProvider({ children }: { children: ReactNode }) {
    const [objective, setObjective] = useState<ObjectiveType>(null)
    const [mode, setMode] = useState<PricingMode>('1to1')

    const [isAppModalOpen, setIsAppModalOpen] = useState(false)
    const [appModalData, setAppModalData] = useState<{ source?: string; tier?: string } | null>(null)

    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)

    const openAppModal = (data?: { source?: string; tier?: string }) => {
        setAppModalData(data || null)
        setIsAppModalOpen(true)
    }
    const closeAppModal = () => {
        setIsAppModalOpen(false)
        setAppModalData(null)
    }

    const openAuditModal = () => setIsAuditModalOpen(true)
    const closeAuditModal = () => setIsAuditModalOpen(false)

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
            isAppModalOpen,
            appModalData,
            openAppModal,
            closeAppModal,
            isAuditModalOpen,
            openAuditModal,
            closeAuditModal,
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
