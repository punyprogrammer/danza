import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Animated, TouchableOpacity, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { Input } from '../../components/ui/Input';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { Colors } from '../../styles/colors';

interface OrganizerOnboardingScreen1Props {
  onContinue: () => void;
  onBack: () => void;
}

export const OrganizerOnboardingScreen1: React.FC<OrganizerOnboardingScreen1Props> = ({
  onContinue,
  onBack,
}) => {
  const { organizerData, updateOrganizerData } = useOnboardingStore();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  const [name, setName] = useState(organizerData.name || '');
  const [instagramPage, setInstagramPage] = useState(organizerData.instagramPage || '');
  const [facebookPage, setFacebookPage] = useState(organizerData.facebookPage || '');
  const [danceStyles, setDanceStyles] = useState<string[]>(organizerData.danceStyles || []);
  const [location, setLocation] = useState(organizerData.location || '');
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

  const danceStyleOptions = [
    'Hip Hop', 'Ballet', 'Contemporary', 'Jazz', 'Tap', 'Ballroom', 'Salsa', 'Latin', 'Modern', 'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (danceStyles.length === 0) {
      newErrors.danceStyles = 'Please select at least one dance style';
    }

    if (!location || (typeof location === 'string' && !location.trim())) {
      newErrors.location = 'Please enter your location';
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
        updateOrganizerData({
          name: name.trim(),
          instagramPage: instagramPage.trim(),
          facebookPage: facebookPage.trim(),
          danceStyles,
          location: typeof location === 'string' ? location.trim() : location,
          profilePicture,
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
                  <Text style={styles.label}>Profile Picture</Text>
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
                </View>

                <Input
                  label="Name"
                  placeholder="Name"
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
                
                {/* Dance Styles Offered */}
                <View style={styles.danceStylesContainer}>
                  <Text style={styles.label}>Dance Styles Offered</Text>
                  <View style={styles.danceStylesGrid}>
                    {danceStyleOptions.map((style) => (
                      <TouchableOpacity
                        key={style}
                        style={[
                          styles.danceStyleTag,
                          danceStyles.includes(style) && styles.selectedDanceStyleTag
                        ]}
                        onPress={() => toggleDanceStyle(style)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.danceStyleTagText,
                          danceStyles.includes(style) && styles.selectedDanceStyleTagText
                        ]}>
                          {style}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.danceStyles && (
                    <Text style={styles.errorText}>{errors.danceStyles}</Text>
                  )}
                </View>
                
                <Input
                  label="Location"
                  placeholder="Location"
                  value={typeof location === 'string' ? location : ''}
                  onChangeText={setLocation}
                  error={errors.location}
                  style={styles.input}
                />
                
                {/* Map Placeholder */}
                <View style={styles.mapContainer}>
                  <View style={styles.mapPlaceholder}>
                    <Ionicons name="map-outline" size={48} color={Colors.text.secondary} />
                    <Text style={styles.mapPlaceholderText}>Map View</Text>
                    <Text style={styles.mapPlaceholderSubtext}>Interactive map will be displayed here</Text>
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
  danceStylesContainer: {
    marginBottom: 16,
  },
  danceStylesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  danceStyleTag: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    marginBottom: 8,
  },
  selectedDanceStyleTag: {
    backgroundColor: Colors.blue.primary,
    borderColor: Colors.blue.primary,
  },
  danceStyleTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  selectedDanceStyleTagText: {
    color: Colors.text.primary,
  },
  mapContainer: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginTop: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 4,
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
