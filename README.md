# 🧠 MindGuard AI — Suicide Risk Detection Platform

A full-stack MERN application for AI-powered suicide risk text detection using two Hugging Face NLP models with human expert review.

> ⚠️ **Disclaimer**: This tool is for research purposes only and does not constitute a medical diagnosis. If you or someone you know is in crisis, please call the **988 Suicide & Crisis Lifeline** or text **HOME** to **741741**.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI Models | Hugging Face Inference API |
| Auth | JWT, bcrypt |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
suicide-detection-app/
├── frontend/                    # React + Vite + Tailwind + Framer Motion
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx     # Login/Signup with flip animation
│   │   │   ├── UserDashboard.jsx # Text input + AI prediction
│   │   │   ├── HistoryPage.jsx  # Past analyses history
│   │   │   ├── AdminDashboard.jsx # Admin review panel
│   │   │   └── NotFoundPage.jsx # Animated 404
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Glassmorphism nav + mobile menu
│   │   │   ├── PredictionCard.jsx # AI results display
│   │   │   ├── HistoryCard.jsx  # History entry card
│   │   │   ├── DisclaimerBanner.jsx # Crisis resources
│   │   │   ├── EmptyState.jsx   # Empty state screens
│   │   │   └── LoadingSpinner.jsx # Animated loader
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # JWT auth state
│   │   ├── services/
│   │   │   └── api.js           # Axios + interceptors
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Glassmorphism + dark theme
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # Express + MongoDB + HuggingFace
│   ├── models/
│   │   ├── User.js              # name, email, password, role
│   │   └── Prediction.js        # text, model results, annotation
│   ├── controllers/
│   │   ├── authController.js    # Register + Login
│   │   ├── predictionController.js # AI predict + history
│   │   └── adminController.js   # All predictions + annotation
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verify
│   │   └── adminMiddleware.js   # Admin check
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── predictionRoutes.js
│   │   └── adminRoutes.js
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── server.js
│   ├── seedAdmin.js             # Create admin user
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Hugging Face account + API token

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_user:your_password@cluster0.xxxxx.mongodb.net/suicide-detection?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here
HF_API_TOKEN=hf_your_huggingface_api_token_here
```

### 3. Seed Admin User

```bash
cd backend
npm run seed
# Admin credentials: admin@example.com / admin123
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 📊 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user/admin |
| POST | `/api/predict` | User JWT | Run AI prediction on text |
| GET | `/api/history` | User JWT | Get user's prediction history |
| GET | `/api/admin/all-predictions` | Admin JWT | Get all predictions |
| PUT | `/api/admin/add-annotation/:id` | Admin JWT | Add admin annotation |

---

## ✨ Features

### Authentication
- 🔐 JWT-based auth with bcrypt password hashing
- 🔄 Animated flip card between Login/Signup
- 👁️ Show/hide password toggle
- 📱 Input icons for better UX

### AI Prediction
- 🧠 Dual model analysis (DistilRoBERTa + ELECTRA)
- 📊 Confidence scores with animated progress bars
- ⚡ Parallel API calls for faster results
- 💾 Auto-save to MongoDB

### Admin Dashboard
- 📋 View all user submissions
- 🔍 Search by username or text
- 🏷️ Filter: All / Annotated / Pending
- ✏️ Inline annotation with keyboard Enter support
- 📊 Stats cards (Total, Annotated, Pending)

### History
- 🃏 Animated card grid layout
- 🔍 Model predictions + admin annotations
- 📱 Responsive grid (1/2/3 columns)
- ✨ Hover scale animations

### UI/UX
- 🌑 Dark theme (#050816)
- 💎 Glassmorphism cards with backdrop blur
- 🌈 Gradient buttons with neon glow hover
- 🎭 Framer Motion page transitions
- 📱 Fully responsive (mobile/tablet/desktop)
- 🔕 Invisible scrollbars
- 🍞 Toast notifications
- ⚡ Loading spinners with dual-ring animation
- 📭 Empty state screens with floating animation

### Security
- 🔒 JWT token authentication
- 🛡️ Protected routes (frontend + backend)
- 👮 Admin middleware for admin-only APIs
- 🔑 Environment variables for secrets
- ⏰ Token expiry handling

### Ethical
- ⚠️ Research-only disclaimer
- 📞 988 Lifeline & Crisis Text Line links
- 👨‍⚕️ Human admin review before final output
- 🔒 Secure data storage

---

## 🌐 Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Build: `npm run build` | Output: `dist`
4. Env: `VITE_API_URL=https://your-backend.render.com/api`

### Backend → Render
1. Push `backend/` to GitHub
2. New Web Service on [render.com](https://render.com)
3. Start: `npm start`
4. Add env vars: MONGO_URI, JWT_SECRET, HF_API_TOKEN

---

## 📜 License

This project is for educational and research purposes only. Not intended for production medical use.
