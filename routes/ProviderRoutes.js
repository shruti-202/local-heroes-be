const express = require('express');
const { authenticateToken, updateProviderAvailability, addProviderService } = require('../controllers/ProviderController');
const router = express.Router();


router.put("/availability", authenticateToken, updateProviderAvailability)
router.post("/service", authenticateToken, addProviderService)


module.exports = router;