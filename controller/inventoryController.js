const Inventory = require('../models/inventoryModel');
const Counter = require('../models/CounterModel');
const { check, validationResult } = require('express-validator');

// Helper function to generate next ID
const generateNextID = async () => {
    const counter = await Counter.findByIdAndUpdate(
        { _id: 'inventoryId' }, // A specific identifier for your inventory ID sequence
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true } // Create the counter if it doesn't exist
    );

    const nextIdNumber = counter.sequence_value;
    return `ID${nextIdNumber.toString().padStart(3, '0')}`;
};

// Add an item to the inventory
const addItem = async (req, res) => {
    // Validation
    await check('name').notEmpty().withMessage('Enter Name').run(req);
    await check('displayName').notEmpty().withMessage('Enter Display Name').run(req);
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
        let newItem;
        let nextId;

        for (let attempt = 0; attempt < 5; attempt++) { // Retry a few times if duplicate error occurs
            try {
                nextId = await generateNextID();
                newItem = new Inventory({
                    id: nextId,
                    ...req.body
                });
                await newItem.save();
                break; // Exit loop on success
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`Duplicate ID ${nextId}, retrying...`);
                } else {
                    throw err; // Non-duplicate error, re-throw
                }
            }
        }

        if (!newItem) {
            return res.status(500).json({ success: false, message: 'Failed to generate unique ID after multiple attempts.' });
        }

        res.status(201).json({ success: true, message: "New Item Added Successfully", data: newItem });
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
    await check('displayName').notEmpty().withMessage('Enter Display Name').run(req);
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
