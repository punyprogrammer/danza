import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { AppHeader } from '../components/ui/AppHeader';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { OrganizerNavigator } from '../navigation/OrganizerNavigator';
import { DancerNavigator } from '../navigation/DancerNavigator';
import { useTheme } from '../components/ThemeProvider';

interface MainScreenProps {
  onSignOut: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onSignOut }) => {
  const { user } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();
  const { colors } = useTheme();
  
  const userType = user?.user_type as 'dancer' | 'organizer' | 'instructor';
  
  // Debug logging
  console.log('🎯 MainScreen - User type check:');
  console.log('User object:', user);
  console.log('User type:', userType);
  console.log('User is_onboarded:', user?.is_onboarded);
  console.log('🎯 MainScreen - Navigation decision:');
  console.log('Will show organizer nav?', userType === 'organizer');
  console.log('Will show dancer nav?', userType === 'dancer');

  const handleSignOut = () => {
    resetOnboarding();
    onSignOut();
  };

  const getUserTypeDisplay = (type: string | undefined) => {
    switch (type) {
      case 'dancer': return 'Dancer';
      case 'organizer': return 'Organizer';
      case 'instructor': return 'Instructor';
      default: return 'User';
    }
  };

  const getUserTypeMessage = (type: string | undefined) => {
    switch (type) {
      case 'dancer': return 'Start exploring dance events, find partners, and connect with the community!';
      case 'organizer': return 'Create your first event and start building your dance community!';
      case 'instructor': return 'Start teaching dance classes and building your student community!';
      default: return 'Welcome to your dance community!';
    }
  };

  // Show organizer navigation for organizers
  if (userType === 'organizer') {
    return <OrganizerNavigator />;
  }

  // Show dancer navigation for dancers
  if (userType === 'dancer') {
    return <DancerNavigator />;
  }

  // Default main screen for other user types
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style={colors.background.primary === '#FFFFFF' ? 'dark' : 'light'} />
      <SafeAreaView className="flex-1" edges={['top']}>
        <AppHeader onSignOut={handleSignOut} onProfilePress={() => {}} />
        <View className="flex-1 px-6 justify-center">
          {/* Header */}
          <View className="items-center mb-8">
            <Ionicons name="musical-notes" size={80} color={colors.accent.primary} />
            <Text style={{ color: colors.text.primary }} className="text-4xl font-bold mt-4 mb-2">
              🎭 Danza
            </Text>
            <Text style={{ color: colors.text.secondary }} className="text-xl text-center">
              Welcome to your dance community!
            </Text>
          </View>

          {/* User Info */}
          <View style={{ backgroundColor: colors.background.card, borderRadius: 16, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: colors.glass.border }}>
            <View className="flex-row items-center mb-4">
              <Ionicons name="person-circle" size={40} color={colors.accent.primary} />
              <View className="ml-4">
                <Text style={{ color: colors.text.primary }} className="text-lg font-semibold">
                  {getUserTypeDisplay(userType)}
                </Text>
                <Text style={{ color: colors.text.secondary }} className="text-sm">
                  Profile completed successfully
                </Text>
              </View>
            </View>
            
            <View style={{ backgroundColor: colors.background.secondary, borderRadius: 12, padding: 16 }}>
              <Text style={{ color: colors.text.primary }} className="font-medium mb-2">
                What's Next?
              </Text>
              <Text style={{ color: colors.text.secondary }} className="text-sm">
                {getUserTypeMessage(userType)}
              </Text>
            </View>
          </View>

          {/* Coming Soon Features */}
          <View style={{ backgroundColor: colors.background.card, borderRadius: 16, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: colors.glass.border }}>
            <Text style={{ color: colors.text.primary }} className="font-semibold text-lg mb-4">
              Coming Soon:
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="calendar" size={20} color={colors.accent.primary} />
                <Text style={{ color: colors.text.secondary }} className="text-sm ml-3">
                  Event Discovery & Booking
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="people" size={20} color={colors.accent.primary} />
                <Text style={{ color: colors.text.secondary }} className="text-sm ml-3">
                  Dance Partner Matching
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="chatbubbles" size={20} color={colors.accent.primary} />
                <Text style={{ color: colors.text.secondary }} className="text-sm ml-3">
                  Community Chat & Forums
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="map" size={20} color={colors.accent.primary} />
                <Text style={{ color: colors.text.secondary }} className="text-sm ml-3">
                  Location-based Event Discovery
                </Text>
              </View>
            </View>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
};
