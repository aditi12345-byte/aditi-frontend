const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBudget } = require('../middleware/validatorMiddleware');

router.use(authMiddleware);

router.get('/', budgetController.getBudgets);
router.post('/', validateBudget, budgetController.createOrUpdateBudget);
router.put('/:id', validateBudget, budgetController.createOrUpdateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
