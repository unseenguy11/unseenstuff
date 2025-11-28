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

    const { email, name, score, certificateData } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Configure transporter
    // User must set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in Vercel
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // Use true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"IQ Assessment" <results@iqcheck.ink>',
            to: email,
            subject: 'Your Official IQ Assessment Results',
            html: `
                <div style="font-family: monospace; padding: 20px; border: 1px solid #ccc;">
                    <h2 style="text-transform: uppercase;">IQ Assessment Protocol // Results</h2>
                    <p>CANDIDATE: ${name || 'UNKNOWN'}</p>
                    <p>STATUS: COMPLETED</p>
                    <div style="background: #000; color: #fff; padding: 15px; margin: 20px 0; display: inline-block;">
                        <h1 style="margin: 0; font-size: 24px;">IQ SCORE: ${score}</h1>
                    </div>
                    <p>Your official certificate is attached to this transmission.</p>
                    <br>
                    <p style="font-size: 12px; color: #666;">IQCHECK.INK // OFFICIAL RECORD</p>
                </div>
            `,
        };

        if (certificateData) {
            mailOptions.attachments = [
                {
                    filename: `IQ_Certificate_${(name || 'User').replace(/\s+/g, '_')}.png`,
                    path: certificateData
                }
            ];
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
}
