const Customer = require('../models/customerModel');

// Helper function to generate next customer ID
const generateNextCustomerID = async () => {
    const lastCustomer = await Customer.findOne().sort({ createdAt: -1 }); // Get the last inserted customer based on creation time

    if (!lastCustomer || !lastCustomer.cusID) {
        return 'CUS001'; // If no customers exist, start with CUS001
    }

    // Extract the number from the last customer ID (e.g., CUS001 -> 1)
    const lastIdNumber = parseInt(lastCustomer.cusID.slice(3), 10); // Remove 'CUS' and convert to a number
    const nextIdNumber = lastIdNumber + 1;

    // Format the next customer ID (e.g., CUS002, CUS003)
    const nextCustomerID = `CUS${nextIdNumber.toString().padStart(3, '0')}`; // Ensure it's always 3 digits
    return nextCustomerID;
};


// add new customer
const addNewCustomer = async (req, res) => {
    try {
        const { cusName, cusEmail, cusPhone1, cusPhone2, cusAddress } = req.body;

        // Generate the next customer ID
        const cusID = await generateNextCustomerID();

        if (!cusName || !cusEmail || !cusPhone1) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const newCustomer = new Customer({ cusID, cusName, cusEmail, cusPhone1, cusPhone2, cusAddress });
        await newCustomer.save();

        return res.status(201).json({ status: "success", message: "Customer added successfully", newCustomer });

    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};


// get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        return res.status(200).json(customers);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// delete a customer by id
const deleteCustomerById = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ status: "error", message: "Customer not found" });
        }
        return res.status(200).json({ status: "success", message: "Customer deleted successfully" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// update a customer by id
const updateCustomerById = async (req, res) => {
    try {
        const { cusID, cusName, cusEmail, cusPhone1, cusPhone2, cusAddress } = req.body;

        // Validate if the required fields are present
        if (!cusID || !cusName || !cusEmail || !cusPhone1) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { cusID, cusName, cusEmail, cusPhone1, cusPhone2, cusAddress }, // Update all fields
            { new: true } // Return the updated document
        );

        if (!updatedCustomer) {
            return res.status(404).json({ status: "error", message: "Customer not found" });
        }
        return res.status(200).json({ status: "success", message: "Customer updated successfully", updatedCustomer });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

//get custmer by id
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ status: "error", message: "Customer not found" });
        }
        return res.status(200).json(customer);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = { addNewCustomer, getAllCustomers, deleteCustomerById, updateCustomerById, getCustomerById };
