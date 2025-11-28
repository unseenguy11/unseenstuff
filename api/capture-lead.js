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

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Configure transporter
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
        // Send notification to Admin
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_USER, // Send to Admin
            subject: 'New Lead Captured - IQ Assessment',
            text: `New lead email captured: ${email}`,
            html: `<p>New lead captured:</p><h2>${email}</h2>`
        });

        return res.status(200).json({ message: 'Lead captured' });
    } catch (error) {
        console.error('Lead capture error:', error);
        // Don't block the user flow if admin email fails, just log it
        return res.status(200).json({ message: 'Lead captured (offline)' });
    }
}
