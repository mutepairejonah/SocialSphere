import { create } from 'zustand';
import { auth, db, storage, rtdb } from './firebase';
import { makeInstagramRequest, getUserMedia } from './instagram';
import { 
  signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, User as FirebaseUser, onAuthStateChanged 
} from 'firebase/auth';
import {
  collection, doc, getDoc, setDoc, query, where, getDocs, addDoc, updateDoc,
  deleteDoc, arrayUnion, arrayRemove, Timestamp, writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  website?: string;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username?: string;
  userAvatar?: string;
  imageUrl: string;
  caption: string;
  likes: number;
  location?: string;
  timestamp: string;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  mediaType?: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  videoUrl?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  userId: string;
  fromUserId?: string;
  postId?: string;
  messageText?: string;
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

interface StoreState {
  currentUser: User | null;
  pendingGoogleUser: {uid: string, displayName: string, email: string, photoURL: string} | null;
  posts: Post[];
  userPosts: Post[];
  notifications: Notification[];
  stories: Story[];
  allUsers: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  toggleFollow: (userId: string) => Promise<void>;
  getUser: (userId: string) => Promise<User | undefined>;
  getFollowing: () => User[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp' | 'isLiked' | 'isSaved'>) => Promise<void>;
  loadPosts: () => Promise<void>;
  loadUserPosts: () => Promise<void>;
  loadStories: () => Promise<void>;
  loadUsers: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  createFollowNotification: (userId: string, fromUserId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  toggleSave: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  addStory: (imageUrl: string) => Promise<void>;
  markStoryViewed: (storyId: string) => void;
  initializeAuth: () => void;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
  completeGoogleSignup: (username: string) => Promise<void>;
  searchUsers: (searchTerm: string) => Promise<User[]>;
  loadFollowStatus: (userId: string) => Promise<boolean>;
  sendMessage: (recipientId: string, message: string) => Promise<void>;
  getMessages: (recipientId: string) => Promise<any[]>;
  startCall: (recipientId: string, callType: 'audio' | 'video') => Promise<string>;
  endCall: (callId: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  currentUser: null,
  pendingGoogleUser: null,
  posts: [],
  userPosts: [],
  notifications: [],
  stories: [],
  allUsers: [],
  isAuthenticated: false,
  isLoading: false,

  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Sync to PostgreSQL database
            try {
              await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: firebaseUser.uid,
                  username: userData.username || firebaseUser.displayName?.split(' ')[0].toLowerCase() || 'user',
                  email: firebaseUser.email || userData.email,
                  fullName: userData.fullName || firebaseUser.displayName,
                  avatar: userData.avatar || firebaseUser.photoURL || '',
                  bio: userData.bio || ''
                })
              });
            } catch (err) {
              console.warn('Database sync failed:', err);
            }
            
            set({
              currentUser: {
                id: firebaseUser.uid,
                ...userData
              } as User,
              isAuthenticated: true
            });
            // Load posts and users with error handling
            await Promise.all([
              get().loadPosts().catch(err => console.warn('Posts load failed:', err)),
              get().loadUsers().catch(err => console.warn('Users load failed:', err)),
              get().loadNotifications().catch(err => console.warn('Notifications load failed:', err))
            ]);
          } else {
            set({ currentUser: null, isAuthenticated: false, posts: [], allUsers: [], notifications: [], stories: [], pendingGoogleUser: null });
          }
        } catch (error: any) {
          if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
            // User is authenticated but offline, allow them to continue with local data
            set({
              currentUser: {
                id: firebaseUser.uid,
                username: firebaseUser.displayName?.split(' ')[0].toLowerCase() || 'user',
                fullName: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || '',
                bio: '',
                followers: 0,
                following: 0
              } as User,
              isAuthenticated: true
            });
          } else {
            console.error('Error loading user data:', error);
            set({ currentUser: null, isAuthenticated: false, posts: [], allUsers: [], notifications: [], stories: [], pendingGoogleUser: null });
          }
        }
      } else {
        set({ currentUser: null, isAuthenticated: false, posts: [], allUsers: [], notifications: [], stories: [], pendingGoogleUser: null });
      }
    });
  },

  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // New user - store pending and wait for username selection
      set({
        pendingGoogleUser: {
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email || '',
          photoURL: user.photoURL || ''
        }
      });
      throw new Error('USERNAME_SETUP_REQUIRED');
    } else {
      const userData = userDoc.data();
      set({
        currentUser: {
          id: user.uid,
          ...userData
        } as User,
        isAuthenticated: true,
        pendingGoogleUser: null
      });
    }
  },

  checkUsernameAvailable: async (username: string) => {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('username', '==', username.toLowerCase())
      );
      const snapshot = await getDocs(usersQuery);
      return snapshot.empty;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  },

  completeGoogleSignup: async (username: string) => {
    const pending = get().pendingGoogleUser;
    if (!pending) throw new Error('No pending user');

    // Check username availability
    const available = await get().checkUsernameAvailable(username);
    if (!available) {
      throw new Error('Username already taken');
    }

    const newUser = {
      username: username.toLowerCase(),
      fullName: pending.displayName,
      email: pending.email,
      avatar: pending.photoURL,
      bio: '',
      followers: 0,
      following: 0,
      createdAt: Timestamp.now()
    };

    await setDoc(doc(db, 'users', pending.uid), newUser);
    
    // Sync to PostgreSQL database
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pending.uid,
          username: username.toLowerCase(),
          email: pending.email,
          fullName: pending.displayName,
          avatar: pending.photoURL,
          bio: ''
        })
      });
    } catch (err) {
      console.warn('Database sync failed:', err);
    }
    
    set({
      currentUser: {
        id: pending.uid,
        ...newUser,
        followers: 0,
        following: 0
      } as User,
      isAuthenticated: true,
      pendingGoogleUser: null
    });
  },

  loginWithEmail: async (email, pass) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      set({
        currentUser: {
          id: user.uid,
          ...userData
        } as User,
        isAuthenticated: true
      });
    }
  },

  signupWithEmail: async (email, pass, fullName) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    
    // Generate unique username from email
    let baseUsername = email.split('@')[0].toLowerCase();
    let username = baseUsername;
    let counter = 1;
    
    // Ensure username is unique
    while (!(await get().checkUsernameAvailable(username))) {
      username = `${baseUsername}${counter}`;
      counter++;
    }
    
    const newUser = {
      username,
      fullName,
      email,
      avatar: '',
      bio: '',
      followers: 0,
      following: 0,
      createdAt: Timestamp.now()
    };
    await setDoc(doc(db, 'users', user.uid), newUser);
    
    // Sync to PostgreSQL database
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.uid,
          username,
          email,
          fullName,
          avatar: '',
          bio: ''
        })
      });
    } catch (err) {
      console.warn('Database sync failed:', err);
    }
    
    set({
      currentUser: {
        id: user.uid,
        ...newUser,
        followers: 0,
        following: 0
      } as User,
      isAuthenticated: true
    });
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
    // Completely clear all state
    set({ 
      currentUser: null, 
      isAuthenticated: false, 
      posts: [], 
      allUsers: [],
      notifications: [],
      stories: [],
      pendingGoogleUser: null
    });
  },

  setUser: (user) => set({ currentUser: user, isAuthenticated: true }),

  updateProfile: async (updates) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.id);
      const updateData: any = {};
      
      // Update local state immediately for text fields
      if (updates.bio) updateData.bio = updates.bio;
      if (updates.fullName) updateData.fullName = updates.fullName;
      if (updates.username) updateData.username = updates.username;
      if (updates.website) updateData.website = updates.website;
      
      // Handle avatar upload separately (non-blocking)
      if (updates.avatar && typeof updates.avatar === 'string' && updates.avatar.startsWith('data:')) {
        const avatarDataUrl = updates.avatar;
        (async () => {
          try {
            const response = await fetch(avatarDataUrl);
            const blob = await response.blob();
            const storageRef = ref(storage, `avatars/${currentUser.id}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(userRef, { avatar: downloadURL });
            set(state => ({
              currentUser: state.currentUser ? { ...state.currentUser, avatar: downloadURL } : null
            }));
          } catch (error) {
            console.error('Error uploading avatar:', error);
          }
        })();
        updateData.avatar = updates.avatar;
      } else if (updates.avatar) {
        updateData.avatar = updates.avatar;
      }
      
      await updateDoc(userRef, updateData);
      set(state => ({
        currentUser: state.currentUser ? { ...state.currentUser, ...updateData } : null
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  toggleFollow: async (userId) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/follow/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUser.id })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }

      const data = await response.json();

      set(state => ({
        allUsers: state.allUsers.map(u =>
          u.id === userId ? { ...u, isFollowing: data.isFollowing } : u
        )
      }));
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  },

  getUser: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        } as User;
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }
    return undefined;
  },

  getFollowing: () => {
    return get().allUsers.filter(u => u.isFollowing);
  },

  addPost: async (newPost) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
      const postData = {
        userId: currentUser.id,
        caption: (newPost.caption || '').trim(),
        imageUrl: newPost.imageUrl || null,
        videoUrl: newPost.videoUrl || null,
        mediaType: newPost.mediaType || 'IMAGE',
        location: (newPost.location || '').trim(),
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const post = await response.json();
      
      set(state => ({
        posts: [{
          id: post.id,
          userId: post.userId,
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          imageUrl: post.imageUrl,
          videoUrl: post.videoUrl,
          caption: post.caption,
          location: post.location,
          mediaType: post.mediaType,
          timestamp: new Date(post.createdAt).toLocaleString(),
          likes: post.likes || 0,
          comments: post.commentCount || 0,
          isLiked: false,
          isSaved: false
        } as Post, ...state.posts]
      }));
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  },

  addComment: async (postId: string, text: string) => {
    const currentUser = get().currentUser;
    if (!currentUser || !text.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        text: text.trim(),
        createdAt: Timestamp.now()
      });

      // Increment comment count
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        await updateDoc(postRef, {
          commentCount: (postDoc.data().commentCount || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  },

  loadPosts: async () => {
    try {
      console.log('Loading Instagram API videos (Home page only)...');
      
      // Fetch posts from Instagram API
      const instagramPosts = await getUserMedia();
      
      if (instagramPosts && Array.isArray(instagramPosts) && instagramPosts.length > 0) {
        // Only show VIDEO posts
        const videoPosts = instagramPosts.filter((igPost: any) => igPost.media_type === 'VIDEO');
        
        const posts = videoPosts.map((igPost: any, index: number) => {
          const timestamp = igPost.timestamp || new Date().toISOString();
          
          return {
            id: igPost.id || `ig_${index}`,
            userId: 'dbcMML2G74Rl4YKhT8VupNOSlDo1',
            username: 'jonah m',
            userAvatar: 'https://lh3.googleusercontent.com/a/ACg8ocJBPGZKLpDAwumlRjUllijfadBvFA6XLAR9rGfXt4dnlnS88w=s96-c',
            imageUrl: igPost.thumbnail_url || '',
            videoUrl: igPost.media_url,
            mediaType: 'VIDEO' as const,
            caption: igPost.caption || '(No caption)',
            likes: igPost.like_count || 0,
            location: '',
            timestamp: new Date(timestamp).toLocaleString(),
            comments: igPost.comments_count || 0,
            isLiked: false,
            isSaved: false
          } as Post;
        });
        
        console.log('Loaded Instagram videos:', posts);
        set({ posts });
      } else {
        console.log('No Instagram videos found');
        set({ posts: [] });
      }
    } catch (error) {
      console.error('Error loading Instagram videos:', error);
      set({ posts: [] });
    }
  },

  loadUserPosts: async () => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      set({ userPosts: [] });
      return;
    }

    try {
      // Fetch posts from users that current user follows
      const res = await fetch(`/api/posts/following/${currentUser.id}`);
      const userPostsData = await res.json();
      
      const formattedPosts = userPostsData.map((data: any) => ({
        id: data.id,
        userId: data.userId,
        username: data.username,
        userAvatar: data.userAvatar,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        caption: data.caption,
        location: data.location,
        mediaType: data.mediaType,
        timestamp: new Date(data.createdAt).toLocaleString(),
        likes: data.likes || 0,
        comments: data.commentCount || 0,
        isLiked: false,
        isSaved: false
      }));

      set({ userPosts: formattedPosts });
    } catch (error) {
      console.error('Error loading following posts:', error);
      set({ userPosts: [] });
    }
  },

  loadUsers: async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      const currentUserId = get().currentUser?.id;
      
      // Return empty list if no users exist
      if (snapshot.empty) {
        set({ allUsers: [] });
        return;
      }

      const API_KEY_OWNER_ID = 'dbcMML2G74Rl4YKhT8VupNOSlDo1';
      const users = snapshot.docs
        .filter(doc => doc.id !== currentUserId && doc.id !== API_KEY_OWNER_ID)
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            username: data.username || `user_${doc.id.substring(0, 8)}`,
            fullName: data.fullName || 'User',
            email: data.email || '',
            avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
            bio: data.bio || '',
            followers: data.followers || 0,
            following: data.following || 0,
            website: data.website
          } as User;
        });

      // Load follow status for each user
      const usersWithFollowStatus = await Promise.all(
        users.map(async (user) => {
          const isFollowing = await get().loadFollowStatus(user.id);
          return { ...user, isFollowing };
        })
      );
      
      set({ allUsers: usersWithFollowStatus });
    } catch (error) {
      console.warn('Error loading users:', error);
      set({ allUsers: [] });
    }
  },

  loadNotifications: async () => {
    const currentUser = get().currentUser;
    if (!currentUser) return;
    
    try {
      const response = await fetch(`/api/notifications/${currentUser.id}`);
      const data = await response.json();
      
      const notifications = data.map((n: any) => ({
        id: n.id,
        type: n.type,
        userId: n.userId,
        fromUserId: n.fromUserId,
        fromUserUsername: n.fromUserUsername,
        userAvatar: n.fromUserAvatar,
        timestamp: new Date(n.createdAt).toLocaleString(),
        read: n.read,
        postId: n.postId,
        postImage: ''
      })) as Notification[];
      
      set({ notifications });
    } catch (error) {
      console.warn('Error loading notifications:', error);
    }
  },

  createFollowNotification: async (userId: string, fromUserId: string) => {
    try {
      await fetch(`/api/follow/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: fromUserId })
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  },

  toggleLike: async (postId) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
      // For Instagram posts (long numeric IDs), just toggle local state
      const post = get().posts.find(p => p.id === postId);
      if (post && (post.id.toString().length > 20 || (post.userId && typeof post.userId === 'string' && post.userId.startsWith('ig_')))) {
        // Instagram post - toggle locally
        set(state => ({
          posts: state.posts.map(p =>
            p.id === postId ? {
              ...p,
              likes: p.isLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
              isLiked: !p.isLiked
            } : p
          )
        }));
        return;
      }

      // Firebase posts
      const likeRef = query(
        collection(db, 'likes'),
        where('userId', '==', currentUser.id),
        where('postId', '==', postId)
      );
      const likeDocs = await getDocs(likeRef);
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (!likeDocs.empty) {
        // Unlike
        likeDocs.forEach(doc => {
          deleteDoc(doc.ref);
        });
        await updateDoc(postRef, { likes: Math.max(0, (postDoc.data()?.likes || 0) - 1) });
      } else {
        // Like
        await addDoc(collection(db, 'likes'), {
          userId: currentUser.id,
          postId,
          createdAt: Timestamp.now()
        });
        await updateDoc(postRef, { likes: (postDoc.data()?.likes || 0) + 1 });
      }

      // Update local state
      set(state => ({
        posts: state.posts.map(p =>
          p.id === postId ? {
            ...p,
            likes: likeDocs.empty ? p.likes + 1 : Math.max(0, p.likes - 1),
            isLiked: !p.isLiked
          } : p
        )
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  },

  toggleSave: async (postId) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
      const saveRef = query(
        collection(db, 'saves'),
        where('userId', '==', currentUser.id),
        where('postId', '==', postId)
      );
      const saveDocs = await getDocs(saveRef);

      if (!saveDocs.empty) {
        saveDocs.forEach(doc => {
          deleteDoc(doc.ref);
        });
      } else {
        await addDoc(collection(db, 'saves'), {
          userId: currentUser.id,
          postId,
          createdAt: Timestamp.now()
        });
      }

      set(state => ({
        posts: state.posts.map(p =>
          p.id === postId ? { ...p, isSaved: !p.isSaved } : p
        )
      }));
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  },

  loadStories: async () => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/stories/following/${currentUser.id}`);
      const dbStories = await response.json();
      
      const storyList = dbStories.map((story: any) => ({
        id: story.id,
        userId: story.userId,
        imageUrl: story.imageUrl,
        isViewed: story.isViewed || false
      }));

      set({ stories: storyList });
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  },

  addStory: async (imageUrl) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
      const storyData = {
        userId: currentUser.id,
        imageUrl,
      };

      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyData)
      });

      if (!response.ok) {
        throw new Error('Failed to create story');
      }

      const story = await response.json();

      const newStory = {
        id: story.id,
        userId: currentUser.id,
        imageUrl: story.imageUrl,
        isViewed: false
      };

      set(state => ({
        stories: [newStory, ...state.stories]
      }));
    } catch (error) {
      console.error('Error saving story:', error);
      throw error;
    }
  },

  markStoryViewed: (storyId) => set((state) => ({
    stories: state.stories.map(s =>
      s.id === storyId ? { ...s, isViewed: true } : s
    )
  })),

  searchUsers: async (searchTerm: string) => {
    const currentUser = get().currentUser;
    if (!currentUser || !searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    try {
      const response = await fetch(`/api/search/users?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      // Get following list to determine follow status
      const followingRes = await fetch(`/api/following/${currentUser.id}`);
      const followingList = await followingRes.json();
      const followingIds = new Set(followingList.map((u: any) => u.id));

      // Map follow status
      return data.map((user: any) => ({
        ...user,
        isFollowing: followingIds.has(user.id)
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  loadFollowStatus: async (userId: string) => {
    const currentUser = get().currentUser;
    if (!currentUser) return false;

    try {
      const followRef = query(
        collection(db, 'follows'),
        where('followerId', '==', currentUser.id),
        where('followingId', '==', userId)
      );
      const followDocs = await getDocs(followRef);
      return !followDocs.empty;
    } catch (error) {
      console.error('Error loading follow status:', error);
      return false;
    }
  },

  // Messaging functions - Using Firestore
  sendMessage: async (recipientId: string, message: string) => {
    const currentUser = get().currentUser;
    if (!currentUser) throw new Error('Not authenticated');
    if (!message || message.trim().length === 0) throw new Error('Message cannot be empty');
    if (!recipientId) throw new Error('Invalid recipient');

    try {
      const conversationId = [currentUser.id, recipientId].sort().join('_');
      const messagesRef = collection(db, 'messages');
      
      // Verify recipient exists
      const recipientDoc = await getDoc(doc(db, 'users', recipientId));
      if (!recipientDoc.exists()) {
        throw new Error('Recipient user not found');
      }
      
      // Send the message
      await addDoc(messagesRef, {
        conversationId,
        senderId: currentUser.id,
        recipientId,
        message: message.trim(),
        timestamp: Timestamp.now(),
        read: false
      });

      // Create a notification for the recipient
      await addDoc(collection(db, 'notifications'), {
        type: 'message',
        userId: recipientId,
        fromUserId: currentUser.id,
        messageText: message.trim().substring(0, 100),
        timestamp: Timestamp.now(),
        read: false,
        userAvatar: currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(error?.message || 'Failed to send message');
    }
  },

  getMessages: async (recipientId: string) => {
    const currentUser = get().currentUser;
    if (!currentUser) return [];
    if (!recipientId) return [];

    try {
      const conversationId = [currentUser.id, recipientId].sort().join('_');
      const messagesRef = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId)
      );
      
      const snapshot = await getDocs(messagesRef);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by timestamp, handle both Timestamp objects and Date objects
      return messages.sort((a: any, b: any) => {
        const timeA = a.timestamp?.toDate?.() || a.timestamp || 0;
        const timeB = b.timestamp?.toDate?.() || b.timestamp || 0;
        return new Date(timeA).getTime() - new Date(timeB).getTime();
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  startCall: async (recipientId: string, callType: 'audio' | 'video') => {
    const currentUser = get().currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    try {
      const callRef = await addDoc(collection(db, 'calls'), {
        callerId: currentUser.id,
        recipientId,
        callType,
        status: 'ringing',
        createdAt: Timestamp.now()
      });

      return callRef.id;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  },

  endCall: async (callId: string) => {
    try {
      await updateDoc(doc(db, 'calls', callId), {
        status: 'ended',
        endedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }
}));
