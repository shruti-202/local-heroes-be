require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const cookieParser = require('cookie-parser')
const healthRoutes = require ("./routes/HealthRoutes")
const authRoutes = require('./routes/AuthRoutes')

/**
 * APP
 */
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}));

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
app.use('/api/v1/auth', authRoutes)

/**
 * LISTEN
 */
app.listen(process.env.APP_PORT,()=>console.log(`APP IS LISTENING ON PORT:${process.env.APP_PORT}`))
