const express = require('express');
const { getProvidersByCategory, createBooking } = require('../controllers/ClientController');
const router = express.Router();

router.get("/providers", getProvidersByCategory)
router.post("/booking", createBooking)

module.exports = router;