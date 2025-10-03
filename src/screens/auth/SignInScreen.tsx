import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Animated, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../styles/colors';

interface SignInScreenProps {
  onNavigateToSignUp: () => void;
  onSignInSuccess: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onNavigateToSignUp,
  onSignInSuccess,
}) => {
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
    setIsLoading(true);
    setLoading(true);
    
    try {
      // TODO: Implement email sign up/sign in
      console.log('Sign Up / Sign In with Email');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNavigateToSignUp();
    } catch (error) {
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      // TODO: Implement Google sign in
      console.log('Sign in with Google');
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
      onSignInSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      // TODO: Implement Apple sign in
      console.log('Sign in with Apple');
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
      onSignInSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      // TODO: Implement Facebook sign in
      console.log('Sign in with Facebook');
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
      onSignInSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Facebook. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

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
                uri: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
              }}
              style={styles.dancerImage}
              resizeMode="cover"
            />
          </View>

          {/* Bottom Section - UI Elements */}
          <View style={styles.uiSection}>
            {/* Title */}
            <Text style={styles.title}>
              Find your rhythm
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
                  onPress={handleEmailSignUp}
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
