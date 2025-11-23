# Instagram Clone - Full-Stack Social Media App

A complete Instagram clone built with React, TypeScript, and Firebase featuring authentication, posts, messaging, and video/audio calling.

## 🚀 Features

### Authentication
- **Google Sign-In** with unique username selection
- **Email/Password** signup and login
- Automatic unique username generation
- Secure session management with Firebase Auth

### User Profiles
- **Unique usernames** enforced in database
- **Editable profiles**: name, bio, website, avatar
- **Avatar uploads** to Firebase Storage
- **Follow/Unfollow** system
- Follower and following counts

### Posts & Content
- **Image/Video uploads** (max 100MB)
- Caption and location tagging
- Like and save functionality
- Feed with posts from followed users
- Post creation with real-time updates

### Social Features
- **User search** by username or full name
- **Real-time search** results in Explore tab
- **Follow from search** results
- See follow status for each user

### Messaging & Calls
- **Real-time messaging** between followers (Firestore)
- **Audio calling** initiation
- **Video calling** initiation
- Conversation history
- Message timestamps

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase
  - Authentication (Google & Email)
  - Firestore Database
  - Firebase Storage
- **Routing**: Wouter
- **State Management**: Zustand
- **UI Components**: Radix UI primitives

## 📋 Prerequisites

Before running this app, you must configure Firebase:

1. **Firebase Project**: chatapp-d92e7
2. **Firestore Database Rules** (See FIREBASE_SETUP.md)
3. **Storage Rules** (See FIREBASE_SETUP.md)

## ⚙️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. **CRITICAL**: Update Firebase rules (see FIREBASE_SETUP.md)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5000](http://localhost:5000)

## 🔒 Firebase Configuration

### Current Configuration
- **API Key**: AIzaSyAYc4hqiWsrzIYvoybXUK_2HglHj_Ut1Mo
- **Auth Domain**: chatapp-d92e7.firebaseapp.com
- **Project ID**: chatapp-d92e7
- **Storage Bucket**: chatapp-d92e7.firebasestorage.app

⚠️ **IMPORTANT**: You MUST update Firestore and Storage rules in Firebase Console for the app to work. See `FIREBASE_SETUP.md` for detailed instructions.

## 📁 Project Structure

```
├── client/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── lib/
│       │   ├── firebase.ts    # Firebase configuration
│       │   └── store.ts       # Zustand state management
│       ├── pages/             # Application pages
│       │   ├── Login.tsx      # Authentication page
│       │   ├── SetupProfile.tsx  # Username setup
│       │   ├── Home.tsx       # Main feed
│       │   ├── Explore.tsx    # User search
│       │   ├── Messages.tsx   # Messaging & calls
│       │   ├── Profile.tsx    # User profile
│       │   └── ...
│       └── App.tsx            # Main app component
├── firestore.rules            # Firestore security rules
├── storage.rules              # Storage security rules
└── FIREBASE_SETUP.md          # Firebase setup guide
```

## 🔐 Security

- All Firebase operations require authentication
- Username uniqueness enforced at database level
- Storage rules protect user uploads
- Messages only accessible by sender/recipient
- Profile updates restricted to profile owner

## 🎨 Design

- **Instagram-inspired UI** with clean, modern aesthetics
- **Responsive design** optimized for mobile
- **Dark/Light mode** support
- **Grand Hotel font** for logo
- **Inter font** for UI text

## 🧪 Key Functionality

### Username Uniqueness
- Real-time availability checking during signup
- Automatic unique username generation for email signups
- Case-insensitive username matching

### Follow System
- Follow/unfollow functionality
- Follower and following counts
- Follow status displayed in search results
- Following list used for messaging

### Messaging
- Conversation IDs based on sorted user IDs
- Real-time message delivery via Firestore
- Message timestamps
- Only followers can message each other

### Search
- Search users by username or full name
- Case-insensitive search
- Real-time results
- Follow buttons in search results

## 🐛 Troubleshooting

**Permission Denied Errors?**
- Make sure you've updated Firestore rules in Firebase Console
- Check that Storage rules are also updated
- Wait 30 seconds after publishing rules

**Can't Upload Avatar?**
- Verify Storage rules are published
- Check file size (max 100MB)
- Ensure you're logged in

**Search Not Working?**
- Make sure Firestore rules allow read access
- Check that you're authenticated
- Verify at least one other user exists

**Messages Not Sending?**
- Ensure Firestore rules are updated
- Check that you're following the user
- Verify you're authenticated

## 📝 Next Steps

To make this production-ready:

1. ✅ Update Firebase rules (CRITICAL)
2. ✅ Test all features end-to-end
3. 🔜 Add real-time WebRTC for audio/video calls
4. 🔜 Implement push notifications
5. 🔜 Add comment functionality on posts
6. 🔜 Implement stories feature
7. 🔜 Add email verification
8. 🔜 Implement password reset

## 📄 License

This is a demo project built for educational purposes.

---

**Built with ❤️ using Replit**
