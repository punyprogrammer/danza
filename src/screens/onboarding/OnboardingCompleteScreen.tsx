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
    try {
      // TODO: Save user profile to Firebase
      // await saveUserProfile();
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      // Handle error - maybe show a retry option
      onComplete();
    }
  };

  const config = getCompletionConfig(userType || 'dancer');

  return (
    <YoureAllSetScreen 
      config={config}
      onComplete={handleComplete}
    />
  );
};