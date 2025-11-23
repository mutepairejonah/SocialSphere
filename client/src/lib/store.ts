import { create } from 'zustand';
import { auth, db, storage } from './firebase';
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
  fromUserId?: string;
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

interface StoreState {
  currentUser: User | null;
  posts: Post[];
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
  loadUsers: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  toggleSave: (postId: string) => Promise<void>;
  markStoryViewed: (storyId: string) => void;
  initializeAuth: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  currentUser: null,
  posts: [],
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
            set({
              currentUser: {
                id: firebaseUser.uid,
                ...userData
              } as User,
              isAuthenticated: true
            });
            // Load posts and users (don't block on these)
            get().loadPosts().catch(err => console.error('Error loading posts:', err));
            get().loadUsers().catch(err => console.error('Error loading users:', err));
            get().loadNotifications().catch(err => console.error('Error loading notifications:', err));
          }
        } catch (error: any) {
          // Handle offline or other errors gracefully
          if (error?.code === 'unavailable' || error?.code === 'failed-precondition') {
            // Still allow login even if Firestore is temporarily unavailable
            console.warn('Firestore temporarily unavailable, app will work with cached data');
            set({
              currentUser: {
                id: firebaseUser.uid,
                username: firebaseUser.displayName?.split(' ')[0].toLowerCase() || firebaseUser.email?.split('@')[0] || 'user',
                fullName: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || '',
                bio: '',
                followers: 0,
                following: 0
              },
              isAuthenticated: true
            });
          } else {
            console.error('Error loading user data:', error);
          }
        }
      } else {
        set({ currentUser: null, isAuthenticated: false });
      }
    });
  },

  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const newUser = {
          username: user.displayName?.split(' ')[0].toLowerCase() || 'user',
          fullName: user.displayName || 'User',
          email: user.email,
          avatar: user.photoURL || '',
          bio: '',
          followers: 0,
          following: 0,
          createdAt: Timestamp.now()
        };
        await setDoc(userRef, newUser);
        set({
          currentUser: {
            id: user.uid,
            ...newUser,
            followers: 0,
            following: 0
          } as User,
          isAuthenticated: true
        });
      } else {
        const userData = userDoc.data();
        set({
          currentUser: {
            id: user.uid,
            ...userData
          } as User,
          isAuthenticated: true
        });
      }
    } catch (error: any) {
      // If Firestore is unavailable, still log them in
      if (error?.code === 'unavailable' || error?.code === 'failed-precondition') {
        set({
          currentUser: {
            id: user.uid,
            username: user.displayName?.split(' ')[0].toLowerCase() || 'user',
            fullName: user.displayName || 'User',
            email: user.email || '',
            avatar: user.photoURL || '',
            bio: '',
            followers: 0,
            following: 0
          },
          isAuthenticated: true
        });
      } else {
        throw error;
      }
    }
  },

  loginWithEmail: async (email, pass) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    try {
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
    } catch (error: any) {
      if (error?.code === 'unavailable' || error?.code === 'failed-precondition') {
        set({
          currentUser: {
            id: user.uid,
            username: email.split('@')[0],
            fullName: email.split('@')[0],
            email,
            avatar: '',
            bio: '',
            followers: 0,
            following: 0
          },
          isAuthenticated: true
        });
      } else {
        throw error;
      }
    }
  },

  signupWithEmail: async (email, pass, fullName) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    const newUser = {
      username: email.split('@')[0],
      fullName,
      email,
      avatar: '',
      bio: '',
      followers: 0,
      following: 0,
      createdAt: Timestamp.now()
    };
    try {
      await setDoc(doc(db, 'users', user.uid), newUser);
    } catch (error: any) {
      if (error?.code === 'unavailable' || error?.code === 'failed-precondition') {
        console.warn('Firestore unavailable, user profile will sync when connection restored');
      } else {
        throw error;
      }
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
    await signOut(auth);
    set({ currentUser: null, isAuthenticated: false, posts: [], allUsers: [] });
  },

  setUser: (user) => set({ currentUser: user, isAuthenticated: true }),

  updateProfile: async (updates) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;
    
    // Always update local state first
    set(state => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null
    }));

    // Try to sync with Firestore (but don't block if offline)
    try {
      const userRef = doc(db, 'users', currentUser.id);
      const updateData: any = {};
      
      // Handle avatar upload if it's a data URL
      if (updates.avatar && updates.avatar.startsWith('data:')) {
        try {
          const blob = await (await fetch(updates.avatar)).blob();
          const storageRef = ref(storage, `avatars/${currentUser.id}`);
          await uploadBytes(storageRef, blob);
          updateData.avatar = await getDownloadURL(storageRef);
        } catch (storageError: any) {
          if (storageError?.code !== 'unavailable') {
            throw storageError;
          }
          // Use data URL if storage is offline
          updateData.avatar = updates.avatar;
        }
      } else if (updates.avatar) {
        updateData.avatar = updates.avatar;
      }
      
      if (updates.bio) updateData.bio = updates.bio;
      if (updates.fullName) updateData.fullName = updates.fullName;
      if (updates.username) updateData.username = updates.username;
      if (updates.website) updateData.website = updates.website;
      
      await updateDoc(userRef, updateData);
    } catch (error: any) {
      if (error?.code === 'unavailable' || error?.code === 'failed-precondition') {
        console.warn('Profile updated locally, will sync to database when connection restored');
      } else {
        console.error('Error updating profile:', error);
      }
    }
  },

  toggleFollow: async (userId) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
      const batch = writeBatch(db);
      const currentUserRef = doc(db, 'users', currentUser.id);
      const targetUserRef = doc(db, 'users', userId);
      
      const followRef = query(
        collection(db, 'follows'),
        where('followerId', '==', currentUser.id),
        where('followingId', '==', userId)
      );
      const followDocs = await getDocs(followRef);
      
      if (!followDocs.empty) {
        // Unfollow
        followDocs.forEach(doc => {
          batch.delete(doc.ref);
        });
        batch.update(currentUserRef, { following: (currentUser.following || 0) - 1 });
      } else {
        // Follow
        await addDoc(collection(db, 'follows'), {
          followerId: currentUser.id,
          followingId: userId,
          createdAt: Timestamp.now()
        });
        batch.update(currentUserRef, { following: (currentUser.following || 0) + 1 });
      }
      
      await batch.commit();
      
      // Update allUsers
      set(state => ({
        allUsers: state.allUsers.map(u =>
          u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u
        ),
        currentUser: state.currentUser ? {
          ...state.currentUser,
          following: followDocs.empty ? (state.currentUser.following || 0) + 1 : (state.currentUser.following || 0) - 1
        } : null
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

    // Add to local state immediately
    const localPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      ...newPost,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isSaved: false
    };

    set(state => ({
      posts: [localPost, ...state.posts]
    }));

    // Try to sync with Firestore
    try {
      const postRef = await addDoc(collection(db, 'posts'), {
        ...newPost,
        timestamp: Timestamp.now(),
        likes: 0,
        comments: 0,
      });

      // Update local state with actual Firebase ID
      set(state => ({
        posts: state.posts.map(p => p.id === localPost.id ? { ...p, id: postRef.id } : p)
      }));
    } catch (error: any) {
      if (error?.code !== 'unavailable' && error?.code !== 'failed-precondition') {
        console.error('Error adding post:', error);
      }
    }
  },

  loadPosts: async () => {
    try {
      const postsQuery = query(collection(db, 'posts'));
      const snapshot = await getDocs(postsQuery);
      const posts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? new Date(data.timestamp.toDate()).toLocaleString() : new Date().toLocaleString(),
          isLiked: false,
          isSaved: false
        } as Post;
      }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      set({ posts });
    } catch (error: any) {
      if (error?.code !== 'unavailable') {
        console.error('Error loading posts:', error);
      }
    }
  },

  loadUsers: async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      const currentUserId = get().currentUser?.id;
      
      const users = snapshot.docs
        .filter(doc => doc.id !== currentUserId)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User));
      
      set({ allUsers: users });
    } catch (error: any) {
      if (error?.code !== 'unavailable') {
        console.error('Error loading users:', error);
      }
    }
  },

  loadNotifications: async () => {
    const currentUser = get().currentUser;
    if (!currentUser) return;
    
    try {
      const notifQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.id)
      );
      const snapshot = await getDocs(notifQuery);
      const notifications = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toLocaleString() : new Date().toLocaleString(),
          userAvatar: '',
          postImage: ''
        } as Notification;
      });
      
      set({ notifications });
    } catch (error: any) {
      if (error?.code !== 'unavailable') {
        console.error('Error loading notifications:', error);
      }
    }
  },

  toggleLike: async (postId) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
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

  markStoryViewed: (storyId) => set((state) => ({
    stories: state.stories.map(s =>
      s.id === storyId ? { ...s, isViewed: true } : s
    )
  }))
}));
