require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const healthRoutes = require ("./routes/HealthRoutes")

/**
 * APP
 */
const app = express();

/**
 * DATABASE
 */
mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.once("connected", () => console.log("🟢 Database connected"));
mongoose.connection.on("error", (err) => console.log("🔴 Database Error", err));

/**
 * ROUTES
 */
app.use("/health",healthRoutes)

/**
 * LISTEN
 */
app.listen(process.env.APP_PORT,()=>console.log(`APP IS LISTENING ON PORT:${process.env.App_PORT}`))
