import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { Colors } from '../styles/colors';

interface AuthNavigatorProps {
  onAuthSuccess: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState<'signin' | 'signup'>('signin');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width: screenWidth } = Dimensions.get('window');

  const handleNavigateToSignUp = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Animate current screen out to the left
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change screen and animate new screen in from the right
      setCurrentScreen('signup');
      slideAnim.setValue(screenWidth);
      fadeAnim.setValue(0);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handleNavigateToSignIn = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Animate current screen out to the right
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change screen and animate new screen in from the left
      setCurrentScreen('signin');
      slideAnim.setValue(-screenWidth);
      fadeAnim.setValue(0);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handleAuthSuccess = () => {
    onAuthSuccess();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.primary }}>
      <Animated.View 
        style={{ 
          flex: 1,
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }}
      >
        {currentScreen === 'signin' ? (
          <SignInScreen
            onNavigateToSignUp={handleNavigateToSignUp}
            onSignInSuccess={handleAuthSuccess}
          />
        ) : (
          <SignUpScreen
            onNavigateToSignIn={handleNavigateToSignIn}
            onSignUpSuccess={handleAuthSuccess}
          />
        )}
      </Animated.View>
    </View>
  );
};

