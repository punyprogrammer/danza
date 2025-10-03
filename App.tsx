import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { MainScreen } from './src/screens/MainScreen';
import { useAuthStore } from './src/stores/authStore';
import { useOnboardingStore } from './src/stores/onboardingStore';
import { OnboardingNavigator } from './src/navigation/OnboardingNavigator';
import { Colors } from './src/styles/colors';

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while app is initializing
  if (!isAppReady || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.blue.primary} />
      </View>
    );
  }

  // Show authentication flow if user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <>
        <StatusBar style="light" />
        <AuthNavigator onAuthSuccess={() => {
          // Auth success is handled by the auth store
          console.log('Authentication successful');
        }} />
      </>
    );
  }

  // Show onboarding if user is authenticated but onboarding is not complete
  if (isAuthenticated && user && !user.isOnboarded) {
    return (
      <>
        <StatusBar style="light" />
        <OnboardingNavigator onOnboardingComplete={() => {
          // Update user to mark onboarding as complete
          const updatedUser = { ...user, isOnboarded: true };
          useAuthStore.getState().setUser(updatedUser);
        }} />
      </>
    );
  }

  // Show main app if user is authenticated and onboarding is complete
  return (
    <>
      <StatusBar style="light" />
      <MainScreen onSignOut={() => {
        useAuthStore.getState().logout();
        useOnboardingStore.getState().resetOnboarding();
      }} />
    </>
  );
}
