import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';

interface PurchasedEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  venue: string;
  danceStyle: string;
  price: number;
  image?: string;
  ticketId: string;
  purchaseDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Mock data for purchased events
const mockPurchasedEvents: PurchasedEvent[] = [
  {
    id: '1',
    title: 'Salsa Night at Studio 54',
    organizer: 'Dance Studio Pro',
    date: '2024-01-15',
    time: '8:00 PM',
    venue: 'Studio 54, Downtown',
    danceStyle: 'Salsa',
    price: 25,
    ticketId: 'TKT-001234',
    purchaseDate: '2024-01-10',
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop&crop=center'
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
    ticketId: 'TKT-001235',
    purchaseDate: '2024-01-12',
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
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
    ticketId: 'TKT-001236',
    purchaseDate: '2024-01-13',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=center'
  },
];

export const DancerDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [purchasedEvents] = useState<PurchasedEvent[]>(mockPurchasedEvents);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const upcomingEvents = purchasedEvents.filter(event => 
    new Date(event.date) >= new Date() && event.status !== 'cancelled'
  );
  
  const pastEvents = purchasedEvents.filter(event => 
    new Date(event.date) < new Date() || event.status === 'cancelled'
  );

  const currentEvents = selectedTab === 'upcoming' ? upcomingEvents : pastEvents;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return Colors.status.success;
      case 'pending':
        return Colors.status.warning;
      case 'cancelled':
        return Colors.status.error;
      default:
        return Colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const handleImageError = (eventId: string) => {
    setImageErrors(prev => new Set(prev).add(eventId));
  };

  const renderEventCard = ({ item }: { item: PurchasedEvent }) => (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.8}>
      <View style={styles.eventImageContainer}>
        {item.image && !imageErrors.has(item.id) ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.eventImage}
            resizeMode="cover"
            onError={() => handleImageError(item.id)}
          />
        ) : (
          <View style={styles.eventImageFallback}>
            <Ionicons name="musical-notes" size={32} color={Colors.text.secondary} />
          </View>
        )}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={12} 
            color={Colors.text.primary} 
          />
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.organizerName}>{item.organizer}</Text>
        </View>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{item.date} • {item.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText} numberOfLines={1}>{item.venue}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="musical-notes-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{item.danceStyle}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="receipt-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText}>Ticket: {item.ticketId}</Text>
          </View>
        </View>
        
        <View style={styles.eventFooter}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Paid</Text>
            <Text style={styles.priceAmount}>${item.price}</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {selectedTab === 'upcoming' ? 'View Details' : 'Rate Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons 
          name={selectedTab === 'upcoming' ? 'calendar-outline' : 'time-outline'} 
          size={64} 
          color={Colors.text.secondary} 
        />
      </View>
      <Text style={styles.emptyTitle}>
        {selectedTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
      </Text>
      <Text style={styles.emptyText}>
        {selectedTab === 'upcoming' 
          ? 'Start exploring events to see your bookings here!'
          : 'Events you\'ve attended will appear here.'
        }
      </Text>
      {selectedTab === 'upcoming' && (
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore Events</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Events</Text>
            <Text style={styles.subtitle}>Manage your dance event bookings</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{pastEvents.length}</Text>
              <Text style={styles.statLabel}>Past Events</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                ${purchasedEvents.reduce((sum, event) => sum + event.price, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabNavigation}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
              onPress={() => setSelectedTab('upcoming')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
                Upcoming ({upcomingEvents.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'past' && styles.activeTab]}
              onPress={() => setSelectedTab('past')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, selectedTab === 'past' && styles.activeTabText]}>
                Past ({pastEvents.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Events List */}
          <View style={styles.eventsContainer}>
            {currentEvents.length > 0 ? (
              <FlatList
                data={currentEvents}
                renderItem={renderEventCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.eventsList}
              />
            ) : (
              renderEmptyState()
            )}
          </View>
        </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.blue.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.blue.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  eventsContainer: {
    flex: 1,
  },
  eventsList: {
    gap: 16,
  },
  eventCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glass.border,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eventImageContainer: {
    position: 'relative',
    height: 140,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  organizerName: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  eventDetails: {
    marginBottom: 16,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInfo: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  actionButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  exploreButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

