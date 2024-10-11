const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description:{
        type: String,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;