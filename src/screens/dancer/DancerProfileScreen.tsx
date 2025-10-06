import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { LocationPicker } from '../../components/ui/LocationPicker';
import { MultiImagePicker } from '../../components/ui/MultiImagePicker';
import { useTheme } from '../../components/ThemeProvider';
import { useAuthStore } from '../../stores/authStore';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';
import { DancerProfile } from '../../types';

interface DancerProfileScreenProps {
  onBack: () => void;
}

export const DancerProfileScreen: React.FC<DancerProfileScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  
  // Profile data state
  const [profile, setProfile] = useState<DancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [proficiencyLevel, setProficiencyLevel] = useState<'beginner' | 'amateur' | 'intermediate' | 'expert'>('beginner');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  
  // Animation state
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Animate in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const profileData = await profileService.getDancerProfile(user.id);
      
      if (profileData) {
        setProfile(profileData);
        setFirstName(profileData.firstName || '');
        setLastName(profileData.lastName || '');
        setPreferredName(profileData.preferredName || '');
        setGender(profileData.gender || 'male');
        setLocation(profileData.location || null);
        setProficiencyLevel(profileData.proficiencyLevel || 'beginner');
        setBio(profileData.bio || '');
        setProfilePicture(profileData.profilePicture || '');
        setAdditionalPhotos(profileData.additionalPhotos || []);
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
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

  const uploadMediaToFirebase = async (): Promise<{ profilePicture: string; additionalPhotos: string[] }> => {
    if (!user?.id) {
      throw new Error('User ID not found');
    }

    const uploadResults = {
      profilePicture: profilePicture,
      additionalPhotos: [] as string[],
    };

    let totalFiles = 0;
    if (profilePicture && !profilePicture.startsWith('http')) totalFiles += 1;
    if (additionalPhotos.length > 0) totalFiles += additionalPhotos.filter(photo => !photo.startsWith('http')).length;

    if (totalFiles === 0) {
      return uploadResults;
    }

    let uploadedFiles = 0;

    // Upload profile picture if it's a local file
    if (profilePicture && !profilePicture.startsWith('http')) {
      const profilePath = storageService.generateUserMediaPath(user.id, 'profile');
      const profileResult = await storageService.uploadFile({ uri: profilePicture }, profilePath);
      uploadResults.profilePicture = profileResult.url;
      uploadedFiles++;
    }

    // Upload additional photos if they're local files
    if (additionalPhotos.length > 0) {
      const photoPromises = additionalPhotos.map(async (photoUri) => {
        if (!photoUri.startsWith('http')) {
          const photoPath = storageService.generateUserMediaPath(user.id, 'photos');
          const photoResult = await storageService.uploadFile({ uri: photoUri }, photoPath);
          uploadedFiles++;
          return photoResult.url;
        }
        return photoUri; // Already uploaded
      });
      uploadResults.additionalPhotos = await Promise.all(photoPromises);
    }

    return uploadResults;
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);

      // Upload media to Firebase Storage if needed
      const mediaUrls = await uploadMediaToFirebase();

      // Prepare updated profile data
      const updatedProfile: Partial<DancerProfile> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        preferredName: preferredName.trim() || undefined,
        gender,
        location: location || undefined,
        proficiencyLevel,
        bio: bio.trim() || undefined,
        profilePicture: mediaUrls.profilePicture || undefined,
        additionalPhotos: mediaUrls.additionalPhotos,
        updatedAt: new Date(),
      };

      // Update profile in Firebase
      await profileService.updateDancerProfile(user.id, updatedProfile);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    useAuthStore.getState().reset();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
            My Profile
          </Text>
          <View style={styles.headerSpacer} />
        </View>

            {/* Profile Picture Section */}
            <View style={[styles.profileSection, { backgroundColor: colors.background.card, borderColor: colors.glass.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Profile Picture
              </Text>
              
              <View style={styles.profilePictureContainer}>
                <View style={styles.profilePictureWrapper}>
                  {profilePicture ? (
                    <Image
                      source={{ uri: profilePicture }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.profilePlaceholder, { 
                      backgroundColor: colors.glass.backgroundLight,
                      borderColor: colors.glass.borderLight,
                      shadowColor: colors.glass.shadow,
                    }]}>
                      <Ionicons
                        name="camera"
                        size={32}
                        color={colors.text.secondary}
                      />
                    </View>
                  )}
                </View>
                
                <TouchableOpacity
                  style={[styles.changePhotoButton, { 
                    backgroundColor: colors.glass.backgroundLight,
                    borderColor: colors.glass.borderLight,
                    shadowColor: colors.glass.shadow,
                  }]}
                  onPress={showImageOptions}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.changePhotoText, { color: colors.text.primary }]}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Basic Information */}
            <View style={[styles.formSection, { backgroundColor: colors.background.card, borderColor: colors.glass.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Basic Information
              </Text>
              
              <Input
                label="First Name"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
              />
              
              <Input
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
              />

              <Input
                label="Preferred Name (Optional)"
                placeholder="Preferred Name"
                value={preferredName}
                onChangeText={setPreferredName}
                style={styles.input}
              />

              <Select
                label="Gender"
                value={gender}
                onValueChange={setGender}
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                ]}
                style={styles.input}
              />

              <LocationPicker
                label="Location"
                value={location}
                onLocationSelect={setLocation}
                style={styles.input}
              />

              <Select
                label="Proficiency Level"
                value={proficiencyLevel}
                onValueChange={setProficiencyLevel}
                options={[
                  { label: 'Beginner', value: 'beginner' },
                  { label: 'Amateur', value: 'amateur' },
                  { label: 'Intermediate', value: 'intermediate' },
                  { label: 'Expert', value: 'expert' },
                ]}
                style={styles.input}
              />
            </View>

            {/* Bio Section */}
            <View style={[styles.formSection, { backgroundColor: colors.background.card, borderColor: colors.glass.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                About Me
              </Text>
              
              <Input
                label="Bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                style={styles.input}
              />
            </View>

            {/* Additional Photos */}
            <View style={[styles.formSection, { backgroundColor: colors.background.card, borderColor: colors.glass.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Additional Photos
              </Text>
              
              <MultiImagePicker
                images={additionalPhotos}
                onImagesChange={setAdditionalPhotos}
                maxImages={2}
                style={styles.input}
              />
            </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={saving ? 'Saving...' : 'Save Profile'}
            onPress={saveProfile}
            variant="primary"
            disabled={saving}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  profileSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  formSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  profilePictureContainer: {
    alignItems: 'center',
  },
  profilePictureWrapper: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  changePhotoButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingTop: 16,
  },
  saveButton: {
    marginBottom: 16,
  },
});
