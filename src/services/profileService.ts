import {
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DancerProfile, OrganizerProfile } from '../types';

class ProfileService {
  private collectionName = 'onboarding';

  /**
   * Check if Firebase is properly initialized
   */
  private checkFirebaseInitialization() {
    if (!db || typeof collection !== 'function') {
      console.error('❌ Firebase Firestore is not initialized or collection is not a function.');
      throw new Error('Firebase Firestore is not initialized. Please check your Firebase configuration.');
    }
  }

  /**
   * Get dancer profile data from Firebase
   * @param userId - User ID
   * @returns Promise<DancerProfile | null>
   */
  async getDancerProfile(userId: string): Promise<DancerProfile | null> {
    try {
      this.checkFirebaseInitialization();
      const profileRef = doc(db, this.collectionName, userId);
      const docSnap = await getDoc(profileRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.dancerData) {
          return data.dancerData as DancerProfile;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting dancer profile:', error);
      throw error;
    }
  }

  /**
   * Update dancer profile data in Firebase
   * @param userId - User ID
   * @param updates - Partial dancer profile data to update
   * @returns Promise<void>
   */
  async updateDancerProfile(userId: string, updates: Partial<DancerProfile>): Promise<void> {
    try {
      this.checkFirebaseInitialization();
      const profileRef = doc(db, this.collectionName, userId);

      // Filter out undefined values
      const filteredUpdates = this.filterUndefinedValues(updates);

      await updateDoc(profileRef, {
        'dancerData': {
          ...filteredUpdates,
          updatedAt: serverTimestamp(),
        },
        updated_at: serverTimestamp(),
      });

      console.log('✅ Dancer profile updated in Firebase:', userId);
    } catch (error) {
      console.error('❌ Error updating dancer profile:', error);
      throw error;
    }
  }

  /**
   * Get organizer profile data from Firebase
   * @param userId - User ID
   * @returns Promise<OrganizerProfile | null>
   */
  async getOrganizerProfile(userId: string): Promise<OrganizerProfile | null> {
    try {
      this.checkFirebaseInitialization();
      const profileRef = doc(db, this.collectionName, userId);
      const docSnap = await getDoc(profileRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.organizerData) {
          return data.organizerData as OrganizerProfile;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting organizer profile:', error);
      throw error;
    }
  }

  /**
   * Update organizer profile data in Firebase
   * @param userId - User ID
   * @param updates - Partial organizer profile data to update
   * @returns Promise<void>
   */
  async updateOrganizerProfile(userId: string, updates: Partial<OrganizerProfile>): Promise<void> {
    try {
      this.checkFirebaseInitialization();
      const profileRef = doc(db, this.collectionName, userId);

      // Filter out undefined values
      const filteredUpdates = this.filterUndefinedValues(updates);

      await updateDoc(profileRef, {
        'organizerData': {
          ...filteredUpdates,
          updatedAt: serverTimestamp(),
        },
        updated_at: serverTimestamp(),
      });

      console.log('✅ Organizer profile updated in Firebase:', userId);
    } catch (error) {
      console.error('❌ Error updating organizer profile:', error);
      throw error;
    }
  }

  /**
   * Recursively filters out undefined values from an object.
   * Firebase Firestore does not allow undefined values.
   * @param obj - The object to filter
   * @returns A new object with undefined values removed
   */
  private filterUndefinedValues<T extends object>(obj: T): T {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value !== undefined) {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            newObj[key] = this.filterUndefinedValues(value);
          } else {
            newObj[key] = value;
          }
        }
      }
    }
    return newObj;
  }
}

export const profileService = new ProfileService();
