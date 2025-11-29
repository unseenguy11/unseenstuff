const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, score } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }



    console.log(`[LEAD CAPTURE] Email: ${email}, Score: ${score}`);

    // Configure transporter (reuse existing setup)
    const port = parseInt(process.env.SMTP_PORT || '587');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        // Send notification to Admin (using SMTP_USER as admin email for now)
        const mailOptions = {
            from: process.env.SMTP_FROM || '"IQ Check System" <system@iqcheck.ink>',
            to: process.env.SMTP_USER, // Send to the admin's email
            subject: `New Lead Captured: ${email}`,
            text: `New lead captured!\n\nEmail: ${email}\nIQ Score: ${score}\n\n(This lead is logged in Vercel and emailed to you since no DB is connected yet.)`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Lead saved successfully' });
    } catch (error) {
        console.error('Lead save error:', error);
        // Even if email fails, we return success to the user so they can proceed, 
        // as long as we logged it above.
        return res.status(200).json({ message: 'Lead saved (email notification failed)' });
    }
}
