
const { db } = require('../lib/firebase/admin')
const { sendNewsletterWelcomeEmail } = require('../lib/email/newsletterEmail')

async function debug() {
    console.log('--- DEBUG NEWSLETTER ---')
    try {
        const email = process.argv[2]
        if (!email) {
            console.log('\nLast 5 subscribers:')
            const subs = await db().collection('newsletter_subscribers').orderBy('subscribedAt', 'desc').limit(5).get()
            if (subs.empty) {
                console.log('No subscribers found.')
            } else {
                subs.forEach(doc => {
                    const data = doc.data()
                    console.log(`- ${data.email} (${data.subscribedAt}) Source: ${data.source}`)
                })
            }
            return
        }

        console.log(`Checking email: ${email}`)
        const docId = Buffer.from(email.toLowerCase()).toString('base64').replace(/[/+=]/g, '_')
        const doc = await db().collection('newsletter_subscribers').doc(docId).get()

        if (doc.exists) {
            console.log(`User already exists in Firestore (ID: ${docId}).`)
        } else {
            console.log(`User does not exist in Firestore (ID: ${docId}).`)
        }

        console.log('Attempting to send welcome email via Resend...')
        const result = await sendNewsletterWelcomeEmail({ email })
        console.log(`Result: ${result ? 'SUCCESS' : 'FAILURE'}`)
    } catch (err) {
        console.error('Debug error:', err)
    }
}

debug()
