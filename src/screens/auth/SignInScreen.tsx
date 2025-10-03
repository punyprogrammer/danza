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

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              {/* Primary Button - Email */}
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={handleEmailSignUp}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Sign Up / Sign In with Email
                </Text>
              </TouchableOpacity>

              {/* Secondary Button - Google */}
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={20} color={Colors.text.primary} style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Sign In with Google
                </Text>
              </TouchableOpacity>

              {/* Secondary Button - Apple (iOS only) */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]}
                  onPress={handleAppleSignIn}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-apple" size={20} color={Colors.text.primary} style={styles.buttonIcon} />
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Sign In with Apple
                  </Text>
                </TouchableOpacity>
              )}
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
  buttonsContainer: {
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.blue.primary,
    shadowColor: Colors.blue.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: Colors.text.primary,
  },
  secondaryButtonText: {
    color: Colors.text.primary,
  },
  buttonIcon: {
    marginRight: 8,
  },
  legalText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
