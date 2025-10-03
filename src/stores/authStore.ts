import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  firebaseUser: null,
  isLoading: false,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ 
    user: null, 
    firebaseUser: null, 
    isAuthenticated: false,
    isLoading: false 
  }),
}));

