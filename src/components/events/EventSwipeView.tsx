import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Animated,
  PanResponder
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { EventCard, Event } from './EventCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.25;

interface EventSwipeViewProps {
  events: Event[];
  onEventBook: (event: Event) => void;
  onBack: () => void;
}

export const EventSwipeView: React.FC<EventSwipeViewProps> = ({
  events,
  onEventBook,
  onBack
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const matchScale = useRef(new Animated.Value(0)).current;
  const matchOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Only respond to horizontal gestures (dx > dy)
        return Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 }); // Only horizontal movement
      },
      onPanResponderRelease: (_, gesture) => {
        const { dx, vx } = gesture;
        const isRightSwipe = dx > SWIPE_THRESHOLD || (dx > 0 && Math.abs(vx) > 0.5);
        const isLeftSwipe = dx < -SWIPE_THRESHOLD || (dx < 0 && Math.abs(vx) > 0.5);
        
        if (isRightSwipe) {
          // Right swipe - Book event
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: screenWidth * 1.5, y: 0 },
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            handleMatchAnimation();
          });
        } else if (isLeftSwipe) {
          // Left swipe - Pass event
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: -screenWidth * 1.5, y: 0 },
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            handleNextEvent();
          });
        } else {
          // Return to center
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleMatchAnimation = () => {
    setShowMatchAnimation(true);
    
    Animated.parallel([
      Animated.spring(matchScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(matchOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After match animation, proceed to payment
      setTimeout(() => {
        const currentEvent = events[currentIndex];
        if (currentEvent) {
          onEventBook(currentEvent);
        }
      }, 1500);
    });
  };

  const handleNextEvent = () => {
    resetAnimations();
    setCurrentIndex(prev => prev + 1);
  };

  const resetAnimations = () => {
    position.setValue({ x: 0, y: 0 });
    opacity.setValue(1);
    matchScale.setValue(0);
    matchOpacity.setValue(0);
    setShowMatchAnimation(false);
  };

  const currentEvent = events[currentIndex];

  if (!currentEvent) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.blue.primary} />
            <Text style={styles.emptyTitle}>All Done!</Text>
            <Text style={styles.emptyText}>You've seen all available events</Text>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Back to Events</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
    ],
    opacity,
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <Text style={styles.headerCounter}>{currentIndex + 1} of {events.length}</Text>
        </View>

        {/* Event Card with Swipe */}
        <View style={styles.cardContainer}>
          <Animated.View 
            style={[styles.card, cardStyle]} 
            {...panResponder.panHandlers}
          >
            <EventCard
              event={currentEvent}
              variant="expanded"
              onBackPress={onBack}
            />
          </Animated.View>
          
          {/* Next card preview */}
          {events[currentIndex + 1] && (
            <View style={[styles.card, styles.nextCard]}>
              <EventCard
                event={events[currentIndex + 1]}
                variant="expanded"
              />
            </View>
          )}
        </View>

        {/* Match Animation Overlay */}
        {showMatchAnimation && (
          <Animated.View 
            style={[
              styles.matchOverlay,
              {
                opacity: matchOpacity,
                transform: [{ scale: matchScale }],
              },
            ]}
          >
            <View style={styles.matchContainer}>
              <Text style={styles.matchText}>It's a Match!</Text>
              <Text style={styles.matchSubtext}>Processing your booking...</Text>
            </View>
          </Animated.View>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>Swipe right to book • Swipe left to pass</Text>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.border,
  },
  headerBackButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerCounter: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cardContainer: {
    flex: 1,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: Colors.background.secondary,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  nextCard: {
    top: 0,
    zIndex: -1,
    opacity: 0.8,
  },
  matchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  matchContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  matchText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.blue.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  matchSubtext: {
    fontSize: 18,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  instructions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});