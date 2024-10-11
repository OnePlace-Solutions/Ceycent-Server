const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Set MongoDB URI (default to Store1)
const mongoUri = process.env.MONGO_URI;

// Function to connect to MongoDB and load models
const connectToMongoDB = async () => {
    try {
        // Connect to the MongoDB instance
        await mongoose.connect(mongoUri);
        console.log(`MongoDB connected to ${mongoUri}`);

        // Load models
        require('./models/SuppliersModel');
        require('./models/customerModel');
        require('./models/expenseModel');
        require('./models/inventoryModel');
        require('./models/saleModel');
        console.log('Models loaded successfully.');
    } catch (err) {
        console.error(`Error connecting to MongoDB:`, err);
        throw err;
    }
};

// Initial MongoDB connection
connectToMongoDB();

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes (import your routes as necessary)
const userRouter = require('./routes/loginRoute');
const inventoryRouter = require('./routes/inventoryRoutes');
const supplierRouter = require('./routes/SuplierRoutes');
const expenseRouter = require('./routes/expeseRoutes');
const customerRouter = require('./routes/customerRoutes');
const saleRouter = require('./routes/saleRoutes');
const reportRouter = require('./routes/reportRoute');

app.use('/user', userRouter);
app.use('/inventory', inventoryRouter);
app.use('/supplier', supplierRouter);
app.use('/expense', expenseRouter);
app.use('/customer', customerRouter);
app.use('/sale', saleRouter);
app.use('/report', reportRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});