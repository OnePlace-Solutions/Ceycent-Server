const Inventory = require('../models/inventoryModel');
const { check, validationResult } = require('express-validator');

// Helper function to generate next ID
const generateNextID = async () => {
    const lastItem = await Inventory.findOne().sort({ createdAt: -1 }); // Get the last inserted item based on creation time

    if (!lastItem || !lastItem.id) {
        return 'ID001'; // If no items exist, start with ID001
    }

    // Extract the number from the last ID and increment it
    const lastIdNumber = parseInt(lastItem.id.slice(2), 10); // Remove 'ID' and convert to a number
    const nextIdNumber = lastIdNumber + 1;

    // Format the next ID (e.g., ID001, ID002)
    const nextId = `ID${nextIdNumber.toString().padStart(3, '0')}`; // Ensure it's always 3 digits
    return nextId;
};

// Add an item to the inventory
const addItem = async (req, res) => {
    // Validation
    await check('name').notEmpty().withMessage('Enter Name').run(req);
    await check('tag').notEmpty().withMessage('Enter Tag').run(req);
    await check('costPrice').notEmpty().withMessage('Enter  Cost Price').run(req);
    await check('sellingPrice').notEmpty().withMessage('Enter  Selling Price').run(req);
    await check('volumeWeight').notEmpty().withMessage('Enter Volume Weight').run(req);
    await check('supplier').notEmpty().withMessage('Enter Supplier').run(req);
    await check('quantity').notEmpty().withMessage('Enter Quantity').run(req);
    await check('status').notEmpty().withMessage('Enter Status').run(req);

    // Handle validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        // Generate the next custom ID
        const nextId = await generateNextID();

        // Create new inventory item with generated ID
        const newItem = new Inventory({
            id: nextId, // Assign the generated ID
            ...req.body
        });

        const result = await newItem.save();

        res.status(201).json({ success: true, message: "New Item Added Successfully", data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.log(err);
    }
};

// Get all items from the inventory
const getAllItems = async (req, res) => {
    try {
        const items = await Inventory.find();
        if (!items || items.length === 0) {
            return res.status(404).json({ success: false, message: 'No items found' });
        }
        res.status(200).json({ success: true, data: items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update an item in the inventory
const updateItem = async (req, res) => {
    // Validate the inputs if needed
    await check('name').notEmpty().withMessage('Enter Name').run(req);
    await check('tag').notEmpty().withMessage('Enter Tag').run(req);
    await check('costPrice').notEmpty().withMessage('Enter Cost Price').run(req);
    await check('sellingPrice').notEmpty().withMessage('Enter Selling Price').run(req);
    await check('volumeWeight').notEmpty().withMessage('Enter Volume Weight').run(req);
    await check('supplier').notEmpty().withMessage('Enter Supplier').run(req);
    await check('quantity').notEmpty().withMessage('Enter Quantity').run(req);
    await check('status').notEmpty().withMessage('Enter Status').run(req);

    // Handle validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const itemId = req.params.id; // Get the item ID from the request parameters
        const updatedItem = await Inventory.findOneAndUpdate(
            { id: itemId }, // Find the item by the custom ID (e.g., ID001)
            { ...req.body, updatedAt: Date.now() }, // Update the item with new values, including updatedAt timestamp
            { new: true } // Return the updated item
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: `Item with ID ${itemId} not found` });
        }

        res.status(200).json({ success: true, message: "Item Updated Successfully", data: updatedItem });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};


// Delete an item from the inventory
const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id; // Get the item ID from the request parameters
        const deletedItem = await Inventory.findOneAndDelete({ id: itemId });

        if (!deletedItem) {
            return res.status(404).json({ success: false, message: `Item with ID ${itemId} not found` });
        }

        res.status(200).json({ success: true, message: "Item Deleted Successfully", data: deletedItem });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

//get item using ID
const getItemById = async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Inventory.findOne({ id: itemId });

        if (!item) {
            return res.status(404).json({ success: false, message: `Item with ID ${itemId} not found` });
        }

        res.status(200).json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};


module.exports = {
    addItem,
    getAllItems,
    updateItem,
    deleteItem,
    getItemById,
};
