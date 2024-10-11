const express = require('express');
const router = express.Router();

const { totalSales, totalExpenses,totalProfit} = require('../controller/reportController');

// Route for getting total sales
router.get('/sales', totalSales);

//get total expenses
router.get('/expenses', totalExpenses);

//get total profit
router.get('/profit', totalProfit);

module.exports = router;