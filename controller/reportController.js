const moment = require('moment');
const Expenses = require('../models/expenseModel');
const Sale = require('../models/saleModel');

// total sales with item names
const totalSales = async (req, res) => {
    try {
        // Get the start and end of the current month
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        // Find sales within the current month
        const sales = await Sale.find({
            createdAt: { 
                $gte: startOfMonth, 
                $lte: endOfMonth 
            }
        }).select('customers totalAmount createdAt items');

        // Return customer name, total amount, createdAt, and item names
        const salesData = sales.map(sale => ({
            customerName: sale.customers[0].cusName, // Assuming 1 customer per sale
            totalAmount: sale.totalAmount,
            createdAt: sale.createdAt,
            itemNames: sale.items.map(item => item.name) // Extract item names from the sale
        }));

        return res.status(200).json(salesData);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// total expenses remains unchanged
const totalExpenses = async (req, res) => {
    try {
        // Get the start and end of the current month
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        // Find expenses within the current month
        const expenses = await Expenses.find({
            date: { 
                $gte: startOfMonth, 
                $lte: endOfMonth 
            }
        }).select('name price date');

        // Return name, price, and date
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

// total profit remains unchanged
const totalProfit = async (req, res) => {
    try {
        // Get the start and end of the current month
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
    
        // Find sales within the current month
        const sales = await Sale.find({
            createdAt: { 
                $gte: startOfMonth, 
                $lte: endOfMonth 
            }
        }).select('totalAmount');
    
        // Find expenses within the current month
        const expenses = await Expenses.find({
            date: { 
                $gte: startOfMonth, 
                $lte: endOfMonth 
            }
        }).select('price');
    
        // Calculate total sales
        const totalSales = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
    
        // Calculate total expenses
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.price, 0);
    
        // Calculate total profit
        const totalProfit = totalSales - totalExpenses;
    
        return res.status(200).json({ totalProfit });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = { totalSales, totalExpenses, totalProfit };
