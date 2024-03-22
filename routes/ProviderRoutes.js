const express = require('express');
const { authenticateToken, updateProviderAvailability, addProviderService, getProviderRequests , updateProviderRequest} = require('../controllers/ProviderController');
const router = express.Router();

router.get("/requests", authenticateToken, getProviderRequests)
router.put("/request",authenticateToken, updateProviderRequest)
router.put("/availability", authenticateToken, updateProviderAvailability)
router.post("/service", authenticateToken, addProviderService)


module.exports = router;