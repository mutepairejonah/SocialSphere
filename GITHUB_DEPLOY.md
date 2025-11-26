# Deploy InstaClone to GitHub Pages

This is now a **React-only app** - no backend needed! 🚀

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/instaclone.git
git push -u origin main
```

## Step 2: Set Up GitHub Pages

1. Go to your repository → **Settings**
2. Scroll to **Pages** section
3. Select **Deploy from a branch**
4. Choose branch: **main**
5. Choose folder: **/dist** (or root if you prefer)
6. Click **Save**

GitHub will automatically build and deploy your app!

## Step 3: Add Your Instagram Token

⚠️ **NEVER commit your Instagram token to GitHub!**

Instead:
1. Build locally with your token:
   ```bash
   echo "VITE_INSTAGRAM_ACCESS_TOKEN=your_token" > .env.local
   npm run build
   ```

2. Deploy the `dist/` folder to GitHub Pages manually, OR

3. Use environment secrets (advanced):
   - Go to **Settings → Secrets and variables → Actions**
   - Add `VITE_INSTAGRAM_ACCESS_TOKEN`
   - Create `.github/workflows/deploy.yml` to build with secrets

## Step 4: Build Locally & Deploy

```bash
# 1. Get your Instagram token
# From: https://developers.instagram.com

# 2. Create .env.local (never commit this!)
echo "VITE_INSTAGRAM_ACCESS_TOKEN=your_token_here" > .env.local

# 3. Install dependencies
npm install

# 4. Build
npm run build

# 5. Test locally
npm run preview

# 6. Commit and push (dist/ is automatically generated)
git add .
git commit -m "Build update"
git push
```

## Your App URL

Your app will be live at:
```
https://YOUR_USERNAME.github.io/instaclone
```

## Tips

✅ **Do this:**
- Build locally with your token
- Commit `dist/` folder to GitHub
- Share the GitHub Pages URL

❌ **Don't do this:**
- Commit `.env.local` file
- Push your Instagram token to GitHub
- Use old code with server files

## Troubleshooting

**App not showing up on GitHub Pages?**
- Go to Settings → Pages
- Make sure "Deploy from a branch" is selected
- Check that the branch and folder are correct
- Wait 1-2 minutes for deployment

**Get fresh Instagram token?**
- Visit: https://developers.instagram.com
- Your App → Tools → Graph API Explorer
- Click "Generate Access Token"

---

**Your app is ready for GitHub! 🎉**
