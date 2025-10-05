// Authentication types for Clerk
export type UserType = 'dancer' | 'organizer' | 'instructor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  user_type: UserType;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  is_active: boolean;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_email: boolean;
    show_phone: boolean;
  };
  language: string;
  timezone: string;
}

export interface UserProfileDetails {
  first_name: string;
  last_name: string;
  display_name: string;
  bio?: string;
  dance_styles: string[];
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  social_links?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    website?: string;
  };
  location?: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  phone?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  date_of_birth?: string;
}

export interface AuthResult {
  user: UserProfile;
  session: any;
  isOnboarded: boolean;
  userType: UserType;
}

export type AuthProvider = 'google' | 'apple' | 'facebook' | 'email';
