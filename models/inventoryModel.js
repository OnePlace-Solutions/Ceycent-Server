const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true, // Ensure the ID is unique
        required: true
    },

    name: {
        type: String,
        required: true
    },
    displayName:{
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    tag: {
        type: String,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },

    volumeWeight: {
        type: String,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Inventory = mongoose.model('inventory', inventorySchema);
module.exports = Inventory;