'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

/**
 * User type for homepage personalization
 * - 'azienda': Business/PMI focused content
 * - 'learner': AI learner/enthusiast focused content  
 * - null: User hasn't selected yet
 */
export type HomeUserType = 'azienda' | 'learner' | null

interface HomeUserTypeContextValue {
    userType: HomeUserType
    setUserType: (type: HomeUserType) => void
    resetUserType: () => void
    isLoading: boolean
}

const STORAGE_KEY = 'staituned_home_user_type'

const HomeUserTypeContext = createContext<HomeUserTypeContextValue | undefined>(undefined)

/**
 * Provider component for homepage user type state
 */
export function HomeUserTypeProvider({ children }: { children: ReactNode }) {
    const [userType, setUserTypeState] = useState<HomeUserType>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'azienda' || stored === 'learner') {
            setUserTypeState(stored)
        }
        setIsLoading(false)
    }, [])

    // Save to localStorage when changed
    const setUserType = (type: HomeUserType) => {
        setUserTypeState(type)
        if (type) {
            localStorage.setItem(STORAGE_KEY, type)
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }

    const resetUserType = () => {
        setUserType(null)
    }

    return (
        <HomeUserTypeContext.Provider value={{ userType, setUserType, resetUserType, isLoading }}>
            {children}
        </HomeUserTypeContext.Provider>
    )
}

/**
 * Hook to access user type context
 */
export function useHomeUserType() {
    const context = useContext(HomeUserTypeContext)
    if (context === undefined) {
        throw new Error('useHomeUserType must be used within a HomeUserTypeProvider')
    }
    return context
}
