import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../ThemeProvider';

interface AppHeaderProps {
  onSignOut?: () => void;
  onProfilePress?: () => void;
  showThemeToggle?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onSignOut, onProfilePress, showThemeToggle = true }) => {
  const { signOut } = useAuth();
  const { colors } = useTheme();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Clerk
              await signOut();
              
              // Clear auth store
              useAuthStore.getState().reset();
              
              // Call custom sign out handler if provided
              if (onSignOut) {
                onSignOut();
              }
              
              console.log('✅ Successfully signed out');
            } catch (error) {
              console.error('❌ Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary, borderBottomColor: colors.glass.border }]}>
      <View style={styles.leftSection}>
        {/* App Name */}
        <Text style={[styles.appName, { color: colors.text.primary }]}>Danza</Text>
      </View>

      <View style={styles.actionsContainer}>
        {/* Profile Button */}
        <TouchableOpacity 
          style={[styles.profileButton, { 
            backgroundColor: colors.glass.backgroundLight,
            borderColor: colors.glass.borderLight,
            shadowColor: colors.glass.shadow,
          }]} 
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={20} color={colors.text.primary} />
        </TouchableOpacity>

        {/* Theme Toggle Button */}
        {showThemeToggle && (
          <TouchableOpacity 
            style={[styles.themeToggleButton, { 
              backgroundColor: colors.glass.backgroundLight,
              borderColor: colors.glass.borderLight,
              shadowColor: colors.glass.shadow,
            }]} 
            onPress={() => {}} // TODO: Implement theme toggle
            activeOpacity={0.7}
          >
            <Ionicons 
              name="sunny-outline"
              size={20} 
              color={colors.text.primary} 
            />
          </TouchableOpacity>
        )}

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { 
            backgroundColor: colors.glass.backgroundLight,
            borderColor: colors.glass.borderLight,
            shadowColor: colors.glass.shadow,
          }]} 
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 0,
  },
  leftSection: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  themeToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});
