# Authentic - Telegram-Style Messaging Platform

A real-time Telegram-inspired messaging platform with Instagram Graph API integration, built with React, TypeScript, Node.js, Socket.io, PostgreSQL, and Drizzle ORM.

## 🚀 Features

### Authentication
- **Google Sign-In** with unique username selection
- **Email/Password** signup and login
- Secure session management with Firebase Auth
- Automatic unique username generation

### Real-Time Messaging
- **Socket.io** powered live chat
- **User-to-user messaging** without follow requirements
- **Direct conversations** with any user
- Real-time message delivery and typing indicators
- Message history stored in PostgreSQL

### Instagram Integration
- **Instagram Graph API** integration
- **Video content** displayed on home feed only
- Live Instagram videos embedded in feed
- Automatic video loading and caching

### User Features
- **Editable profiles**: name, bio, website, avatar
- **User search** by username or full name
- **Real-time search** results
- Clean Telegram-style interface

### Posts
- **Create posts** with images and captions
- **Location tagging** for posts
- Posts stored in PostgreSQL database
- Like and comment functionality (coming soon)

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** components (Radix UI primitives)
- **Wouter** for routing
- **Zustand** for state management
- **Socket.io Client** for real-time updates

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **PostgreSQL** database with Drizzle ORM
- **TypeScript** for type safety

### External APIs
- **Firebase** for authentication
- **Instagram Graph API** for video content
- **Google Fonts** for typography

## 📋 Prerequisites

### Required Setup
1. **Instagram Graph API** - Configure Instagram Business Account access token
2. **Firebase Project** - Set up authentication
3. **PostgreSQL Database** - Replit provides automatic database setup
4. **Environment Variables** - Set up VITE_INSTAGRAM_ACCESS_TOKEN

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mutepairejonah/Connect.git
   cd Connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Add `VITE_INSTAGRAM_ACCESS_TOKEN` for Instagram API access
   - Database connection is automatically configured on Replit

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5000](http://localhost:5000)

## 🏗️ Project Structure

```
├── client/
│   └── src/
│       ├── components/              # Reusable UI components
│       ├── lib/
│       │   ├── firebase.ts          # Firebase configuration
│       │   ├── store.ts             # Zustand state management
│       │   └── instagram-api.ts     # Instagram Graph API
│       ├── pages/                   # Application pages
│       │   ├── Login.tsx
│       │   ├── Home.tsx             # Main feed with Instagram videos
│       │   ├── Messages.tsx         # Real-time messaging
│       │   ├── Create.tsx           # Create posts
│       │   ├── Profile.tsx
│       │   └── ...
│       └── App.tsx
├── server/
│   ├── index.ts                     # Express server
│   ├── routes.ts                    # API routes
│   ├── storage.ts                   # PostgreSQL operations
│   └── index-dev.ts                 # Development server
├── shared/
│   ├── schema.ts                    # Drizzle ORM schema
│   └── db.ts                        # Database configuration
├── drizzle.config.ts                # Drizzle configuration
└── package.json
```

## 🔐 Security

- Firebase handles authentication securely
- PostgreSQL database for encrypted data storage
- Environment variables for sensitive credentials
- Message history protected at database level
- User data isolated by authentication

## 🎨 Design

- **Telegram-inspired UI** - Clean, minimal design
- **Mobile-optimized** - Responsive layout
- **Real-time updates** - Instant message delivery
- **Dark/Light mode** support
- **Modern typography** - Inter font family

## 💬 Real-Time Features

### Socket.io Events
- `message:send` - Send a new message
- `message:receive` - Receive incoming messages
- `user:typing` - Show typing indicators
- `user:online` - User presence updates

### Database Events
- Real-time message syncing
- User activity tracking
- Message persistence

## 🐛 Troubleshooting

**Can't connect to messages?**
- Ensure Socket.io server is running
- Check browser console for connection errors
- Verify both users are authenticated

**Instagram videos not loading?**
- Verify VITE_INSTAGRAM_ACCESS_TOKEN is set
- Check Instagram Business Account permissions
- Ensure token has media access scope

**Database errors?**
- Run `npm run db:push` to sync schema
- Check PostgreSQL connection in logs
- Verify DATABASE_URL environment variable

**Posts not appearing?**
- Ensure user is logged in
- Check database for post records
- Verify imageUrl is valid

## 🚀 Deployment

### Deploy on Replit
1. Push code to GitHub repository
2. Import repository into Replit
3. Set environment variables in Secrets
4. Click "Run" to start the application

### Production Checklist
- [ ] Set all environment variables
- [ ] Configure Instagram Graph API
- [ ] Test all messaging features
- [ ] Verify database backups
- [ ] Enable production logging

## 📝 API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/user/:userId` - Get user's posts
- `GET /api/stories` - Get stories

### Users
- `POST /api/users` - Create new user
- `GET /api/search/users` - Search users

### Messages
- `GET /api/messages/:conversationId` - Get message history

## 🎯 Roadmap

- ✅ Real-time messaging with Socket.io
- ✅ Instagram API integration
- ✅ PostgreSQL database
- ✅ User authentication
- 🔜 Video calls with WebRTC
- 🔜 Group messaging
- 🔜 Message encryption
- 🔜 File sharing
- 🔜 Push notifications
- 🔜 Message search

## 📄 License

Built for educational purposes. Open source and available for learning.

---

**Built with ❤️ using Replit, React, and Node.js**

GitHub: [https://github.com/mutepairejonah/Connect](https://github.com/mutepairejonah/Connect)
