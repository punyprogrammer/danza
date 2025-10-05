import { create } from 'zustand';
import { DancerProfile, OrganizerProfile, InstructorProfile } from '../types';
import { onboardingService } from '../services/onboardingService';
import { useAuthStore } from './authStore';

interface OnboardingStore {
  currentStep: number;
  userType: 'dancer' | 'instructor' | 'organizer' | null;
  dancerData: Partial<DancerProfile>;
  organizerData: Partial<OrganizerProfile>;
  instructorData: Partial<InstructorProfile>;
  isOnboardingComplete: boolean;
  
  // Actions
  setUserType: (type: 'dancer' | 'instructor' | 'organizer') => void;
  setCurrentStep: (step: number) => void;
  updateDancerData: (data: Partial<DancerProfile>) => void;
  updateOrganizerData: (data: Partial<OrganizerProfile>) => void;
  updateInstructorData: (data: Partial<InstructorProfile>) => void;
  saveOnboardingData: (data: any, step?: number) => Promise<void>;
  loadOnboardingData: () => Promise<void>;
  resetOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  currentStep: 0,
  userType: null,
  dancerData: {},
  organizerData: {},
  instructorData: {},
  isOnboardingComplete: false,
  
  setUserType: (userType) => set({ userType, currentStep: 0 }),
  
  setCurrentStep: (currentStep) => set({ currentStep }),
  
  updateDancerData: (data) => set((state) => ({
    dancerData: { ...state.dancerData, ...data }
  })),
  
  updateOrganizerData: (data) => set((state) => ({
    organizerData: { ...state.organizerData, ...data }
  })),
  
  updateInstructorData: (data) => set((state) => ({
    instructorData: { ...state.instructorData, ...data }
  })),
  
  saveOnboardingData: async (data, step) => {
    try {
      const state = get();
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId || !state.userType) {
        throw new Error('User ID or user type not found');
      }

      console.log('🔄 Saving onboarding data to Firebase...');
      await onboardingService.saveOnboardingData(
        userId,
        state.userType,
        data,
        step || state.currentStep
      );
      
      console.log('✅ Onboarding data saved to Firebase');
    } catch (error) {
      console.error('❌ Error saving onboarding data:', error);
      throw error;
    }
  },

  loadOnboardingData: async () => {
    try {
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId) {
        console.log('⚠️ No user ID found, skipping onboarding data load');
        return;
      }

      console.log('🔄 Loading onboarding data from Firebase...');
      const data = await onboardingService.getOnboardingData(userId);
      
      if (data) {
        set({
          currentStep: data.currentStep,
          userType: data.userType,
          dancerData: data.dancerData || {},
          organizerData: data.organizerData || {},
          instructorData: data.instructorData || {},
          isOnboardingComplete: data.isOnboardingComplete,
        });
        console.log('✅ Onboarding data loaded from Firebase');
      }
    } catch (error) {
      console.error('❌ Error loading onboarding data:', error);
      // Don't throw error to prevent blocking the app
    }
  },
  
  resetOnboarding: () => set({
    currentStep: 0,
    userType: null,
    dancerData: {},
    organizerData: {},
    instructorData: {},
    isOnboardingComplete: false,
  }),
  
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(0, state.currentStep - 1) 
  })),
  
  completeOnboarding: async () => {
    try {
      const userId = useAuthStore.getState().user?.id;
      const state = get();
      
      if (userId && state.userType) {
        // Complete onboarding in Firebase (updates both collections)
        await onboardingService.completeOnboarding(userId, state.userType);
        console.log('✅ Onboarding completed in Firebase');
        
        // Update auth store user to reflect onboarding completion and user type
        const authStore = useAuthStore.getState();
        if (authStore.user) {
          console.log('🔄 Updating user in auth store...');
          console.log('Current user:', authStore.user);
          console.log('Current user_type:', authStore.user.user_type);
          console.log('Onboarding user_type:', state.userType);
          
          // Only update user_type if it's different from the default 'dancer'
          const updateData: any = { 
            ...authStore.user, 
            is_onboarded: true
          };
          
          if (state.userType !== 'dancer') {
            updateData.user_type = state.userType;
            console.log('🔄 Updating user_type from dancer to:', state.userType);
          } else {
            console.log('✅ User_type remains as dancer (default)');
          }
          
          console.log('🔄 About to update auth store with:', updateData);
          authStore.setUser(updateData);
          
          // Check the updated user immediately after
          const updatedAuthStore = useAuthStore.getState();
          console.log('✅ User updated in auth store');
          console.log('Updated user:', updatedAuthStore.user);
          console.log('Updated user_type:', updatedAuthStore.user?.user_type);
          console.log('Updated is_onboarded:', updatedAuthStore.user?.is_onboarded);
        } else {
          console.error('❌ No user found in auth store during onboarding completion');
        }
      }
      
      set({ isOnboardingComplete: true });
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      // Still mark as complete locally even if Firebase fails
      set({ isOnboardingComplete: true });
    }
  },
}));

