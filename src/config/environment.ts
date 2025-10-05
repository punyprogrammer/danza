// Environment Configuration
export const ENV = {
  // Firebase Configuration
  FIREBASE: {
    API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'your-firebase-api-key',
    AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
    PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
    STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
    MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'your-firebase-app-id',
  },
  
  // Auth0 Configuration
  AUTH0: {
    DOMAIN: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-domain.auth0.com',
    CLIENT_ID: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'your-auth0-client-id',
    AUDIENCE: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || 'your-api-identifier',
  },
  
  // App Configuration
  APP: {
    ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-api.com',
  },
} as const;

// Validation function
export const validateEnvironment = () => {
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_AUTH0_DOMAIN',
    'EXPO_PUBLIC_AUTH0_CLIENT_ID',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    console.warn('Please set up your environment variables in .env file');
  }
  
  return missingVars.length === 0;
};
