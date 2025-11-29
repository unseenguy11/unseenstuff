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

    const { email, name, score, categories } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Configure transporter
    // User must set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in Vercel
    const port = parseInt(process.env.SMTP_PORT || '587');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465, // True for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Format categories for email
    let breakdownHtml = '';
    if (categories) {
        const cats = [
            { key: 'pattern', label: 'Pattern Recognition' },
            { key: 'logic', label: 'Logical Reasoning' },
            { key: 'spatial', label: 'Spatial Awareness' },
            { key: 'verbal', label: 'Verbal Intelligence' },
            { key: 'numerical', label: 'Numerical Reasoning' },
            { key: 'abstract', label: 'Abstract Reasoning' },
            { key: 'critical', label: 'Critical Thinking' },
            { key: 'problem', label: 'Problem Solving' }
        ];

        breakdownHtml = `
            <div style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 20px;">
                <h3 style="margin-bottom: 15px;">COGNITIVE BREAKDOWN</h3>
                <table style="width: 100%; border-collapse: collapse; font-family: monospace;">
                    ${cats.map(cat => `
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${cat.label.toUpperCase()}</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${categories[cat.key] || 0}/100</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    }

    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"IQ Assessment" <results@iqcheck.ink>',
            to: email,
            subject: 'Your Official IQ Assessment Results',
            html: `
                <div style="font-family: monospace; padding: 20px; border: 1px solid #ccc; max-width: 600px; margin: 0 auto;">
                    <h2 style="text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px;">IQ Assessment Protocol // Results</h2>
                    
                    <div style="margin: 20px 0;">
                        <p><strong>CANDIDATE:</strong> ${email}</p>
                        <p><strong>STATUS:</strong> COMPLETED</p>
                        <p><strong>DATE:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>

                    <div style="background: #000; color: #fff; padding: 20px; text-align: center; margin: 30px 0;">
                        <span style="font-size: 14px; display: block; margin-bottom: 5px;">OFFICIAL IQ SCORE</span>
                        <h1 style="margin: 0; font-size: 48px;">${score}</h1>
                    </div>

                    ${breakdownHtml}

                    <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                        <p>IQCHECK.INK // OFFICIAL RECORD</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
}
