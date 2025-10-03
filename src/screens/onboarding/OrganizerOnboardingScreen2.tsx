import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface OrganizerOnboardingScreen2Props {
  onContinue: () => void;
  onBack: () => void;
}

export const OrganizerOnboardingScreen2: React.FC<OrganizerOnboardingScreen2Props> = ({
  onContinue,
  onBack,
}) => {
  const { organizerData } = useOnboardingStore();

  const handleContinue = () => {
    onContinue();
  };

  return (
    <LinearGradient
      colors={['#1e40af', '#3b82f6', '#60a5fa']}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <Button
              title=""
              onPress={onBack}
              variant="outline"
              icon="arrow-back"
              size="small"
              className="w-10 h-10 p-0 border-white"
            />
            <Text className="text-white text-lg font-semibold">
              Almost Done!
            </Text>
            <View className="w-10" />
          </View>

          {/* Progress Indicator */}
          <View className="flex-row items-center justify-center mb-8">
            <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
              <Text className="text-primary-600 font-bold text-sm">1</Text>
            </View>
            <View className="w-12 h-1 bg-white mx-2" />
            <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
              <Text className="text-primary-600 font-bold text-sm">2</Text>
            </View>
          </View>

          {/* Success Content */}
          <View className="flex-1 justify-center items-center mb-8">
            {/* Success Icon */}
            <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={60} color="#ffffff" />
            </View>
            
            <Text className="text-white text-3xl font-bold mb-4 text-center">
              You're all set!
            </Text>
            
            <Text className="text-white/90 text-xl text-center mb-6">
              Welcome to Danza, {organizerData?.name || 'Organizer'}!
            </Text>
            
            <Text className="text-white/80 text-base text-center leading-6 mb-8">
              Your organizer profile is complete. You can now create events, 
              manage attendees, and grow your dance community.
            </Text>

            {/* Features List */}
            <View className="bg-white/10 rounded-2xl p-6 w-full">
              <Text className="text-white font-semibold text-lg mb-4 text-center">
                What you can do now:
              </Text>
              
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 rounded-full bg-white/20 items-center justify-center mr-3">
                    <Ionicons name="calendar" size={14} color="#ffffff" />
                  </View>
                  <Text className="text-white/90 text-sm flex-1">
                    Create and manage dance events
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-6 h-6 rounded-full bg-white/20 items-center justify-center mr-3">
                    <Ionicons name="people" size={14} color="#ffffff" />
                  </View>
                  <Text className="text-white/90 text-sm flex-1">
                    Track event attendance and manage guest lists
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-6 h-6 rounded-full bg-white/20 items-center justify-center mr-3">
                    <Ionicons name="megaphone" size={14} color="#ffffff" />
                  </View>
                  <Text className="text-white/90 text-sm flex-1">
                    Promote your events to the dance community
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-6 h-6 rounded-full bg-white/20 items-center justify-center mr-3">
                    <Ionicons name="heart" size={14} color="#ffffff" />
                  </View>
                  <Text className="text-white/90 text-sm flex-1">
                    Build and grow your dance community
                  </Text>
                </View>
              </View>
            </View>

            {/* Celebration */}
            <View className="flex-row mt-8">
              <Ionicons name="musical-notes" size={32} color="#ffffff" className="mx-2" />
              <Ionicons name="star" size={32} color="#ffffff" className="mx-2" />
              <Ionicons name="heart" size={32} color="#ffffff" className="mx-2" />
            </View>
          </View>

          {/* Continue Button */}
          <View className="pb-8">
            <Button
              title="Get Started"
              onPress={handleContinue}
              icon="arrow-forward"
              iconPosition="right"
              size="large"
              className="mb-4"
            />
            
            <View className="bg-white/10 rounded-xl p-4">
              <View className="flex-row items-center justify-center mb-2">
                <Ionicons name="information-circle" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-2">
                  Next Steps
                </Text>
              </View>
              <Text className="text-white/90 text-sm text-center">
                You can always update your profile later in the settings. 
                Start by creating your first event and connecting with dancers!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

