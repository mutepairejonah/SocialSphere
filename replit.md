# InstaClone - Social Media Application

## Overview

InstaClone is a social media web application that integrates with Instagram's Graph API to display and manage Instagram content. The application provides a modern, mobile-first interface for viewing posts, stories, and user profiles. Built with React and TypeScript on the frontend, it uses Firebase for authentication and data persistence, with Instagram API serving as the primary content source.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, configured for fast HMR and optimized production builds
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, accordions, etc.)
- Tailwind CSS v4 (using the new `@import` syntax) for utility-first styling
- Custom design system with CSS variables for theming (light/dark mode support)
- shadcn/ui-style component patterns for consistent UI elements

**State Management**
- Zustand for global state management (user authentication, bookmarks, preferences)
- TanStack Query for server state management and API caching
- Local state with React hooks for component-specific state

**Data Fetching Strategy**
- Instagram Graph API as the primary data source for posts, stories, and user media
- Firebase Firestore for user profiles and application-specific data
- Client-side caching with localStorage for bookmarks and user preferences

### Authentication & Authorization

**Firebase Authentication**
- Google OAuth for social sign-in
- Email/password authentication as alternative
- Custom username setup flow for new Google sign-ups
- Session persistence with Firebase's built-in token management

**Security Model**
- Firebase security rules control access to Firestore documents
- Users can only modify their own profile data
- Public read access for user profiles and posts
- Instagram API tokens stored securely in environment variables (never in client code)

### External Dependencies

**Instagram Graph API Integration**
- Business account required for API access
- Permissions needed: `instagram_business_content_read`, `instagram_basic`
- Environment variables: `VITE_INSTAGRAM_ACCESS_TOKEN`, `VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID`
- API endpoints used:
  - `/me/media` - Fetch user's Instagram posts
  - `/me/stories` - Retrieve user's active stories
  - `/hashtag/{hashtag-id}` - Search and fetch hashtag content
  - `/user/insights` - Get engagement metrics

**Firebase Services**
- **Authentication**: User sign-in/sign-up management
- **Firestore Database**: User profiles, bookmarks, app-specific metadata
- **Realtime Database**: Real-time features (if implemented)
- **Cloud Storage**: Avatar uploads and media storage
- Firebase config embedded in client code (public API keys)

**Third-Party UI Libraries**
- Lucide React for consistent iconography
- Framer Motion for animations (noted as removed in package.json but still in dependencies)
- Sonner for toast notifications
- date-fns for date formatting

### Data Storage

**Firebase Firestore Schema**
- `users` collection: User profiles with fields for username, fullName, bio, avatar, instagramAccounts
- Document-based structure with user ID as document key
- Nested subcollections for user-specific data

**Browser localStorage**
- Bookmarked posts stored locally (array of post IDs)
- User preferences (dark mode, default Instagram account)
- Cached Instagram account data to reduce API calls

**Instagram API as Source of Truth**
- Posts, stories, and media always fetched from Instagram
- No local duplication of Instagram content
- Engagement metrics (likes, comments) from Instagram API

### Development Environment

**Replit-Specific Integrations**
- Custom Vite plugins for Replit environment (`@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`)
- Development server configured for Replit's networking (`host: "0.0.0.0"`)
- Cartographer plugin for code navigation (development only)

**Path Aliases**
- `@/*` maps to `client/src/*`
- `@shared/*` for shared code
- `@assets/*` for static assets
- Configured in both `vite.config.ts` and `tsconfig.json`

### Key Architectural Decisions

**Why Instagram API for Content**
- Avoids duplicating Instagram's complex content delivery infrastructure
- Ensures content is always up-to-date
- Leverages Instagram's CDN for media delivery
- Reduces storage and bandwidth costs

**Why Firebase for Authentication**
- Proven OAuth integration with Google
- Built-in session management and token refresh
- Free tier suitable for early-stage development
- Easy integration with Firestore for user data

**Why Zustand Over Redux**
- Simpler API with less boilerplate
- Better TypeScript inference
- No need for actions/reducers for simple state
- Hooks-based API aligns with React patterns

**Why Vite Over Create React App**
- Significantly faster dev server with native ESM
- Faster production builds with Rollup
- Better TypeScript integration out of the box
- More flexible plugin system

**Mobile-First Responsive Design**
- Viewport meta tag prevents zooming on mobile
- Bottom navigation bar for mobile ergonomics
- Touch-friendly UI elements (min-height: 44px for buttons)
- CSS safe area insets for notched devices (`pb-safe`)