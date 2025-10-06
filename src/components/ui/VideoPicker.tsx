import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GlobalStyles } from '../../styles/globalStyles';
import { useTheme } from '../ThemeProvider';

interface VideoPickerProps {
  label?: string;
  value: string | null;
  onVideoSelect: (video: string | null) => void;
  maxSizeMB?: number;
  error?: string;
  style?: any;
}

export const VideoPicker: React.FC<VideoPickerProps> = ({
  label = 'Video',
  value,
  onVideoSelect,
  maxSizeMB = 10,
  error,
  style,
}) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to select videos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
        videoMaxDuration: 30, // 30 seconds max
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const video = result.assets[0];
        
        // Check file size
        if (video.fileSize && video.fileSize > maxSizeMB * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            `Video must be under ${maxSizeMB}MB. Selected video is ${(video.fileSize / 1024 / 1024).toFixed(1)}MB.`,
            [{ text: 'OK' }]
          );
          return;
        }

        onVideoSelect(video.uri);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to select video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeVideo = () => {
    onVideoSelect(null);
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
        <Text style={[GlobalStyles.label, styles.label, { color: colors.text.primary }]}>
          {label}
        </Text>
      )}
      
      <View style={[styles.videoContainer, {
        backgroundColor: colors.glass.backgroundLight,
        borderColor: colors.glass.borderLight,
        shadowColor: colors.glass.shadow,
      }]}>
        {value ? (
          <View style={styles.videoSelected}>
            <View style={styles.videoInfo}>
              <Ionicons name="videocam" size={24} color={colors.accent.primary} />
              <View style={styles.videoDetails}>
                <Text style={[styles.videoName, { color: colors.text.primary }]}>Video Selected</Text>
                <Text style={[styles.videoSize, { color: colors.text.secondary }]}>Ready to upload</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeVideo}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={colors.status.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.pickButton, isLoading && styles.pickButtonDisabled]}
            onPress={pickVideo}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <View style={styles.pickButtonContent}>
              <Ionicons 
                name={isLoading ? "hourglass" : "videocam"} 
                size={32} 
                color={colors.text.secondary} 
              />
              <Text style={[styles.pickButtonText, { color: colors.text.primary }]}>
                {isLoading ? 'Loading...' : 'Select Video'}
              </Text>
              <Text style={[styles.pickButtonSubtext, { color: colors.text.secondary }]}>
                Max {maxSizeMB}MB, 30 seconds
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: colors.status.error }]}>
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
  videoContainer: {
    padding: 16,
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
  videoSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  videoDetails: {
    marginLeft: 12,
    flex: 1,
  },
  videoName: {
    fontSize: 16,
    fontWeight: '600',
  },
  videoSize: {
    fontSize: 14,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  pickButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pickButtonDisabled: {
    opacity: 0.6,
  },
  pickButtonContent: {
    alignItems: 'center',
  },
  pickButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  pickButtonSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
});
