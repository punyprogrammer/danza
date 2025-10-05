import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Animated, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useSignIn, useOAuth } from '@clerk/clerk-expo';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../styles/colors';
import { userService } from '../../services/userService';
import { AuthLoadingScreen } from '../../components/AuthLoadingScreen';
import * as WebBrowser from 'expo-web-browser';

interface SignInScreenProps {
  onNavigateToSignUp: () => void;
  onSignInSuccess: () => void;
}

interface EmailSignInFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const EmailSignInForm: React.FC<EmailSignInFormProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive } = useSignIn();
  const { setUser } = useAuthStore();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!signIn) {
      Alert.alert('Error', 'Sign in not available');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
        }
        
        // Fetch or create user in Firebase
        try {
          console.log('🔄 Fetching user from Firebase...');
          const firebaseUser = await userService.ensureUserExists(result, 'email');
          const userProfile = userService.convertToUserProfile(firebaseUser);
          setUser(userProfile);
          console.log('✅ User data synced from Firebase');
        } catch (firebaseError) {
          console.error('❌ Error fetching user from Firebase:', firebaseError);
          // Don't block the sign-in flow if Firebase fails
        }
        
        onSuccess();
      } else {
        Alert.alert('Error', 'Sign in failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      Alert.alert('Error', error.errors?.[0]?.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.emailForm}>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.formInput}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.formInput}
      />
      <TouchableOpacity
        style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.signInButtonText}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to OAuth options</Text>
      </TouchableOpacity>
    </View>
  );
};

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onNavigateToSignUp,
  onSignInSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { setLoading } = useAuthStore();
  const { signIn, setActive } = useSignIn();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // OAuth hooks for different providers
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: startFacebookOAuth } = useOAuth({ strategy: 'oauth_facebook' });

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEmailSignIn = () => {
    setShowEmailForm(true);
  };

  const handleGoogleSignIn = async () => {
    console.log('🚀 Starting Google sign in with Clerk...');
    setIsLoading(true);
    setLoading(true);
    
    try {
      if (!startGoogleOAuth) {
        throw new Error('Google OAuth not available');
      }

      // Start the OAuth flow using the useOAuth hook
      const result = await startGoogleOAuth({
        redirectUrl: 'danza://auth0',
      });

             if (result.createdSessionId) {
               // Set active session
               if (setActive) {
                 await setActive({ session: result.createdSessionId });
               }
               
               // Fetch or create user in Firebase
               try {
                 console.log('🔄 Fetching user from Firebase for Google sign-in...');
                 const firebaseUser = await userService.ensureUserExists(result, 'google');
                 const userProfile = userService.convertToUserProfile(firebaseUser);
                 useAuthStore.getState().setUser(userProfile);
                 console.log('✅ User data synced from Firebase for Google sign-in');
               } catch (firebaseError) {
                 console.error('❌ Error fetching user from Firebase for Google:', firebaseError);
                 // Don't block the sign-in flow if Firebase fails
               }
               
               console.log('✅ Clerk Google sign in successful');
               onSignInSuccess();
             } else {
               throw new Error('Google sign in incomplete');
             }
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    console.log('🚀 Starting Apple sign in with Clerk...');
    setIsLoading(true);
    setLoading(true);
    
    try {
      if (!startAppleOAuth) {
        throw new Error('Apple OAuth not available');
      }

      // Start the OAuth flow using the useOAuth hook
      const result = await startAppleOAuth({
        redirectUrl: 'danza://auth0',
      });

             if (result.createdSessionId) {
               // Set active session
               if (setActive) {
                 await setActive({ session: result.createdSessionId });
               }
               
               // Fetch or create user in Firebase
               try {
                 console.log('🔄 Fetching user from Firebase for Apple sign-in...');
                 const firebaseUser = await userService.ensureUserExists(result, 'apple');
                 const userProfile = userService.convertToUserProfile(firebaseUser);
                 useAuthStore.getState().setUser(userProfile);
                 console.log('✅ User data synced from Firebase for Apple sign-in');
               } catch (firebaseError) {
                 console.error('❌ Error fetching user from Firebase for Apple:', firebaseError);
                 // Don't block the sign-in flow if Firebase fails
               }
               
               console.log('✅ Clerk Apple sign in successful');
               onSignInSuccess();
             } else {
               throw new Error('Apple sign in incomplete');
             }
    } catch (error) {
      console.error('❌ Apple sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    console.log('🚀 Starting Facebook sign in with Clerk...');
    setIsLoading(true);
    setLoading(true);
    
    try {
      if (!startFacebookOAuth) {
        throw new Error('Facebook OAuth not available');
      }

      // Start the OAuth flow using the useOAuth hook
      const result = await startFacebookOAuth({
        redirectUrl: 'danza://auth0',
      });

             if (result.createdSessionId) {
               // Set active session
               if (setActive) {
                 await setActive({ session: result.createdSessionId });
               }
               
               // Fetch or create user in Firebase
               try {
                 console.log('🔄 Fetching user from Firebase for Facebook sign-in...');
                 const firebaseUser = await userService.ensureUserExists(result, 'facebook');
                 const userProfile = userService.convertToUserProfile(firebaseUser);
                 useAuthStore.getState().setUser(userProfile);
                 console.log('✅ User data synced from Firebase for Facebook sign-in');
               } catch (firebaseError) {
                 console.error('❌ Error fetching user from Firebase for Facebook:', firebaseError);
                 // Don't block the sign-in flow if Firebase fails
               }
               
               console.log('✅ Clerk Facebook sign in successful');
               onSignInSuccess();
             } else {
               throw new Error('Facebook sign in incomplete');
             }
    } catch (error) {
      console.error('❌ Facebook sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Facebook. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Show loading screen during authentication
  if (isLoading) {
    return <AuthLoadingScreen message="Signing you in..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Top Section - Dancer Image */}
          <View style={styles.imageSection}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
              }}
              style={styles.dancerImage}
              resizeMode="cover"
            />
          </View>

          {/* Bottom Section - UI Elements */}
          <View style={styles.uiSection}>
            {/* Title */}
            <Text style={styles.title}>
              Danza
            </Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Connect with dancers, studios, and events.
            </Text>

            {/* Circular Provider Buttons */}
            <View style={styles.providerButtonsContainer}>
              <View style={styles.providerButtonsRow}>
                {/* Google Button */}
                <TouchableOpacity 
                  style={[styles.providerButton, styles.googleButton]}
                  onPress={handleGoogleSignIn}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>

                {/* Apple Button (iOS only) */}
                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={[styles.providerButton, styles.appleButton]}
                    onPress={handleAppleSignIn}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-apple" size={24} color="#000000" />
                  </TouchableOpacity>
                )}

                {/* Email Button */}
                <TouchableOpacity 
                  style={[styles.providerButton, styles.emailButton]}
                  onPress={handleEmailSignIn}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="mail" size={24} color="#4285F4" />
                </TouchableOpacity>

                {/* Facebook Button */}
                <TouchableOpacity 
                  style={[styles.providerButton, styles.facebookButton]}
                  onPress={handleFacebookSignIn}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Clerk Email Sign In Form */}
            {showEmailForm && (
              <View style={styles.emailFormContainer}>
                <Text style={styles.formTitle}>Sign In with Email</Text>
                <EmailSignInForm 
                  onSuccess={onSignInSuccess}
                  onBack={() => setShowEmailForm(false)}
                />
              </View>
            )}

            {/* Not Registered Link */}
            <View style={styles.notRegisteredContainer}>
              <Text style={styles.notRegisteredText}>
                Not Registered?{' '}
                <Text 
                  style={styles.signUpLink}
                  onPress={onNavigateToSignUp}
                >
                  Sign Up
                </Text>
              </Text>
            </View>

            {/* Legal Text */}
            <Text style={styles.legalText}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    flex: 0.6, // 60% of screen height
  },
  dancerImage: {
    width: '100%',
    height: '100%',
  },
  uiSection: {
    flex: 0.4, // 40% of screen height
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  providerButtonsContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  providerButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  providerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emailButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emailFormContainer: {
    width: '100%',
    marginTop: 20,
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.text.secondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  emailForm: {
    width: '100%',
  },
  formInput: {
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  facebookButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  notRegisteredContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  notRegisteredText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  signUpLink: {
    fontSize: 14,
    color: Colors.blue.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
