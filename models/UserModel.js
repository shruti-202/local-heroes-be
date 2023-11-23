const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Empty Name"]
    },
    phone:{
        type: String,
        required: [true,"Empty Phone"]
    },
    email:{
        type: String,
        required: [true,"Empty Email"]
    },
    username:{
        type:String,
        required: [true,"Empty Username"]
    },
    password:{
        type: String,
        required: [true,"Empty Password"]
    },
    userType:{
        type: String,
        enum: ["PROVIDER","CLIENT"],
        required: [true,"Empty UserType"]
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('users',UserSchema)

