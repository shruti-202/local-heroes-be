const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("Local Heroes Backend is Healthy")
})

module.exports = router;