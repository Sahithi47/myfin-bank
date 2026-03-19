const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Deposit — ADMIN only (admin deposits on behalf of customer)
router.post('/deposit', authMiddleware('ADMIN'), controller.deposit);

// Withdraw — CUSTOMER only
router.post('/withdraw', authMiddleware('CUSTOMER'), controller.withdraw);

// Transfer — CUSTOMER only
router.post('/transfer', authMiddleware('CUSTOMER'), controller.transfer);

// Passbook — CUSTOMER only
router.get('/passbook/:accountNumber', authMiddleware('CUSTOMER'), controller.getPassbook);

module.exports = router;