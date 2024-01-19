const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);
const { nameValidator, emailValidator, usernameValidator, passwordValidator,  } = require("../constants/validator");

const userTypes = ["PROVIDER", "CLIENT"];

const registerUser = async (req, res) => {
  const { name, phone, email, username, password, userType } = req.body;

  if (!name) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please enter your Name",
    });
  }
  if (name.length < 2 || name.length > 30) {
    return res.status(400).json({
      statusCode: 400,
      message: "Name length should be greater than 1 and less than 30 characters",
    });
  }
  if (!nameValidator(name)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Name Format: First [Last], both start with uppercase, & contains only alphabetical characters"
    });
    
  }
  if (!email) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please enter your email id"
    });
  }
  if (!emailValidator(email)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Email"
    });
  }
  if (!phone) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please enter your Phone Number"
    });
  }
  if (phone.length < 10 || phone.length > 10) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Phone Number"
    });
  }
  if (!username) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please enter Username"
    });
  }
  if (!usernameValidator(username)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid username! It should have only a-z A-Z 0-9 _ characters and should have 8-30 characters"
    });
  }
  if (!password) {
    return res.status(400).json({
      statusCode: 400,
      message: "Password cannot be empty"
    });
  }
  if (!passwordValidator(password)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Password! Minimum eight characters, at least one uppercase letter, lowercase letter, number and special character"
    });
  }
  if (!userType) {
    return res.status(400).json({
      statusCode: 400,
      message: "UserType can not be empty"
    });
  }
  if (!userTypes.includes(userType)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid User Type"
    });
  }
 
  try {
    const userByUsername = await UserModel.findOne({ username: username });
    if (userByUsername) {
      return res.status(400).json({
        statusCode: 400,
        message: "Username Already Exists"
      });
    }
    const userByEmail = await UserModel.findOne({ email: email });
    if (userByEmail) {
      return res.status(400).json({
        statusCode: 400,
        message: "Email Already Exists"
      });
    }

    const userDoc = await UserModel.create({
      name,
      phone,
      email,
      username,
      password: bcrypt.hashSync(password, salt),
      userType,
    });
    res.status(201).json({
      message: "User Created",
      data: userDoc,
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "Server Error"
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!usernameValidator(username)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid username! It should have only a-z A-Z 0-9 _ characters and should have 8-30 characters"
    });
  }
  if (!passwordValidator(password)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid Password! Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    });
  }

  try {
    const userDoc = await UserModel.findOne({ username: username });
    if (!userDoc) {
      return res.status(400).json({
        statusCode: 400,
        message: "Username Does not Exists"
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Password"
      });
    }

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true })
      .status(200)
      .json({
        message: "User Logged In",
        data: {
          userId: userDoc._id,
          username: userDoc.username,
          email: userDoc.email,
          phone: userDoc.phone,
          type: userDoc.userType,
        },
      });
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: "Something went wrong"
    });
  }
};

const getProfile = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).end();
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userDoc = await UserModel.findOne({ _id: decoded.id });
    const {_id, username, email, phone, userType } = userDoc;
    res.status(200).json({
      data: {
        userId: _id,
        username: username,
        email: email,
        phone: phone,
        type: userType,
      },
    });
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: "Something went wrong"
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token").status(200).json({ success: "User Logout" });
};

module.exports = { registerUser, loginUser, getProfile, logoutUser };
