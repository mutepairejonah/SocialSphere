# Deployment to Render

This guide explains how to deploy "Authentic" to Render.

## Prerequisites

1. GitHub account (repository already created)
2. Render account (free tier available at https://render.com)
3. Instagram Graph API access token
4. Instagram Business Account ID (optional)

## Step-by-Step Deployment

### 1. Push Latest Changes to GitHub

Your code is already pushed, but ensure all latest changes are committed:

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended - automatic authentication)
3. Authorize Render to access your GitHub account

### 3. Create Web Service

1. In Render dashboard, click **"+ New"** button
2. Select **"Web Service"**
3. Connect your GitHub repository `mutepairejonah/Connect`
4. Select repository and authorize if prompted
5. Configure the service:
   - **Name**: `authentic-app` (or any preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter (whatever suits your needs)

### 4. Create PostgreSQL Database

1. In Render dashboard, click **"+ New"** button
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `authentic-db`
   - **Database**: `authenticdb`
   - **User**: (auto-generated)
   - **Region**: Same as web service
   - **Plan**: Free

### 5. Configure Environment Variables

In the Web Service settings, add these environment variables:

#### Required:
- **DATABASE_URL**: Copy from the PostgreSQL service (automatic link)
- **NODE_ENV**: `production`
- **VITE_INSTAGRAM_ACCESS_TOKEN**: Your Instagram Graph API token

#### Optional:
- **VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID**: Your Instagram Business Account ID

### 6. Deploy

1. Return to Web Service dashboard
2. Click **"Deploy latest commit"** or wait for automatic deployment (triggered by GitHub push)
3. View deployment logs in the **"Events"** tab
4. Once deployment shows "Live", your app is running!

## Getting Your App URL

After successful deployment, you'll see a URL like:
```
https://authentic-app.onrender.com
```

Use this URL to access your application.

## Troubleshooting

### Database Connection Failed
- Ensure DATABASE_URL is correctly linked from PostgreSQL service
- Wait 30 seconds after creating database for connection to be ready
- Check that Web Service has access to the database

### Instagram API Not Loading Videos
- Verify VITE_INSTAGRAM_ACCESS_TOKEN is correctly set
- Ensure the token has media read permissions
- Check Instagram Graph API is enabled in your developer account

### Build Failed
- Check deployment logs for specific errors
- Ensure all dependencies are in package.json
- Verify npm run build works locally: `npm run build`

### App Crashes on Deploy
- Check logs in Events tab for error messages
- Ensure environment variables are set correctly
- Verify database migrations ran: Look for database schema creation

### Messages Not Working
- Verify Socket.io is properly configured for production
- Check browser console for WebSocket connection errors
- Ensure backend server is running (check Render logs)

## Database Migrations on Render

After first deployment, you may need to push database schema:

1. SSH into Render shell (if available) or use Render CLI
2. Run: `npm run db:push`
3. Or connect to PostgreSQL and verify tables are created

## Monitoring

### View Logs
- Go to Web Service → Events tab to see deployment logs
- Go to Web Service → Logs tab to see runtime logs

### Monitor Performance
- Render dashboard shows CPU, memory, and request metrics
- Free tier has limitations - upgrade if needed

## Redeployment

To redeploy after code changes:

1. Push changes to GitHub main branch
2. Render automatically redeploys on push
3. Or manually trigger in dashboard: **"Manual Deploy"** → **"Deploy latest commit"**

## Free Tier Limitations

- Apps auto-sleep after 15 minutes of inactivity (paid tiers don't sleep)
- Limited to 1 free PostgreSQL instance
- 750 hours/month of free Web Service hours
- Cold starts may take 30-50 seconds

## Upgrading to Paid Tiers

1. Go to Web Service settings
2. Under Plan, select **"Starter"** or higher
3. Benefits: Always on, faster cold starts, more compute power

## Need Help?

- Render Docs: https://render.com/docs
- Render Support: support@render.com
- Check deployment logs for specific errors

---

**Your live app will be accessible at**: `https://yourdomain.onrender.com`
