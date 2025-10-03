import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, Alert, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../stores/authStore';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

interface SignUpScreenProps {
  onNavigateToSignIn: () => void;
  onSignUpSuccess: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigateToSignIn,
  onSignUpSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setLoading } = useAuthStore();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
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

  const handleEmailSignUp = async () => {
    // Validate all fields
    let hasErrors = false;
    
    // Check for empty fields
    if (!email) {
      setEmailError('Email is required');
      triggerShakeAnimation(emailShakeAnim);
      hasErrors = true;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      triggerShakeAnimation(passwordShakeAnim);
      hasErrors = true;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      triggerShakeAnimation(confirmPasswordShakeAnim);
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      triggerShakeAnimation(emailShakeAnim);
      hasErrors = true;
    }

    // Validate password requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0]);
      triggerShakeAnimation(passwordShakeAnim);
      hasErrors = true;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      triggerShakeAnimation(confirmPasswordShakeAnim);
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Add exit animation before sign up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLoading(true);
      setLoading(true);
      
      // TODO: Implement Firebase email sign up
      console.log('Sign up with email:', email);
      // Simulate API call
      setTimeout(() => {
        // Mock user data for testing
        const mockUser = {
          id: '1',
          email: email,
          userType: 'dancer' as const,
          isOnboarded: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Set user in auth store
        useAuthStore.getState().setUser(mockUser);
        onSignUpSuccess();
        setIsLoading(false);
        setLoading(false);
      }, 1000);
    });
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      // TODO: Implement Google sign up
      console.log('Sign up with Google');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for testing
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        userType: 'dancer' as const,
        isOnboarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Set user in auth store
      useAuthStore.getState().setUser(mockUser);
      onSignUpSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      // TODO: Implement Apple sign up
      console.log('Sign up with Apple');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for testing
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        userType: 'dancer' as const,
        isOnboarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Set user in auth store
      useAuthStore.getState().setUser(mockUser);
      onSignUpSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up with Apple. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      // TODO: Implement Facebook sign up
      console.log('Sign up with Facebook');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for testing
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        userType: 'dancer' as const,
        isOnboarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Set user in auth store
      useAuthStore.getState().setUser(mockUser);
      onSignUpSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up with Facebook. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleInstagramSignUp = async () => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      // TODO: Implement Instagram sign up
      console.log('Sign up with Instagram');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for testing
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        userType: 'dancer' as const,
        isOnboarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Set user in auth store
      useAuthStore.getState().setUser(mockUser);
      onSignUpSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up with Instagram. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6', '#60A5FA']}
      style={GlobalStyles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={GlobalStyles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={GlobalStyles.container}
        >
          <Animated.View 
            style={[
              GlobalStyles.container,
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Header */}
            <View style={[GlobalStyles.centerContent, styles.header]}>
              <Text style={[GlobalStyles.title, styles.registerTitle]}>
                Register with
              </Text>
            </View>

            {/* Social Sign Up Options */}
            <View style={styles.socialButtonsContainer}>
              <View style={styles.providerButtonsRow}>
                {/* Google Button */}
                <TouchableOpacity 
                  style={[styles.providerButton, styles.googleButton]}
                  onPress={handleGoogleSignUp}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>

                {/* Apple Button (iOS only) */}
                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={[styles.providerButton, styles.appleButton]}
                    onPress={handleAppleSignUp}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-apple" size={24} color="#000000" />
                  </TouchableOpacity>
                )}

                {/* Facebook Button */}
                <TouchableOpacity 
                  style={[styles.providerButton, styles.facebookButton]}
                  onPress={handleFacebookSignUp}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={[GlobalStyles.divider, styles.divider]}>
              <View style={GlobalStyles.dividerLine} />
              <Text style={GlobalStyles.dividerText}>or</Text>
              <View style={GlobalStyles.dividerLine} />
            </View>

            {/* Email Sign Up */}
            <View style={styles.formContainer}>
              <Animated.View style={{ transform: [{ translateX: emailShakeAnim }] }}>
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={handleEmailBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {emailError ? (
                  <Animated.Text style={styles.errorText}>
                    {emailError}
                  </Animated.Text>
                ) : null}
              </Animated.View>
              
              <Animated.View style={{ transform: [{ translateX: passwordShakeAnim }] }}>
                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  secureTextEntry={!showPassword}
                  rightIcon={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
                {passwordError ? (
                  <Animated.Text style={styles.errorText}>
                    {passwordError}
                  </Animated.Text>
                ) : null}
                
                {/* Password Requirements */}
                {isPasswordFocused && password.length > 0 && (
                  <Animated.View style={styles.requirementsContainer}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    {getPasswordRequirements().map((req, index) => (
                      <Animated.View key={index} style={styles.requirementItem}>
                        <Ionicons 
                          name={req.met ? "checkmark-circle" : "ellipse-outline"} 
                          size={16} 
                          color={req.met ? "#4CAF50" : "#9E9E9E"} 
                          style={styles.requirementIcon}
                        />
                        <Text style={[
                          styles.requirementText,
                          req.met && styles.requirementTextMet
                        ]}>
                          {req.text}
                        </Text>
                      </Animated.View>
                    ))}
                  </Animated.View>
                )}
              </Animated.View>
              
              <Animated.View style={[
                { transform: [{ translateX: confirmPasswordShakeAnim }] },
                styles.confirmPasswordContainer
              ]}>
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  secureTextEntry={!showConfirmPassword}
                  rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                {confirmPasswordError ? (
                  <Animated.Text style={styles.errorText}>
                    {confirmPasswordError}
                  </Animated.Text>
                ) : null}
              </Animated.View>
            </View>

            <Button
              title="Create Account"
              onPress={handleEmailSignUp}
              disabled={isLoading || !isFormValid()}
              loading={isLoading}
              style={styles.createAccountButton}
            />

            {/* Sign In Link */}
            <View style={[GlobalStyles.centerContent, styles.signInContainer]}>
              <Text style={[GlobalStyles.bodyText, styles.signInText]}>
                Already have an account?{' '}
                <Text 
                  style={[GlobalStyles.bodyText, styles.signInLink]}
                  onPress={onNavigateToSignIn}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  registerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    marginBottom: 24,
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
  facebookButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  divider: {
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 24,
  },
  createAccountButton: {
    marginBottom: 24,
  },
  signInContainer: {
    marginTop: 16,
  },
  signInText: {
    fontSize: 14,
    opacity: 0.8,
  },
  signInLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
    opacity: 1,
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
    color: Colors.text.primary,
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
