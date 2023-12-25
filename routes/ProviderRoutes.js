const express = require('express');
const { authenticateToken, updateProviderAvailability, addProviderService } = require('../controllers/ProviderController');
const router = express.Router();


router.put("/availability", updateProviderAvailability)
router.post("/service", authenticateToken, addProviderService)


module.exports = router;