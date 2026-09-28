const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTransaction } = require('../middleware/validatorMiddleware');

// All transaction routes are strictly protected by authentication
router.use(authMiddleware);

router.get('/', transactionController.getTransactions);
router.post('/', validateTransaction, transactionController.createTransaction);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', validateTransaction, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
