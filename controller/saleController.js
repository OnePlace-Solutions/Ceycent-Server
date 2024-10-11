const Sale = require('../models/saleModel');
const Customer = require('../models/customerModel');
const Inventory = require('../models/inventoryModel');

// Create Sale
const createSale = async (req, res) => {
    try {
        const { customerId, items, totalAmount } = req.body;

        // Fetch the customer based on provided ID
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Store customer data in the Sale schema
        const sale = new Sale({
            customers: [
                {
                    cusID: customer.cusID,
                    cusName: customer.cusName,
                    cusEmail: customer.cusEmail,
                    cusPhone1: customer.cusPhone1,
                    cusPhone2: customer.cusPhone2,
                    cusAddress: customer.cusAddress
                }
            ],
            items: items.map(item => ({
                id: item.id, // Ensure this exists in the incoming request body
                name: item.name,
                sellingPrice: item.sellingPrice,
                quantity: item.quantity,
                discount: item.discount,
                total: item.total
            })),
            totalAmount,
            saleStatus: 'To be Shift'
        });
        


        // Save the sale to the database
        await sale.save();
        console.log('Sale created successfully:', sale);

        // Update inventory quantities after sale is saved
        await decreaseInventory(items); // Make sure this function works as expected

        res.status(201).json({ message: 'Sale completed successfully', sale });
    } catch (error) {
        console.error('Error creating sale:', error); // Improved error logging
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get All Sales
const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find();
        return res.status(200).json(sales);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// Delete Sale
const deleteSale = async (req, res) => {
    try {
        const saleId = req.params.id;

        // Find the sale before deleting it to access the items
        const sale = await Sale.findById(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Now delete the sale after adjusting inventory
        await Sale.findByIdAndDelete(saleId);

        return res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};




const updateSaleStatus = async (req, res) => {
    try {
        const { trackingNumber, saleStatus } = req.body;
        const saleId = req.params.id;

        const sale = await Sale.findById(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Update the tracking number and sale status
        sale.trackingNumber = trackingNumber;

        // If the sale status is being changed to "Shiped", decrease inventory
        if (saleStatus === 'Shiped') {
            await decreaseInventory(sale.items); // Decrement the inventory
        }

        sale.saleStatus = saleStatus; // Update the sale status
        await sale.save(); // Save the updated sale

        res.status(200).json({ message: 'Sale updated successfully', sale });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};




const decreaseInventory = async (items) => {
    try {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('No items found to update inventory');
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            // Validate required fields
            if (!item.id || !item.quantity) {
                throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
            }

            console.log(`Processing item ${item.id} with quantity ${item.quantity}`);

            // Find the inventory item using the correct field name
            const inventoryItem = await Inventory.findOne({ id: item.id });

            if (!inventoryItem) {
                console.log(`Item with ID ${item.id} not found in inventory`);
                continue; // Skip if the item is not found
            }

            console.log(`Found inventory item ${inventoryItem.id} with stock quantity ${inventoryItem.quantity}`);

            if (inventoryItem.quantity >= item.quantity) {
                // Reduce inventory quantity by the sold quantity
                const newQuantity = Math.max(0, inventoryItem.quantity - item.quantity);
                console.log(`Reducing quantity by ${item.quantity}. New quantity: ${newQuantity}`);
                
                await Inventory.findByIdAndUpdate(inventoryItem._id, { $set: { quantity: newQuantity } });
                console.log(`Inventory updated for item ${item.id}`);
            } else {
                console.log(`Insufficient quantity for item ${item.id}. Stock: ${inventoryItem.quantity}, Required: ${item.quantity}`);
                throw new Error(`Insufficient stock for item: ${item.id}`);
            }
        }
    } catch (error) {
        console.error('Error while updating inventory', error);
        throw new Error(`Error while updating inventory: ${error.message}`);
    }
};









module.exports = { createSale, getAllSales, deleteSale, updateSaleStatus };