const Prediction = require('../models/Prediction');

// @desc    Get all predictions (admin only)
// @route   GET /api/admin/all-predictions
const getAllPredictions = async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    // Search by username or input text
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { inputText: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by annotation status
    if (filter === 'annotated') {
      query.adminAnnotation = { $ne: '' };
    } else if (filter === 'pending') {
      query.adminAnnotation = '';
    }

    const predictions = await Prediction.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json(predictions);
  } catch (error) {
    console.error('Admin getAllPredictions error:', error.message);
    res.status(500).json({ message: 'Error fetching predictions' });
  }
};

// @desc    Add admin annotation to a prediction
// @route   PUT /api/admin/add-annotation/:id
const addAnnotation = async (req, res) => {
  try {
    const { annotation } = req.body;

    if (!annotation || annotation.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide an annotation' });
    }

    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    prediction.adminAnnotation = annotation.trim();
    await prediction.save();

    res.json({
      message: 'Annotation saved successfully',
      prediction,
    });
  } catch (error) {
    console.error('Admin addAnnotation error:', error.message);
    res.status(500).json({ message: 'Error saving annotation' });
  }
};

module.exports = { getAllPredictions, addAnnotation };
