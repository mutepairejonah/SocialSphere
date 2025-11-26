# Deploy InstaClone to GitHub Pages

Your app is **100% React-only** with zero backend - perfect for GitHub Pages! 🚀

## Quick Start (3 Steps)

### Step 1: Build Locally

```bash
# Clone or open your project
cd Connect

# Install dependencies
npm install

# Build for production
npm run build

# This creates `/dist` folder with your entire app
```

### Step 2: Push to GitHub

```bash
# Add the dist folder
git add dist/
git commit -m "Build: InstaClone ready for GitHub Pages"
git push origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo: https://github.com/mutepairejonah/Connect
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Select **Deploy from a branch**
   - Branch: **main**
   - Folder: **/dist**
4. Click **Save**

**Wait 1-2 minutes** for deployment to complete.

---

## Your App is Live! 🎉

```
https://mutepairejonah.github.io/Connect
```

---

## What You Need to Know

### Instagram Access Token

Your app needs an Instagram access token to display posts and profile data.

**Get your token:**
1. Go to https://developers.instagram.com
2. Create/select your app
3. Go to Tools → Graph API Explorer
4. Generate Access Token
5. Copy the token

**Use it in your app:**

When you connect an Instagram account in the app, paste your access token. Your app stores it in **browser localStorage** (encrypted and local-only).

### Data Storage

Everything is stored **locally in your browser**:
- ✅ Bookmarks/saved posts
- ✅ Account data
- ✅ Preferences (dark mode, etc)
- ✅ Access tokens (never sent to servers)

**Data persists:**
- Survives page refreshes ✓
- Survives closing the browser ✓
- Stored only on your device ✓

**Data is cleared:**
- When you clear browser cache/cookies
- When you use private/incognito mode

### Environment Variables (Optional)

To avoid pasting your token each time, create `.env.local`:

```
VITE_INSTAGRAM_ACCESS_TOKEN=your_access_token_here
```

Then the app uses it automatically on startup.

---

## Features Included

✅ Multiple Instagram account support  
✅ Switch between accounts  
✅ View posts, stories, engagement metrics  
✅ Bookmark/save posts locally  
✅ Dark mode toggle  
✅ Real-time search  
✅ Offline-ready (after first load)  

---

## Troubleshooting

### App not updating on GitHub Pages?

1. Wait 1-2 minutes for deployment
2. Hard refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check deployment status in your repo:
   - Go to Settings → Pages
   - Scroll to "Deployments"
   - Look for latest deployment status

### Changes not showing after push?

```bash
# Make sure you built before pushing
npm run build

# Then push the new dist folder
git add dist/
git commit -m "Update: [describe changes]"
git push origin main
```

### Instagram token not working?

1. Generate a fresh token from https://developers.instagram.com
2. Make sure it's a valid access token (not App Secret or API Key)
3. Paste it in the app when connecting your account

### Still need help?

- Check the GitHub Actions logs: https://github.com/mutepairejonah/Connect/actions
- Verify your Instagram app is in Development mode (not Live)
- Make sure your Instagram business account is connected to your app

---

## Local Development

Want to test before deploying?

```bash
npm run dev
```

Your app runs at http://localhost:5000

---

## That's It! 🎊

Your InstaClone app is now live and ready to use. Enjoy!
