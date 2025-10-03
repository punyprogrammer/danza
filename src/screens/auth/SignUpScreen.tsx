import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, Alert, StyleSheet, Animated } from 'react-native';
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

  const handleEmailSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
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
              <View style={styles.logoContainer}>
                <Ionicons name="musical-notes" size={60} color={Colors.text.primary} />
              </View>
              <Text style={[GlobalStyles.title, styles.appTitle]}>
                🎭 Danza
              </Text>
              <Text style={[GlobalStyles.bodyText, styles.subtitle]}>
                Join the dance community
              </Text>
            </View>

            {/* Social Sign Up Options */}
            <View style={styles.socialButtonsContainer}>
              {Platform.OS === 'ios' && (
                <Button
                  title="Continue with Apple"
                  onPress={handleAppleSignUp}
                  variant="social"
                  icon="logo-apple"
                  disabled={isLoading}
                  style={styles.socialButton}
                />
              )}
              
              <Button
                title="Continue with Google"
                onPress={handleGoogleSignUp}
                variant="social"
                icon="logo-google"
                disabled={isLoading}
                style={styles.socialButton}
              />
              
              <Button
                title="Continue with Facebook"
                onPress={handleFacebookSignUp}
                variant="social"
                icon="logo-facebook"
                disabled={isLoading}
                style={styles.socialButton}
              />
              
              <Button
                title="Continue with Instagram"
                onPress={handleInstagramSignUp}
                variant="social"
                icon="logo-instagram"
                disabled={isLoading}
                style={styles.socialButton}
              />
            </View>

            {/* Divider */}
            <View style={[GlobalStyles.divider, styles.divider]}>
              <View style={GlobalStyles.dividerLine} />
              <Text style={GlobalStyles.dividerText}>or</Text>
              <View style={GlobalStyles.dividerLine} />
            </View>

            {/* Email Sign Up */}
            <View style={styles.formContainer}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <Button
              title="Create Account"
              onPress={handleEmailSignUp}
              disabled={isLoading}
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
  logoContainer: {
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.9,
  },
  socialButtonsContainer: {
    marginBottom: 24,
  },
  socialButton: {
    marginBottom: 12,
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
});
