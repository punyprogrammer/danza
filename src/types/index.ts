export interface User {
  id: string;
  email: string;
  userType: 'dancer' | 'instructor' | 'organizer';
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DancerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  gender: 'male' | 'female' | 'other';
  danceStyles: string[];
  zipCode: string;
  proficiencyLevel: 'beginner' | 'amateur' | 'intermediate' | 'expert';
  role: 'lead' | 'follow' | 'both';
  bio?: string;
  profilePicture?: string;
  additionalPhotos?: string[];
  additionalVideos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizerProfile {
  id: string;
  userId: string;
  name: string;
  instagramPage?: string;
  facebookPage?: string;
  danceStyles: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstructorProfile {
  id: string;
  userId: string;
  name: string;
  type: 'independent' | 'studio';
  danceStyles: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  bio?: string;
  profilePicture?: string;
  additionalPhotos?: string[];
  additionalVideos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserProfile = DancerProfile | OrganizerProfile | InstructorProfile;

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface OnboardingState {
  currentStep: number;
  userType: 'dancer' | 'instructor' | 'organizer' | null;
  dancerData: Partial<DancerProfile>;
  organizerData: Partial<OrganizerProfile>;
  instructorData: Partial<InstructorProfile>;
}
