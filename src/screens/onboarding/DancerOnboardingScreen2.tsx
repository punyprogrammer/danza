import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ImagePicker } from '../../components/ui/ImagePicker';
import { MultiImagePicker } from '../../components/ui/MultiImagePicker';
import { VideoPicker } from '../../components/ui/VideoPicker';
import { UploadLoader } from '../../components/ui/UploadLoader';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';
import { storageService } from '../../services/storageService';
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
  const { dancerData, updateDancerData, saveOnboardingData, completeOnboarding } = useOnboardingStore();
  const { user } = useAuthStore();
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
  const [additionalVideo, setAdditionalVideo] = useState<string | null>(dancerData.additionalVideos?.[0] || null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Profile picture is mandatory
    if (!profilePicture.trim()) {
      newErrors.profilePicture = 'Profile picture is required';
    }

    // Bio must be at least 60 characters
    if (!bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (bio.trim().length < 60) {
      newErrors.bio = 'Bio must be at least 60 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadMediaToFirebase = async (): Promise<{ profilePicture: string; additionalPhotos: string[]; additionalVideo?: string }> => {
    if (!user?.id) {
      throw new Error('User ID not found');
    }

    const uploadResults = {
      profilePicture: profilePicture,
      additionalPhotos: [] as string[],
      additionalVideo: undefined as string | undefined,
    };

    let totalFiles = 1; // profile picture
    if (additionalPhotos.length > 0) totalFiles += additionalPhotos.length;
    if (additionalVideo) totalFiles += 1;
    
    let uploadedFiles = 0;

    // Upload profile picture
    if (profilePicture) {
      setUploadMessage('Uploading profile picture...');
      const profilePath = storageService.generateUserMediaPath(user.id, 'profile');
      const profileResult = await storageService.uploadFile({ uri: profilePicture }, profilePath);
      uploadResults.profilePicture = profileResult.url;
      uploadedFiles++;
      setUploadProgress((uploadedFiles / totalFiles) * 100);
    }

    // Upload additional photos
    if (additionalPhotos.length > 0) {
      setUploadMessage('Uploading additional photos...');
      const photoPromises = additionalPhotos.map(async (photoUri) => {
        const photoPath = storageService.generateUserMediaPath(user.id, 'photos');
        const photoResult = await storageService.uploadFile({ uri: photoUri }, photoPath);
        uploadedFiles++;
        setUploadProgress((uploadedFiles / totalFiles) * 100);
        return photoResult.url;
      });
      uploadResults.additionalPhotos = await Promise.all(photoPromises);
    }

    // Upload additional video
    if (additionalVideo) {
      setUploadMessage('Uploading video...');
      const videoPath = storageService.generateUserMediaPath(user.id, 'videos');
      const videoResult = await storageService.uploadFile({ uri: additionalVideo }, videoPath);
      uploadResults.additionalVideo = videoResult.url;
      uploadedFiles++;
      setUploadProgress((uploadedFiles / totalFiles) * 100);
    }

    return uploadResults;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadMessage('Preparing upload...');

      // Upload media to Firebase Storage
      const mediaUrls = await uploadMediaToFirebase();

      // Prepare data to save
      const formData = {
        bio: bio.trim(),
        profilePicture: mediaUrls.profilePicture,
        additionalPhotos: mediaUrls.additionalPhotos,
        additionalVideos: mediaUrls.additionalVideo ? [mediaUrls.additionalVideo] : [],
      };

      setUploadMessage('Saving profile data...');
      setUploadProgress(95);

      // Update local store
      updateDancerData(formData);

      // Save to Firebase
      await saveOnboardingData(formData, 2);

      setUploadProgress(100);
      setUploadMessage('Complete!');

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsUploading(false);

      // Mark onboarding as complete
      await completeOnboarding();

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
      setIsUploading(false);
      Alert.alert('Upload Error', 'Failed to upload media. Please try again.');
    }
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
                  label="Profile Picture *"
                  value={profilePicture}
                  onImageSelect={setProfilePicture}
                  maxSizeMB={10}
                  error={errors.profilePicture}
                />
                
                <View style={styles.bioContainer}>
                  <View style={[GlobalStyles.spaceBetween, styles.bioHeader]}>
                    <Text style={[GlobalStyles.label, styles.bioLabel]}>
                      Bio * ({bio.length}/60 min characters)
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
                    placeholder="Tell us about yourself, your dance journey, and what you're looking for... (minimum 60 characters)"
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                    error={errors.bio}
                    style={styles.bioInput}
                  />
                </View>
                
                <MultiImagePicker
                  label="Additional Photos (Optional)"
                  value={additionalPhotos}
                  onImagesSelect={setAdditionalPhotos}
                  maxImages={2}
                  maxSizeMB={10}
                />
                
                <VideoPicker
                  label="Additional Video (Optional)"
                  value={additionalVideo}
                  onVideoSelect={setAdditionalVideo}
                  maxSizeMB={10}
                />
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
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
      {/* Upload Loader */}
      <UploadLoader
        visible={isUploading}
        progress={uploadProgress}
        message={uploadMessage}
        subMessage="Please don't close the app during upload"
      />
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
  bioInput: {
    minHeight: 100,
  },
  aiButton: {
    borderColor: Colors.glass.border,
  },
  buttonContainer: {
    paddingBottom: 24,
  },
  continueButton: {
    marginBottom: 24,
  },
});
