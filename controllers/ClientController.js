const Users = require("../models/UserModel");
const Booking = require("../models/BookingModel");
const jwt = require("jsonwebtoken");
const { pinCodeValidator } = require("../constants/Validator");

const getProvidersByCategory = async (req, res) => {
  const category = req.query.category;

  if (!category || category.length === 0) {
    return res.status(400).json({
      statusCode: 400,
      message: "Category is not provided",
    });
  }

  const validCategories = [
    "HOME_SERVICES",
    "TECHNOLOGY_AND_ELECTRONICS",
    "BEAUTY_AND_GROOMING",
    "EDUCATIONAL_SERVICES",
    "MISCELLANEOUS_SERVICES",
  ];

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid category specified. Please check the spelling.",
    });
  }

  try {
    const providers = await Users.find({
      userType: "PROVIDER",
      "services.category": category,
    });
    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: { providers },
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const createBooking = async (req, res) => {
  const token = req.cookies.token;
  console.log("token", token);
  console.log("cookies", req.cookies);
  console.log("Body",req.body)
  const { providerId, providerServiceId, date, startTime, endTime, address, paymentMode } = req.body

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); 

  const dateParts = date.split('/');
  const selectedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

if (selectedDate < currentDate) {
  return res.status(400).json({
    statusCode: 400,
    message: "Invalid Request: Selected date should be greater than or equal to the current date",
  });
}

if (!startTime || startTime.length === 0 || startTime === undefined || startTime === "Invalid Date") {
    return res.status(400).json({
      statusCode: 400,
      message: "Please select Start Time",
    });
  }

if (!endTime || endTime.length === 0 || endTime === undefined || endTime === "Invalid Date") {
    return res.status(400).json({
      statusCode: 400,
      message: "Please select End Time",
    });
  }

if (startTime > endTime) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Request: start time should be less than end time",
    });
  }

  // const { addressLineOne, state, city, pinCode } = address;
  // if (!addressLineOne || addressLineOne.length < 5) {
  //   return res.status(400).json({
  //     statusCode: 400,
  //     message:
  //       "Invalid Request: Address line one should be at least 5 characters",
  //   });
  // }
  // if (!state || state.length < 2) {
  //   return res.status(400).json({
  //     statusCode: 400,
  //     message: "Invalid Request: State should be at least 2 characters",
  //   });
  // }
  // if (!city || city.length < 2) {
  //   return res.status(400).json({
  //     statusCode: 400,
  //     message: "Invalid Request: City should be at least 2 characters",
  //   });
  // }

  // if (!pinCode || !pinCodeValidator(pinCode)) {
  //   return res.status(400).json({
  //     statusCode: 400,
  //     message:
  //       "Invalid Request: Pincode should be 6 numbers excluding starting 0",
  //   });
  // }

  try {
    const tokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const clientUserDoc = await Users.findById(tokenInfo.id);
    const providerUserDoc = await Users.findById(providerId);
    const service = providerUserDoc.services.find((service) => service._id.toString() === providerServiceId);

    const bookingDoc = await Booking.create({
      providerId: providerUserDoc._id,
      providerServiceId: service._id,
      clientId: clientUserDoc._id,
      status:"IN_PROGRESS",
      clientAddress: address,
      date: date,
      startTime: startTime,
      endTime: endTime,
      paymentMode: paymentMode
    });
    res.status(201).json({
      message: "Booking Created Successfully",
      data: bookingDoc,
    });
  } catch (e) {
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
    });
  }
};

module.exports = { getProvidersByCategory, createBooking };
