const express = require('express');
const router = express.Router();
const { createSale, getAllSales, deleteSale, updateSaleStatus } = require('../controller/saleController');

// Route to create a new sale
router.post('/add', createSale);

// Route to get all sales
router.get('/', getAllSales);

// Route to delete a sale
router.delete('/:id', deleteSale);

// Route to update sale status
router.put('/:id', updateSaleStatus); // Just call updateSaleStatus

module.exports = router;
