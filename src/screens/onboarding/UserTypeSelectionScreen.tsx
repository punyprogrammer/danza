import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { UserTypeCard } from '../../components/ui/UserTypeCard';
import { AppHeader } from '../../components/ui/AppHeader';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

interface UserTypeSelectionScreenProps {
  onContinue: () => void;
}

export const UserTypeSelectionScreen: React.FC<UserTypeSelectionScreenProps> = ({
  onContinue,
}) => {
  const [selectedType, setSelectedType] = useState<'dancer' | 'instructor' | 'organizer' | null>(null);
  const { setUserType } = useOnboardingStore();

  const handleSignOut = () => {
    useAuthStore.getState().reset();
    useOnboardingStore.getState().resetOnboarding();
  };

  const handleContinue = () => {
    if (selectedType) {
      setUserType(selectedType);
      onContinue();
    }
  };

  const userTypes = [
    {
      type: 'dancer' as const,
      title: 'Dancer',
      description: 'Attend dance socials, classes, and find dance partners',
      icon: 'person' as const,
      comingSoon: false,
    },
    {
      type: 'instructor' as const,
      title: 'Instructor',
      description: 'Independent instructors and dance studios',
      icon: 'school' as const,
      comingSoon: true,
    },
    {
      type: 'organizer' as const,
      title: 'Event Organizer',
      description: 'Organize and host dance events and socials',
      icon: 'calendar' as const,
      comingSoon: false,
    },
  ];

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={GlobalStyles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={GlobalStyles.safeArea}>
        <AppHeader onSignOut={handleSignOut} />
        <ScrollView 
          style={GlobalStyles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={[GlobalStyles.title, styles.questionTitle]}>
              Who are you?
            </Text>
            <Text style={[GlobalStyles.bodyText, styles.questionSubtitle]}>
              Select the option that best describes you
            </Text>
          </View>

          {/* User Type Cards */}
          <View style={styles.cardsContainer}>
            {userTypes.map((userType) => (
              <UserTypeCard
                key={userType.type}
                title={userType.title}
                description={userType.description}
                icon={userType.icon}
                isSelected={selectedType === userType.type}
                onPress={() => !userType.comingSoon && setSelectedType(userType.type)}
                comingSoon={userType.comingSoon}
              />
            ))}
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!selectedType}
              style={styles.continueButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  questionContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  cardsContainer: {
    marginBottom: 32,
  },
  buttonContainer: {
    paddingBottom: 24,
  },
  continueButton: {
    marginBottom: 24,
  },
});
