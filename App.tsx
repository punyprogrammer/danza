import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { MainScreen } from './src/screens/MainScreen';
import { useAuthStore } from './src/stores/authStore';
import { useOnboardingStore } from './src/stores/onboardingStore';
import { OnboardingNavigator } from './src/navigation/OnboardingNavigator';
import { Colors } from './src/styles/colors';
import { clerkPublishableKey } from './src/config/clerk';
import { userService } from './src/services/userService';

// Custom token cache using expo-secure-store
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },
  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  },
};

function AppContent() {
  const { isSignedIn } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Sync Clerk state with our auth store and Firebase
  useEffect(() => {
    const syncUserData = async () => {
      if (clerkUser && isSignedIn) {
        try {
          console.log('🔄 Syncing user data from Firebase...');
          // Try to fetch user from Firebase first
          const firebaseUser = await userService.ensureUserExists(clerkUser, 'email'); // Default to email, will be updated based on actual auth method
          const userProfile = userService.convertToUserProfile(firebaseUser);
          useAuthStore.getState().setUser(userProfile);
          console.log('✅ User data synced from Firebase');
        } catch (error) {
          console.error('❌ Error syncing user data from Firebase:', error);
          // Fallback to Clerk data if Firebase fails
          const fallbackProfile = {
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            name: clerkUser.fullName || clerkUser.username || clerkUser.id,
            avatar_url: clerkUser.imageUrl,
            user_type: (clerkUser.publicMetadata?.userType as 'dancer' | 'organizer' | 'instructor') || 'dancer',
            is_onboarded: (clerkUser.publicMetadata?.isOnboarded as boolean) || false,
            created_at: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
            updated_at: clerkUser.updatedAt ? new Date(clerkUser.updatedAt).toISOString() : new Date().toISOString(),
            last_sign_in_at: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt).toISOString() : undefined,
            is_active: true,
          };
          useAuthStore.getState().setUser(fallbackProfile);
          console.log('⚠️ Using fallback user data from Clerk');
        }
      } else if (!isSignedIn) {
        useAuthStore.getState().setUser(null);
      }
    };

    syncUserData();
  }, [clerkUser, isSignedIn]);

  // Show loading screen while app is initializing or Clerk is loading
  if (!isAppReady || isLoading || !clerkLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.blue.primary} />
      </View>
    );
  }

  // Show authentication flow if user is not authenticated
  if (!isSignedIn || !user) {
    return (
      <>
        <StatusBar style="light" />
        <AuthNavigator onAuthSuccess={() => {
          // Auth success is handled by the auth store
          console.log('Authentication successful, user state:', { isSignedIn, user: !!user, userEmail: user?.email });
        }} />
      </>
    );
  }

  // Show onboarding if user is authenticated but onboarding is not complete
  if (isSignedIn && user && !user.is_onboarded) {
    console.log('🎯 App.tsx - Showing onboarding for user:', user.email, 'user_type:', user.user_type);
    return (
      <>
        <StatusBar style="light" />
        <OnboardingNavigator onOnboardingComplete={async () => {
          // The onboarding store already handles updating the user
          // No need to update here as it would override the user_type changes
          console.log('✅ Onboarding completed, navigating to main app');
          console.log('User should be updated by onboarding store');
        }} />
      </>
    );
  }

  // Show main app if user is authenticated and onboarding is complete
  console.log('🎯 App.tsx - Showing main app for user:', user?.email, 'user_type:', user?.user_type, 'is_onboarded:', user?.is_onboarded);
  return (
    <>
      <StatusBar style="light" />
      <MainScreen onSignOut={() => {
        useAuthStore.getState().signOut();
        useOnboardingStore.getState().resetOnboarding();
      }} />
    </>
  );
}

export default function App() {
  if (!clerkPublishableKey) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.blue.primary} />
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <AppContent />
    </ClerkProvider>
  );
}
