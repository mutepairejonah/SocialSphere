# Deploy InstaClone to GitHub Pages

Your React app is ready to deploy automatically on every push! 🚀

## Setup (2 minutes)

### Step 1: Add Instagram Token to GitHub Secrets

1. Go to your repo: https://github.com/mutepairejonah/SocialSphere
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name**: `VITE_INSTAGRAM_ACCESS_TOKEN` (exactly as shown - all caps with underscores)
5. **Value**: Your Instagram access token
6. Click **Add secret**

### Step 2: Enable GitHub Pages

1. Go to repo **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. Click Save

### Step 3: Push to Deploy

```bash
git add -A
git commit -m "Enable GitHub Pages deployment"
git push origin main
```

**Done!** Your app is now live at:
```
https://mutepairejonah.github.io/SocialSphere/
```

## What Happens Next

- GitHub Actions automatically builds your app
- Deploys to GitHub Pages
- Every `git push` to `main` automatically redeploys

## View Deployment Status

1. Go to your repo
2. Click **Actions**
3. See your deployment status
4. Click the latest workflow to see logs

## Troubleshooting

### Build Failed
- Check **Actions** tab for error logs
- Make sure `VITE_INSTAGRAM_ACCESS_TOKEN` secret is added
- Try pushing again: `git push origin main`

### App Shows 404
- Wait 1-2 minutes for GitHub Pages to update
- Check **Settings** → **Pages** → GitHub Pages is enabled
- Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

### App Loads but Instagram Data is Missing
- Verify `VITE_INSTAGRAM_ACCESS_TOKEN` secret is set correctly
- Go to **Actions** → view latest deployment logs
- Check the secret value is correct (no extra spaces)

## Update Instagram Token

If your Instagram token expires:
1. Get a new token from https://developers.instagram.com
2. Go to repo **Settings** → **Secrets**
3. Click `VITE_INSTAGRAM_ACCESS_TOKEN` → click "Update secret"
4. Paste new token
5. Click **Update secret**
6. Push again: `git push --allow-empty -m "Trigger redeploy"`

---

**Your app is live on GitHub Pages!** 🎉
