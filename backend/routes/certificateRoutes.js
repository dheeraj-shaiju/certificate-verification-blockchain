const express = require('express');
const router = express.Router();
const multer = require('multer');
const { issueCertificate } = require('../controllers/certificateController');

// Configure Multer for this specific route
const upload = multer({ dest: 'uploads/' });

// Route: POST /api/certificates/issue
router.post('/issue', upload.single('certificatePDF'), issueCertificate);

module.exports = router;