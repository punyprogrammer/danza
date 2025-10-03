import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LocationPicker } from '../../components/ui/LocationPicker';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { Colors } from '../../styles/colors';

interface DancerOnboardingScreen1Props {
  onContinue: () => void;
  onBack: () => void;
}

export const DancerOnboardingScreen1: React.FC<DancerOnboardingScreen1Props> = ({
  onContinue,
  onBack,
}) => {
  const { dancerData, updateDancerData } = useOnboardingStore();
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
  
  const [firstName, setFirstName] = useState(dancerData.firstName || '');
  const [lastName, setLastName] = useState(dancerData.lastName || '');
  const [preferredName, setPreferredName] = useState(dancerData.preferredName || '');
  const [gender, setGender] = useState(dancerData.gender || '');
  const [danceStyles, setDanceStyles] = useState<string[]>((dancerData as any).danceStyles || []);
  const [zipCode, setZipCode] = useState((dancerData as any).zipCode || '');
  const [proficiencyLevel, setProficiencyLevel] = useState(dancerData.proficiencyLevel || '');
  const [role, setRole] = useState((dancerData as any).role || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const danceStyleOptions = [
    'Salsa', 'Bachata', 'Tango', 'Waltz', 'Cha-Cha', 'Rumba', 'Swing', 'Hip-Hop', 'Contemporary', 'Ballet'
  ];

  const proficiencyOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Amateur', value: 'amateur' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Expert', value: 'expert' },
  ];

  const roleOptions = [
    { label: 'Lead', value: 'lead' },
    { label: 'Follow', value: 'follow' },
    { label: 'Both', value: 'both' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!preferredName.trim()) {
      newErrors.preferredName = 'Preferred name is required';
    }

    if (!gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }

    if (!proficiencyLevel) {
      newErrors.proficiencyLevel = 'Please select your proficiency level';
    }

    if (!role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleDanceStyle = (style: string) => {
    setDanceStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleContinue = () => {
    if (validateForm()) {
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
        updateDancerData({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          preferredName: preferredName.trim(),
          gender: gender as 'male' | 'female' | 'other',
          danceStyles,
          zipCode: zipCode.trim(),
          proficiencyLevel: proficiencyLevel as 'beginner' | 'amateur' | 'intermediate' | 'expert',
          role: role as 'lead' | 'follow' | 'both',
        } as any);
        onContinue();
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
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
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  error={errors.firstName}
                  style={styles.input}
                />
                
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  error={errors.lastName}
                  style={styles.input}
                />
                
                <Input
                  label="Preferred Name"
                  placeholder="What should we call you?"
                  value={preferredName}
                  onChangeText={setPreferredName}
                  error={errors.preferredName}
                  style={styles.input}
                />
                
                <Select
                  label="Gender"
                  placeholder="Select your gender"
                  value={gender}
                  onSelect={setGender}
                  options={genderOptions}
                  error={errors.gender}
                  style={styles.select}
                />
                
                {/* Dance Style Tags */}
                <View style={styles.danceStylesContainer}>
                  <Text style={styles.label}>Dance Styles</Text>
                  <View style={styles.tagsContainer}>
                    {danceStyleOptions.slice(0, 6).map((style) => (
                      <TouchableOpacity
                        key={style}
                        style={[
                          styles.tag,
                          danceStyles.includes(style) && styles.selectedTag
                        ]}
                        onPress={() => toggleDanceStyle(style)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.tagText,
                          danceStyles.includes(style) && styles.selectedTagText
                        ]}>
                          {style}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <Input
                  label="Zip Code"
                  placeholder="Enter your zip code"
                  value={zipCode}
                  onChangeText={setZipCode}
                  error={errors.zipCode}
                  keyboardType="numeric"
                  style={styles.input}
                />
                
                <Select
                  label="Proficiency Level"
                  placeholder="Select your dance level"
                  value={proficiencyLevel}
                  onSelect={setProficiencyLevel}
                  options={proficiencyOptions}
                  error={errors.proficiencyLevel}
                  style={styles.select}
                />
                
                {/* Role Selection */}
                <View style={styles.roleContainer}>
                  <Text style={styles.label}>Role</Text>
                  <View style={styles.roleButtonsContainer}>
                    {roleOptions.map((roleOption) => (
                      <TouchableOpacity
                        key={roleOption.value}
                        style={[
                          styles.roleButton,
                          role === roleOption.value && styles.selectedRoleButton
                        ]}
                        onPress={() => setRole(roleOption.value)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.roleButtonText,
                          role === roleOption.value && styles.selectedRoleButtonText
                        ]}>
                          {roleOption.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Next Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.nextButton}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextButtonText}>
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
    backgroundColor: Colors.background.primary,
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
    color: Colors.text.primary,
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
    color: Colors.text.primary,
    marginBottom: 12,
  },
  danceStylesContainer: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  selectedTag: {
    backgroundColor: Colors.blue.primary,
    borderColor: Colors.blue.primary,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  selectedTagText: {
    color: Colors.text.primary,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
  },
  selectedRoleButton: {
    backgroundColor: Colors.blue.primary,
    borderColor: Colors.blue.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  selectedRoleButtonText: {
    color: Colors.text.primary,
  },
  buttonContainer: {
    paddingBottom: 24,
  },
  nextButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.blue.primary,
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
    color: Colors.text.primary,
  },
});
