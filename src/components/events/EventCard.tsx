import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';

const { width: screenWidth } = Dimensions.get('window');

export interface Event {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  venue: string;
  danceStyle: string;
  price: number;
  image?: string;
  attendees: number;
  maxAttendees: number;
  description?: string;
  tags?: string[];
}

interface EventCardProps {
  event: Event;
  variant: 'compact' | 'expanded';
  onPress?: () => void;
  onBookPress?: () => void;
  onBackPress?: () => void;
  style?: any;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  variant,
  onPress,
  onBookPress,
  onBackPress,
  style
}) => {
  const [imageError, setImageError] = useState(false);

  const handleBookPress = () => {
    if (onBookPress) {
      onBookPress();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity 
        style={[styles.compactCard, style]} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.compactImageContainer}>
          {event.image && !imageError ? (
            <Image 
              source={{ uri: event.image }} 
              style={styles.compactImage}
              resizeMode="cover"
              onError={handleImageError}
            />
          ) : (
            <View style={styles.compactImageFallback}>
              <Ionicons name="musical-notes" size={24} color={Colors.text.secondary} />
            </View>
          )}
        </View>
        
        <View style={styles.compactContent}>
          <View style={styles.compactHeader}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {event.title}
            </Text>
            <Text style={styles.compactOrganizer} numberOfLines={1}>
              {event.organizer}
            </Text>
          </View>
          
          <View style={styles.compactDetails}>
            <View style={styles.compactDetailRow}>
              <Ionicons name="calendar-outline" size={12} color={Colors.text.secondary} />
              <Text style={styles.compactDetailText} numberOfLines={1}>
                {event.date} • {event.time}
              </Text>
            </View>
            
            <View style={styles.compactDetailRow}>
              <Ionicons name="location-outline" size={12} color={Colors.text.secondary} />
              <Text style={styles.compactDetailText} numberOfLines={1}>
                {event.venue}
              </Text>
            </View>
            
            <View style={styles.compactDetailRow}>
              <Ionicons name="musical-notes-outline" size={12} color={Colors.text.secondary} />
              <Text style={styles.compactDetailText}>
                {event.danceStyle}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.compactPriceBadge}>
          <Text style={styles.compactPriceText}>${event.price}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Expanded variant
  return (
    <View style={[styles.expandedCard, style]}>
      {/* Expanded Image */}
      <View style={styles.expandedImageContainer}>
        {event.image && !imageError ? (
          <Image 
            source={{ uri: event.image }} 
            style={styles.expandedImage}
            resizeMode="cover"
            onError={handleImageError}
          />
        ) : (
          <View style={styles.expandedImageFallback}>
            <Ionicons name="musical-notes" size={64} color={Colors.text.secondary} />
          </View>
        )}
        <View style={styles.expandedPriceBadge}>
          <Text style={styles.expandedPriceText}>${event.price}</Text>
        </View>
      </View>
      
      {/* Expanded Content */}
      <ScrollView 
        style={styles.expandedContent}
        contentContainerStyle={styles.expandedContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.expandedHeader}>
          <Text style={styles.expandedTitle}>{event.title}</Text>
          <Text style={styles.expandedOrganizer}>{event.organizer}</Text>
        </View>
        
        {event.description && (
          <View style={styles.expandedDescriptionContainer}>
            <Text style={styles.expandedDescription}>{event.description}</Text>
          </View>
        )}
        
        <View style={styles.expandedDetails}>
          <View style={styles.expandedDetailRow}>
            <Ionicons name="calendar-outline" size={18} color={Colors.text.secondary} />
            <View style={styles.expandedDetailContent}>
              <Text style={styles.expandedDetailLabel}>Date & Time</Text>
              <Text style={styles.expandedDetailText}>{event.date} • {event.time}</Text>
            </View>
          </View>
          
          <View style={styles.expandedDetailRow}>
            <Ionicons name="location-outline" size={18} color={Colors.text.secondary} />
            <View style={styles.expandedDetailContent}>
              <Text style={styles.expandedDetailLabel}>Venue</Text>
              <Text style={styles.expandedDetailText}>{event.venue}</Text>
            </View>
          </View>
          
          <View style={styles.expandedDetailRow}>
            <Ionicons name="musical-notes-outline" size={18} color={Colors.text.secondary} />
            <View style={styles.expandedDetailContent}>
              <Text style={styles.expandedDetailLabel}>Dance Style</Text>
              <Text style={styles.expandedDetailText}>{event.danceStyle}</Text>
            </View>
          </View>
          
          <View style={styles.expandedDetailRow}>
            <Ionicons name="people-outline" size={18} color={Colors.text.secondary} />
            <View style={styles.expandedDetailContent}>
              <Text style={styles.expandedDetailLabel}>Attendance</Text>
              <Text style={styles.expandedDetailText}>
                {event.attendees} of {event.maxAttendees} spots filled
              </Text>
            </View>
          </View>
        </View>

        {event.tags && event.tags.length > 0 && (
          <View style={styles.expandedTagsContainer}>
            <Text style={styles.expandedTagsLabel}>Tags</Text>
            <View style={styles.expandedTagsList}>
              {event.tags.map((tag, index) => (
                <View key={index} style={styles.expandedTag}>
                  <Text style={styles.expandedTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Compact variant styles
  compactCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glass.border,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
    height: 110,
    position: 'relative',
  },
  compactImageContainer: {
    width: 80,
    height: 110,
    borderRadius: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  compactHeader: {
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  compactOrganizer: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  compactDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  compactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactDetailText: {
    fontSize: 10,
    color: Colors.text.secondary,
    flex: 1,
  },
  compactPriceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.blue.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  compactPriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },

  // Expanded variant styles
  expandedCard: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    width: '100%',
    height: '100%',
  },
  expandedHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  expandedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  expandedHeaderSpacer: {
    width: 40,
  },
  expandedImageContainer: {
    position: 'relative',
    height: 300,
  },
  expandedImage: {
    width: '100%',
    height: '100%',
  },
  expandedImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedPriceBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.blue.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  expandedPriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  expandedContent: {
    flex: 1,
  },
  expandedContentContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding for bottom content
  },
  expandedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  expandedOrganizer: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  expandedDescriptionContainer: {
    marginBottom: 20,
  },
  expandedDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  expandedDetails: {
    marginBottom: 20,
    gap: 16,
  },
  expandedDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  expandedDetailContent: {
    flex: 1,
  },
  expandedDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  expandedDetailText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  expandedTagsContainer: {
    marginBottom: 20,
  },
  expandedTagsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  expandedTagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expandedTag: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  expandedTagText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});
