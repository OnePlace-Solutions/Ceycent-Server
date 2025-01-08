const moment = require('moment');
const Expenses = require('../models/expenseModel');
const Sale = require('../models/saleModel');

// Helper function to get start and end of the selected month
const getMonthRange = (month, year) => {
    const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();
    return { startOfMonth, endOfMonth };
};

// total sales with item names
const totalSales = async (req, res) => {
    try {
        const { month, year } = req.query;
        const { startOfMonth, endOfMonth } = getMonthRange(month, year);

        const sales = await Sale.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).select('customers totalAmount createdAt items');

        const salesData = sales.map(sale => ({
            customerName: sale.customers[0]?.cusName || 'N/A', // Handling potential undefined
            totalAmount: sale.totalAmount,
            createdAt: sale.createdAt,
            itemNames: sale.items.map(item => item.name)
        }));

        return res.status(200).json(salesData);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// total expenses
const totalExpenses = async (req, res) => {
    try {
        const { month, year } = req.query;
        const { startOfMonth, endOfMonth } = getMonthRange(month, year);

        const expenses = await Expenses.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).select('name price date');

        const expensesData = expenses.map(expense => ({
            name: expense.name,
            price: expense.price,
            date: expense.date
        }));

        return res.status(200).json(expensesData);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// total profit
const totalProfit = async (req, res) => {
    try {
        const { month, year } = req.query;
        const { startOfMonth, endOfMonth } = getMonthRange(month, year);

        const sales = await Sale.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).select('totalAmount');

        const expenses = await Expenses.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).select('price');

        const totalSales = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.price, 0);
        const totalProfit = totalSales - totalExpenses;

        return res.status(200).json({ totalProfit });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = { totalSales, totalExpenses, totalProfit };
