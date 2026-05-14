const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { getAllPredictions, addAnnotation, deletePrediction } = require('../controllers/adminController');

router.get('/all-predictions', protect, adminOnly, getAllPredictions);
router.put('/add-annotation/:id', protect, adminOnly, addAnnotation);
router.delete('/delete-prediction/:id', protect, adminOnly, deletePrediction);

module.exports = router;
