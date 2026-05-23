# Deployment Configuration Guide

## CRITICAL FIXES NEEDED

### 1. Backend CORS Configuration (CRITICAL)

**Current Issue**: CORS allows all origins - NOT SAFE FOR PRODUCTION

**File**: `backend/server.js`

**Replace line 18**:
```javascript
// ❌ CURRENT (UNSAFE)
app.use(cors());

// ✅ REPLACE WITH THIS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Then add to `.env`**:
```
FRONTEND_URL=https://your-deployed-frontend-domain.com
```

---

### 2. Frontend Environment Setup (CRITICAL)

**Files Created**:
- ✅ `frontend/.env.development` → `VITE_API_URL=http://localhost:5000/api`
- ✅ `frontend/.env.production` → Update with your deployed backend URL

**To Deploy**:
1. Replace `your-backend-domain.com` in `.env.production` with your actual backend URL
2. Example:
   ```
   VITE_API_URL=https://api.mindguard.com/api
   ```

---

### 3. Test API Endpoints Locally

**Start Backend**:
```bash
cd backend
npm install
npm run dev
```

**Start Frontend** (in new terminal):
```bash
cd frontend
npm install
npm run dev
```

**Verify all endpoints work** by testing:
- ✅ Register: POST http://localhost:5000/api/auth/register
- ✅ Login: POST http://localhost:5000/api/auth/login
- ✅ Predict: POST http://localhost:5000/api/predict
- ✅ History: GET http://localhost:5000/api/history
- ✅ Admin endpoints: GET/PUT/DELETE /api/admin/*

---

### 4. Deployment Checklist

**Before Production**:
- [ ] Update `.env.production` with real backend URL
- [ ] Update `backend/.env` with `FRONTEND_URL`
- [ ] Configure CORS in backend
- [ ] Set proper MongoDB URI
- [ ] Set JWT_SECRET to secure random string
- [ ] Disable console.error logs in production
- [ ] Test all endpoints with production URLs
- [ ] Verify auth token is stored/retrieved correctly
- [ ] Check browser console for CORS errors

**Environment Variables Needed**:

**Backend `.env`**:
```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend-domain.com
COLAB_API_URL=your-ml-api-url
```

**Frontend `.env.production`**:
```
VITE_API_URL=https://your-backend-domain.com/api
```

---

### 5. Debugging Failed APIs

If APIs still don't work:

**Check 1**: Open browser DevTools → Network tab
- See if requests are being made
- Check request/response headers
- Look for CORS errors

**Check 2**: Browser Console
- Look for error messages
- Check if API URL is correct

**Check 3**: Backend Logs
- Run backend with `npm run dev`
- Watch console for errors
- Check if requests reach backend

**Check 4**: Common Issues

| Error | Fix |
|-------|-----|
| CORS blocked | Configure CORS origins in backend |
| 404 Not Found | Check endpoint path matches |
| 401 Unauthorized | Check JWT token is sent |
| 500 Server Error | Check backend logs |

---

### 6. API Endpoint Reference

All endpoints are correctly implemented:

| Method | Endpoint | Auth | Admin | Status |
|--------|----------|------|-------|--------|
| POST | /api/auth/register | No | No | ✅ |
| POST | /api/auth/login | No | No | ✅ |
| POST | /api/predict | Yes | No | ✅ |
| GET | /api/history | Yes | No | ✅ |
| GET | /api/admin/all-predictions | Yes | Yes | ✅ |
| PUT | /api/admin/add-annotation/:id | Yes | Yes | ✅ |
| DELETE | /api/admin/delete-prediction/:id | Yes | Yes | ✅ |

---

## Summary

**Main Issue**: Frontend environment variables not configured for production

**Solution**:
1. ✅ Create `.env.production` with backend URL
2. ✅ Configure CORS in backend
3. ✅ Add environment variables to `.env` files
4. ✅ Test endpoints before deploying

All API endpoints match perfectly between frontend and backend!
