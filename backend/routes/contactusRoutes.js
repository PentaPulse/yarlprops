const express = require('express');
const { getContactusResponses } = require('../controllers/contactusController');
const router = express.Router();

router.get('/responses',getContactusResponses);

module.exports = router;