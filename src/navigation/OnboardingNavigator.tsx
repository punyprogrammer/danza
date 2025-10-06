import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { UserTypeSelectionScreen } from '../screens/onboarding/UserTypeSelectionScreen';
import { DancerOnboardingScreen1 } from '../screens/onboarding/DancerOnboardingScreen1';
import { DancerOnboardingScreen2 } from '../screens/onboarding/DancerOnboardingScreen2';
import { OrganizerOnboardingScreen1 } from '../screens/onboarding/OrganizerOnboardingScreen1';
import { OnboardingCompleteScreen } from '../screens/onboarding/OnboardingCompleteScreen';
import { YoureAllSetScreen, YoureAllSetConfig } from '../components/onboarding/YoureAllSetScreen';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useTheme } from '../components/ThemeProvider';

interface OnboardingNavigatorProps {
  onOnboardingComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({
  onOnboardingComplete,
}) => {
  const { currentStep, userType, nextStep, prevStep } = useOnboardingStore();
  const { colors } = useTheme();

  // Default config for dancer onboarding completion
  const dancerAllSetConfig: YoureAllSetConfig = {
    title: "You're All Set!",
    subtitle: "Welcome to Danza",
    description: "Your dancer profile is complete and ready to go. Start connecting with other dancers, finding events, and growing your dance journey!",
    buttonText: "Continue to Dashboard",
    illustrationText: {
      main: "🎉",
      sub: "Let's Dance!"
    }
  };
  
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
    // If we're on step 2 (final step for dancers), go to completion screen
    if (currentStep === 2) {
      animateTransition('forward', nextStep);
    } else {
      animateTransition('forward', nextStep);
    }
  };

  const handleDancerBack = () => {
    animateTransition('backward', prevStep);
  };

  const handleOrganizerContinue = () => {
    // If we're on step 1 (final step for organizers), go to completion screen
    if (currentStep === 1) {
      animateTransition('forward', nextStep);
    } else {
      animateTransition('forward', nextStep);
    }
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
            <YoureAllSetScreen
              config={dancerAllSetConfig}
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
            <OnboardingCompleteScreen
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
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
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
