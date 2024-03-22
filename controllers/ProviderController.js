const { titleValidator, descriptionValidator } = require("../constants/Validator");
const Users = require("../models/UserModel");
const Booking = require("../models/BookingModel");
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      statusCode: 400,
      message: "Access denied. Token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userDoc = await Users.findOne({ _id: decoded.id });

    if (!userDoc) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Token",
      });
    }
    req.user = userDoc;
    next();
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Token",
    });
  }
};

const getProviderRequests = async (req, res) => {
  let query = { providerId: req.user._id };

  if (req.query.status && req.query.status !== "ALL") {
    query.status = req.query.status;
  }

  try {
    const bookings = await Booking.find(query).populate("clientId", [
      "name",
      "phone",
    ]);

    const bookingsWithServiceDetail = bookings.map((booking) => {
      const service = req.user.services.find(
        (service) =>
          service._id.toString() === booking.providerServiceId.toString()
      );
      return {
        ...booking.toObject(),
        serviceName: service.title,
        servicePrice: service.price,
      };
    });
    console.log("bookings", bookings);
    return res.status(200).json({
      data: bookingsWithServiceDetail,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      statusCode: 400,
      message: "Something went wrong",
    });
  }
};

const updateProviderRequest = async (req, res) => {
  const { bookingIdToUpdate, status } = req.body;

  try {
    const bookingDoc = await Booking.findById(bookingIdToUpdate);
    bookingDoc.status = status;
    const updatedBooking = await bookingDoc.save();
    return res.status(200).json({
      statusCode: 200,
      data: updatedBooking,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      statusCode: 400,
      message: "Something went wrong",
    });
  }
};

const updateProviderAvailability = async (req, res) => {
  const { daysType, startDate, endDate, startTime, endTime } = req.body;

  let startDateObj = null;
  let endDateObj = null;

  if (daysType === "DATE_RANGE") {
    if (!startDate || startDate.length === 0 || startDate === undefined) {
      console.log("testing3");
      return res.status(400).json({
        statusCode: 400,
        message: "Please select Start Date",
      });
    }
    if (!endDate || endDate.length === 0 || endDate === undefined) {
      return res.status(400).json({
        statusCode: 400,
        message: "Please select End Date",
      });
    }
    startDateObj = new Date(startDate);
    endDateObj = new Date(endDate);

    if (startDateObj >= endDateObj) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Request: start date should be less than end date",
      });
    }
  } else if (daysType === "ALL_DAYS") {
  } else {
    return res.status(400).json({
      statusCode: 400,
      message: "Please select Day Type",
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
      message: "Please select Start Time",
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
      message: "Please select End Time",
    });
  }
  if (startTime > endTime) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Request: start time should be less than end time",
    });
  }
  try {
    const userDoc = await Users.findOne({ _id: req.user._id });
    userDoc.availability.daysType = daysType;
    userDoc.availability.startDate = daysType === "ALL_DAYS" ? null : startDate;
    userDoc.availability.endDate = daysType === "ALL_DAYS" ? null : endDate;
    userDoc.availability.startTime = startTime;
    userDoc.availability.endTime = endTime;
    userDoc.save();
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: "Something went wrong!!!",
    });
  }
  return res.status(200).json({
    statusCode: 200,
    message: "User availability updated!!!",
  });
};

const addProviderService = async (req, res) => {
  const { serviceType, serviceDetails } = req.body;
  let { title, price, description } = serviceDetails;

  title = title.trim();
  description = description.trim();

  if (!serviceType) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please select Service Category",
    });
  }

  if (!title) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please enter the Title",
    });
  }

  if (title?.length < 2 || title?.length >= 100) {
    return res.status(400).json({
      statusCode: 400,
      message: "Title should be more than 1 less than 100 characters",
    });
  }

  if (!titleValidator(title)) {
    return res.status(400).json({
      statusCode: 400,
      message:
        "Invalid Title Format: Start with uppercase followed by either all uppercase/lowercase & Title cannot contain gibberish/special characters",
    });
  }
  if (!price) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please enter the Price",
    });
  }
  if (price <= 9 || price > 5000) {
    return res.status(400).json({
      statusCode: 400,
      message: "Price should be more than 10 & less than 5000 Rs",
    });
  }
  if (!description) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please enter the Description",
    });
  }
  if (description?.length < 5 || description?.length >= 500) {
    return res.status(400).json({
      statusCode: 400,
      message: "Description should be more than 5 & less than 500 characters",
    });
  }
  if (!descriptionValidator(description)) {
    return res.status(400).json({
      statusCode: 400,
      message:
        "Invalid Description Format: Start with uppercase, followed by optional uppercase or lowercase or number, and words separated by spaces.",
    });
  }

  if (!serviceType) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Service Type",
    });
  }
  try {
    const userDoc = await Users.findOne({ _id: req.user._id });
    const newService = {
      title: title,
      description: description,
      price: price,
      category: serviceType,
    };
    userDoc.services.push(newService);
    userDoc.save();
    return res.status(200).json({
      statusCode: 200,
      message: "Service Added Successfully",
    });
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: "Something went wrong!!!",
    });
  }
};

module.exports = { authenticateToken, updateProviderAvailability, addProviderService, getProviderRequests, updateProviderRequest };
