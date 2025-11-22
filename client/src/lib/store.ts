import { create } from 'zustand';
import { nanoid } from 'nanoid';

// Types
export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
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
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  userId: string;
  postId?: string;
  timestamp: string;
  read: boolean;
}

// Mock Data
const MOCK_USER: User = {
  id: 'current-user',
  username: 'johndoe',
  fullName: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60',
  bio: 'Digital explorer 📸 | Coffee enthusiast ☕️ | Travels 🌍',
  followers: 1250,
  following: 450
};

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: 'current-user',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=60',
    caption: 'Exploring the Cinque Terre! 🇮🇹 #italy #travel',
    likes: 124,
    location: 'Cinque Terre, Italy',
    timestamp: '2 hours ago',
    comments: 12,
    isLiked: false
  },
  {
    id: '2',
    userId: 'user-2',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    caption: 'Sunset vibes only 🌅',
    likes: 856,
    location: 'Malibu, California',
    timestamp: '5 hours ago',
    comments: 45,
    isLiked: true
  },
  {
    id: '3',
    userId: 'user-3',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60',
    caption: 'Fashion week ready 👗',
    likes: 2431,
    location: 'Paris, France',
    timestamp: '1 day ago',
    comments: 128,
    isLiked: false
  }
];

interface StoreState {
  currentUser: User | null;
  posts: Post[];
  notifications: Notification[];
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp' | 'isLiked'>) => void;
  toggleLike: (postId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentUser: null,
  posts: MOCK_POSTS,
  notifications: [
    { id: '1', type: 'like', userId: 'user-2', postId: '1', timestamp: '10m', read: false },
    { id: '2', type: 'follow', userId: 'user-3', timestamp: '2h', read: false }
  ],
  isAuthenticated: false,
  login: () => set({ currentUser: MOCK_USER, isAuthenticated: true }),
  logout: () => set({ currentUser: null, isAuthenticated: false }),
  addPost: (newPost) => set((state) => ({
    posts: [{
      ...newPost,
      id: nanoid(),
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      isLiked: false
    }, ...state.posts]
  })),
  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map(p => 
      p.id === postId ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p
    )
  }))
}));
