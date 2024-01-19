const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Empty Name"],
    },
    phone: {
      type: String,
      required: [true, "Empty Phone"],
    },
    email: {
      type: String,
      required: [true, "Empty Email"],
    },
    username: {
      type: String,
      required: [true, "Empty Username"],
    },
    password: {
      type: String,
      required: [true, "Empty Password"],
    },
    userType: {
      type: String,
      enum: ["PROVIDER", "CLIENT"],
      required: [true, "Empty UserType"],
    },

    availability: {
      daysType: {
        type: String,
        required: false
      },
      startDate: {
        type: String,
        required: false,
      },
      endDate: {
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
    },

    services: [
        {
            category: {
                type: String,
                enum: [
                    "HOME_SERVICES",
                    "TECHNOLOGY_AND_ELECTRONICS",
                    "BEAUTY_AND_GROOMING",
                    "EDUCATIONAL_SERVICES",
                    "MISCELLANEOUS_SERVICES",
                ],
                require: false
            },
            title: {
                type: String,
                require: false
            },
            description: {
                type: String,
                require: false
            },
            price: {
                type: String,
                require: false
            },
        }
    ]
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("users", UserSchema);

module.exports = Users


