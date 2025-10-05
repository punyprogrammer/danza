import { create } from 'zustand';
import { UserProfile } from '../types/auth';

interface AuthStore {
  user: UserProfile | null;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userType: 'dancer' | 'organizer' | 'instructor' | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  setUserType: (userType: 'dancer' | 'organizer' | 'instructor') => void;
  
  // Authentication methods (stubs for compatibility)
  signInWithEmail: (email: string, password: string, userType?: 'dancer' | 'organizer') => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, userType?: 'dancer' | 'organizer') => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple' | 'facebook', userType?: 'dancer' | 'organizer') => Promise<void>;
  signOut: () => Promise<void>;
  
  // Reset
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  isOnboarded: false,
  userType: null,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isOnboarded: user?.is_onboarded || false,
    userType: user?.user_type || null,
  }),
  
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),
  setOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
  setUserType: (userType) => set({ userType }),
  
  // Authentication method stubs (will be handled by components using Clerk hooks)
  signInWithEmail: async (email, password, userType = 'dancer') => {
    console.log('signInWithEmail called - use Clerk hooks in components');
    // This will be handled by components using useAuthService hook
  },
  
  signUpWithEmail: async (email, password, name, userType = 'dancer') => {
    console.log('signUpWithEmail called - use Clerk hooks in components');
    // This will be handled by components using useAuthService hook
  },
  
  signInWithOAuth: async (provider, userType = 'dancer') => {
    console.log(`signInWithOAuth called for ${provider} - use Clerk hooks in components`);
    // This will be handled by components using useAuthService hook
  },
  
  signOut: async () => {
    console.log('signOut called - use Clerk hooks in components');
    // This will be handled by components using useAuthService hook
  },
  
  reset: () => set({
    user: null,
    session: null,
    isLoading: false,
    isAuthenticated: false,
    isOnboarded: false,
    userType: null,
  }),
}));