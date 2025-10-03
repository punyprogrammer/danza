import { create } from 'zustand';
import { DancerProfile, OrganizerProfile, InstructorProfile } from '../types';

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
  
  completeOnboarding: () => set({ isOnboardingComplete: true }),
}));

