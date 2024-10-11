const mongoose = require('mongoose');

const suppliersSchema = new mongoose.Schema({

    supplierName: {
        type: String,
        required: true
    },
    supplierAddress: {
        type: String,
        required: true
    },
    suplierPhone: {
        type: String,
        required: true
    },

    supplierEmail: {
        type: String,
        required: true
    },
});

const SuppliersModel = mongoose.model('Suppliers', suppliersSchema);
module.exports = SuppliersModel;