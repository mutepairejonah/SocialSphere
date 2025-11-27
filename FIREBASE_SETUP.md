# Firebase Setup Instructions

Your app needs real Firebase credentials to work. Follow these steps:

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Create a project**
3. Enter project name: `InstaClone`
4. Continue through setup

## Step 2: Register Web App

1. In Firebase Console, click **+ Add app** → **Web**
2. App nickname: `InstaClone`
3. Click **Register app**
4. Copy the config

## Step 3: Update Your App

Open `client/src/lib/firebase.ts` and replace:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

With your **actual credentials from Firebase Console**.

## Step 4: Enable Authentication

1. Go to **Build** → **Authentication**
2. Enable **Google** and **Email/Password**

## Step 5: Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **Create database** → **Test mode**

## Step 6: Rebuild & Deploy

```bash
npm run build
npm run deploy
```

Done! 🚀
