import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LocationPicker } from '../../components/ui/LocationPicker';
import { AppHeader } from '../../components/ui/AppHeader';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../components/ThemeProvider';

interface DancerOnboardingScreen1Props {
  onContinue: () => void;
  onBack: () => void;
}

export const DancerOnboardingScreen1: React.FC<DancerOnboardingScreen1Props> = ({
  onContinue,
  onBack,
}) => {
  const { dancerData, updateDancerData, saveOnboardingData } = useOnboardingStore();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const { colors } = useTheme();

  const handleSignOut = () => {
    useAuthStore.getState().reset();
    useOnboardingStore.getState().resetOnboarding();
  };

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
  
  const [firstName, setFirstName] = useState(dancerData.firstName || '');
  const [lastName, setLastName] = useState(dancerData.lastName || '');
  const [preferredName, setPreferredName] = useState(dancerData.preferredName || '');
  const [gender, setGender] = useState(dancerData.gender || '');
  const [location, setLocation] = useState(dancerData.location || null);
  const [proficiencyLevel, setProficiencyLevel] = useState(dancerData.proficiencyLevel || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const proficiencyOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Amateur', value: 'amateur' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Expert', value: 'expert' },
  ];


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Mandatory fields validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!location || !location.latitude || !location.longitude) {
      newErrors.location = 'Please select your location';
    }

    if (!proficiencyLevel) {
      newErrors.proficiencyLevel = 'Please select your proficiency level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (validateForm()) {
      try {
        // Prepare data to save (filter out empty strings and undefined values)
        const formData: any = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender: gender as 'male' | 'female' | 'other',
          location: location || undefined,
          proficiencyLevel: proficiencyLevel as 'beginner' | 'amateur' | 'intermediate' | 'expert',
        };

        // Only add preferredName if it's not empty
        if (preferredName.trim()) {
          formData.preferredName = preferredName.trim();
        }

        // Update local store
        updateDancerData(formData);

        // Save to Firebase
        await saveOnboardingData(formData, 1);

        // Add exit animation before continuing
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
          onContinue();
        });
      } catch (error) {
        console.error('❌ Error saving onboarding data:', error);
        // Still continue to next screen even if Firebase save fails
        onContinue();
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style="light" />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.primary }]}>
        <AppHeader onSignOut={handleSignOut} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.container, { backgroundColor: colors.background.primary }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              Personal Details
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Form Fields */}
              <View style={styles.formContainer}>
                <Input
                  label="First Name *"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  error={errors.firstName}
                  style={styles.input}
                />
                
                <Input
                  label="Last Name *"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  error={errors.lastName}
                  style={styles.input}
                />
                
                <Input
                  label="Preferred Name"
                  placeholder="What should we call you? (Optional)"
                  value={preferredName}
                  onChangeText={setPreferredName}
                  error={errors.preferredName}
                  style={styles.input}
                />
                
                <Select
                  label="Gender *"
                  placeholder="Select your gender"
                  value={gender}
                  onSelect={setGender}
                  options={genderOptions}
                  error={errors.gender}
                  style={styles.select}
                />
                
                <LocationPicker
                  label="Location *"
                  value={location}
                  onLocationSelect={setLocation}
                  error={errors.location}
                  style={styles.input}
                />
                
                <Select
                  label="Proficiency Level *"
                  placeholder="Select your dance level"
                  value={proficiencyLevel}
                  onSelect={setProficiencyLevel}
                  options={proficiencyOptions}
                  error={errors.proficiencyLevel}
                  style={styles.select}
                />
              </View>

              {/* Next Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.nextButton, { 
                    backgroundColor: colors.accent.primary,
                    shadowColor: colors.accent.primary,
                  }]}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.nextButtonText, { color: colors.text.inverse }]}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  formContainer: {
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  select: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonContainer: {
    paddingBottom: 24,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
