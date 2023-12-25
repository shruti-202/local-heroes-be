const { titleValidator, descriptionValidator } = require("../constants/validator");
const Users = require("../models/UserModel");
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

const updateProviderAvailability = async (req, res) => {};

const addProviderService = async (req, res) => {
  const { serviceType, serviceDetails } = req.body;
  const { title, price, description } = serviceDetails;

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
        "Invalid Title Format: Start with uppercase followed by lowercase & contains only alphabetical characters.",
    });
  }
  if (!price) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please enter the Price",
    });
  }
  if (price <= 1 || price > 5000) {
    return res.status(400).json({
      statusCode: 400,
      message: "Price should be more than 1 & less than 5000 Rs",
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
      message: "Invalid Description Format. Start with a capital letter"
    });
  }
 
  if (serviceType.length === 0) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid service type",
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
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: "Something went wrong!!!",
    });
  }
  return res.status(200).json({
    statusCode: 200,
    message: "Service Added Successfully",
  });
};

module.exports = { authenticateToken, updateProviderAvailability, addProviderService };
