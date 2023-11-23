const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userTypes = ["PROVIDER", "CLIENT"];

const registerUser = async (req, res) => {
    const { name, phone, email, username, password ,userType } = req.body;
    
    if(!name){
        res.status(400).json({error:"Name cannot be empty"})
        return;
    }
    if(!email){
        res.status(400).json({error:"Email cannot be empty"})
        return;
    }
    if(!phone){
        res.status(400).json({error:"Phone number cannot be empty"})
        return;
    }
    if(!username){
        res.status(400).json({error:"Username cannot be empty"})
        return;
    }
    if(!password){
        res.status(400).json({error:"Password cannot be empty"})
        return;
    }
    if (!userType) {
        res.status(400).json({error: 'userType can not be empty'})
        return
    }
    if (name.length < 2 || name.length > 30) {
        res.status(400).json({error: 'name length should be greater than 1 and less than equals to 30 characters'})
        return
    }
    if (phone.length < 10 || phone.length > 10) {
        res.status(400).json({error: 'Invalid Phone Number'})
        return
    }
    if (!emailRegex.test(email)) {
        res.status(400).json({error: 'Invalid Email'})
        return
    }
    if (!usernameRegex.test(username)) {
        res.status(400).json({error: 'Invalid username! It should have only a-z A-Z 0-9 _ characters and should have 8-30 characters'})
        return
    }
    if (!passwordRegex.test(password)) {
        res.status(400).json({error: 'Invalid Password! Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:'})
        return
    }
    if (!userTypes.includes(userType)) {
        res.status(400).json({error: 'Invalid User Type'})
        return
    }
    
    try {
        const userByUsername = await UserModel.findOne({username: username});
        if (userByUsername) {
            res.status(400).json({error: 'Username Already Exists'});
            return;
        }
        const userByEmail = await UserModel.findOne({email: email});
        if (userByEmail) {
            res.status(400).json({error: 'Email Already Exists'})
            return;
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
            data: userDoc
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error" })
    }
}

const loginUser = async (req, res) => {
    const {username, password} = req.body;

    if (!usernameRegex.test(username)) {
        res.status(400).json({error: 'Invalid username! It should have only a-z A-Z 0-9 _ characters and should have 8-30 characters'})
        return
    }
    if (!passwordRegex.test(password)) {
        res.status(400).json({error: 'Invalid Password! Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:'})
        return
    }

    try {
        const userDoc = await UserModel.findOne({username: username});
        if (!userDoc){
            res.status(400).json({error: 'Username Does not Exists'});
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, userDoc.password);
        if (!isPasswordCorrect) {
            res.status(400).json({error: 'Invalid Password'});
            return;
        }
        
        const token = jwt.sign({id : userDoc._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
        
        res.cookie('token', token, {httpOnly: true, sameSite: 'none', secure: true})
            .status(200)
            .json({
                message: 'User Logged In',
                data: {
                    userId: userDoc._id,
                    username: userDoc.username,
                    email: userDoc.email,
                    phone: userDoc.phone,
                    type: userDoc.userType
                }
            })
    } catch (err) {
        res.status(400).json({error: "something went wrong"})
    }
}

const getProfile = async (req, res) => {
    const {token} = req.cookies;

    if (!token) {
        res.status(401).end();
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userDoc = await UserModel.findOne({_id: decoded.id});
        const {_id, username, email, phone, userType} = userDoc;
        res.status(200)
            .json({
                data: {
                    userId: _id, 
                    username: username,
                    email: email,
                    phone: phone,
                    type: userType
                }
            });
    } catch (err) {
        res.status(401).end();
        return
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie('token').status(200).json({success: "User Logout"});
}

module.exports = { registerUser, loginUser, getProfile, logoutUser };