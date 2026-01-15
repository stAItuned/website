/**
 * Email Service for Newsletter Welcome
 * 
 * Sends a welcome email to new newsletter subscribers using Resend
 */

import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'stAItuned <noreply@staituned.com>'

interface SendWelcomeEmailParams {
    email: string
}

function generateWelcomeEmailHtml(): string {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Benvenuto su stAItuned</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <img src="https://staituned.com/assets/general/logo-text-dark.png" alt="stAItuned" style="height: 40px; width: auto;" />
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      
      <h1 style="font-size: 24px; margin: 0 0 16px 0; color: #1e293b; text-align: center;">🎉 Benvenuto/a in stAItuned!</h1>
      
      <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        Ottima scelta. Ti sei appena unito/a alla community di builder che non si accontentano dell'hype, ma vogliono capire come l'AI stia cambiando il modo di lavorare (sul serio).
      </p>

      <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 15px; color: #92400e;">
          <strong>Cosa aspettarti:</strong> Ogni settimana riceverai deep-dive tecnici, strategie di carriera per AI Engineers e casi studio reali di implementazione GenAI.
        </p>
      </div>

      <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        Nel frattempo, ecco da dove puoi iniziare:
      </p>

      <ul style="padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8; margin-bottom: 32px;">
        <li><a href="https://staituned.com/learn/articles" style="color: #f59e0b; font-weight: bold; text-decoration: none;">Esplora tutti gli articoli</a> per approfondire le basi e le tecniche avanzate.</li>
        <li><a href="https://staituned.com/career-os" style="color: #f59e0b; font-weight: bold; text-decoration: none;">Scopri Career OS</a> se vuoi accelerare la tua transizione professionale nell'AI.</li>
        <li>Seguici su <a href="https://www.linkedin.com/company/stai-tuned" style="color: #0a66c2; font-weight: bold; text-decoration: none;">LinkedIn</a> per i leak settimanali.</li>
      </ul>

      <div style="text-align: center;">
        <p style="font-size: 14px; color: #94a3b8; margin-top: 32px;">
          Se hai domande o feedback, rispondi pure a questa mail. Leggiamo tutto.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding: 20px;">
      <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px 0;">
        Ricevi questa email perché ti sei iscritto alla newsletter su stAItuned.com.
      </p>
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        <a href="https://staituned.com/privacy" style="color: #94a3b8;">Privacy Policy</a> · 
        <a href="mailto:info@staituned.com?subject=Disiscrizione%20Newsletter" style="color: #94a3b8;">Disiscriviti</a>
      </p>
    </div>

  </div>
</body>
</html>
`
}

function generateWelcomeEmailText(): string {
    return `
Benvenuto/a in stAItuned! 🎉

Ottima scelta. Ti sei appena unito/a alla community di builder che non si accontentano dell'hype, ma vogliono capire come l'AI stia cambiando il modo di lavorare (sul serio).

COSA ASPETTARTI:
Ogni settimana riceverai deep-dive tecnici, strategie di carriera per AI Engineers e casi studio reali di implementazione GenAI.

DA DOVE INIZIARE:
- Esplora tutti gli articoli: https://staituned.com/learn/articles
- Scopri Career OS: https://staituned.com/career-os
- Seguici su LinkedIn: https://www.linkedin.com/company/stai-tuned

Se hai domande o feedback, rispondi pure a questa mail. Leggiamo tutto.

---
Ricevi questa email perché ti sei iscritto alla newsletter su stAItuned.com.
Privacy Policy: https://staituned.com/privacy
`
}

export async function sendNewsletterWelcomeEmail(params: SendWelcomeEmailParams): Promise<boolean> {
    const { email } = params
    console.log(`[Newsletter Service] Preparing email for: ${email}`)

    if (!process.env.RESEND_API_KEY) {
        console.error('[Newsletter Service] CRITICAL: RESEND_API_KEY is missing in process.env')
        return false
    }

    try {
        console.log('[Newsletter Service] Calling Resend API...')
        const { error, data } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: '🚀 Benvenuto in stAItuned! (Iscrizione confermata)',
            html: generateWelcomeEmailHtml(),
            text: generateWelcomeEmailText(),
        })

        if (error) {
            console.error('[Resend Error DETAILS]:', JSON.stringify(error, null, 2))
            return false
        }
        console.log(`[Resend Success]: Welcome email sent to ${email}. ID: ${data?.id}`)
        return true
    } catch (err) {
        console.error('[Welcome Email Exception]:', err)
        return false
    }
}
