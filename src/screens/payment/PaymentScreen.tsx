import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Event } from '../../components/events/EventCard';

interface PaymentScreenProps {
  event: Event;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  event,
  onPaymentSuccess,
  onBack,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful!',
        `You've successfully booked ${event.title}`,
        [
          {
            text: 'OK',
            onPress: onPaymentSuccess,
          },
        ]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Event Summary */}
          <View style={styles.eventSummary}>
            <Text style={styles.summaryTitle}>Event Summary</Text>
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventOrganizer}>by {event.organizer}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.eventDetail}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
                  <Text style={styles.eventDetailText}>{event.date} • {event.time}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
                  <Text style={styles.eventDetailText}>{event.venue}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Method Selection */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'card' && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Ionicons 
                name="card" 
                size={24} 
                color={paymentMethod === 'card' ? Colors.blue.primary : Colors.text.secondary} 
              />
              <Text style={[
                styles.paymentOptionText,
                paymentMethod === 'card' && styles.selectedPaymentOptionText,
              ]}>
                Credit/Debit Card
              </Text>
              {paymentMethod === 'card' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.blue.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'apple' && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod('apple')}
            >
              <Ionicons 
                name="logo-apple" 
                size={24} 
                color={paymentMethod === 'apple' ? Colors.blue.primary : Colors.text.secondary} 
              />
              <Text style={[
                styles.paymentOptionText,
                paymentMethod === 'apple' && styles.selectedPaymentOptionText,
              ]}>
                Apple Pay
              </Text>
              {paymentMethod === 'apple' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.blue.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'google' && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod('google')}
            >
              <Ionicons 
                name="logo-google" 
                size={24} 
                color={paymentMethod === 'google' ? Colors.blue.primary : Colors.text.secondary} 
              />
              <Text style={[
                styles.paymentOptionText,
                paymentMethod === 'google' && styles.selectedPaymentOptionText,
              ]}>
                Google Pay
              </Text>
              {paymentMethod === 'google' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.blue.primary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Price Breakdown */}
          <View style={styles.priceSection}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Event Ticket</Text>
                <Text style={styles.priceValue}>${event.price}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Processing Fee</Text>
                <Text style={styles.priceValue}>$2.50</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${(event.price + 2.50).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Payment Button */}
        <View style={styles.paymentButtonContainer}>
          <TouchableOpacity
            style={[styles.paymentButton, isProcessing && styles.disabledButton]}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={Colors.text.primary} />
            ) : (
              <>
                <Text style={styles.paymentButtonText}>
                  Pay ${(event.price + 2.50).toFixed(2)}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.text.primary} />
              </>
            )}
          </TouchableOpacity>
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
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  eventSummary: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  eventOrganizer: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  paymentSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    gap: 12,
  },
  selectedPaymentOption: {
    borderColor: Colors.blue.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  paymentOptionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  selectedPaymentOptionText: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  priceSection: {
    padding: 20,
    paddingTop: 0,
  },
  priceBreakdown: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.glass.border,
    marginTop: 8,
    paddingTop: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 18,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    color: Colors.blue.primary,
    fontWeight: 'bold',
  },
  paymentButtonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  paymentButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.blue.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

