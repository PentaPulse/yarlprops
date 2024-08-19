const express = require('express');
const router = express.Router();
const { getService } = require('../../backend/controllers/serviceController');

router.get('/services',getService);

module.exports = router;