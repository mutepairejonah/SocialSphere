import { create } from 'zustand';
import { auth, db } from './firebase';
import { 
  signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  bio?: string;
  website?: string;
  instagramToken?: string;
}

interface StoreState {
  currentUser: User | null;
  pendingGoogleUser: {uid: string, displayName: string, email: string, photoURL: string} | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: {fullName?: string, bio?: string, website?: string, avatar?: string, instagramToken?: string}) => Promise<void>;
  initializeAuth: () => void;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
  completeGoogleSignup: (username: string) => Promise<void>;
  setInstagramToken: (token: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  currentUser: null,
  pendingGoogleUser: null,
  isAuthenticated: false,

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
          } else {
            set({ currentUser: null, isAuthenticated: false, pendingGoogleUser: null });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ currentUser: null, isAuthenticated: false, pendingGoogleUser: null });
        }
      } else {
        set({ currentUser: null, isAuthenticated: false, pendingGoogleUser: null });
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

    const available = await get().checkUsernameAvailable(username);
    if (!available) {
      throw new Error('Username already taken');
    }

    const newUser = {
      username: username.toLowerCase(),
      fullName: pending.displayName,
      email: pending.email,
      avatar: pending.photoURL,
      createdAt: Timestamp.now()
    };

    await setDoc(doc(db, 'users', pending.uid), newUser);
    
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
        })
      });
    } catch (err) {
      console.warn('Database sync failed:', err);
    }
    
    set({
      currentUser: {
        id: pending.uid,
        ...newUser
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
    
    let baseUsername = email.split('@')[0].toLowerCase();
    let username = baseUsername;
    let counter = 1;
    
    while (!(await get().checkUsernameAvailable(username))) {
      username = `${baseUsername}${counter}`;
      counter++;
    }
    
    const newUser = {
      username,
      fullName,
      email,
      avatar: '',
      createdAt: Timestamp.now()
    };
    await setDoc(doc(db, 'users', user.uid), newUser);
    
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
        })
      });
    } catch (err) {
      console.warn('Database sync failed:', err);
    }
    
    set({
      currentUser: {
        id: user.uid,
        ...newUser
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
    set({ 
      currentUser: null, 
      isAuthenticated: false, 
      pendingGoogleUser: null
    });
  },

  updateProfile: async (updates) => {
    const currentUser = get().currentUser;
    if (!currentUser) throw new Error('No current user');

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedUser = await response.json();
      set({ currentUser: { ...currentUser, ...updatedUser } });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  setInstagramToken: async (token: string) => {
    const currentUser = get().currentUser;
    if (!currentUser) throw new Error('No current user');

    try {
      // Update Firestore
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { instagramToken: token });

      // Sync to PostgreSQL
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...currentUser,
            instagramToken: token
          })
        });
      } catch (err) {
        console.warn('Database sync failed:', err);
      }

      set(state => ({
        currentUser: state.currentUser ? { ...state.currentUser, instagramToken: token } : null
      }));
    } catch (error) {
      console.error('Error setting Instagram token:', error);
      throw error;
    }
  },
}));
