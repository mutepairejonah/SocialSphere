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

### Step 3: Set Environment Variables

**IMPORTANT:** You must add your Instagram access token in the Vercel dashboard AFTER deployment:

1. Go to https://vercel.com/dashboard
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

Click "Deploy" and wait ~2 minutes

Your app will be live at: `https://instaclone.vercel.app` 🎉

## Automatic Deployments

After your first deployment, every time you push to GitHub, Vercel **automatically redeploys** your app!

```bash
git push origin main
# Vercel detects changes and redeploys automatically
```

## Using Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from local machine
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs
```

## Update Environment Variables

### Using Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add/update variables
5. Redeploy

### Using CLI
```bash
vercel env add VITE_INSTAGRAM_ACCESS_TOKEN
# Follow prompts to add value
vercel --prod  # Redeploy with new variables
```

## Troubleshooting

### Build Failed

Check build logs in Vercel dashboard:
1. Dashboard → Your Project
2. Click on failed deployment
3. View build logs
4. Fix errors and push to GitHub (auto-redeploys)

### App is Blank

- Check browser console for errors
- Verify environment variables are set
- Check Vercel Function logs (Deployments → Logs)

### Instagram API Not Working

1. Verify `VITE_INSTAGRAM_ACCESS_TOKEN` is set
2. Check token has correct permissions
3. Get a fresh token from Meta Developers

## Custom Domain (Free!)

1. Dashboard → Your Project → Settings
2. Domains → Add Domain
3. Enter your custom domain (e.g., `instaclone.com`)
4. Follow DNS setup instructions

## Monitoring

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

**Upgrade later** if you need more resources (Pro/Pro+)

## Rollback (Undo a Deployment)

1. Dashboard → Deployments
2. Find previous working deployment
3. Click three dots → "Promote to Production"
4. Done! ✨

## View Live App

```bash
# After deployment
vercel --prod

# Or find URL in dashboard
```

---

**Your app is live on Vercel!** It's faster and easier than any other platform 🚀

For more: https://vercel.com/docs
