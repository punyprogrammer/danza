import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ImagePicker } from '../../components/ui/ImagePicker';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

interface DancerOnboardingScreen2Props {
  onContinue: () => void;
  onBack: () => void;
}

export const DancerOnboardingScreen2: React.FC<DancerOnboardingScreen2Props> = ({
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
  
  const [bio, setBio] = useState(dancerData.bio || '');
  const [profilePicture, setProfilePicture] = useState(dancerData.profilePicture || '');
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>(dancerData.additionalPhotos || []);
  const [additionalVideos, setAdditionalVideos] = useState<string[]>(dancerData.additionalVideos || []);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const generateBioWithAI = async () => {
    setIsGeneratingBio(true);
    
    try {
      // TODO: Implement AI bio generation
      // This would typically call an AI service to generate a bio based on user data
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const generatedBio = `Hi! I'm ${dancerData.preferredName || 'a dancer'} and I love to dance. I'm at ${dancerData.proficiencyLevel || 'beginner'} level and enjoy connecting with the dance community. Looking forward to meeting new dance partners and attending amazing events!`;
      
      setBio(generatedBio);
      Alert.alert('Bio Generated', 'Your AI-generated bio has been created! You can edit it if needed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate bio. Please try again.');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleContinue = () => {
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
        bio: bio.trim(),
        profilePicture,
        additionalPhotos,
        additionalVideos,
      });
      onContinue();
    });
  };

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={GlobalStyles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={GlobalStyles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={GlobalStyles.container}
        >
          {/* Header */}
          <View style={[GlobalStyles.header, styles.header]}>
            <Button
              title=""
              onPress={onBack}
              variant="outline"
              icon="arrow-back"
              size="small"
              style={styles.backButton}
            />
            <Text style={[GlobalStyles.headerTitle, styles.headerTitle]}>
              Complete Your Profile
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <Animated.View 
            style={[
              GlobalStyles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <ScrollView 
              style={GlobalStyles.container}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Progress Indicator */}
              <View style={[GlobalStyles.progressContainer, styles.progressContainer]}>
                <View style={[GlobalStyles.progressStep, styles.progressStep]}>
                  <Text style={[GlobalStyles.progressStepText, styles.progressStepText]}>1</Text>
                </View>
                <View style={GlobalStyles.progressLineActive} />
                <View style={[GlobalStyles.progressStep, styles.progressStep]}>
                  <Text style={[GlobalStyles.progressStepText, styles.progressStepText]}>2</Text>
                </View>
                <View style={GlobalStyles.progressLine} />
                <View style={[GlobalStyles.progressStepInactive, styles.progressStepInactive]}>
                  <Text style={[GlobalStyles.progressStepTextInactive, styles.progressStepTextInactive]}>3</Text>
                </View>
              </View>

              {/* Title */}
              <View style={styles.titleContainer}>
                <Text style={[GlobalStyles.title, styles.title]}>
                  Add your photos & bio
                </Text>
                <Text style={[GlobalStyles.bodyText, styles.subtitle]}>
                  Help others get to know you better
                </Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formContainer}>
                <ImagePicker
                  label="Profile Picture"
                  value={profilePicture}
                  onImageSelect={setProfilePicture}
                  maxSizeMB={10}
                />
                
                <View style={styles.bioContainer}>
                  <View style={[GlobalStyles.spaceBetween, styles.bioHeader]}>
                    <Text style={[GlobalStyles.label, styles.bioLabel]}>
                      Bio
                    </Text>
                    <Button
                      title={isGeneratingBio ? "Generating..." : "Generate with AI"}
                      onPress={generateBioWithAI}
                      variant="outline"
                      size="small"
                      disabled={isGeneratingBio}
                      loading={isGeneratingBio}
                      icon="sparkles"
                      style={styles.aiButton}
                    />
                  </View>
                  <Input
                    placeholder="Tell us about yourself, your dance journey, and what you're looking for..."
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                  />
                </View>
                
                <View style={styles.mediaContainer}>
                  <Text style={[GlobalStyles.label, styles.mediaLabel]}>
                    Additional Photos (Optional)
                  </Text>
                  <View style={[GlobalStyles.glassInput, styles.mediaPlaceholder]}>
                    <View style={styles.mediaPlaceholderContent}>
                      <View style={styles.mediaIconContainer}>
                        <Ionicons name="images" size={24} color={Colors.text.placeholder} />
                      </View>
                      <Text style={styles.mediaPlaceholderText}>
                        Add Photos
                      </Text>
                      <Text style={styles.mediaPlaceholderSubtext}>
                        Max 10MB per photo
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.mediaContainer}>
                  <Text style={[GlobalStyles.label, styles.mediaLabel]}>
                    Additional Videos (Optional)
                  </Text>
                  <View style={[GlobalStyles.glassInput, styles.mediaPlaceholder]}>
                    <View style={styles.mediaPlaceholderContent}>
                      <View style={styles.mediaIconContainer}>
                        <Ionicons name="videocam" size={24} color={Colors.text.placeholder} />
                      </View>
                      <Text style={styles.mediaPlaceholderText}>
                        Add Videos
                      </Text>
                      <Text style={styles.mediaPlaceholderSubtext}>
                        Max 10MB per video
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Continue Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Continue"
                  onPress={handleContinue}
                  icon="arrow-forward"
                  iconPosition="right"
                  style={styles.continueButton}
                />
                
                <View style={[GlobalStyles.glassCard, styles.infoCard]}>
                  <View style={[GlobalStyles.row, styles.infoHeader]}>
                    <Ionicons name="information-circle" size={20} color={Colors.text.primary} />
                    <Text style={[GlobalStyles.bodyText, styles.infoTitle]}>
                      Tips for a great profile:
                    </Text>
                  </View>
                  <Text style={[GlobalStyles.bodyText, styles.infoText]}>
                    • A clear profile picture helps others recognize you{'\n'}
                    • Share your dance journey and what you're passionate about{'\n'}
                    • Mention your favorite dance styles and what you're looking for{'\n'}
                    • Additional photos and videos showcase your personality
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    padding: 0,
    borderColor: Colors.glass.border,
  },
  headerTitle: {
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressStep: {
    backgroundColor: Colors.blue.primary,
  },
  progressStepInactive: {
    backgroundColor: Colors.glass.light,
  },
  progressStepText: {
    color: Colors.text.primary,
  },
  progressStepTextInactive: {
    color: Colors.text.secondary,
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  formContainer: {
    marginBottom: 32,
  },
  bioContainer: {
    marginBottom: 24,
  },
  bioHeader: {
    marginBottom: 8,
  },
  bioLabel: {
    flex: 1,
  },
  aiButton: {
    borderColor: Colors.glass.border,
  },
  mediaContainer: {
    marginBottom: 20,
  },
  mediaLabel: {
    marginBottom: 8,
  },
  mediaPlaceholder: {
    padding: 20,
  },
  mediaPlaceholderContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mediaIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.glass.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaPlaceholderText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  mediaPlaceholderSubtext: {
    fontSize: 12,
    color: Colors.text.placeholder,
  },
  buttonContainer: {
    paddingBottom: 24,
  },
  continueButton: {
    marginBottom: 24,
  },
  infoCard: {
    padding: 20,
    backgroundColor: Colors.glass.light,
  },
  infoHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
});
