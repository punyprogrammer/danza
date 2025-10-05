// Clerk Authentication Service
import { useAuth, useUser } from '@clerk/clerk-expo';
import { UserProfile, UserType } from '../types/auth';

// Hook-based authentication service
export const useAuthService = () => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // Get current user from Clerk
  const getCurrentUser = (): UserProfile | null => {
    try {
      if (!user) {
        return null;
      }

      return mapClerkUserToProfile(user);
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return null;
    }
  };

  // Get authentication state
  const getAuthState = () => {
    try {
      return { isSignedIn, isLoaded: true };
    } catch (error) {
      console.error('❌ Get auth state error:', error);
      return { isSignedIn: false, isLoaded: false };
    }
  };

  // Sign out
  const signOutUser = async (): Promise<void> => {
    try {
      console.log('🚀 Starting sign out...');
      
      if (!signOut) {
        throw new Error('Sign out not available');
      }

      await signOut();
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    try {
      if (!user) {
        throw new Error('No user found');
      }

      // Update Clerk user metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          ...profileData,
        },
      });

      console.log('✅ User profile updated');
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  };

  // Mark user as onboarded
  const markUserOnboarded = async (userType: UserType): Promise<void> => {
    try {
      if (!user) {
        throw new Error('No user found');
      }

      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          is_onboarded: true,
          user_type: userType,
        },
      });

      console.log('✅ User marked as onboarded');
    } catch (error) {
      console.error('❌ Mark onboarded error:', error);
      throw error;
    }
  };

  return {
    getCurrentUser,
    getAuthState,
    signOut: signOutUser,
    updateUserProfile,
    markUserOnboarded,
  };
};

// Map Clerk user to our UserProfile interface
const mapClerkUserToProfile = (clerkUser: any): UserProfile => {
  const metadata = clerkUser.unsafeMetadata || {};
  
  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
    avatar_url: clerkUser.imageUrl || null,
    user_type: metadata.user_type || 'dancer',
    is_onboarded: metadata.is_onboarded || false,
    created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
    updated_at: clerkUser.updatedAt?.toISOString() || new Date().toISOString(),
    last_sign_in_at: clerkUser.lastSignInAt?.toISOString() || null,
    is_active: true,
  };
};