
const { Resend } = require('resend');

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

async function test() {
    console.log('Testing Resend...');
    try {
        const result = await resend.emails.send({
            from: 'stAItuned <noreply@staituned.com>',
            to: 'danielemoltisanti@gmail.com', // Assuming this is the user's email or a safe test
            subject: 'Test Resend from Script',
            html: '<p>Benvenuto! Se leggi questo, Resend funziona.</p>'
        });
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
