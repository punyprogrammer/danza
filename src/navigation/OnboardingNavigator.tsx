import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { UserTypeSelectionScreen } from '../screens/onboarding/UserTypeSelectionScreen';
import { DancerOnboardingScreen1 } from '../screens/onboarding/DancerOnboardingScreen1';
import { DancerOnboardingScreen2 } from '../screens/onboarding/DancerOnboardingScreen2';
import { OrganizerOnboardingScreen1 } from '../screens/onboarding/OrganizerOnboardingScreen1';
import { OnboardingCompleteScreen } from '../screens/onboarding/OnboardingCompleteScreen';
import { YoureAllSetScreen } from '../components/onboarding/YoureAllSetScreen';
import { useOnboardingStore } from '../stores/onboardingStore';
import { Colors } from '../styles/colors';

interface OnboardingNavigatorProps {
  onOnboardingComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({
  onOnboardingComplete,
}) => {
  const { currentStep, userType, nextStep, prevStep } = useOnboardingStore();
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width: screenWidth } = Dimensions.get('window');

  // Animate screen transitions
  const animateTransition = (direction: 'forward' | 'backward', callback: () => void) => {
    const slideValue = direction === 'forward' ? -screenWidth : screenWidth;
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: slideValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(direction === 'forward' ? screenWidth : -screenWidth);
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
      ]).start();
    });
  };

  const handleUserTypeContinue = () => {
    animateTransition('forward', nextStep);
  };

  const handleDancerContinue = () => {
    // If we're on step 2 (final step for dancers), complete onboarding
    if (currentStep === 2) {
      onOnboardingComplete();
    } else {
      animateTransition('forward', nextStep);
    }
  };

  const handleDancerBack = () => {
    animateTransition('backward', prevStep);
  };

  const handleOrganizerContinue = () => {
    animateTransition('forward', nextStep);
  };

  const handleOrganizerBack = () => {
    animateTransition('backward', prevStep);
  };

  const renderCurrentScreen = () => {
    // User Type Selection
    if (currentStep === 0) {
      return <UserTypeSelectionScreen onContinue={handleUserTypeContinue} />;
    }

    // Dancer Onboarding Flow
    if (userType === 'dancer') {
      switch (currentStep) {
        case 1:
          return (
            <DancerOnboardingScreen1
              onContinue={handleDancerContinue}
              onBack={handleDancerBack}
            />
          );
        case 2:
          return (
            <DancerOnboardingScreen2
              onContinue={handleDancerContinue}
              onBack={handleDancerBack}
            />
          );
        case 3:
          return (
            <OnboardingCompleteScreen
              onComplete={onOnboardingComplete}
            />
          );
      }
    }

    // Organizer Onboarding Flow
    if (userType === 'organizer') {
      switch (currentStep) {
        case 1:
          return (
            <OrganizerOnboardingScreen1
              onContinue={handleOrganizerContinue}
              onBack={handleOrganizerBack}
            />
          );
        case 2:
          return (
            <YoureAllSetScreen
              config={{
                title: "You're All Set!",
                subtitle: "Welcome to the dance community",
                description: "Your organizer profile is complete. You can now start creating amazing dance events and building your community.",
                buttonText: "Get Started",
                illustrationText: {
                  main: "🎉",
                  sub: "Ready to organize!"
                }
              }}
              onComplete={onOnboardingComplete}
            />
          );
      }
    }

    // Instructor Onboarding Flow (if needed in the future)
    if (userType === 'instructor') {
      switch (currentStep) {
        case 1:
          return (
            <OnboardingCompleteScreen
              onComplete={onOnboardingComplete}
            />
          );
      }
    }

    // Default fallback
    return <UserTypeSelectionScreen onContinue={handleUserTypeContinue} />;
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
        {renderCurrentScreen()}
      </Animated.View>
    </View>
  );
};
