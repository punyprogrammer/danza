import React from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';

interface UploadLoaderProps {
  visible: boolean;
  progress: number;
  message: string;
  subMessage?: string;
}

export const UploadLoader: React.FC<UploadLoaderProps> = ({
  visible,
  progress,
  message,
  subMessage,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.container}
        >
          <View style={styles.content}>
            {/* Upload Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="cloud-upload" size={48} color={Colors.blue.primary} />
            </View>
            
            {/* Progress Circle */}
            <View style={styles.progressContainer}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
              </View>
              <View 
                style={[
                  styles.progressCircle,
                  styles.progressCircleOverlay,
                  { transform: [{ rotate: `${(progress / 100) * 360}deg` }] }
                ]} 
              />
            </View>
            
            {/* Messages */}
            <View style={styles.textContainer}>
              <Text style={styles.message}>{message}</Text>
              {subMessage && (
                <Text style={styles.subMessage}>{subMessage}</Text>
              )}
            </View>
            
            {/* Loading Indicator */}
            <ActivityIndicator 
              size="large" 
              color={Colors.blue.primary} 
              style={styles.loader}
            />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: Colors.glass.light,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: 320,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  iconContainer: {
    marginBottom: 24,
  },
  progressContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.glass.dark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.glass.border,
  },
  progressCircleOverlay: {
    position: 'absolute',
    borderColor: Colors.blue.primary,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  loader: {
    marginTop: 8,
  },
});
