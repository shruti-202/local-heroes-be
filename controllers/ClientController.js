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
  const {
    providerId,
    providerServiceId,
    date,
    startTime,
    endTime,
    paymentMode,
  } = req.body;
  const { clientAddress } = req.body;
  console.log(req.body);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const dateParts = date.split("/");
  const selectedDate = new Date(
    `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
  );

  if (!date) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Request: Please select a date for the appointment",
    });
  }

  if (selectedDate < currentDate) {
    return res.status(400).json({
      statusCode: 400,
      message:
        "Invalid Request: Selected date should be greater than or equal to the current date",
    });
  }

  if (
    !startTime ||
    startTime.length === 0 ||
    startTime === undefined ||
    startTime === "Invalid Date"
  ) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Request: Please select Start Time",
    });
  }

  if (
    !endTime ||
    endTime.length === 0 ||
    endTime === undefined ||
    endTime === "Invalid Date"
  ) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Request: Please select End Time",
    });
  }

  if (startTime > endTime) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Request: Start Time should be less than End Time",
    });
  }
  if (typeof clientAddress === "object") {
    const { addressLineOne, state, city, pinCode } = clientAddress;
    if (!addressLineOne) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Request: Address line one is required",
      });
    }

    if (addressLineOne.length < 5) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Invalid Request: Address line one should be more than 5 characters",
      });
    }
    if (addressLineOne.length > 50) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Invalid Request: Address line one should be less than 50 characters",
      });
    }
    if (!state) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Request: State is required",
      });
    }
    if (state.length < 2 || state.length > 20) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Invalid Request: State should be more than 2 & less than 20 characters",
      });
    }
    if (!city) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Request: City is required",
      });
    }
    if (city.length < 2 || city.length > 20) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Invalid Request: City should be more than 2 & less than 20 characters",
      });
    }
    if (!pinCode) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Request: Pincode is required",
      });
    }
    if (!pinCodeValidator(pinCode)) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Invalid Request: Pincode should be 6 numbers excluding starting with 0",
      });
    }
  }

  try {
    const tokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const clientUserDoc = await Users.findById(tokenInfo.id);
    const providerUserDoc = await Users.findById(providerId);
    const service = providerUserDoc.services.find(
      (service) => service._id.toString() === providerServiceId
    );

    const bookingDoc = await Booking.create({
      providerId: providerUserDoc._id,
      providerServiceId: service._id,
      clientId: clientUserDoc._id,
      status: "IN_PROGRESS",
      clientAddress: clientAddress,
      date: date,
      startTime: startTime,
      endTime: endTime,
      paymentMode: paymentMode,
    });
    res.status(201).json({
      message: "Booking Created Successfully",
      data: bookingDoc,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
    });
  }
};

module.exports = { getProvidersByCategory, createBooking };
