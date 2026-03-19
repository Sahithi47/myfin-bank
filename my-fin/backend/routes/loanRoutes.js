const express = require('express');
const router = express.Router();
const controller = require('../controllers/loanController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/apply', authMiddleware('CUSTOMER'), controller.applyLoan);
router.post('/calculate-emi', controller.calculateEMI); // public — no auth needed
router.get('/my/:accountNumber', authMiddleware('CUSTOMER'), controller.getMyLoans);
router.get('/pending', authMiddleware('ADMIN'), controller.getAllPendingLoans);
router.put('/:loanId/status', authMiddleware('ADMIN'), controller.updateLoanStatus);
router.get('/:loanId/payments', authMiddleware('CUSTOMER'), controller.getLoanPayments);

module.exports = router;