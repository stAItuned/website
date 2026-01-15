
const { Resend } = require('resend');

const apiKey = 're_3kxLqQ1M_9qWQd4AmB2XLqhkDdjKLwLnR'; // From .env
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
