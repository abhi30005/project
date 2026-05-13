const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { predict, getHistory } = require('../controllers/predictionController');

router.post('/predict', protect, predict);
router.get('/history', protect, getHistory);

module.exports = router;
