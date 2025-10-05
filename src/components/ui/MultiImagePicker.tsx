import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

interface MultiImagePickerProps {
  label?: string;
  value: string[];
  onImagesSelect: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  error?: string;
  style?: any;
}

export const MultiImagePicker: React.FC<MultiImagePickerProps> = ({
  label = 'Images',
  value = [],
  onImagesSelect,
  maxImages = 2,
  maxSizeMB = 10,
  error,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to select images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImages = async () => {
    if (value.length >= maxImages) {
      Alert.alert(
        'Limit Reached',
        `You can only select up to ${maxImages} images.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.slice(0, maxImages - value.length);
        const updatedImages = [...value, ...newImages.map(asset => asset.uri)];
        onImagesSelect(updatedImages);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to select images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = value.filter((_, i) => i !== index);
    onImagesSelect(updatedImages);
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
          {label} {value.length > 0 && `(${value.length}/${maxImages})`}
        </Text>
      )}
      
      <View style={styles.imageGrid}>
        {/* Existing Images */}
        {value.map((imageUri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={Colors.red.primary} />
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Add Button */}
        {value.length < maxImages && (
          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.addButtonDisabled]}
            onPress={pickImages}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isLoading ? "hourglass" : "add"} 
              size={24} 
              color={Colors.text.secondary} 
            />
            <Text style={styles.addButtonText}>
              {isLoading ? 'Loading...' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
      
      {maxImages > 0 && (
        <Text style={styles.helpText}>
          Maximum {maxImages} images, {maxSizeMB}MB each
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
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.glass.light,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 2,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.glass.light,
    borderWidth: 2,
    borderColor: Colors.glass.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.status.error,
    fontSize: 14,
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: Colors.text.placeholder,
    marginTop: 4,
  },
});
