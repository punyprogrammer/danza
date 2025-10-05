import React from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { YoureAllSetScreen } from '../../components/onboarding/YoureAllSetScreen';
import { getCompletionConfig } from '../../config/onboardingConfigs';

interface OnboardingCompleteScreenProps {
  onComplete: () => void;
}

export const OnboardingCompleteScreen: React.FC<OnboardingCompleteScreenProps> = ({
  onComplete,
}) => {
  const { userType } = useOnboardingStore();
  
  const handleComplete = async () => {
    // The onboarding data has already been saved to Firebase
    // by the individual onboarding screens (DancerOnboardingScreen2, OrganizerOnboardingScreen1)
    // This screen just shows the completion message
    onComplete();
  };

  const config = getCompletionConfig(userType || 'dancer');

  return (
    <YoureAllSetScreen 
      config={config}
      onComplete={handleComplete}
    />
  );
};