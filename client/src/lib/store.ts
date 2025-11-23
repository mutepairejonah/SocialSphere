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
  pendingGoogleUser: {uid: string, displayName: string, email: string, photoURL: string} | null;
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
            // Load posts and users with error handling
            await Promise.all([
              get().loadPosts().catch(err => console.warn('Posts load failed:', err)),
              get().loadUsers().catch(err => console.warn('Users load failed:', err)),
              get().loadNotifications().catch(err => console.warn('Notifications load failed:', err))
            ]);
          } else {
            set({ currentUser: null, isAuthenticated: false });
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

    try {
      const postRef = await addDoc(collection(db, 'posts'), {
        ...newPost,
        timestamp: Timestamp.now(),
        likes: 0,
        comments: 0,
      });

      const postData = await getDoc(postRef);
      if (postData.exists()) {
        set(state => ({
          posts: [{
            id: postData.id,
            ...postData.data(),
            timestamp: new Date(postData.data().timestamp.toDate()).toLocaleString(),
            isLiked: false,
            isSaved: false
          } as Post, ...state.posts]
        }));
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  },

  loadPosts: async () => {
    try {
      // Load posts from Instagram API
      const instagramPosts = await getUserMedia();
      
      if (instagramPosts && instagramPosts.length > 0) {
        const posts = instagramPosts.map((igPost: any, index: number) => ({
          id: igPost.id || `ig_${index}`,
          userId: get().currentUser?.id || 'instagram',
          imageUrl: igPost.media_type === 'IMAGE' ? igPost.media_url : (igPost.thumbnail_url || 'https://via.placeholder.com/500'),
          caption: igPost.caption || '',
          likes: 0,
          location: '',
          timestamp: new Date(igPost.timestamp).toLocaleString(),
          comments: 0,
          isLiked: false,
          isSaved: false
        } as Post));
        
        set({ posts });
      } else {
        set({ posts: [] });
      }
    } catch (error) {
      console.warn('Error loading Instagram posts:', error);
      set({ posts: [] });
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

      // Load follow status for each user
      const usersWithFollowStatus = await Promise.all(
        users.map(async (user) => {
          const isFollowing = await get().loadFollowStatus(user.id);
          return { ...user, isFollowing };
        })
      );
      
      set({ allUsers: usersWithFollowStatus });
    } catch (error) {
      console.warn('Error loading users (using local data):', error);
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
          timestamp: data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toLocaleString() : 'Recently',
          userAvatar: '',
          postImage: ''
        } as Notification;
      });
      
      set({ notifications });
    } catch (error) {
      console.warn('Error loading notifications (using local data):', error);
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
  })),

  searchUsers: async (searchTerm: string) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    try {
      const searchLower = searchTerm.toLowerCase();
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      const currentUserId = get().currentUser?.id;
      
      const users = snapshot.docs
        .filter(doc => doc.id !== currentUserId)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User))
        .filter(user => 
          user.username.toLowerCase().includes(searchLower) || 
          user.fullName.toLowerCase().includes(searchLower)
        );

      // Load follow status for each user
      const usersWithFollowStatus = await Promise.all(
        users.map(async (user) => {
          const isFollowing = await get().loadFollowStatus(user.id);
          return { ...user, isFollowing };
        })
      );

      return usersWithFollowStatus;
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

    try {
      const conversationId = [currentUser.id, recipientId].sort().join('_');
      const messagesRef = collection(db, 'messages');
      
      await addDoc(messagesRef, {
        conversationId,
        senderId: currentUser.id,
        recipientId,
        message,
        timestamp: Timestamp.now(),
        read: false
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  getMessages: async (recipientId: string) => {
    const currentUser = get().currentUser;
    if (!currentUser) return [];

    try {
      const conversationId = [currentUser.id, recipientId].sort().join('_');
      const messagesRef = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId)
      );
      
      const snapshot = await getDocs(messagesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => a.timestamp?.toDate?.() - b.timestamp?.toDate?.());
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
