// Onboarding service for Firebase operations
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DancerProfile, OrganizerProfile, InstructorProfile } from '../types';
import { userService } from './userService';

export interface FirebaseOnboardingData {
  userId: string;
  userType: 'dancer' | 'organizer' | 'instructor';
  isOnboardingComplete: boolean;
  currentStep: number;
  dancerData?: Partial<DancerProfile>;
  organizerData?: Partial<OrganizerProfile>;
  instructorData?: Partial<InstructorProfile>;
  created_at: any;
  updated_at: any;
}

class OnboardingService {
  private collectionName = 'onboarding';

  /**
   * Check if Firebase is properly initialized
   */
  private checkFirebaseInitialization() {
    if (!db || typeof db === 'undefined') {
      console.error('❌ Firebase database is not initialized for onboarding service.');
      throw new Error('Firebase database is not initialized. Please check your Firebase configuration.');
    }
  }

  /**
   * Filter out undefined values from an object (Firebase doesn't support undefined)
   * @param obj - Object to filter
   * @returns Object with undefined values removed
   */
  private filterUndefinedValues(obj: any): any {
    if (obj === null || obj === undefined) {
      return {};
    }
    
    if (Array.isArray(obj)) {
      return obj.filter(item => item !== undefined);
    }
    
    if (typeof obj === 'object') {
      const filtered: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          if (typeof value === 'object' && value !== null) {
            const filteredValue = this.filterUndefinedValues(value);
            // Only add the key if the filtered value is not empty
            if (Object.keys(filteredValue).length > 0 || Array.isArray(filteredValue)) {
              filtered[key] = filteredValue;
            }
          } else {
            filtered[key] = value;
          }
        }
      }
      return filtered;
    }
    
    return obj;
  }

  /**
   * Save onboarding data to Firebase
   * @param userId - User ID
   * @param userType - Type of user (dancer, organizer, instructor)
   * @param data - Onboarding data
   * @param currentStep - Current onboarding step
   * @returns Promise<void>
   */
  async saveOnboardingData(
    userId: string,
    userType: 'dancer' | 'organizer' | 'instructor',
    data: Partial<DancerProfile> | Partial<OrganizerProfile> | Partial<InstructorProfile>,
    currentStep: number = 1
  ): Promise<void> {
    try {
      this.checkFirebaseInitialization();
      
      const onboardingRef = doc(db, this.collectionName, userId);
      
      // Prepare onboarding data based on user type
      const onboardingData: FirebaseOnboardingData = {
        userId,
        userType,
        isOnboardingComplete: false,
        currentStep,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      // Add user-specific data and filter out undefined values
      if (userType === 'dancer') {
        onboardingData.dancerData = this.filterUndefinedValues(data as Partial<DancerProfile>);
      } else if (userType === 'organizer') {
        onboardingData.organizerData = this.filterUndefinedValues(data as Partial<OrganizerProfile>);
      } else if (userType === 'instructor') {
        onboardingData.instructorData = this.filterUndefinedValues(data as Partial<InstructorProfile>);
      }

      await setDoc(onboardingRef, onboardingData, { merge: true });
      console.log('✅ Onboarding data saved to Firebase:', userId);
    } catch (error) {
      console.error('❌ Error saving onboarding data:', error);
      throw error;
    }
  }

  /**
   * Get onboarding data from Firebase
   * @param userId - User ID
   * @returns Promise<FirebaseOnboardingData | null>
   */
  async getOnboardingData(userId: string): Promise<FirebaseOnboardingData | null> {
    try {
      this.checkFirebaseInitialization();
      
      const onboardingRef = doc(db, this.collectionName, userId);
      const onboardingSnap = await getDoc(onboardingRef);

      if (onboardingSnap.exists()) {
        const data = onboardingSnap.data();
        console.log('✅ Onboarding data retrieved from Firebase:', userId);
        return {
          userId: onboardingSnap.id,
          userType: data.userType,
          isOnboardingComplete: data.isOnboardingComplete,
          currentStep: data.currentStep,
          dancerData: data.dancerData,
          organizerData: data.organizerData,
          instructorData: data.instructorData,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
      
      console.log('⚠️ No onboarding data found for user:', userId);
      return null;
    } catch (error) {
      console.error('❌ Error getting onboarding data:', error);
      throw error;
    }
  }

  /**
   * Update onboarding data in Firebase
   * @param userId - User ID
   * @param data - Updated onboarding data
   * @param currentStep - Current onboarding step
   * @returns Promise<void>
   */
  async updateOnboardingData(
    userId: string,
    data: Partial<DancerProfile> | Partial<OrganizerProfile> | Partial<InstructorProfile>,
    currentStep?: number
  ): Promise<void> {
    try {
      this.checkFirebaseInitialization();
      
      const onboardingRef = doc(db, this.collectionName, userId);
      
      // Get existing data to determine user type
      const existingData = await this.getOnboardingData(userId);
      if (!existingData) {
        throw new Error('No existing onboarding data found');
      }

      const updateData: any = {
        updated_at: serverTimestamp(),
      };

      if (currentStep !== undefined) {
        updateData.currentStep = currentStep;
      }

      // Update user-specific data and filter out undefined values
      if (existingData.userType === 'dancer') {
        updateData.dancerData = this.filterUndefinedValues({ ...existingData.dancerData, ...data });
      } else if (existingData.userType === 'organizer') {
        updateData.organizerData = this.filterUndefinedValues({ ...existingData.organizerData, ...data });
      } else if (existingData.userType === 'instructor') {
        updateData.instructorData = this.filterUndefinedValues({ ...existingData.instructorData, ...data });
      }

      await updateDoc(onboardingRef, updateData);
      console.log('✅ Onboarding data updated in Firebase:', userId);
    } catch (error) {
      console.error('❌ Error updating onboarding data:', error);
      throw error;
    }
  }

  /**
   * Complete onboarding for a user
   * @param userId - User ID
   * @param userType - User type (dancer, organizer, instructor)
   * @returns Promise<void>
   */
  async completeOnboarding(userId: string, userType?: 'dancer' | 'organizer' | 'instructor'): Promise<void> {
    try {
      this.checkFirebaseInitialization();
      
      // Update onboarding collection
      const onboardingRef = doc(db, this.collectionName, userId);
      
      await updateDoc(onboardingRef, {
        isOnboardingComplete: true,
        currentStep: 999, // Mark as completed
        updated_at: serverTimestamp(),
      });
      
      // Update user collection to mark as onboarded and set user type (only if different from default 'dancer')
      if (userType && userType !== 'dancer') {
        await userService.updateUserOnboardingStatus(userId, true, userType);
        console.log('✅ User type updated to:', userType);
      } else {
        await userService.updateUserOnboardingStatus(userId, true);
        console.log('✅ User type remains as dancer (default)');
      }
      
      console.log('✅ Onboarding completed for user:', userId);
      console.log('✅ User marked as onboarded in user collection');
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      throw error;
    }
  }

  /**
   * Delete onboarding data
   * @param userId - User ID
   * @returns Promise<void>
   */
  async deleteOnboardingData(userId: string): Promise<void> {
    try {
      this.checkFirebaseInitialization();
      
      const onboardingRef = doc(db, this.collectionName, userId);
      await setDoc(onboardingRef, {});
      
      console.log('✅ Onboarding data deleted for user:', userId);
    } catch (error) {
      console.error('❌ Error deleting onboarding data:', error);
      throw error;
    }
  }
}

export const onboardingService = new OnboardingService();
