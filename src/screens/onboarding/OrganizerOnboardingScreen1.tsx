import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Animated, TouchableOpacity, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { Input } from '../../components/ui/Input';
import { AppHeader } from '../../components/ui/AppHeader';
import { LocationPicker } from '../../components/ui/LocationPicker';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../styles/colors';

interface OrganizerOnboardingScreen1Props {
  onContinue: () => void;
  onBack: () => void;
}

export const OrganizerOnboardingScreen1: React.FC<OrganizerOnboardingScreen1Props> = ({
  onContinue,
  onBack,
}) => {
  const { organizerData, updateOrganizerData, saveOnboardingData, completeOnboarding } = useOnboardingStore();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const handleSignOut = () => {
    useAuthStore.getState().reset();
    useOnboardingStore.getState().resetOnboarding();
  };
  
  const [name, setName] = useState(organizerData.name || '');
  const [instagramPage, setInstagramPage] = useState(organizerData.instagramPage || '');
  const [facebookPage, setFacebookPage] = useState(organizerData.facebookPage || '');
  const [location, setLocation] = useState(organizerData.location || null);
  const [profilePicture, setProfilePicture] = useState(organizerData.profilePicture || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingImage, setIsLoadingImage] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (!profilePicture.trim()) {
      newErrors.profilePicture = 'Profile picture is required';
    }

    if (!location) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requestPermissions = async () => {
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera roll permission is required to select photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoadingImage(true);

    try {
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Check file size (approximate)
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            'Please select an image smaller than 10MB.',
            [{ text: 'OK' }]
          );
          return;
        }

        setProfilePicture(asset.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to select image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingImage(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoadingImage(true);

    try {
      const result = await ExpoImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Check file size (approximate)
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            'Please select an image smaller than 10MB.',
            [{ text: 'OK' }]
          );
          return;
        }

        setProfilePicture(asset.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(
        'Error',
        'Failed to take photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingImage(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => setProfilePicture('') },
      ]
    );
  };

  const handleContinue = async () => {
    if (validateForm()) {
      try {
        // Prepare data to save
        const formData = {
          name: name.trim(),
          instagramPage: instagramPage.trim() || undefined,
          facebookPage: facebookPage.trim() || undefined,
          location: location || undefined,
          profilePicture,
        };

        // Update local store
        updateOrganizerData(formData);

        // Save to Firebase
        await saveOnboardingData(formData, 1);

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
        // Still continue to next screen even if Firebase save fails
        onContinue();
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <AppHeader onSignOut={handleSignOut} />
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
              Event Organizer
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
                {/* Profile Picture Section */}
                <View style={styles.profilePictureSection}>
                  <Text style={styles.label}>Profile Picture *</Text>
                  <View style={styles.profilePictureContainer}>
                    <View style={styles.profilePictureWrapper}>
                      {profilePicture ? (
                        <Image
                          source={{ uri: profilePicture }}
                          style={styles.profileImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.profilePlaceholder}>
                          <Ionicons 
                            name={isLoadingImage ? 'hourglass' : 'camera'} 
                            size={32} 
                            color={Colors.text.placeholder} 
                          />
                        </View>
                      )}
                    </View>
                    <View style={styles.profileActions}>
                      {profilePicture ? (
                        <>
                          <TouchableOpacity
                            style={styles.changePhotoButton}
                            onPress={showImageOptions}
                            disabled={isLoadingImage}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.changePhotoText}>Change photo</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.deletePhotoButton}
                            onPress={removeImage}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.deletePhotoText}>Delete photo</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={styles.addPhotoButton}
                          onPress={showImageOptions}
                          disabled={isLoadingImage}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.addPhotoText}>
                            {isLoadingImage ? 'Processing...' : 'Add Photo'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {errors.profilePicture && (
                    <Text style={styles.errorText}>{errors.profilePicture}</Text>
                  )}
                </View>

                <Input
                  label="Organization Name *"
                  placeholder="Organization Name"
                  value={name}
                  onChangeText={setName}
                  error={errors.name}
                  style={styles.input}
                />
                
                <Input
                  label="Instagram Page"
                  placeholder="Instagram Page"
                  value={instagramPage}
                  onChangeText={setInstagramPage}
                  autoCapitalize="none"
                  style={styles.input}
                />
                
                <Input
                  label="Facebook Page"
                  placeholder="Facebook Page"
                  value={facebookPage}
                  onChangeText={setFacebookPage}
                  autoCapitalize="none"
                  style={styles.input}
                />
                
                <LocationPicker
                  label="Location *"
                  value={location}
                  onLocationSelect={setLocation}
                  error={errors.location}
                  style={styles.input}
                />
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
  profilePictureSection: {
    marginBottom: 24,
  },
  profilePictureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  profilePictureWrapper: {
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.secondary,
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  profileActions: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 8,
  },
  changePhotoButton: {
    marginBottom: 8,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blue.primary,
  },
  deletePhotoButton: {
    marginBottom: 8,
  },
  deletePhotoText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.status.error,
  },
  addPhotoButton: {
    paddingVertical: 8,
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blue.primary,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
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
  errorText: {
    fontSize: 12,
    color: Colors.status.error,
    marginTop: 4,
  },
});
