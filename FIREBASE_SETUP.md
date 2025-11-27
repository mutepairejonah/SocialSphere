# Firebase Setup Guide for Instagram Clone

## 🚨 Critical: You Must Update Firebase Rules

Your app is currently getting **permission-denied** errors because Firebase security rules need to be updated. Follow these steps:

---

## Step 1: Update Firestore Database Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **chatapp-d92e7** project
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab
5. Copy and paste the contents from `firestore.rules` file in this project
6. Click **Publish**

**⚠️ This is REQUIRED or your app won't work!**

---

## Step 2: Update Firebase Storage Rules

1. In the same Firebase Console
2. Click **Storage** in the left sidebar
3. Click the **Rules** tab
4. Copy and paste the contents from `storage.rules` file in this project
5. Click **Publish**

**⚠️ This fixes avatar upload errors!**

---

## What These Rules Do

### Firestore Rules
- ✅ Allow authenticated users to read all user profiles
- ✅ Allow users to update their own profiles
- ✅ Allow authenticated users to create posts, messages, and calls
- ✅ Protect private data (users can only see messages sent to them)
- ✅ Enable follow/unfollow functionality

### Storage Rules
- ✅ Allow anyone to view avatars and posts (public content)
- ✅ Allow users to upload their own avatar
- ✅ Allow authenticated users to upload post images/videos
- ✅ Protect against unauthorized uploads

---

## Verification

After updating the rules:

1. Refresh your app
2. Try logging in with Google or Email
3. Search for users in the Explore tab
4. Upload an avatar in Edit Profile
5. Send messages to followers

All features should work without permission errors!

---

## Current Features

✅ **Authentication**
- Google Sign-in with unique username selection
- Email/Password signup with auto-generated unique usernames
- Secure session management

✅ **User Profiles**
- Unique usernames (enforced in database)
- Editable profile info (name, bio, website)
- Avatar uploads to Firebase Storage
- Follower/Following counts

✅ **Posts**
- Image and video uploads (max 100MB)
- Captions and location tags
- Like and save functionality

✅ **Social Features**
- Follow/Unfollow system
- Real-time user search by username or name
- Messaging between followers (Firestore)
- Audio and video call initiation (Firestore)

✅ **Search**
- Find users by typing username or full name
- See follow status for each user
- Follow/unfollow directly from search results

---

## Troubleshooting

**Still seeing permission errors?**
1. Make sure you clicked **Publish** in both Firestore and Storage
2. Wait 30 seconds for rules to propagate
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for specific error messages

**Avatar uploads not working?**
1. Verify Storage rules are published
2. Check that the file is under 100MB
3. Make sure you're signed in

**Can't find users in search?**
1. Make sure at least one other user exists
2. Try searching by exact username
3. Check that you're logged in

---

## Firebase Configuration

Your app is connected to:
- **Project ID**: chatapp-d92e7
- **Auth Domain**: chatapp-d92e7.firebaseapp.com
- **Storage**: chatapp-d92e7.firebasestorage.app

All configuration is already set up in `client/src/lib/firebase.ts`
