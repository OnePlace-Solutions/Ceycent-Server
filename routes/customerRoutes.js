const express = require('express');
const router = express.Router();
const { addNewCustomer, getAllCustomers, getCustomerById, updateCustomerById, deleteCustomerById } = require('../controller/customerController');

// Route for adding a new customer
router.post('/add', addNewCustomer);

// Route for getting all customers
router.get('/', getAllCustomers);

// Route for getting a customer by id
router.get('/:id', getCustomerById);

// Route for updating a customer by id
router.put('/:id', updateCustomerById);

// Route for deleting a customer by id
router.delete('/:id', deleteCustomerById);

module.exports = router;