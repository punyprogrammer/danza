import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, Alert, StyleSheet, Animated, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn, useSignUp, useOAuth, useUser } from '@clerk/clerk-expo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../components/ThemeProvider';
import { userService } from '../../services/userService';
import { AuthLoadingScreen } from '../../components/AuthLoadingScreen';
import * as WebBrowser from 'expo-web-browser';

interface SignUpScreenProps {
  onNavigateToSignIn: () => void;
  onSignUpSuccess: () => void;
}

interface EmailSignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const EmailSignUpForm: React.FC<EmailSignUpFormProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, setActive } = useSignUp();
  const { user: clerkUser } = useUser();
  const { setUser } = useAuthStore();

  const handleSignUp = async () => {
    if (!email || !password || !firstName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!signUp) {
      Alert.alert('Error', 'Sign up not available');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
      });

      if (result.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
        }
        
        // Create user in Firebase
        try {
          console.log('🔄 Creating user in Firebase...');
          const firebaseUser = await userService.ensureUserExists(result, 'email');
          const userProfile = userService.convertToUserProfile(firebaseUser);
          setUser(userProfile);
          console.log('✅ User created in Firebase and auth store updated');
        } catch (firebaseError) {
          console.error('❌ Error creating user in Firebase:', firebaseError);
          // Don't block the sign-up flow if Firebase fails
          Alert.alert('Warning', 'Account created but there was an issue syncing data. Please try signing in again.');
        }
        
        onSuccess();
      } else {
        Alert.alert('Error', 'Sign up failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert('Error', error.errors?.[0]?.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.emailForm}>
      <Input
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        style={styles.formInput}
      />
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
        style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.signUpButtonText}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to OAuth options</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigateToSignIn,
  onSignUpSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { setLoading } = useAuthStore();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { user: clerkUser } = useUser();
  const { colors } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // OAuth hooks for different providers
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: startFacebookOAuth } = useOAuth({ strategy: 'oauth_facebook' });
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailShakeAnim] = useState(new Animated.Value(0));
  const [passwordShakeAnim] = useState(new Animated.Value(0));
  const [confirmPasswordShakeAnim] = useState(new Animated.Value(0));
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Shake animation function
  const triggerShakeAnimation = (animValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Handle email change (no validation on change)
  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  // Handle password change (no validation on change)
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
    // Clear confirm password error if passwords now match
    if (confirmPassword.length > 0 && text === confirmPassword && confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  // Handle confirm password change (no validation on change)
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    // Clear error when user starts typing
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  // Handle email blur validation
  const handleEmailBlur = () => {
    if (email.length === 0) {
      setEmailError('Email is required');
      triggerShakeAnimation(emailShakeAnim);
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      triggerShakeAnimation(emailShakeAnim);
    }
  };

  // Handle password focus
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  // Handle password blur validation
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    if (password.length === 0) {
      setPasswordError('Password is required');
      triggerShakeAnimation(passwordShakeAnim);
    } else {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        setPasswordError(validation.errors[0]);
        triggerShakeAnimation(passwordShakeAnim);
      }
    }
  };

  // Handle confirm password blur validation
  const handleConfirmPasswordBlur = () => {
    if (confirmPassword.length === 0) {
      setConfirmPasswordError('Confirm password is required');
      triggerShakeAnimation(confirmPasswordShakeAnim);
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      triggerShakeAnimation(confirmPasswordShakeAnim);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const isEmailValid = email.length > 0 && validateEmail(email);
    const isPasswordValid = password.length > 0 && validatePassword(password).isValid;
    const isConfirmPasswordValid = confirmPassword.length > 0 && confirmPassword === password;
    
    return isEmailValid && isPasswordValid && isConfirmPasswordValid;
  };

  // Password requirements with validation status
  const getPasswordRequirements = () => {
    const requirements = [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'One lowercase letter', met: /[a-z]/.test(password) },
      { text: 'One number', met: /\d/.test(password) },
      { text: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
    return requirements;
  };

  const handleEmailSignUp = () => {
    setShowEmailForm(true);
  };

  const handleGoogleSignUp = async () => {
    console.log('🚀 Starting Google sign up with Clerk...');
    setIsLoading(true);
    setLoading(true);
    
    try {
      if (!startGoogleOAuth) {
        throw new Error('Google OAuth not available');
      }

      // Start the OAuth flow using the useOAuth hook
      const result = await startGoogleOAuth({
        redirectUrl: 'danza://auth0',
        unsafeMetadata: {
          user_type: 'dancer',
          is_onboarded: false,
        },
      });

             if (result.createdSessionId) {
               // Set active session
               if (setSignInActive) {
                 await setSignInActive({ session: result.createdSessionId });
               }
               
        // Create user in Firebase
        try {
          console.log('🔄 Creating user in Firebase for Google sign-up...');
          const firebaseUser = await userService.ensureUserExists(clerkUser, 'google');
          const userProfile = userService.convertToUserProfile(firebaseUser);
          useAuthStore.getState().setUser(userProfile);
          console.log('✅ User created in Firebase for Google sign-up');
        } catch (firebaseError) {
          console.error('❌ Error creating user in Firebase for Google:', firebaseError);
          // Fallback to Clerk data if Firebase fails
          if (clerkUser) {
            const fallbackProfile = {
              id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              name: clerkUser.fullName || clerkUser.username || clerkUser.id,
              avatar_url: clerkUser.imageUrl,
              user_type: (clerkUser.publicMetadata?.userType as 'dancer' | 'organizer' | 'instructor') || 'dancer',
              is_onboarded: (clerkUser.publicMetadata?.isOnboarded as boolean) || false,
              created_at: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
              updated_at: clerkUser.updatedAt ? new Date(clerkUser.updatedAt).toISOString() : new Date().toISOString(),
              last_sign_in_at: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt).toISOString() : undefined,
              is_active: true,
            };
            useAuthStore.getState().setUser(fallbackProfile);
            console.log('⚠️ Using fallback user data from Clerk for Google sign-up');
          }
        }
               
               console.log('✅ Clerk Google sign up successful');
               onSignUpSuccess();
             } else {
               throw new Error('Google sign up incomplete');
             }
    } catch (error) {
      console.error('❌ Google sign up error:', error);
      Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    console.log('🚀 Starting Apple sign up with Clerk...');
    setIsLoading(true);
    setLoading(true);
    
    try {
      if (!startAppleOAuth) {
        throw new Error('Apple OAuth not available');
      }

      // Start the OAuth flow using the useOAuth hook
      const result = await startAppleOAuth({
        redirectUrl: 'danza://auth0',
        unsafeMetadata: {
          user_type: 'dancer',
          is_onboarded: false,
        },
      });

             if (result.createdSessionId) {
               // Set active session
               if (setSignInActive) {
                 await setSignInActive({ session: result.createdSessionId });
               }
               
               // Create user in Firebase
               try {
                 console.log('🔄 Creating user in Firebase for Apple sign-up...');
                 const firebaseUser = await userService.ensureUserExists(clerkUser, 'apple');
                 const userProfile = userService.convertToUserProfile(firebaseUser);
                 useAuthStore.getState().setUser(userProfile);
                 console.log('✅ User created in Firebase for Apple sign-up');
               } catch (firebaseError) {
                 console.error('❌ Error creating user in Firebase for Apple:', firebaseError);
                 // Don't block the sign-up flow if Firebase fails
               }
               
               console.log('✅ Clerk Apple sign up successful');
               onSignUpSuccess();
             } else {
               throw new Error('Apple sign up incomplete');
             }
    } catch (error) {
      console.error('❌ Apple sign up error:', error);
      Alert.alert('Error', 'Failed to sign up with Apple. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    console.log('🚀 Starting Facebook sign up with Clerk...');
    setIsLoading(true);
    setLoading(true);
    
    try {
      if (!startFacebookOAuth) {
        throw new Error('Facebook OAuth not available');
      }

      // Start the OAuth flow using the useOAuth hook
      const result = await startFacebookOAuth({
        redirectUrl: 'danza://auth0',
        unsafeMetadata: {
          user_type: 'dancer',
          is_onboarded: false,
        },
      });

             if (result.createdSessionId) {
               // Set active session
               if (setSignInActive) {
                 await setSignInActive({ session: result.createdSessionId });
               }
               
               // Create user in Firebase
               try {
                 console.log('🔄 Creating user in Firebase for Facebook sign-up...');
                 const firebaseUser = await userService.ensureUserExists(clerkUser, 'facebook');
                 const userProfile = userService.convertToUserProfile(firebaseUser);
                 useAuthStore.getState().setUser(userProfile);
                 console.log('✅ User created in Firebase for Facebook sign-up');
               } catch (firebaseError) {
                 console.error('❌ Error creating user in Firebase for Facebook:', firebaseError);
                 // Don't block the sign-up flow if Firebase fails
               }
               
               console.log('✅ Clerk Facebook sign up successful');
               onSignUpSuccess();
             } else {
               throw new Error('Facebook sign up incomplete');
             }
    } catch (error) {
      console.error('❌ Facebook sign up error:', error);
      Alert.alert('Error', 'Failed to sign up with Facebook. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Show loading screen during authentication
  if (isLoading) {
    return <AuthLoadingScreen message="Creating your account..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style="light" />
      
      {/* Blurred Background Image */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../../assets/sergei-gavrilov-gbd6PqRqGms-unsplash.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={[styles.blurOverlay, { backgroundColor: colors.glass.backdrop }]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Combined Glassmorphism Container */}
            <View style={[styles.combinedCard, { backgroundColor: colors.glass.background, borderColor: colors.glass.border }]}>
              {/* Header Text */}
              <View style={styles.headerSection}>
                <Text style={[styles.title, { color: colors.text.primary }]}>Register with Danza</Text>
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                  Join our dance community today
                </Text>
              </View>

              {/* Circular Provider Buttons */}
              <View style={styles.providerButtonsContainer}>
                <View style={styles.providerButtonsRow}>
                  {/* Google Button */}
                  <TouchableOpacity 
                    style={[styles.providerButton, { backgroundColor: colors.glass.backdrop, borderColor: colors.glass.borderLight }]}
                    onPress={handleGoogleSignUp}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                  </TouchableOpacity>

                  {/* Apple Button (iOS only) */}
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity 
                      style={[styles.providerButton, { backgroundColor: colors.glass.backdrop, borderColor: colors.glass.borderLight }]}
                      onPress={handleAppleSignUp}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="logo-apple" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                  )}

                  {/* Facebook Button */}
                  <TouchableOpacity 
                    style={[styles.providerButton, { backgroundColor: colors.glass.backdrop, borderColor: colors.glass.borderLight }]}
                    onPress={handleFacebookSignUp}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Email Sign Up Button (shown when not showing form) */}
              {!showEmailForm && (
                <TouchableOpacity 
                  style={[styles.emailSignUpButton, { backgroundColor: colors.glass.backdrop, borderColor: colors.glass.borderLight }]}
                  onPress={handleEmailSignUp}
                  activeOpacity={0.8}
                >
                  <Ionicons name="mail-outline" size={24} color={colors.accent.primary} />
                  <Text style={[styles.emailSignUpButtonText, { color: colors.text.primary }]}>Sign up with Email</Text>
                </TouchableOpacity>
              )}

              {/* Clerk Email Sign Up Form */}
              {showEmailForm && (
                <View style={[styles.emailFormContainer, { backgroundColor: colors.glass.background, borderColor: colors.glass.border }]}>
                  <Text style={[styles.formTitle, { color: colors.text.primary }]}>Sign Up with Email</Text>
                  <EmailSignUpForm 
                    onSuccess={onSignUpSuccess}
                    onBack={() => setShowEmailForm(false)}
                  />
                </View>
              )}

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={[styles.signInText, { color: colors.text.secondary }]}>
                  Already have an account?{' '}
                  <Text 
                    style={[styles.signInLink, { color: colors.accent.primary }]}
                    onPress={onNavigateToSignIn}
                  >
                    Sign In
                  </Text>
                </Text>
              </View>

              {/* Legal Text */}
              <Text style={[styles.legalText, { color: colors.text.tertiary }]}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  combinedCard: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  headerSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.9,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
    opacity: 0.8,
  },
  providerButtonsContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  providerButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  providerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  emailFormContainer: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  createAccountButton: {
    marginBottom: 24,
  },
  emailSignUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emailSignUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailForm: {
    width: '100%',
  },
  formInput: {
    marginBottom: 15,
  },
  signUpButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    opacity: 0.8,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  requirementsContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#9E9E9E',
    flex: 1,
  },
  requirementTextMet: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  confirmPasswordContainer: {
    marginTop: 20,
  },
});
