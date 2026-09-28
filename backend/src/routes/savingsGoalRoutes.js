const express = require('express');
const router = express.Router();
const savingsGoalController = require('../controllers/savingsGoalController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateSavingsGoal } = require('../middleware/validatorMiddleware');

router.use(authMiddleware);

router.get('/', savingsGoalController.getSavingsGoals);
router.post('/', validateSavingsGoal, savingsGoalController.createSavingsGoal);
router.put('/:id', validateSavingsGoal, savingsGoalController.updateSavingsGoal);
router.post('/:id/deposit', savingsGoalController.addDeposit);
router.delete('/:id', savingsGoalController.deleteSavingsGoal);

module.exports = router;
