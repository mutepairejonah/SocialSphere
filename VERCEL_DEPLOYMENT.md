# Deploy InstaClone to Vercel (React Only)

Your React-only InstaClone is ready to deploy! ⚡

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmutepairejonah%2FSocialSphere&env=VITE_INSTAGRAM_ACCESS_TOKEN)

**Click the button above and you're done!** 🚀

## Manual Deploy (2 minutes)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click **Deploy** - that's it!
4. After deployment, go to **Settings → Environment Variables**
5. Add: `VITE_INSTAGRAM_ACCESS_TOKEN` = your token
6. Click **Redeploy**

Your app is live! 🎉

## Get Instagram Token

1. https://developers.instagram.com
2. Generate access token with: `instagram_basic`, `instagram_graph_user_media`
3. Add to Vercel environment variables
4. Redeploy
