const nodemailer = require('nodemailer');


// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'slsachiboy.yt@gmail.com', // Replace with your Gmail
        pass: 'clgl mrci ctlp sgzv',   // Replace with your App Password
    },
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ success: false, message: 'Method not allowed' });
    }

    const { to, subject, text } = req.body;

    const mailOptions = {
        from: 'yarlprops@contact.p5p.lk', // Sender address
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ success: false, message: 'Failed to send email', error: error.message });
    }
}
