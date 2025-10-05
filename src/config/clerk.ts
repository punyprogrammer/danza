// Clerk configuration
import { ClerkProvider } from '@clerk/clerk-expo';

// Clerk configuration
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE';

if (!clerkPublishableKey) {
  console.warn('⚠️ Clerk publishable key not found. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file');
}

console.log('🔧 Clerk Configuration:');
console.log('Publishable Key:', clerkPublishableKey ? 'Set' : 'Not Set');
console.log('========================');

export { ClerkProvider };
export { clerkPublishableKey };
