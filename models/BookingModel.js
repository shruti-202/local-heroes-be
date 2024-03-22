const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    providerServiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    status: {
        type: String,
        enum: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
        required: [true, "Empty UserType"]
    },
    clientAddress: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    startTime: {
        type: String,
        required: false
    },
    endTime: {
        type: String,
        required: false
    },
    paymentMode: {
        type: String,
        enum: ["UPI","COD"],
        required: [true, "Empty payment mode"]
    }
},
{
    timestamps: true
}
)

const Booking = mongoose.model("bookings", BookingSchema);

module.exports = Booking