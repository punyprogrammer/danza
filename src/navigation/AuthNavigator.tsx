import React, { useState } from 'react';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';

interface AuthNavigatorProps {
  onAuthSuccess: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState<'signin' | 'signup'>('signin');

  const handleNavigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleNavigateToSignIn = () => {
    setCurrentScreen('signin');
  };

  const handleAuthSuccess = () => {
    onAuthSuccess();
  };

  if (currentScreen === 'signin') {
    return (
      <SignInScreen
        onNavigateToSignUp={handleNavigateToSignUp}
        onSignInSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <SignUpScreen
      onNavigateToSignIn={handleNavigateToSignIn}
      onSignUpSuccess={handleAuthSuccess}
    />
  );
};

