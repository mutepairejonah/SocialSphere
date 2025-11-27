# Personal Instagram Clone

A minimal, personal Instagram clone that displays your Instagram media feed with real engagement metrics. Built with React, TypeScript, Firebase Auth, and Instagram Graph API.

## 🎯 What This Does

- **Login**: Firebase authentication (email/password or Google)
- **Home Feed**: Display your Instagram media with real engagement metrics
- **Profile**: View your Instagram profile data (followers, following, bio, website)
- **API-Only**: Only features supported by the Instagram Graph API

## ❌ What This Doesn't Do

- ❌ Create posts (API read-only)
- ❌ Messaging or real-time chat
- ❌ Stories
- ❌ Follow/unfollow system
- ❌ Comments or likes (read-only)
- ❌ User search

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **API**: Instagram Graph API
- **Backend**: Node.js + Express (minimal - auth sync only)
- **Database**: PostgreSQL (minimal - users sync only)

## 🚀 Getting Started

### Prerequisites

1. **Instagram Business Account** - Required for Graph API access
2. **Instagram Access Token** - Create via Meta Developer Portal
3. **Firebase Project** - For authentication

### Installation

```bash
# 1. Clone repository
git clone https://github.com/mutepairejonah/instaclone.git
cd instaclone

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env file and add:
VITE_INSTAGRAM_ACCESS_TOKEN=your_instagram_token_here
VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id

# 4. Sync database schema
npm run db:push

# 5. Start development server
npm run dev
```

Open [http://localhost:5000](http://localhost:5000)

## 📱 Features

### Home Feed
- Display all your Instagram media (photos & videos)
- Real-time engagement metrics (likes, comments)
- Timestamps and captions from Instagram

### Profile Page
- View your Instagram profile info
- Follower/following counts
- Bio and website link
- Media count

### Authentication
- Sign up with email/password
- Log in with Google
- Firebase session management

## 🔑 Environment Variables

```
VITE_INSTAGRAM_ACCESS_TOKEN      # Your Instagram Graph API token
VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID # Your business account ID (optional)
```

## 📂 Project Structure

```
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Login.tsx          # Authentication
│       │   ├── Home.tsx           # Instagram feed
│       │   └── Profile.tsx        # Profile page
│       ├── lib/
│       │   ├── firebase.ts        # Firebase config
│       │   ├── instagram.ts       # Instagram API
│       │   └── store.ts           # State management
│       └── App.tsx                # Main routing
├── server/
│   ├── routes.ts                  # API routes
│   └── storage.ts                 # Database operations
├── shared/
│   └── schema.ts                  # Database schema
└── package.json
```

## 🔗 Instagram API Endpoints Used

- `GET /me/media` - Fetch user media
- `GET /me` - Fetch user profile
- Media fields: `id, caption, media_type, media_url, thumbnail_url, timestamp, like_count, comments_count`

## ⚙️ How It Works

1. **Login** → Firebase Auth creates user session
2. **Home** → Fetch Instagram media via Graph API
3. **Profile** → Display Instagram profile data
4. **Logout** → Clear Firebase session

## 🚀 Deployment

### Deploy on Render

1. Push code to GitHub
2. Create Render account
3. Connect GitHub repository
4. Set environment variables in Render dashboard
5. Deploy!

See `RENDER_DEPLOYMENT.md` for detailed steps.

## 🐛 Troubleshooting

**Instagram videos not loading?**
- Verify `VITE_INSTAGRAM_ACCESS_TOKEN` is set
- Check token has `instagram_graph_user_media` permission
- Ensure token is valid and not expired

**Can't log in?**
- Check Firebase configuration in `client/src/lib/firebase.ts`
- Verify email/password is correct
- Try Google sign-in instead

**Profile showing no data?**
- Ensure Instagram token has `instagram_graph_user_profile` permission
- Check that your Instagram account is a Business Account

## 📝 Notes

- This app displays your personal Instagram data only
- No public user discovery or search
- No data collection or sharing
- Read-only access to Instagram media

## 📄 License

Built for personal use. Open source and available for educational purposes.

---

**Built with React, Firebase, and Instagram Graph API**

GitHub: [https://github.com/mutepairejonah/Connect](https://github.com/mutepairejonah/Connect)
