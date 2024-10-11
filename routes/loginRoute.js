const express = require('express');
const router = express.Router();
const { addNewUser,login } = require('../controller/loginController');

// Route for adding a new user
router.post('/add', addNewUser);

// Route for user login
router.post('/login', login);


module.exports = router; // Properly export the router
