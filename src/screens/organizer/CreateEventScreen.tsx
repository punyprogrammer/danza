import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import * as ExpoImagePicker from 'expo-image-picker';

interface EventFormData {
  title: string;
  image?: string;
  date: string;
  time: string;
  venue: string;
  danceStyle: string;
  price: string;
}

export const CreateEventScreen: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    time: '',
    venue: '',
    danceStyle: '',
    price: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const danceStyleOptions = [
    { label: 'Salsa', value: 'salsa' },
    { label: 'Bachata', value: 'bachata' },
    { label: 'Kizomba', value: 'kizomba' },
    { label: 'Tango', value: 'tango' },
    { label: 'Hip Hop', value: 'hip-hop' },
    { label: 'Contemporary', value: 'contemporary' },
    { label: 'Ballet', value: 'ballet' },
    { label: 'Jazz', value: 'jazz' },
    { label: 'Ballroom', value: 'ballroom' },
    { label: 'Latin', value: 'latin' },
    { label: 'Street Dance', value: 'street-dance' },
    { label: 'Flamenco', value: 'flamenco' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Event time is required';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.danceStyle.trim()) {
      newErrors.danceStyle = 'Dance style is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement event creation logic
      console.log('Creating event:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!', 
        'Your event has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                title: '',
                date: '',
                time: '',
                venue: '',
                danceStyle: '',
                price: '',
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Event</Text>
              <Text style={styles.subtitle}>Fill in the details for your dance event</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Event Title */}
              <Input
                label="Event Title"
                placeholder="Enter event title"
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                error={errors.title}
                style={styles.input}
              />

              {/* Event Image */}
              <View style={styles.imageSection}>
                <Text style={styles.label}>Event Image (Optional)</Text>
                <View style={styles.imageContainer}>
                  {formData.image ? (
                    <View style={styles.imageWrapper}>
                      <View style={styles.imagePreview}>
                        {/* Image preview would go here */}
                        <Ionicons name="image" size={32} color={Colors.text.secondary} />
                      </View>
                      <View style={styles.imageActions}>
                        <TouchableOpacity
                          style={styles.changeImageButton}
                          onPress={handleImagePicker}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.changeImageText}>Change Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={removeImage}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.removeImageText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addImageButton}
                      onPress={handleImagePicker}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="camera" size={24} color={Colors.blue.primary} />
                      <Text style={styles.addImageText}>Add Event Image</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Date and Time */}
              <View style={styles.dateTimeRow}>
                <View style={styles.dateTimeColumn}>
                  <Input
                    label="Date"
                    placeholder="MM/DD/YYYY"
                    value={formData.date}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                    error={errors.date}
                    style={styles.dateTimeInput}
                  />
                </View>
                <View style={styles.dateTimeColumn}>
                  <Input
                    label="Time"
                    placeholder="HH:MM AM/PM"
                    value={formData.time}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
                    error={errors.time}
                    style={styles.dateTimeInput}
                  />
                </View>
              </View>

              {/* Venue */}
              <View style={styles.venueSection}>
                <Input
                  label="Venue"
                  placeholder="Enter venue name or address"
                  value={formData.venue}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, venue: text }))}
                  error={errors.venue}
                  style={styles.input}
                  rightIcon="location-outline"
                />
                {/* Map placeholder */}
                <View style={styles.mapPlaceholder}>
                  <Ionicons name="map-outline" size={32} color={Colors.text.secondary} />
                  <Text style={styles.mapPlaceholderText}>Map View</Text>
                  <Text style={styles.mapPlaceholderSubtext}>Location will be shown here</Text>
                </View>
              </View>

              {/* Dance Style */}
              <Select
                label="Dance Style"
                placeholder="Select dance style"
                value={formData.danceStyle}
                onSelect={(value) => setFormData(prev => ({ ...prev, danceStyle: value }))}
                options={danceStyleOptions}
                error={errors.danceStyle}
                style={styles.input}
              />

              {/* Price */}
              <Input
                label="Price"
                placeholder="Enter ticket price"
                value={formData.price}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                error={errors.price}
                style={styles.input}
                keyboardType="numeric"
                rightIcon="card-outline"
              />

              {/* Submit Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title={isSubmitting ? "Creating Event..." : "Create Event"}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={styles.submitButton}
                  icon="add-circle"
                />
              </View>
            </View>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  form: {
    flex: 1,
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
  imageSection: {
    marginBottom: 16,
  },
  imageContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    padding: 16,
  },
  imageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  imageActions: {
    flex: 1,
  },
  changeImageButton: {
    marginBottom: 8,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blue.primary,
  },
  removeImageButton: {
    marginBottom: 8,
  },
  removeImageText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.status.error,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  addImageText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blue.primary,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateTimeColumn: {
    flex: 1,
  },
  dateTimeInput: {
    marginBottom: 0,
  },
  venueSection: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glass.border,
    marginTop: 8,
  },
  mapPlaceholderText: {
    fontSize: 14,
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
    marginTop: 24,
    paddingBottom: 24,
  },
  submitButton: {
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
});

