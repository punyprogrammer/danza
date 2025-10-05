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
import { Colors } from '../styles/colors';

interface MainScreenProps {
  onSignOut: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onSignOut }) => {
  const { user } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();
  
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
    <LinearGradient
      colors={['#1e40af', '#3b82f6', '#60a5fa']}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={['top']}>
        <AppHeader onSignOut={handleSignOut} />
        <View className="flex-1 px-6 justify-center">
          {/* Header */}
          <View className="items-center mb-8">
            <Ionicons name="musical-notes" size={80} color="#ffffff" />
            <Text className="text-white text-4xl font-bold mt-4 mb-2">
              🎭 Danza
            </Text>
            <Text className="text-white/90 text-xl text-center">
              Welcome to your dance community!
            </Text>
          </View>

          {/* User Info */}
          <View className="bg-white/10 rounded-2xl p-6 mb-8">
            <View className="flex-row items-center mb-4">
              <Ionicons name="person-circle" size={40} color="#ffffff" />
              <View className="ml-4">
                <Text className="text-white text-lg font-semibold">
                  {getUserTypeDisplay(userType)}
                </Text>
                <Text className="text-white/80 text-sm">
                  Profile completed successfully
                </Text>
              </View>
            </View>
            
            <View className="bg-white/10 rounded-xl p-4">
              <Text className="text-white font-medium mb-2">
                What's Next?
              </Text>
              <Text className="text-white/90 text-sm">
                {getUserTypeMessage(userType)}
              </Text>
            </View>
          </View>

          {/* Coming Soon Features */}
          <View className="bg-white/10 rounded-2xl p-6 mb-8">
            <Text className="text-white font-semibold text-lg mb-4">
              Coming Soon:
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="calendar" size={20} color="#ffffff" />
                <Text className="text-white/90 text-sm ml-3">
                  Event Discovery & Booking
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="people" size={20} color="#ffffff" />
                <Text className="text-white/90 text-sm ml-3">
                  Dance Partner Matching
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="chatbubbles" size={20} color="#ffffff" />
                <Text className="text-white/90 text-sm ml-3">
                  Community Chat & Forums
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="map" size={20} color="#ffffff" />
                <Text className="text-white/90 text-sm ml-3">
                  Location-based Event Discovery
                </Text>
              </View>
            </View>
          </View>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};
