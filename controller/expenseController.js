const Expense = require('../models/expenseModel');

// add new expense
const addNewExpense = async (req, res) => {
    try {
        const { name, price,description, date } = req.body;
            if (!name || !price || !date) {
                return res.status(400).json({ status: "error", message: "All fields are required" });
        }
        const newExpense = new Expense({ name, price, description, date });
        await newExpense.save();
        return res.status(201).json({ status: "success", message: "Expense added successfully", newExpense });

    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};


// get all expenses
const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        return res.status(200).json(expenses);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// delete an expense by id
const deleteExpenseById = async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ status: "error", message: "Expense not found" });
        }
        return res.status(200).json({ status: "success", message: "Expense deleted successfully" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// update an expense by id
const updateExpenseById = async (req, res) => {
    try {
        const { name, price, description, date } = req.body;

        // Validate if the required fields are present
        if (!name || !price || !date || !description) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { name, price, description, date }, // Update all fields
            { new: true } // Return the updated document
        );

        if (!updatedExpense) {
            return res.status(404).json({ status: "error", message: "Expense not found" });
        }

        return res.status(200).json({ status: "success", message: "Expense updated successfully", updatedExpense });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};



//get an expense by id
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ status: "error", message: "Expense not found" });
        }
        return res.status(200).json(expense);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = { addNewExpense, getAllExpenses, deleteExpenseById, updateExpenseById, getExpenseById };