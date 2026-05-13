const Prediction = require('../models/Prediction');

// ====================================================
// OPTION 1: Use Colab API (via ngrok)
// Set COLAB_API_URL in your .env file
// Example: COLAB_API_URL=https://xxxx-xx-xx.ngrok-free.app
// ====================================================
// OPTION 2: Use HuggingFace Inference API (direct)
// Set HF_API_TOKEN in your .env file
// ====================================================

const HF_MODEL_1 = 'https://api-inference.huggingface.co/models/CoderKnight03/suicidal-roberta-tag2';
const HF_MODEL_2 = 'https://api-inference.huggingface.co/models/CoderKnight03/suicidal-roberta-tag1';

// Query HuggingFace Inference API directly
async function queryHuggingFace(modelUrl, text) {
  const response = await fetch(modelUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`HF API error (${response.status}):`, errorBody);
    throw new Error(`HF API returned ${response.status}`);
  }

  return await response.json();
}

// Query Colab API (via ngrok)
async function queryColab(text) {
  const colabUrl = process.env.COLAB_API_URL;
  if (!colabUrl) {
    throw new Error('COLAB_API_URL is not set in .env file');
  }

  const response = await fetch(`${colabUrl}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Colab API error (${response.status}):`, errorBody);
    throw new Error(`Colab API returned ${response.status}`);
  }

  return await response.json();
}

// Parse HuggingFace result
function parseHFResult(result) {
  try {
    if (Array.isArray(result) && Array.isArray(result[0])) {
      const sorted = result[0].sort((a, b) => b.score - a.score);
      return { label: sorted[0].label, confidence: Math.round(sorted[0].score * 10000) / 100 };
    }
    if (Array.isArray(result)) {
      const sorted = result.sort((a, b) => b.score - a.score);
      return { label: sorted[0].label, confidence: Math.round(sorted[0].score * 10000) / 100 };
    }
    return { label: 'Unknown', confidence: 0 };
  } catch {
    return { label: 'Error', confidence: 0 };
  }
}

// Parse Colab result
function parseColabResult(modelResult) {
  try {
    return {
      label: modelResult.label || 'Unknown',
      confidence: Math.round((modelResult.score || 0) * 10000) / 100,
    };
  } catch {
    return { label: 'Error', confidence: 0 };
  }
}

// @desc    Predict suicide risk from text
// @route   POST /api/predict
const predict = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide text for analysis' });
    }

    let model1, model2;

    // Check which method to use
    if (process.env.COLAB_API_URL) {
      // ---- COLAB MODE ----
      console.log('Using Colab API...');
      const colabResult = await queryColab(text);
      model1 = parseColabResult(colabResult.model1);
      model2 = parseColabResult(colabResult.model2);
    } else if (process.env.HF_API_TOKEN) {
      // ---- HUGGINGFACE MODE ----
      console.log('Using HuggingFace Inference API...');
      const [result1, result2] = await Promise.all([
        queryHuggingFace(HF_MODEL_1, text),
        queryHuggingFace(HF_MODEL_2, text),
      ]);
      model1 = parseHFResult(result1);
      model2 = parseHFResult(result2);
    } else {
      return res.status(500).json({
        message: 'No AI model configured. Set COLAB_API_URL or HF_API_TOKEN in .env file.',
      });
    }

    // Save prediction to database
    const prediction = await Prediction.create({
      userId: req.user._id,
      username: req.user.name,
      inputText: text,
      model1Prediction: model1,
      model2Prediction: model2,
    });

    res.status(201).json({
      _id: prediction._id,
      inputText: prediction.inputText,
      model1Prediction: model1,
      model2Prediction: model2,
      createdAt: prediction.createdAt,
    });
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({
      message: 'Error processing prediction. Please check if your Colab server or HuggingFace models are running.',
    });
  }
};

// @desc    Get prediction history for logged-in user
// @route   GET /api/history
const getHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(predictions);
  } catch (error) {
    console.error('History error:', error.message);
    res.status(500).json({ message: 'Error fetching history' });
  }
};

module.exports = { predict, getHistory };
