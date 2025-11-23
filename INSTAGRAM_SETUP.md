# Instagram API Integration

Your app now uses **Instagram API exclusively for posts**. Here's how to set it up:

## Step 1: Get Instagram Graph API Credentials

1. Go to [Meta Developers](https://developers.facebook.com/)
2. Create an app or select existing one
3. Add Instagram Graph API product
4. Generate an access token with these permissions:
   - `instagram_business_content_read`
   - `instagram_basic`

## Step 2: Find Your Business Account ID

1. In Meta Developers, go to your Instagram app
2. Navigate to Tools > Graph Explorer
3. Run: `GET /me/instagram_business_accounts`
4. Copy the `id` from the response

## Step 3: Set Environment Variables

Provide these credentials:

- **VITE_INSTAGRAM_ACCESS_TOKEN**: Your Graph API access token
- **VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID**: Your business account ID

## Step 4: Features Available

The app will now:
- ✅ Fetch your Instagram posts automatically
- ✅ Display posts with images/videos
- ✅ Show post captions
- ✅ Display post timestamps
- ✅ Support likes and saves locally

## Features Using Instagram API

**In `client/src/lib/instagram.ts`:**
- `getUserMedia()` - Fetch all your Instagram posts
- `getUserInsights()` - Get post insights (impressions, reach)
- `makeInstagramRequest()` - Make custom API calls

## Usage in Your App

Posts are loaded automatically when you open the Home page. The feed will show your Instagram media with captions and details.

**Note**: Likes and saves are tracked locally for now. To sync with Instagram, you'd need to implement additional API calls.

---

**Ready to connect?** Provide your credentials and the app will pull your Instagram posts directly!
