const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    customers: [ // Array to store customer details
        {
            cusID: { type: String, required: true },
            cusName: { type: String, required: true },
            cusEmail: { type: String, required: true },
            cusPhone1: { type: String, required: true },
            cusPhone2: { type: String },
            cusAddress: {
                street: String,
                city: String,
                state: String,
                zip: String
            }
        }
    ],
    items: [
        {
            itemID: String,
            name: String,
            sellingPrice: Number,
            quantity: Number,
            discount: Number,
            total: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    saleStatus: {
        type: String,
        enum: ['To be Shift', 'Shiped', 'completed'],
        default: 'Blocked'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    trackingNumber: {
        type: String
    }
});

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
