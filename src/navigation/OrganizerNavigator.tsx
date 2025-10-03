import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import { OrganizerDashboard } from '../screens/organizer/OrganizerDashboard';
import { CreateEventScreen } from '../screens/organizer/CreateEventScreen';

type OrganizerTab = 'dashboard' | 'createEvent';

export const OrganizerNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrganizerTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OrganizerDashboard />;
      case 'createEvent':
        return <CreateEventScreen />;
      default:
        return <OrganizerDashboard />;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Main Content */}
        <View style={styles.content}>
          {renderContent()}
        </View>

        {/* Glassmorphism Tab Navigation */}
        <View style={styles.tabContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'dashboard' && styles.activeTab
              ]}
              onPress={() => setActiveTab('dashboard')}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name="grid-outline"
                  size={24}
                  color={activeTab === 'dashboard' ? Colors.blue.primary : Colors.text.secondary}
                />
                <Text style={[
                  styles.tabLabel,
                  activeTab === 'dashboard' && styles.activeTabLabel
                ]}>
                  Dashboard
                </Text>
              </View>
              {activeTab === 'dashboard' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'createEvent' && styles.activeTab
              ]}
              onPress={() => setActiveTab('createEvent')}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={activeTab === 'createEvent' ? Colors.blue.primary : Colors.text.secondary}
                />
                <Text style={[
                  styles.tabLabel,
                  activeTab === 'createEvent' && styles.activeTabLabel
                ]}>
                  Create Event
                </Text>
              </View>
              {activeTab === 'createEvent' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(44, 49, 68, 0.85)', // Semi-transparent glass effect
    borderRadius: 16, // Added rounded corners
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    backdropFilter: 'blur(20px)', // Additional blur effect
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    position: 'relative',
  },
  activeTab: {
    // Remove background color - just change text/icon color
  },
  tabContent: {
    flexDirection: 'row', // Horizontal alignment
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // Space between icon and text
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabLabel: {
    color: Colors.blue.primary,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 4,
    backgroundColor: Colors.blue.primary,
    borderRadius: 2,
  },
});
