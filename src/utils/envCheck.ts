// Environment variables check utility
export const checkEnvironmentVariables = () => {
  console.log('🔍 Environment Variables Check:');
  console.log('================================');
  
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY'
  ];

  let allSet = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value !== 'your-api-key-here' && value !== 'your-project-id') {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Not set or using placeholder`);
      allSet = false;
    }
  });

  console.log('================================');
  console.log(`Overall Status: ${allSet ? '✅ All variables set' : '❌ Some variables missing'}`);
  
  return allSet;
};

export default checkEnvironmentVariables;
