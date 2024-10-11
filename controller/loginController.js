const loginmodel = require('../models/loginModal')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// add a new user
const addNewUser = async(req, res) => {
    try {
        const existingUser = await loginmodel.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "User already exists" });
        }
        const hashpassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new loginmodel({
            username: req.body.username,
            password: hashpassword
        });
        await newUser.save();
        return res.status(201).json({ status: "succes", message: "User added successfully" });

    }
    catch(err){
        return res.status(500).json({status: "error", message: err.message});
    }
}

//login function and generate token
const login = async(req, res) =>{
    try{
        const {username, password} = req.body;
        const user = await loginmodel.findOne({username : username});
        if(!user){
            return res.status(404).json({status: "error", message: "User not found"});
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({status: "error", message: "Invalid password"});
        }
        const token = jwt.sign({id: user._id, username:user.username},process.env.JWT_SECRET, {expiresIn: '8h'});
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({status: "success", message: "Login successful", token: token});

    }
    catch(err){
        return res.status(500).json({status: "error", message: err.message});
}
}

module.exports = {
    addNewUser,
    login
}