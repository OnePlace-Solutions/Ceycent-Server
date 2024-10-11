const express = require('express');
const router = express.Router();
const { addNewSupplier, getAllSuppliers, getSupplierById, updateSupplierById, deleteSupplierById } = require('../controller/SuplierController');

// Route for adding a new supplier
router.post('/add', addNewSupplier);

// Route for getting all suppliers
router.get('/', getAllSuppliers);

// Route for getting a supplier by id
router.get('/:id', getSupplierById);

// Route for updating a supplier by id
router.put('/:id', updateSupplierById);

// Route for deleting a supplier by id
router.delete('/:id', deleteSupplierById);

module.exports = router; 