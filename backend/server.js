require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/api/status', (req, res) => {
    res.json({ message: "Backend is running!" });
});

// Mount the Certificate Routes
// This maps all routes in certificateRoutes.js to start with /api/certificates
app.use('/api/certificates', require('./routes/certificateRoutes'));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});