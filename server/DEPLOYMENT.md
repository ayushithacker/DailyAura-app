# Deployment Guide for DailyAura Backend

## Render Deployment Setup

### 1. Environment Variables Required

Set these environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.onrender.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:5050/api/auth/google/callback`
   - Production: `https://your-backend-domain.onrender.com/api/auth/google/callback`

### 3. Render Configuration

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18.x or higher

### 4. Common Issues & Solutions

#### Issue: "Application exited early"
**Solution**: Check environment variables and MongoDB connection

#### Issue: Google OAuth not working
**Solution**: 
1. Verify callback URLs in Google Console
2. Check FRONTEND_URL and BACKEND_URL environment variables
3. Ensure CORS is properly configured

#### Issue: Build fails
**Solution**: 
1. Check TypeScript compilation
2. Verify all dependencies are in package.json
3. Ensure Node.js version compatibility

### 5. Health Check

After deployment, test these endpoints:
- `GET /` - Should return "DailyAura API server is running"
- `GET /health` - Should return status and environment info

### 6. Local Development

1. Copy `env.example` to `.env`
2. Fill in your local values
3. Run `npm run dev`
4. Server will start on http://localhost:5050 