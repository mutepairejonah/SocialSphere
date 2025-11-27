# Deploy InstaClone to Heroku (React Only)

Simple React-only deployment! 🚀

## Steps

```bash
# 1. Login
heroku login

# 2. Create app
heroku create instaclone-yourname

# 3. Set Instagram token
heroku config:set VITE_INSTAGRAM_ACCESS_TOKEN=your_token_here

# 4. Deploy
git push heroku main

# 5. Open
heroku open
```

**Your app is live!** ✨

## Get Instagram Token

1. https://developers.instagram.com  
2. Generate token with: `instagram_basic`, `instagram_graph_user_media`
3. Set in Heroku: `heroku config:set VITE_INSTAGRAM_ACCESS_TOKEN=your_token`
4. Redeploy: `git push heroku main`
