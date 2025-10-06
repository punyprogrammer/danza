import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Input } from './Input';
import { GlobalStyles } from '../../styles/globalStyles';
import { useTheme } from '../ThemeProvider';

interface LocationPickerProps {
  label?: string;
  value: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  onLocationSelect: (location: { latitude: number; longitude: number; address: string }) => void;
  error?: string;
  style?: any;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  label = 'Location',
  value,
  onLocationSelect,
  error,
  style,
}) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    }
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Location permission is required to use this feature. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocoding to get address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const address = geocode[0] 
        ? `${geocode[0].street || ''} ${geocode[0].city || ''} ${geocode[0].region || ''} ${geocode[0].postalCode || ''}`.trim()
        : 'Current Location';

      onLocationSelect({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
      });

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again or enter manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openMapPicker = () => {
    // TODO: Implement map picker modal
    Alert.alert(
      'Map Picker',
      'Map picker will be implemented here. For now, use current location.',
      [{ text: 'OK' }]
    );
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (error) {
      // baseStyle.push(styles.containerError);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getInputContainerStyle = () => {
    return [
      styles.inputContainer,
      {
        backgroundColor: colors.glass.backgroundLight,
        borderColor: colors.glass.borderLight,
        shadowColor: colors.glass.shadow,
      },
    ];
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={[GlobalStyles.label, styles.label, { color: colors.text.primary }]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        <Input
          value={value?.address || ''}
          placeholder="Select your location"
          editable={false}
          onChangeText={() => {}}
          style={styles.locationInput}
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.currentLocationButton, { backgroundColor: colors.accent.primary }]}
            onPress={getCurrentLocation}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isLoading ? 'hourglass' : 'location'} 
              size={16} 
              color={colors.text.inverse} 
            />
            <Text style={[styles.actionButtonText, { color: colors.text.inverse }]}>
              {isLoading ? 'Getting Location...' : 'Current Location'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.mapButton, { 
              backgroundColor: colors.glass.backgroundLight,
              borderColor: colors.glass.borderLight,
            }]}
            onPress={openMapPicker}
            activeOpacity={0.7}
          >
            <Ionicons name="map" size={16} color={colors.text.secondary} />
            <Text style={[styles.actionButtonText, styles.mapButtonText, { color: colors.text.secondary }]}>
              Pick on Map
            </Text>
          </TouchableOpacity>
        </View>
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
  inputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  locationInput: {
    borderWidth: 0,
    padding: 0,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  currentLocationButton: {
    
  },
  mapButton: {
   
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    
  },
  mapButtonText: {
    // color: colors.text.tertiary,
  },
  errorText: {
  
    fontSize: 14,
    marginTop: 4,
  },
});
