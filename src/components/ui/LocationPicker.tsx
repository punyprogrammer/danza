import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Input } from './Input';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

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
      
      <View style={[GlobalStyles.glassInput, styles.inputContainer]}>
        <Input
          value={value?.address || ''}
          placeholder="Select your location"
          editable={false}
          onChangeText={() => {}}
          style={styles.locationInput}
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.currentLocationButton]}
            onPress={getCurrentLocation}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isLoading ? 'hourglass' : 'location'} 
              size={16} 
              color={Colors.blue.primary} 
            />
            <Text style={styles.actionButtonText}>
              {isLoading ? 'Getting Location...' : 'Use Current Location'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.mapButton]}
            onPress={openMapPicker}
            activeOpacity={0.7}
          >
            <Ionicons name="map" size={16} color={Colors.text.tertiary} />
            <Text style={[styles.actionButtonText, styles.mapButtonText]}>
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
    padding: 16,
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
    backgroundColor: Colors.glass.light,
  },
  mapButton: {
    backgroundColor: Colors.glass.dark,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: Colors.blue.primary,
  },
  mapButtonText: {
    color: Colors.text.tertiary,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: 14,
    marginTop: 4,
  },
});
