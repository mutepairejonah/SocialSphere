# InstaClone - Social Media Application

## Overview

This is a full-stack Instagram clone (InstaClone) built with React, TypeScript, and Firebase. The application provides core social media functionality including user authentication, profile management, post creation and sharing, real-time messaging, and audio/video calling capabilities. The frontend uses React with Vite for fast development, styled with Tailwind CSS and shadcn/ui components. Firebase handles all backend services including authentication, Firestore for data storage, Firebase Storage for media files, and Realtime Database for live features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript running on Vite for fast development and hot module replacement. The application uses a client-side rendering approach with wouter for lightweight routing.

**State Management**: Zustand is used for global state management, primarily handling authentication state, user data, posts, notifications, and social interactions. The store (`client/src/lib/store.ts`) centralizes all Firebase interactions and manages the application's data flow.

**UI Components**: The application leverages shadcn/ui, a collection of Radix UI primitives styled with Tailwind CSS. This provides accessible, customizable components following the "new-york" style variant. Components are organized in `client/src/components/ui/`.

**Styling**: Tailwind CSS v4 with custom theme configuration defined inline in `client/src/index.css`. The theme supports both light and dark modes with custom color tokens for background, foreground, primary, secondary, muted, accent, destructive, border, and input states.

**Mobile-First Design**: The application is optimized for mobile with a bottom navigation bar (`BottomNav.tsx`), touch-friendly interactions, and responsive layouts constrained to a maximum width of `max-w-md` (448px) centered on screen.

### Authentication System

**Firebase Authentication**: Supports two authentication methods:
- Google OAuth sign-in with popup flow
- Email/password authentication (both signup and login)

**Username Management**: Unique username system enforced at the database level. New Google users are directed to a setup flow (`SetupProfile.tsx`) to select a unique username before accessing the application. Username availability is checked in real-time against Firestore.

**Session Management**: Firebase Auth handles session persistence automatically. The auth state is initialized on app load via `onAuthStateChanged` listener, which updates Zustand store and redirects unauthenticated users to the login page.

### Data Storage

**Firestore Database**: Primary data store organized into collections:
- `users`: User profiles with username, fullName, email, avatar, bio, website, followers/following counts
- `posts`: Post content with userId, imageUrl, caption, location, likes, comments counts
- `follows`: Follow relationships between users
- `messages`: Real-time messaging between users
- `notifications`: Activity feed for likes, comments, follows
- `calls`: Call initiation and status tracking

**Firebase Storage**: Stores user-uploaded media in organized paths:
- `avatars/{userId}`: Profile pictures
- `posts/{postId}`: Post images and videos (max 100MB)

**Realtime Database**: Used for real-time features like messaging and call signaling (`rtdb` instance in `firebase.ts`).

**Security Rules**: Critical security configuration in `firestore.rules` and `storage.rules` files that must be deployed to Firebase Console. Rules enforce:
- Authenticated users can read all user profiles
- Users can only update their own profiles
- Public read access to avatars and posts
- Protected write access for user-specific data

### Social Features

**Posts**: Users can create posts with images/videos, captions, and location tags. Posts support likes and saves, with state managed both locally (for instant feedback) and in Firestore (for persistence).

**Follow System**: Follow/unfollow functionality with bidirectional relationship tracking. Following users determines feed content and messaging availability.

**Search**: Real-time user search by username or full name in the Explore page. Search queries Firestore with case-insensitive matching.

**Notifications**: Activity tracking for social interactions (likes, comments, follows) with read/unread states.

**Messaging**: Real-time messaging between users who follow each other. Messages are stored in Firestore with sender/recipient IDs and timestamps.

**Calling**: Audio and video call initiation (UI present, full WebRTC implementation may require additional setup).

### Build and Deployment

**Development**: Vite dev server runs on port 5000 with HMR, serving the client application while the Express server handles API routes (though most logic is client-side Firebase calls).

**Production Build**: 
- Client: Vite bundles React app to `dist/public`
- Server: esbuild bundles Express server to `dist/index.js`
- Static files served by Express in production

**Environment**: The application expects Firebase configuration hardcoded in `client/src/lib/firebase.ts` for the `chatapp-d92e7` project.

## External Dependencies

### Firebase Services

**Project**: chatapp-d92e7
- **Firebase Auth**: Google OAuth and Email/Password authentication
- **Firestore**: NoSQL document database for users, posts, follows, messages, notifications
- **Firebase Storage**: Object storage for avatars and post media
- **Realtime Database**: Real-time sync for messaging and calls
- **Hosting Domain**: chatapp-d92e7.firebaseapp.com

**Critical Setup Required**: Firebase security rules must be manually deployed via Firebase Console for both Firestore and Storage, otherwise permission-denied errors will occur. Rules files are included in repository (`firestore.rules`, `storage.rules`).

### Third-Party APIs and Services

**Google Fonts**: Inter (sans-serif, weights 300-700) and Grand Hotel (cursive) loaded from Google Fonts CDN for typography.

**Dicebear API**: Used for generating avatar placeholders (`https://api.dicebear.com/7.x/avataaars/svg?seed={id}`).

**Unsplash**: Stock images used for avatar selection options in EditProfile component.

### UI Component Libraries

**Radix UI**: Accessible component primitives for accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, popover, select, tabs, toast, tooltip, and more.

**Lucide React**: Icon library for UI icons throughout the application.

**Embla Carousel**: Carousel component for potential gallery/story features.

**React Hook Form**: Form state management with Zod schema validation.

**Sonner**: Toast notification system for user feedback.

### Development Tools

**Replit-Specific Plugins**: 
- `@replit/vite-plugin-runtime-error-modal`: Runtime error overlay
- `@replit/vite-plugin-cartographer`: Development mapping tool
- `@replit/vite-plugin-dev-banner`: Development environment banner

**Meta Images Plugin**: Custom Vite plugin (`vite-plugin-meta-images.ts`) that updates OpenGraph and Twitter card meta tags with the correct Replit deployment URL.

### Database Consideration

The project includes Drizzle ORM configuration (`drizzle.config.ts`) and references to PostgreSQL in package dependencies, but these are currently unused. Firebase serves as the primary database. If PostgreSQL is added later, migration from Firebase to a hybrid architecture would be required.