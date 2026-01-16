import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramFeedback } from '@/lib/telegram'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { event, details, amount, currency, orderId } = body || {}

        let message = ''
        let category = 'payment_intent'

        switch (event) {
            case 'started':
                message = `💳 Inizio pagamento PayPal\n💰 Importo: ${amount} ${currency}\n👤 Azione: Checkout aperto`
                break
            case 'completed':
                message = `✅ Pagamento COMPLETATO\n🆔 Order ID: ${orderId}\n💰 Importo: ${amount} ${currency}\n✨ L'utente ha ora accesso all'audit.`
                category = 'payment_success'
                break
            case 'error':
                message = `❌ ERRORE durante il pagamento\n📝 Dettagli: ${details || 'Nessun dettaglio'}\n💰 Importo: ${amount} ${currency}`
                category = 'payment_error'
                break
            default:
                message = `⚠️ Evento pagamento sconosciuto: ${event}`
        }

        await sendTelegramFeedback({
            category,
            message,
            page: '/role-fit-audit',
            userAgent: req.headers.get('user-agent') || undefined,
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[Payment Notify API] Error:', error)
        return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
    }
}
