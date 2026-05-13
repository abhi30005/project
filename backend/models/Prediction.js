const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  inputText: {
    type: String,
    required: [true, 'Input text is required'],
    trim: true,
  },
  model1Prediction: {
    label: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
  },
  model2Prediction: {
    label: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
  },
  adminAnnotation: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Prediction', predictionSchema);
