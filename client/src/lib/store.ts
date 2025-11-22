import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';

// Types
export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  highlights?: { id: string; image: string; title: string }[];
  website?: string;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  location?: string;
  timestamp: string;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  userId: string;
  postId?: string;
  timestamp: string;
  read: boolean;
  userAvatar: string;
  postImage?: string;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  isViewed: boolean;
}

// Mock Data
const MOCK_USER: User = {
  id: 'current-user',
  username: 'johndoe',
  fullName: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60',
  bio: 'Digital explorer 📸 | Coffee enthusiast ☕️ | Travels 🌍\nSan Francisco, CA',
  followers: 1250,
  following: 450,
  website: 'johndoe.com',
  highlights: [
    { id: '1', title: 'Travels', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&fit=crop' },
    { id: '2', title: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&fit=crop' },
    { id: '3', title: 'Friends', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&fit=crop' },
  ]
};

const MOCK_USERS: User[] = [
  {
    id: 'alex_travels',
    username: 'alex_travels',
    fullName: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop',
    bio: 'Travel photographer 🌍',
    followers: 3421,
    following: 234,
    website: 'alextravel.com',
    isFollowing: false
  },
  {
    id: 'sarah.styles',
    username: 'sarah.styles',
    fullName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop',
    bio: 'Fashion & lifestyle 👗\nBased in Paris',
    followers: 8942,
    following: 1123,
    website: 'sarahstyles.com',
    isFollowing: true
  },
  {
    id: 'nature_lover',
    username: 'nature_lover',
    fullName: 'Mike Roberts',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop',
    bio: 'Nature & outdoor enthusiast 🏔️',
    followers: 5623,
    following: 456,
    isFollowing: false
  },
  {
    id: 'mike_photos',
    username: 'mike_photos',
    fullName: 'Michael Zhang',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop',
    bio: 'Street photography',
    followers: 2341,
    following: 789,
    isFollowing: true
  },
  {
    id: 'jessica_w',
    username: 'jessica_w',
    fullName: 'Jessica Williams',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop',
    bio: 'Designer & creative 🎨',
    followers: 4125,
    following: 567,
    isFollowing: false
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: 'alex_travels',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=60',
    caption: 'Exploring the Cinque Terre! 🇮🇹 The colors here are absolutely unreal. Can\'t wait to come back next summer. #italy #travel #summer',
    likes: 124,
    location: 'Cinque Terre, Italy',
    timestamp: '2 hours ago',
    comments: 12,
    isLiked: false,
    isSaved: false
  },
  {
    id: '2',
    userId: 'sarah.styles',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60',
    caption: 'Fashion week fits 👗 What do you think of this look? #ootd #paris',
    likes: 2431,
    location: 'Paris, France',
    timestamp: '5 hours ago',
    comments: 128,
    isLiked: false,
    isSaved: true
  },
  {
    id: '3',
    userId: 'nature_lover',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    caption: 'Sunset vibes only 🌅 nothing beats a California sunset.',
    likes: 856,
    location: 'Malibu, California',
    timestamp: '1 day ago',
    comments: 45,
    isLiked: true,
    isSaved: false
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { 
    id: '1', 
    type: 'like', 
    userId: 'sarah.styles', 
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    postId: '1', 
    postImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=100',
    timestamp: '2m', 
    read: false 
  },
  { 
    id: '2', 
    type: 'follow', 
    userId: 'mike_photos', 
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    timestamp: '2h', 
    read: false 
  },
  { 
    id: '3', 
    type: 'comment', 
    userId: 'alex_travels', 
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    postId: '2', 
    postImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100',
    timestamp: '1d', 
    read: true 
  },
  { 
    id: '4', 
    type: 'follow', 
    userId: 'jessica_w', 
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    timestamp: '3d', 
    read: true 
  }
];

const MOCK_STORIES: Story[] = [
  { id: '1', userId: 'alex_travels', imageUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f107f6b7?w=400&fit=crop', isViewed: false },
  { id: '2', userId: 'sarah.styles', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&fit=crop', isViewed: false },
  { id: '3', userId: 'mike_photos', imageUrl: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400&fit=crop', isViewed: true },
  { id: '4', userId: 'nature_lover', imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&fit=crop', isViewed: false },
];

interface StoreState {
  currentUser: User | null;
  posts: Post[];
  notifications: Notification[];
  stories: Story[];
  allUsers: User[];
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  updateProfile: (updates: Partial<User>) => void;
  toggleFollow: (userId: string) => void;
  getUser: (userId: string) => User | undefined;
  getFollowing: () => User[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp' | 'isLiked' | 'isSaved'>) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  markStoryViewed: (storyId: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  currentUser: null,
  posts: MOCK_POSTS,
  notifications: MOCK_NOTIFICATIONS,
  stories: MOCK_STORIES,
  allUsers: MOCK_USERS,
  isAuthenticated: false,
  
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    set({ 
      currentUser: {
        ...MOCK_USER,
        id: user.uid,
        username: user.displayName?.split(' ')[0].toLowerCase() || 'user',
        fullName: user.displayName || 'User',
        avatar: user.photoURL || MOCK_USER.avatar
      }, 
      isAuthenticated: true 
    });
  },

  loginWithEmail: async (email, pass) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    set({ 
      currentUser: {
        ...MOCK_USER,
        id: user.uid,
        username: email.split('@')[0],
        fullName: email.split('@')[0],
      }, 
      isAuthenticated: true 
    });
  },

  signupWithEmail: async (email, pass) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    set({ 
      currentUser: {
        ...MOCK_USER,
        id: user.uid,
        username: email.split('@')[0],
        fullName: email.split('@')[0],
      }, 
      isAuthenticated: true 
    });
  },

  logout: async () => {
    await signOut(auth);
    set({ currentUser: null, isAuthenticated: false });
  },

  setUser: (user) => set({ currentUser: user, isAuthenticated: true }),

  updateProfile: (updates) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null
  })),

  toggleFollow: (userId) => set((state) => {
    const updatedUsers = state.allUsers.map(u => 
      u.id === userId ? { 
        ...u, 
        isFollowing: !u.isFollowing,
        followers: u.isFollowing ? u.followers - 1 : u.followers + 1
      } : u
    );
    const newFollowing = updatedUsers.filter(u => u.isFollowing).length;
    return {
      allUsers: updatedUsers,
      currentUser: state.currentUser ? { ...state.currentUser, following: newFollowing } : null
    };
  }),

  getUser: (userId) => {
    return get().allUsers.find(u => u.id === userId);
  },

  getFollowing: () => {
    return get().allUsers.filter(u => u.isFollowing);
  },

  addPost: (newPost) => set((state) => ({
    posts: [{
      ...newPost,
      id: nanoid(),
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      isLiked: false,
      isSaved: false
    }, ...state.posts]
  })),
  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map(p => 
      p.id === postId ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p
    )
  })),
  toggleSave: (postId) => set((state) => ({
    posts: state.posts.map(p => 
      p.id === postId ? { ...p, isSaved: !p.isSaved } : p
    )
  })),
  markStoryViewed: (storyId) => set((state) => ({
    stories: state.stories.map(s => 
      s.id === storyId ? { ...s, isViewed: true } : s
    )
  }))
}));
