// User service for Firebase operations
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
  Firestore
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/auth';

export interface FirebaseUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  user_type: 'dancer' | 'organizer' | 'instructor';
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  is_active: boolean;
  clerk_user_id: string; // Clerk user ID for reference
  auth_provider: 'email' | 'google' | 'apple' | 'facebook'; // Track auth method
}

class UserService {
  private collectionName = 'users';

  /**
   * Check if Firebase is properly initialized
   */
  private checkFirebaseInitialization() {
    console.log('🔍 Checking Firebase initialization...');
    console.log('Database object:', db);
    console.log('Database type:', typeof db);
    console.log('Database is null:', db === null);
    console.log('Database is undefined:', db === undefined);
    
    if (!db || db === null || typeof db === 'undefined') {
      console.error('❌ Firebase database is not initialized.');
      console.error('Database object:', db);
      console.error('Database type:', typeof db);
      console.error('Environment variables:', {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not set',
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not set',
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set',
      });
      throw new Error('Firebase database is not initialized. The db object is null/undefined. Please check Firebase configuration.');
    }
    
    // In Firebase v9+, we don't use db.collection() directly
    // Instead, we use the collection() function imported from firebase/firestore
    console.log('✅ Using Firebase v9+ modular SDK (collection function imported separately)');
    
    console.log('✅ Firebase database is properly initialized');
  }

  /**
   * Test Firebase connection
   */
  async testConnection(): Promise<boolean> {
    try {
      this.checkFirebaseInitialization();
      // Test creating a collection reference (this doesn't actually make a network call)
      const testCollectionRef = collection(db, 'testCollection');
      console.log('✅ Collection reference created successfully');
      console.log('Collection path:', testCollectionRef.path);
      console.log('Collection ID:', testCollectionRef.id);
      console.log('🔥 Firebase connection test passed');
      return true;
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      return false;
    }
  }

