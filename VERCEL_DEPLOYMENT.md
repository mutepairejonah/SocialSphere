# Deploy InstaClone to Vercel

Get your app live on Vercel in 3 minutes! ⚡

## Prerequisites

- Vercel account (free at https://vercel.com)
- GitHub account with your code pushed
- Your Instagram access token ready

## Easiest Way: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmutepairejonah%2FSocialSphere&env=VITE_INSTAGRAM_ACCESS_TOKEN)

**Just click the button and follow the steps!**

> **Note:** Vercel will ask for a project name. Use only letters, digits, and underscores. Examples: `instaclone`, `insta_clone`, `socialsphere`, `socialsphere_app`

## Manual Deployment (5 minutes)

### Step 1: Connect GitHub

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

### Step 2: Configure Project

- **Project Name**: Use only **letters, digits, and underscores** (no hyphens!)
  - ✅ Valid: `instaclone`, `insta_clone`, `socialsphere`, `my_app_123`
  - ❌ Invalid: `insta-clone`, `insta.clone`, `123app`, `insta@clone`
- **Framework**: Auto-detected as Node.js ✓
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (pre-filled)
- **Output Directory**: `dist` (pre-filled)

### Step 3: Set Environment Variables

**IMPORTANT:** You must add your Instagram access token AFTER deployment:

1. After your project is created, go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_INSTAGRAM_ACCESS_TOKEN`
   - **Value**: Your Instagram access token
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Add**
6. Redeploy: Go to **Deployments** → click on latest deployment → click **Redeploy**

**Get your Instagram token:**
1. Go to https://developers.instagram.com
2. Create an app or use existing one (e.g., "instaclone-app")
3. Go to **Settings** → **Basic**
4. Under **App Roles**, find your account and generate an access token
5. Permissions needed: `instagram_basic`, `instagram_graph_user_media`
6. Copy the long token string and paste it into Vercel

### Step 4: Deploy!

Click "Deploy" and wait ~2-3 minutes

Your app will be live at: `https://your-project-name.vercel.app` 🎉

## After First Deployment

If you see code instead of your app:
1. Check the **Deployments** tab → view the latest deployment
2. Check the **Build Logs** - look for errors
3. Go to **Settings** → **Environment Variables** and make sure `VITE_INSTAGRAM_ACCESS_TOKEN` is set
4. Click **Redeploy** on the latest deployment

## Automatic Deployments

After your first deployment, every time you push to GitHub, Vercel **automatically redeploys** your app!

```bash
git push origin main
# Vercel detects changes and redeploys automatically
```

## Update Code & Redeploy

1. Make changes locally
2. Push to GitHub: `git push origin main`
3. Vercel automatically redeploys within 1-2 minutes
4. Check the **Deployments** tab to monitor

## Update Environment Variables

### Using Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Update the token value
5. Go to **Deployments** → click latest → **Redeploy**

### If Token Expires
Instagram access tokens can expire. When yours does:
1. Generate a new token from https://developers.instagram.com
2. Update it in Vercel dashboard (Settings → Environment Variables)
3. Redeploy

## Troubleshooting

### Build Failed

Check build logs:
1. Dashboard → Your Project → **Deployments**
2. Click on the failed deployment
3. View build logs
4. Fix errors and push to GitHub (auto-redeploys)

**Common errors:**
- `DATABASE_URL is not set` - This is normal, your app doesn't need it
- `Module not found` - Run `npm install` locally and push again

### App Shows Code Instead of UI

This means the build ran but the server isn't starting. Try:
1. Settings → Environment Variables
2. Make sure `VITE_INSTAGRAM_ACCESS_TOKEN` is set
3. Click **Redeploy**

### Instagram API Not Working

1. Verify `VITE_INSTAGRAM_ACCESS_TOKEN` is in Environment Variables
2. Check token has correct permissions
3. Get a fresh token from Meta Developers
4. Update in Vercel and redeploy

### 404 Errors

If you see 404 pages, it's normal for API routes. The app is working! Just make sure:
1. Environment variable is set correctly
2. App has fully loaded in browser (check Network tab in DevTools)

## Custom Domain (Free!)

1. Dashboard → Your Project → Settings
2. Domains → Add Domain
3. Enter your custom domain (e.g., `instaclone.com`)
4. Follow DNS setup instructions

## Monitoring & Logs

Vercel provides free monitoring:
- Real-time analytics
- Error tracking
- Performance metrics

Go to: Dashboard → Your Project → Analytics

## Cost

**Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ Auto SSL certificates
- ✅ Edge caching
- ✅ Serverless functions

**Upgrade later** if you need more (Pro/Pro+)

## Rollback (Undo a Deployment)

1. Dashboard → **Deployments**
2. Find previous working deployment
3. Click three dots → "Promote to Production"
4. Done! ✨

## View Live App

After deployment:
1. Go to Dashboard
2. Click your project
3. Visit the URL shown at the top

---

**Your app is live on Vercel!** It's the easiest way to deploy 🚀

For more: https://vercel.com/docs
