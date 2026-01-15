
import { db } from './lib/firebase/admin'
import { sendNewsletterWelcomeEmail } from './lib/email/newsletterEmail'

async function debug() {
    console.log('--- DEBUG NEWSLETTER ---')
    const email = process.argv[2]
    if (!email) {
        console.log('Usage: npx ts-node scripts/debug-newsletter.ts <email>')

        console.log('\nLast 5 subscribers:')
        const subs = await db().collection('newsletter_subscribers').orderBy('subscribedAt', 'desc').limit(5).get()
        subs.forEach(doc => {
            console.log(`- ${doc.data().email} (${doc.data().subscribedAt}) Source: ${doc.data().source}`)
        })
        return
    }

    console.log(`Checking email: ${email}`)
    const existing = await db().collection('newsletter_subscribers').where('email', '==', email.toLowerCase()).get()

    if (!existing.empty) {
        console.log('User already exists in Firestore.')
    } else {
        console.log('User does not exist in Firestore.')
    }

    console.log('Attempting to send welcome email via Resend...')
    const result = await sendNewsletterWelcomeEmail({ email })
    console.log(`Result: ${result ? 'SUCCESS' : 'FAILURE'}`)
}

debug().catch(console.error)
