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
import { LocationPicker } from '../../components/ui/LocationPicker';
import { useTheme } from '../../components/ThemeProvider';
import { useAuthStore } from '../../stores/authStore';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';
import { OrganizerProfile } from '../../types';

interface OrganizerProfileScreenProps {
  onBack: () => void;
}

export const OrganizerProfileScreen: React.FC<OrganizerProfileScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  
  // Profile data state
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [instagramPage, setInstagramPage] = useState('');
  const [facebookPage, setFacebookPage] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [profilePicture, setProfilePicture] = useState('');
  
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
      const profileData = await profileService.getOrganizerProfile(user.id);
      
      if (profileData) {
        setProfile(profileData);
        setName(profileData.name || '');
        setInstagramPage(profileData.instagramPage || '');
        setFacebookPage(profileData.facebookPage || '');
        setLocation(profileData.location || null);
        setProfilePicture(profileData.profilePicture || '');
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

  const uploadMediaToFirebase = async (): Promise<{ profilePicture: string }> => {
    if (!user?.id) {
      throw new Error('User ID not found');
    }

    const uploadResults = {
      profilePicture: profilePicture,
    };

    // Upload profile picture if it's a local file
    if (profilePicture && !profilePicture.startsWith('http')) {
      const profilePath = storageService.generateUserMediaPath(user.id, 'profile');
      const profileResult = await storageService.uploadFile({ uri: profilePicture }, profilePath);
      uploadResults.profilePicture = profileResult.url;
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
      const updatedProfile: Partial<OrganizerProfile> = {
        name: name.trim(), // Keep name as is (non-editable in UI but can be updated in backend)
        instagramPage: instagramPage.trim() || undefined,
        facebookPage: facebookPage.trim() || undefined,
        location: location || undefined,
        profilePicture: mediaUrls.profilePicture || undefined,
        updatedAt: new Date(),
      };

      // Update profile in Firebase
      await profileService.updateOrganizerProfile(user.id, updatedProfile);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
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
                <View style={[styles.profilePlaceholder, { backgroundColor: colors.background.secondary }]}>
                  <Ionicons
                    name="camera"
                    size={32}
                    color={colors.text.placeholder}
                  />
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={[styles.changePhotoButton, { backgroundColor: colors.accent.primary }]}
              onPress={showImageOptions}
              activeOpacity={0.8}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Organization Information */}
        <View style={[styles.formSection, { backgroundColor: colors.background.card, borderColor: colors.glass.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Organization Information
          </Text>
          
          {/* Name field - Non-editable display only */}
          <View style={styles.nonEditableField}>
            <Text style={[styles.fieldLabel, { color: colors.text.primary }]}>
              Organization Name
            </Text>
            <View style={[styles.nonEditableValue, { backgroundColor: colors.background.secondary, borderColor: colors.glass.border }]}>
              <Text style={[styles.nonEditableText, { color: colors.text.secondary }]}>
                {name || 'No organization name set'}
              </Text>
              <Ionicons name="lock-closed" size={16} color={colors.text.tertiary} />
            </View>
            <Text style={[styles.helpText, { color: colors.text.tertiary }]}>
              Organization name cannot be changed after onboarding
            </Text>
          </View>

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
            label="Location"
            value={location}
            onLocationSelect={setLocation}
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
  },
  changePhotoButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  nonEditableField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  nonEditableValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  nonEditableText: {
    fontSize: 16,
    flex: 1,
  },
  helpText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
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
