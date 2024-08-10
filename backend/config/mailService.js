const nodemailer = require('nodemailer');

// Create a transporter object using the Mailtrap SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'penta5pulse@gmail.com',
    pass: 'penta@12345' 
  }
});

/*
transporter.verify(function(error, success) {
  if (error) {
    console.error('Mail server error:', error);
  } else {
    console.log('Mail server connected successfully.');
  }
});*/

module.exports = transporter;