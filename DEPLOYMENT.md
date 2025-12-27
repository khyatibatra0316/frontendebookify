# Frontend Deployment Guide for Vercel

Complete guide for deploying the eBookify frontend to Vercel.

---

## 📋 Vercel Configuration

Based on your screenshot, here's the correct configuration:

### Basic Settings

| Setting | Value |
|---------|-------|
| **Project Name** | `frontendebookify` (or your preferred name) |
| **Framework Preset** | **Vite** |
| **Root Directory** | `./` (leave as root since you're deploying from frontend folder) |

### Build Settings

| Setting | Command |
|---------|---------|
| **Build Command** | `vite build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

> [!IMPORTANT]
> Make sure **Framework Preset** is set to **Vite**, not just "Node". Vercel will auto-detect this if you're deploying from the frontend directory.

---

## 🔐 Environment Variables

Add this environment variable in Vercel dashboard under **Settings** → **Environment Variables**:

### For Production

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://finalebookify.onrender.com` | Production |

> [!WARNING]
> **Important**: Replace `finalebookify.onrender.com` with your actual Render backend URL once it's deployed!

### For Preview/Development (Optional)

You can also set environment variables for preview deployments:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `http://localhost:4000` | Development |

---

## 📝 What Was Changed

All hardcoded `localhost:4000` URLs have been replaced with environment variables:

### Files Updated:

1. **[authService.js](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/frontend/src/services/authService.js#L3)**
   ```javascript
   const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;
   ```

2. **[bookService.js](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/frontend/src/services/bookService.js#L4-L5)**
   ```javascript
   const API_URL = `${import.meta.env.VITE_API_URL}/api/books`;
   export const BASE_URL = import.meta.env.VITE_API_URL;
   ```

3. **[BookCard.jsx](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/frontend/src/components/BookCard.jsx#L2)**
   - Cover images: `${BASE_URL}${book.coverImage}`
   - File downloads: `${BASE_URL}${book.fileUrl}`

4. **[ReaderDashboard.jsx](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/frontend/src/pages/ReaderDashboard.jsx#L4)**
   - Cover images: `${BASE_URL}${book.coverImage}`

5. **[ReadingInterface.jsx](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/frontend/src/pages/ReadingInterface.jsx#L3)**
   - Cover images and file downloads now use `BASE_URL`

### Files Created:

- **[.env](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/frontend/.env)** - Local development environment variables
- **[.env.example](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/frontend/.env.example)** - Template for environment variables

---

## 🚀 Deployment Steps

### Step 1: Test Locally

Before deploying, test that everything works locally:

```bash
cd frontend
npm run dev
```

Your app should work with `http://localhost:4000` as the API URL (from `.env` file).

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Configure frontend for Vercel deployment"
git push origin main
```

### Step 3: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository: `khyatibatra0316/frontendebookify`
4. **Important**: Set the **Root Directory** to `frontend` (since your frontend is in a subdirectory)
5. Framework Preset should auto-detect as **Vite**
6. Configure build settings:
   - Build Command: `vite build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 4: Add Environment Variable

1. Go to **Settings** → **Environment Variables**
2. Add `VITE_API_URL` with your Render backend URL
3. Click **Save**

### Step 5: Redeploy

After adding environment variables, trigger a new deployment:
- Go to **Deployments** tab
- Click the three dots on the latest deployment
- Click **"Redeploy"**

---

## 🔄 Update Backend CORS

Once your frontend is deployed, you need to update the backend's CORS configuration:

### In Render Dashboard (Backend)

Add this environment variable:

```
FRONTEND_URL=https://your-frontend.vercel.app
```

Replace `your-frontend.vercel.app` with your actual Vercel URL.

The backend is already configured to accept this environment variable in [`server.js`](file:///Users/khyatibatra/ADVANCE%20CAPSTONE/capstone-ap/backend/server.js#L24-L29).

---

## ✅ Verification

After deployment, verify everything works:

### 1. Check Frontend Loads
Visit your Vercel URL: `https://your-frontend.vercel.app`

### 2. Test API Connection
- Try logging in
- Try viewing books
- Check browser console for any CORS errors

### 3. Check Environment Variables
In your browser console, you can verify the API URL:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build fails with "command not found"

**Solution**:
- Ensure Framework Preset is set to **Vite**
- Verify `package.json` has the correct build script: `"build": "vite build"`

### Environment Variables Not Working

**Issue**: Frontend still tries to connect to localhost

**Solution**:
- Verify `VITE_API_URL` is set in Vercel dashboard
- Redeploy after adding environment variables
- Check that variable name starts with `VITE_` (required for Vite)

### CORS Errors

**Issue**: "Access-Control-Allow-Origin" errors in console

**Solution**:
- Add `FRONTEND_URL` environment variable in Render (backend)
- Ensure it matches your Vercel URL exactly (including `https://`)
- Redeploy backend after adding the variable

### Images/Files Not Loading

**Issue**: Book covers or PDF files return 404

**Solution**:
- Verify `VITE_API_URL` is set correctly (should be your Render backend URL)
- Check that backend is serving static files from `/uploads` directory
- Ensure file paths in database start with `/uploads/`

---

## 📱 Custom Domain (Optional)

To add a custom domain:

1. Go to **Settings** → **Domains** in Vercel
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` in Render backend to match your custom domain

---

## 🔒 Security Notes

> [!CAUTION]
> - Never commit `.env` files to git
> - `.env` is already in `.gitignore`
> - Always use environment variables for API URLs and secrets
> - Use HTTPS in production (Vercel provides this automatically)

---

## 📊 Vercel Dashboard Settings Summary

Here's a quick reference for your Vercel configuration:

```yaml
Project Name: frontendebookify
Framework: Vite
Root Directory: frontend
Build Command: vite build
Output Directory: dist
Install Command: npm install

Environment Variables:
  VITE_API_URL: https://finalebookify.onrender.com
```

---

## 🎯 Next Steps

After successful deployment:

1. ✅ Test all features (login, signup, book viewing, file downloads)
2. ✅ Monitor Vercel deployment logs for any errors
3. ✅ Update backend `FRONTEND_URL` environment variable
4. ✅ Test CORS by trying to login from production frontend
5. ✅ Share your deployed app URL!

---

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel CLI](https://vercel.com/docs/cli) - For command-line deployments
