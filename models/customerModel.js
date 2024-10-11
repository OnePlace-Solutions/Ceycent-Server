const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    cusID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cusName: {
        type: String,
        required: true,
        trim: true
    },
    cusEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cusPhone1: {
        type: String,
        required: true,
        trim: true
    },
    cusPhone2: {
        type: String,
        trim: true
    },
    cusAddress: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;