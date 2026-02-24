'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import RoleFitAuditForm from './RoleFitAuditForm'
import { trackPurchase, trackRoleFitAuditPurchase } from '@/lib/analytics/trackEvent'
import { AUDIT_CONFIG } from '../auditConfig'
import { roleFitAuditTranslations, type RoleFitLocale } from '@/lib/i18n/role-fit-audit-translations'

const VALID_PROMO_CODES = ['GENAIAUDIT', 'GENAI0', 'GENAI2026', 'STAITUNED', 'FREE100']
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test'

const UNLOCKED_STORAGE_KEY = 'roleFitAudit_unlocked'
const PAYPAL_ORDER_ID_KEY = 'roleFitAudit_paypalOrderId'

export default function PromoCodeGate({ locale }: { locale: RoleFitLocale }) {
  const t = roleFitAuditTranslations[locale].promoGate

  const [isUnlocked, setIsUnlocked] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const searchParams = useSearchParams()

  useEffect(() => {
    let timer: number | null = null
    try {
      const savedUnlocked = localStorage.getItem(UNLOCKED_STORAGE_KEY)
      const savedOrderId = localStorage.getItem(PAYPAL_ORDER_ID_KEY)
      timer = window.setTimeout(() => {
        if (savedUnlocked === 'true') setIsUnlocked(true)
        if (savedOrderId) setPaypalOrderId(savedOrderId)
      }, 0)
    } catch (e) {
      console.warn('Failed to load unlock state from localStorage:', e)
    }

    return () => {
      if (timer !== null) window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    try {
      if (isUnlocked) localStorage.setItem(UNLOCKED_STORAGE_KEY, 'true')
      if (paypalOrderId) localStorage.setItem(PAYPAL_ORDER_ID_KEY, paypalOrderId)
    } catch (e) {
      console.warn('Failed to save unlock state to localStorage:', e)
    }
  }, [isUnlocked, paypalOrderId])

  useEffect(() => {
    const urlCoupon = searchParams.get('coupon') || searchParams.get('promo')
    if (!urlCoupon) return

    const normalizedCode = urlCoupon.trim().toUpperCase()
    if (!VALID_PROMO_CODES.includes(normalizedCode)) return

    const timer = window.setTimeout(() => {
      setPromoCode(normalizedCode)
      setPromoApplied(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [searchParams])

  const handleApplyPromo = () => {
    const normalizedCode = promoCode.trim().toUpperCase()
    if (VALID_PROMO_CODES.includes(normalizedCode)) {
      setError('')
      setPromoApplied(true)
      setShowPromoInput(false)
      return
    }
    setError(t.invalidCode)
    setPromoApplied(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && promoCode.trim()) {
      handleApplyPromo()
    }
  }

  const handleStart = () => {
    if (!(promoApplied || AUDIT_CONFIG.price === 0)) return

    const transactionId = `FREE_${promoCode || 'NO_CODE'}_${Date.now()}`
    trackPurchase({
      transactionId,
      value: 0,
      currency: AUDIT_CONFIG.currency,
      coupon: promoCode || 'FREE_OFFER',
      items: [
        {
          item_id: 'audit_genai',
          item_name: 'GenAI Fit Check',
          price: 0,
          discount: AUDIT_CONFIG.originalPrice,
          coupon: promoCode || 'FREE_OFFER',
          quantity: 1,
        },
      ],
    })
    setIsUnlocked(true)
  }

  const notifyPaymentEvent = async (event: 'started' | 'completed' | 'error', data?: Record<string, unknown>) => {
    try {
      await fetch('/api/role-fit-audit/payment-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          amount: AUDIT_CONFIG.price.toFixed(2),
          currency: AUDIT_CONFIG.currency,
          ...data,
        }),
      })
    } catch (e) {
      console.warn('Failed to send payment notification:', e)
    }
  }

  if (isUnlocked) {
    return (
      <>
        <div className="max-w-xl mx-auto mb-10 relative z-10">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4 text-center">
            <div className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
              <span>✓</span>
              <span>{t.unlocked}</span>
            </div>
          </div>
        </div>

        <RoleFitAuditForm locale={locale} paypalOrderId={paypalOrderId || undefined} />
      </>
    )
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: 'EUR',
        intent: 'capture',
      }}
    >
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className={`text-white p-6 text-center ${promoApplied || AUDIT_CONFIG.price === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-slate-700 to-slate-800'}`}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-5xl font-bold">{AUDIT_CONFIG.price === 0 ? t.free : `€${AUDIT_CONFIG.price.toFixed(2).replace('.', ',')}`}</span>
              <div className="text-left">
                <span className={`block line-through text-lg ${promoApplied || AUDIT_CONFIG.price === 0 ? 'text-green-200' : 'text-slate-400'}`}>
                  €{AUDIT_CONFIG.originalPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className={`text-xs ${promoApplied || AUDIT_CONFIG.price === 0 ? 'text-green-100' : 'text-slate-300'}`}>
                  {promoApplied ? t.access : AUDIT_CONFIG.price === 0 ? t.forNow : t.oneTime}
                </span>
              </div>
            </div>
            {promoApplied && (
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                <span>🎟️</span>
                <span>
                  {t.codeApplied}: <strong>{promoCode}</strong>
                </span>
              </div>
            )}
            {!promoApplied && !showPromoInput && AUDIT_CONFIG.price > 0 && (
              <button onClick={() => setShowPromoInput(true)} className="text-sm text-slate-300 hover:text-white underline underline-offset-2">
                {t.haveCode}
              </button>
            )}
          </div>

          {showPromoInput && !promoApplied && (
            <div className="p-4 bg-slate-50 dark:bg-[#0F1117] border-b border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value)
                    setError('')
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder={t.insertCode}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#151925] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition uppercase"
                  autoFocus
                />
                <button onClick={handleApplyPromo} disabled={!promoCode.trim()} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50">
                  {t.apply}
                </button>
              </div>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>
          )}

          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 text-center">{t.transformationLabel}</p>
            <div className="space-y-3">
              {t.painsToSolutions.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-green-50/50 dark:from-red-900/5 dark:to-green-900/10 border border-slate-100 dark:border-slate-800">
                  <div className="flex-1">
                    <span className="text-sm text-red-500/80 dark:text-red-400/60 line-through">{item.pain}</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600 text-sm">→</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">✅ {item.solution}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              {promoApplied || AUDIT_CONFIG.price === 0 ? (
                <button
                  onClick={handleStart}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold hover:shadow-lg transition"
                >
                  {t.startButton}
                </button>
              ) : (
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal',
                    height: 44,
                  }}
                  createOrder={async (_, actions) => {
                    await notifyPaymentEvent('started')
                    return actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [
                        {
                          amount: {
                            currency_code: AUDIT_CONFIG.currency,
                            value: AUDIT_CONFIG.price.toFixed(2),
                          },
                          description: 'GenAI Fit Check',
                        },
                      ],
                    })
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order?.capture()
                    const orderId = data.orderID
                    setPaypalOrderId(orderId)
                    setIsUnlocked(true)
                    trackRoleFitAuditPurchase(orderId, AUDIT_CONFIG.price, AUDIT_CONFIG.currency)
                    trackPurchase({
                      transactionId: orderId,
                      value: AUDIT_CONFIG.price,
                      currency: AUDIT_CONFIG.currency,
                      items: [{ item_id: 'audit_genai', item_name: 'GenAI Fit Check', price: AUDIT_CONFIG.price, quantity: 1 }],
                    })
                    await notifyPaymentEvent('completed', {
                      orderId,
                      payerId: data.payerID,
                      captureId: details?.purchase_units?.[0]?.payments?.captures?.[0]?.id,
                    })
                  }}
                  onError={async (err) => {
                    console.error('PayPal error:', err)
                    await notifyPaymentEvent('error', { message: String(err) })
                    setError('Payment error. Please retry.')
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
