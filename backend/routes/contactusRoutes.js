const express = require('express');
const { getContactusResponses, sendContactusRequest } = require('../controllers/contactusController');
const router = express.Router();

router.get('/responses',getContactusResponses);
router.post('/send',sendContactusRequest);

module.exports = router;