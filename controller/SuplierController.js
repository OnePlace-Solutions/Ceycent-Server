const Supplier = require('../models/SuppliersModel');

// add a new supplier
const addNewSupplier = async (req, res) => {
    try {
        const { supplierName, supplierAddress, suplierPhone, supplierEmail } = req.body;
        const newSupplier = new Supplier({ supplierName, supplierAddress, suplierPhone, supplierEmail });
        await newSupplier.save();
        return res.status(201).json({ status: "success", message: "Supplier added successfully", newSupplier });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        return res.status(200).json(suppliers);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// get a supplier by id
const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ status: "error", message: "Supplier not found" });
        }
        return res.status(200).json(supplier);
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// update a supplier by id
const updateSupplierById = async (req, res) => {
    try {
        const { supplierName, supplierAddress, suplierPhone, supplierEmail } = req.body;
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { supplierName, supplierAddress, suplierPhone, supplierEmail },
            { new: true }
        );
        if (!updatedSupplier) {
            return res.status(404).json({ status: "error", message: "Supplier not found" });
        }
        return res.status(200).json({ status: "success", message: "Supplier updated successfully", updatedSupplier });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

// delete a supplier by id
const deleteSupplierById = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).json({ status: "error", message: "Supplier not found" });
        }
        return res.status(200).json({ status: "success", message: "Supplier deleted successfully" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = {
    addNewSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplierById,
    deleteSupplierById
};
