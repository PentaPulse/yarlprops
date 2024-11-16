const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure the SMTP transporter (e.g., Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'slsachiboy.yt@gmail.com',
        pass: 'uedz ovrp xipz rdtz'
    }
});

// Define the Cloud Function to send emails
exports.sendEmail = functions.https.onCall(async (data, context) => {
    const { to, subject, text } = data;

    const mailOptions = {
        from: 'slsachiboy.yt@gmail.com',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Email sent successfully!' };
        throw new functions.https.HttpsError('internal', error.message);
    }
});