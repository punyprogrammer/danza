# 🎭 Danza - Dance Community App

A React Native application for the dance community, built with Expo, Firebase, and NativeWind.

## Features

### Phase 1 - Authentication & Onboarding ✅

- **Social Authentication**: Google, Apple, Facebook, and Instagram sign-in
- **User Type Selection**: Choose between Dancer, Instructor, or Event Organizer
- **Dancer Onboarding**: Complete profile setup with personal info, location, and bio
- **Event Organizer Onboarding**: Organization setup with dance styles and location
- **Modern UI**: Beautiful gradient designs with NativeWind styling

### Coming Soon

- Event Discovery & Booking
- Dance Partner Matching
- Community Chat & Forums
- Location-based Event Discovery

## Tech Stack

- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Language**: TypeScript
- **Maps**: React Native Maps
- **Image Handling**: Expo Image Picker

## Project Structure

```
src/
├── components/
│   └── ui/                 # Reusable UI components
├── screens/
│   ├── auth/              # Authentication screens
│   ├── onboarding/        # Onboarding flow screens
│   └── MainScreen.tsx     # Main app screen
├── stores/                # Zustand state management
├── types/                 # TypeScript type definitions
├── navigation/            # Navigation components
├── services/              # Firebase and API services
└── utils/                 # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd danza
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Download the Firebase config file
   - Update `src/services/firebase.ts` with your Firebase configuration

4. **Configure Social Authentication**
   - Set up Google Sign-In in Firebase Console
   - Configure Apple Sign-In (iOS only)
   - Set up Facebook and Instagram authentication
   - Update the authentication methods in the auth screens

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on iOS Simulator**
   ```bash
   npm run ios
   ```

7. **Run on Android**
   ```bash
   npm run android
   ```

## Firebase Configuration

### Required Firebase Services

1. **Authentication**
   - Enable Email/Password authentication
   - Enable Google Sign-In
   - Enable Apple Sign-In (iOS)
   - Enable Facebook authentication
   - Enable Instagram authentication

2. **Firestore Database**
   - Create collections for users, dancers, organizers, instructors
   - Set up proper security rules

3. **Storage**
   - Configure for profile pictures and media uploads

### Firestore Data Structure

```typescript
// Users Collection
users: {
  [userId]: {
    id: string;
    email: string;
    userType: 'dancer' | 'instructor' | 'organizer';
    isOnboarded: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}

// Dancer Profiles Collection
dancers: {
  [dancerId]: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    preferredName: string;
    gender: 'male' | 'female' | 'other';
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    proficiencyLevel: 'beginner' | 'amateur' | 'intermediate' | 'expert';
    bio?: string;
    profilePicture?: string;
    additionalPhotos?: string[];
    additionalVideos?: string[];
    createdAt: Date;
    updatedAt: Date;
  }
}

// Organizer Profiles Collection
organizers: {
  [organizerId]: {
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
}
```

## Development

### Adding New Features

1. Create components in `src/components/`
2. Add screens in `src/screens/`
3. Update stores in `src/stores/` for state management
4. Add types in `src/types/`
5. Update navigation as needed

### Styling

This project uses NativeWind (Tailwind CSS for React Native). You can use all Tailwind utility classes:

```tsx
<View className="flex-1 bg-blue-500 p-4">
  <Text className="text-white text-lg font-bold">
    Hello World
  </Text>
</View>
```

### State Management

State is managed using Zustand stores:

```typescript
import { useAuthStore } from './stores/authStore';

const { user, setUser } = useAuthStore();
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

