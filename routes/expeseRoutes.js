const express = require('express');
const router = express.Router();
const { addNewExpense, getAllExpenses, getExpenseById, updateExpenseById, deleteExpenseById } = require('../controller/expenseController');

// Route for adding a new expense
router.post('/add', addNewExpense);

// Route for getting all expenses
router.get('/', getAllExpenses);

// Route for getting an expense by id
router.get('/:id', getExpenseById);

// Route for updating an expense by id
router.put('/:id', updateExpenseById);

// Route for deleting an expense by id
router.delete('/:id', deleteExpenseById);

module.exports = router;
