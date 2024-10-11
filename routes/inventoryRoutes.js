const express = require('express');
const router = express.Router();
const { addItem, getAllItems, updateItem, deleteItem, getItemById } = require('../controller/inventoryController');

// Route for adding an item
router.post('/add', addItem);

// Route for getting all items
router.get('/', getAllItems);

// Route for updating an item
router.put('/:id', updateItem);

//  Route for deleting an Item
router.delete('/:id', deleteItem);

// Route for getting an item by ID
router.get('/:id', getItemById);

module.exports = router;