import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

interface ImagePickerProps {
  label?: string;
  value?: string;
  onImageSelect: (uri: string) => void;
  maxSizeMB?: number;
  error?: string;
  style?: any;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  label = 'Profile Picture',
  value,
  onImageSelect,
  maxSizeMB = 10,
  error,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

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
        if (asset.fileSize && asset.fileSize > maxSizeMB * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            `Please select an image smaller than ${maxSizeMB}MB.`,
            [{ text: 'OK' }]
          );
          return;
        }

        onImageSelect(asset.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to select image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
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

    setIsLoading(true);

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
        if (asset.fileSize && asset.fileSize > maxSizeMB * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            `Please select an image smaller than ${maxSizeMB}MB.`,
            [{ text: 'OK' }]
          );
          return;
        }

        onImageSelect(asset.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(
        'Error',
        'Failed to take photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
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
        { text: 'Remove', style: 'destructive', onPress: () => onImageSelect('') },
      ]
    );
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (error) {
      baseStyle.push(styles.containerError);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={[GlobalStyles.label, styles.label]}>
          {label}
        </Text>
      )}
      
      <View style={[GlobalStyles.glassInput, styles.imageContainer]}>
        {value ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: value }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.changeButton]}
                onPress={showImageOptions}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={16} color={Colors.blue.primary} />
                <Text style={styles.actionButtonText}>
                  Change Photo
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={removeImage}
                activeOpacity={0.7}
              >
                <Ionicons name="trash" size={16} color={Colors.status.error} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.placeholderContainer}
            onPress={showImageOptions}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <View style={styles.placeholderIcon}>
              <Ionicons 
                name={isLoading ? 'hourglass' : 'camera'} 
                size={32} 
                color={Colors.text.placeholder} 
              />
            </View>
            <Text style={styles.placeholderText}>
              {isLoading ? 'Processing...' : 'Add Profile Picture'}
            </Text>
            <Text style={styles.placeholderSubtext}>
              Max {maxSizeMB}MB
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  containerError: {
    // Add error styling if needed
  },
  label: {
    marginBottom: 8,
  },
  imageContainer: {
    padding: 16,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  changeButton: {
    flex: 1,
    backgroundColor: Colors.glass.light,
  },
  removeButton: {
    backgroundColor: Colors.glass.dark,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: Colors.blue.primary,
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  placeholderIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.glass.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: Colors.text.placeholder,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: 14,
    marginTop: 4,
  },
});
