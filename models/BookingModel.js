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
        type: {
            addressLineOne: {
                type: String,
                required: true
            },
            addressLineTwo: String,
            state: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            pinCode: {
                type: String,
                required: true,
                validate: {
                    validator: function(v) {
                        return /^\d{6}$/.test(v); // Validate pinCode format (6 digits)
                    },
                    message: props => `${props.value} is not a valid pin code!`
                }
            }
        },
        required: false,
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