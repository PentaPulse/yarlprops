const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || 'your-api-key',
    apiSecret: process.env.MJ_APIKEY_PRIVATE || 'your-api-secret'
  });
  /*
  mailjet
  .get('ping')
  .request()
  .then(() => console.log("Mail server connected"))
  .catch(err => console.error("Failed to connect to Mailjet:", err));
  */

module.exports = mailjet;