  /**
   * Create a new user in Firebase
   * @param userData - User data from Clerk
   * @param authProvider - Authentication provider used
   * @returns Promise<FirebaseUser>
   */
  async createUser(userData: any, authProvider: 'email' | 'google' | 'apple' | 'facebook'): Promise<FirebaseUser> {
    try {
      this.checkFirebaseInitialization();
      const userRef = doc(db, this.collectionName, userData.id);
      
      // Check if user already exists
      const existingUser = await this.getUserById(userData.id);
      if (existingUser) {
        console.log('🔄 User already exists, updating last sign in');
        return await this.updateLastSignIn(userData.id);
      }

      const firebaseUser: FirebaseUser = {
        id: userData.id,
        email: userData.primaryEmailAddress?.emailAddress || '',
        name: userData.fullName || userData.username || userData.id,
        avatar_url: userData.imageUrl,
        user_type: (userData.publicMetadata?.userType as 'dancer' | 'organizer' | 'instructor') || 'dancer',
        is_onboarded: (userData.publicMetadata?.isOnboarded as boolean) || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        is_active: true,
        clerk_user_id: userData.id,
        auth_provider: authProvider,
      };

      // Set document with server timestamp
      await setDoc(userRef, {
        ...firebaseUser,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        last_sign_in_at: serverTimestamp(),
      });

      console.log('✅ User created in Firebase:', firebaseUser.id);
      return firebaseUser;
    } catch (error) {
      console.error('❌ Error creating user in Firebase:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns Promise<FirebaseUser | null>
   */
  async getUserById(userId: string): Promise<FirebaseUser | null> {
    try {
      this.checkFirebaseInitialization();
      console.log('db',db);
      console.log('collectionName',this.collectionName);
      console.log('userId',userId);
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log('✅ User found in Firebase:', userId);
        return userData as FirebaseUser;
      } else {
        console.log('ℹ️ User not found in Firebase:', userId);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting user from Firebase:', error);
      throw error;
    }
  }

  /**
   * Get user by Clerk user ID
   * @param clerkUserId - Clerk user ID
   * @returns Promise<FirebaseUser | null>
   */
  async getUserByClerkId(clerkUserId: string): Promise<FirebaseUser | null> {
    try {
      this.checkFirebaseInitialization();
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, where('clerk_user_id', '==', clerkUserId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        console.log('✅ User found by Clerk ID:', clerkUserId);
        return userData as FirebaseUser;
      } else {
        console.log('ℹ️ User not found by Clerk ID:', clerkUserId);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting user by Clerk ID:', error);
      throw error;
    }
  }

  /**
   * Update user data
   * @param userId - User ID
   * @param updates - Partial user data to update
   * @returns Promise<void>
   */
  async updateUser(userId: string, updates: Partial<FirebaseUser>): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
      console.log('✅ User updated in Firebase:', userId);
    } catch (error) {
      console.error('❌ Error updating user in Firebase:', error);
      throw error;
    }
  }

  /**
   * Update last sign in timestamp
   * @param userId - User ID
   * @returns Promise<FirebaseUser>
   */
  async updateLastSignIn(userId: string): Promise<FirebaseUser> {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        last_sign_in_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      
      // Return updated user data
      const updatedUser = await this.getUserById(userId);
      console.log('✅ Last sign in updated for user:', userId);
      return updatedUser!;
    } catch (error) {
      console.error('❌ Error updating last sign in:', error);
      throw error;
    }
  }

  /**
   * Check if user exists and create if not
   * @param userData - User data from Clerk
   * @param authProvider - Authentication provider
   * @returns Promise<FirebaseUser>
   */
  async ensureUserExists(userData: any, authProvider: 'email' | 'google' | 'apple' | 'facebook'): Promise<FirebaseUser> {
    try {
      // First check if user exists
      let existingUser = await this.getUserById(userData.id);
      
      if (existingUser) {
        // User exists, update last sign in
        console.log('🔄 User exists, updating last sign in');
        return await this.updateLastSignIn(userData.id);
      } else {
        // User doesn't exist, create new user
        console.log('🆕 Creating new user');
        return await this.createUser(userData, authProvider);
      }
    } catch (error) {
      console.error('❌ Error ensuring user exists:', error);
      throw error;
    }
  }

  /**
   * Update user onboarding status
   * @param userId - User ID
   * @param isOnboarded - Onboarding status
   * @param userType - User type (optional)
   * @returns Promise<void>
   */
  async updateUserOnboardingStatus(userId: string, isOnboarded: boolean, userType?: 'dancer' | 'organizer' | 'instructor'): Promise<void> {
    try {
      this.checkFirebaseInitialization();
      const userRef = doc(db, this.collectionName, userId);
      
      const updateData: any = {
        is_onboarded: isOnboarded,
        updated_at: serverTimestamp(),
      };
      
      // Add user_type if provided
      if (userType) {
        updateData.user_type = userType;
      }
      
      await updateDoc(userRef, updateData);
      
      console.log('✅ User onboarding status updated:', userId, isOnboarded);
      if (userType) {
        console.log('✅ User type updated to:', userType);
      }
    } catch (error) {
      console.error('❌ Error updating user onboarding status:', error);
      throw error;
    }
  }

  /**
   * Convert Firebase user to UserProfile format
   * @param firebaseUser - Firebase user data
   * @returns UserProfile
   */
  convertToUserProfile(firebaseUser: FirebaseUser): UserProfile {
    return {
      id: firebaseUser.id,
      email: firebaseUser.email,
      name: firebaseUser.name,
      avatar_url: firebaseUser.avatar_url,
      user_type: firebaseUser.user_type,
      is_onboarded: firebaseUser.is_onboarded,
      created_at: firebaseUser.created_at,
      updated_at: firebaseUser.updated_at,
      last_sign_in_at: firebaseUser.last_sign_in_at,
      is_active: firebaseUser.is_active,
    };
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
