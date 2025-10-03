import React from 'react';
import { UserTypeSelectionScreen } from '../screens/onboarding/UserTypeSelectionScreen';
import { DancerOnboardingScreen1 } from '../screens/onboarding/DancerOnboardingScreen1';
import { DancerOnboardingScreen2 } from '../screens/onboarding/DancerOnboardingScreen2';
import { OrganizerOnboardingScreen1 } from '../screens/onboarding/OrganizerOnboardingScreen1';
import { OnboardingCompleteScreen } from '../screens/onboarding/OnboardingCompleteScreen';
import { useOnboardingStore } from '../stores/onboardingStore';

interface OnboardingNavigatorProps {
  onOnboardingComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({
  onOnboardingComplete,
}) => {
  const { currentStep, userType, nextStep, prevStep } = useOnboardingStore();

  const handleUserTypeContinue = () => {
    nextStep();
  };

  const handleDancerContinue = () => {
    nextStep();
  };

  const handleDancerBack = () => {
    prevStep();
  };

  const handleOrganizerContinue = () => {
    nextStep();
  };

  const handleOrganizerBack = () => {
    prevStep();
  };

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
