'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { app } from '@/lib/firebase/client'

import { PRICING } from '@/lib/ai/pricing'

export function AdminModelConfig() {
    const { user } = useAuth()
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Dynamically derive available Gemini models from PRICING
    const geminiModels = Object.keys(PRICING)
        .filter(key => key.startsWith('gemini-'))
        .map(key => ({
            id: key,
            // Simple name formatting: gemini-2.5-flash -> Gemini 2.5 Flash
            name: key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            type: key.includes('flash') ? 'Fast' : key.includes('pro') ? 'Powerful' : 'Preview'
        }))

    useEffect(() => {
        const fetchConfig = async () => {
            if (!user) return
            try {
                const db = getFirestore(app)
                const docRef = doc(db, 'config', 'ai_settings')
                const snapshot = await getDoc(docRef)
                if (snapshot.exists() && snapshot.data().geminiModel) {
                    setSelectedModel(snapshot.data().geminiModel)
                }
            } catch (error) {
                console.error('Error fetching AI config', error)
            } finally {
                setLoading(false)
            }
        }
        fetchConfig()
    }, [user])

    const handleSave = async (modelId: string) => {
        if (!user) return
        setSaving(true)
        try {
            const db = getFirestore(app)
            await setDoc(doc(db, 'config', 'ai_settings'), {
                geminiModel: modelId,
                updatedAt: new Date().toISOString(),
                updatedBy: user.email
            }, { merge: true })
            setSelectedModel(modelId)
        } catch (error) {
            console.error('Error saving AI config', error)
            alert('Failed to save configuration')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="animate-pulse h-20 bg-slate-100 rounded-xl" />

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gemini Model Configuration</h3>
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 font-mono">
                    Active: {selectedModel}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {geminiModels.map(model => (
                    <button
                        key={model.id}
                        onClick={() => handleSave(model.id)}
                        disabled={saving}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedModel === model.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="pr-4">
                                <p className={`font-bold ${selectedModel === model.id ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {model.name}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{model.type}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{model.id}</p>
                            </div>
                            {selectedModel === model.id && (
                                <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs shrink-0">
                                    ✓
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            {saving && <p className="text-xs text-slate-400 mt-2 text-right">Saving...</p>}
        </div>
    )
}
