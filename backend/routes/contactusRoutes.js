const express = require('express');
const { getContactusResponses, sendContactusRequest, sendReply } = require('../controllers/contactusController');
const router = express.Router();

router.get('/responses',getContactusResponses);
router.post('/send',sendContactusRequest);
router.post('/reply',sendReply);

module.exports = router;