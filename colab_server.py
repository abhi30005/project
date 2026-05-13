# ============================================
# Run this in your Google Colab notebook
# This creates an API server for your models
# ============================================

# Step 1: Install dependencies
!pip install flask flask-ngrok pyngrok transformers torch

# Step 2: Set up ngrok (get free token from https://ngrok.com)
from pyngrok import ngrok
ngrok.set_auth_token("YOUR_NGROK_TOKEN_HERE")  # Get from https://dashboard.ngrok.com/get-started/your-authtoken

# Step 3: Load your 2 models
from transformers import pipeline
import torch

print("Loading Model 1...")
model1 = pipeline("text-classification", model="CoderKnight03/suicidal-roberta-tag2")
print("✅ Model 1 loaded!")

print("Loading Model 2...")
model2 = pipeline("text-classification", model="CoderKnight03/suicidal-roberta-tag1")
print("✅ Model 2 loaded!")

# Step 4: Create Flask API
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Run both models
    result1 = model1(text)
    result2 = model2(text)
    
    return jsonify({
        "model1": result1[0],  # {"label": "...", "score": 0.95}
        "model2": result2[0],  # {"label": "...", "score": 0.87}
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Models are running!"})

# Step 5: Start server with ngrok
public_url = ngrok.connect(5000)
print("\n" + "="*50)
print(f"🚀 YOUR API URL: {public_url}")
print("="*50)
print("\n📋 Copy the URL above and paste it in your backend .env file as:")
print(f"   COLAB_API_URL={public_url}")
print("\n⚠️  Keep this Colab tab OPEN while using the website!")

app.run(port=5000)
