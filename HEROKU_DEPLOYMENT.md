# Deploy InstaClone to Heroku

Get your app live on Heroku in 5 minutes! 🚀

## Prerequisites

- Heroku account (free at https://signup.heroku.com)
- Heroku CLI installed ([Download](https://devcenter.heroku.com/articles/heroku-cli))
- Git configured locally
- Your Instagram access token ready

## Step 1: Login to Heroku

```bash
heroku login
```

This opens a browser to authenticate.

## Step 2: Create Heroku App

```bash
heroku create instaclone-yourname
```

Replace `yourname` with your name. This gives you a unique URL like `https://instaclone-yourname.herokuapp.com`

## Step 3: Add PostgreSQL Database (Optional)

Heroku can provide a free database:

```bash
heroku addons:create heroku-postgresql:mini --app instaclone-yourname
```

## Step 4: Set Environment Variables

```bash
# Your Instagram access token
heroku config:set VITE_INSTAGRAM_ACCESS_TOKEN=your_token_here --app instaclone-yourname

# Optional: set environment
heroku config:set NODE_ENV=production --app instaclone-yourname
```

**Get your Instagram token:**
1. Go to https://developers.instagram.com
2. Create an app or use existing
3. Generate an access token with permissions: `instagram_basic`, `instagram_graph_user_media`

## Step 5: Deploy

```bash
git push heroku main
```

Or if your main branch is called `master`:
```bash
git push heroku master
```

## Step 6: View Your App

```bash
heroku open --app instaclone-yourname
```

Your app is now **LIVE** on the internet! 🎉

## View Logs

```bash
heroku logs --tail --app instaclone-yourname
```

## Troubleshooting

### Build Failed
```bash
# Check build logs
heroku logs --app instaclone-yourname

# Try rebuilding
git push heroku main --force
```

### Database Errors
```bash
# Check if database is provisioned
heroku addons --app instaclone-yourname

# Add database if missing
heroku addons:create heroku-postgresql:mini --app instaclone-yourname
```

### App Crashes
```bash
# View error logs
heroku logs -n 100 --app instaclone-yourname

# Restart app
heroku restart --app instaclone-yourname
```

### Instagram API Not Working
- Verify `VITE_INSTAGRAM_ACCESS_TOKEN` is set: `heroku config --app instaclone-yourname`
- Check token has correct permissions
- Get a fresh token from Meta Developers

## Managing Your Heroku App

```bash
# View environment variables
heroku config --app instaclone-yourname

# Update a variable
heroku config:set VITE_INSTAGRAM_ACCESS_TOKEN=new_token --app instaclone-yourname

# View app info
heroku apps:info --app instaclone-yourname

# Scale dynos (if needed)
heroku ps:scale web=1 --app instaclone-yourname

# Run one-off commands
heroku run npm run db:push --app instaclone-yourname
```

## Upgrade Later

When your app grows:
- Upgrade database: `heroku addons:upgrade heroku-postgresql:standard-0`
- Upgrade dyno: `heroku dyno:type web=standard-1x`
- Enable eco: `heroku dyno:type web=eco`

## Custom Domain (Optional)

```bash
# Add custom domain
heroku domains:add www.yourdomain.com --app instaclone-yourname

# Get DNS target
heroku domains:info www.yourdomain.com --app instaclone-yourname
```

Then point your domain DNS to the Heroku target.

## Stop/Delete App

```bash
# Stop app
heroku ps:scale web=0 --app instaclone-yourname

# Delete app
heroku apps:destroy --app instaclone-yourname
```

---

**Your app is live!** Share your Heroku URL with the world 🌍

Need help? Check Heroku docs: https://devcenter.heroku.com
