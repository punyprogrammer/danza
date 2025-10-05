import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { EventCard, Event } from '../../components/events/EventCard';
import { EventSwipeView } from '../../components/events/EventSwipeView';
import { PaymentScreen } from '../payment/PaymentScreen';


// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Salsa Night at Studio 54',
    organizer: 'Dance Studio Pro',
    date: '2024-01-15',
    time: '8:00 PM',
    venue: 'Studio 54, Downtown',
    danceStyle: 'Salsa',
    price: 25,
    attendees: 45,
    maxAttendees: 60,
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop&crop=center',
    description: 'Join us for an unforgettable night of Salsa dancing at the legendary Studio 54! Whether you\'re a beginner or advanced dancer, this event promises to be an amazing experience with live music, professional DJ, and a vibrant dance community.',
    tags: ['Beginner Friendly', 'Live Music', 'Professional DJ', 'Social Dancing']
  },
  {
    id: '2',
    title: 'Bachata Workshop',
    organizer: 'Latin Dance Academy',
    date: '2024-01-18',
    time: '7:00 PM',
    venue: 'Community Center',
    danceStyle: 'Bachata',
    price: 35,
    attendees: 28,
    maxAttendees: 40,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    description: 'Learn the sensual and romantic dance of Bachata with our professional instructors. This workshop is perfect for couples and individuals looking to master the basics and intermediate moves of this beautiful Latin dance.',
    tags: ['Couples', 'Workshop', 'Professional Instructors', 'Romantic']
  },
  {
    id: '3',
    title: 'Kizomba Social',
    organizer: 'African Rhythms',
    date: '2024-01-20',
    time: '9:00 PM',
    venue: 'Club Paradise',
    danceStyle: 'Kizomba',
    price: 20,
    attendees: 62,
    maxAttendees: 80,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=center',
    description: 'Experience the smooth and intimate dance of Kizomba at Club Paradise. This social event features the best Kizomba music and provides the perfect atmosphere for connecting with other dancers in a relaxed, friendly environment.',
    tags: ['Intimate', 'Social', 'African Music', 'Connection']
  },
  {
    id: '4',
    title: 'Hip Hop Battle Night',
    organizer: 'Street Dance Crew',
    date: '2024-01-22',
    time: '8:30 PM',
    venue: 'Underground Club',
    danceStyle: 'Hip Hop',
    price: 15,
    attendees: 89,
    maxAttendees: 100,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    description: 'Get ready for the ultimate Hip Hop battle night! Watch amazing dancers compete, learn new moves, and dance to the hottest Hip Hop tracks. This is where street culture meets dance artistry.',
    tags: ['Competition', 'Street Dance', 'High Energy', 'Urban Culture']
  },
];

export const ExploreScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isSwipeView, setIsSwipeView] = useState(false);
  const [isPaymentView, setIsPaymentView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Salsa', value: 'salsa' },
    { label: 'Bachata', value: 'bachata' },
    { label: 'Kizomba', value: 'kizomba' },
    { label: 'Hip Hop', value: 'hip-hop' },
    { label: 'Tango', value: 'tango' },
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         event.danceStyle.toLowerCase() === selectedFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleEventPress = () => {
    setIsSwipeView(true);
  };

  const handleBackFromSwipe = () => {
    setIsSwipeView(false);
  };

  const handleEventBook = (event: Event) => {
    setSelectedEvent(event);
    setIsPaymentView(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentView(false);
    setIsSwipeView(false);
    setSelectedEvent(null);
    // TODO: Add event to user's booked events
  };

  const handleBackFromPayment = () => {
    setIsPaymentView(false);
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      variant="compact"
      onPress={handleEventPress}
      onBookPress={() => handleEventBook(item)}
    />
  );

  if (isPaymentView && selectedEvent) {
    return (
      <PaymentScreen
        event={selectedEvent}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={handleBackFromPayment}
      />
    );
  }

  if (isSwipeView) {
    return (
      <EventSwipeView
        events={filteredEvents}
        onEventBook={handleEventBook}
        onBack={handleBackFromSwipe}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore Events</Text>
          <Text style={styles.subtitle}>Discover dance events near you</Text>
        </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events, venues, or organizers..."
                placeholderTextColor={Colors.text.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Options */}
          <View style={styles.filterContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {filterOptions.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter.value && styles.activeFilterChip
                  ]}
                  onPress={() => setSelectedFilter(filter.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedFilter === filter.value && styles.activeFilterChipText
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Events List */}
          <View style={styles.eventsContainer}>
            <Text style={styles.eventsCount}>
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </Text>
            
            <FlatList
              data={filteredEvents}
              renderItem={renderEventCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.eventsList}
            />
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100, // Space for bottom navigation
  },
  header: {
    marginBottom: 24,
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
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterScrollContent: {
    paddingHorizontal: 4,
  },
  filterChip: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  activeFilterChip: {
    backgroundColor: Colors.blue.primary,
    borderColor: Colors.blue.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeFilterChipText: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  eventsContainer: {
    flex: 1,
  },
  eventsCount: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  eventsList: {
    gap: 16,
  },
});
