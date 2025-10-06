import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/ui/AppHeader';
import { DancerDashboard } from '../screens/dancer/DancerDashboard';
import { ExploreScreen } from '../screens/dancer/ExploreScreen';
import { DancerProfileScreen } from '../screens/dancer/DancerProfileScreen';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useTheme } from '../components/ThemeProvider';

type DancerTab = 'explore' | 'dashboard' | 'profile';

export const DancerNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DancerTab>('explore');
  const { resetOnboarding } = useOnboardingStore();
  const { colors } = useTheme();

  const handleSignOut = () => {
    resetOnboarding();
    useAuthStore.getState().reset();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreScreen />;
      case 'dashboard':
        return <DancerDashboard />;
      case 'profile':
        return <DancerProfileScreen onBack={() => setActiveTab('explore')} />;
      default:
        return <ExploreScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={['top', 'bottom']}>
      <View style={[styles.safeArea, { backgroundColor: colors.background.primary }]}>
        <AppHeader onSignOut={handleSignOut} onProfilePress={() => setActiveTab('profile')} />
        {/* Main Content */}
        <View style={[styles.content, { backgroundColor: colors.background.primary }]}>
          {renderContent()}
        </View>

        {/* Glassmorphism Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: colors.background.primary }]}>
          <View style={[styles.tabBar, { 
            backgroundColor: colors.glass.backgroundLight,
            borderColor: colors.glass.borderLight,
            shadowColor: colors.glass.shadow,
          }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'explore' && styles.activeTab
              ]}
              onPress={() => setActiveTab('explore')}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name="search-outline"
                  size={24}
                  color={activeTab === 'explore' ? colors.accent.primary : colors.text.secondary}
                />
                <Text style={[
                  styles.tabLabel,
                  { color: activeTab === 'explore' ? colors.accent.primary : colors.text.secondary },
                  activeTab === 'explore' && styles.activeTabLabel
                ]}>
                  Explore
                </Text>
              </View>
              {activeTab === 'explore' && <View style={[styles.activeIndicator, { backgroundColor: colors.accent.primary }]} />}
            </TouchableOpacity>

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
                  color={activeTab === 'dashboard' ? colors.accent.primary : colors.text.secondary}
                />
                <Text style={[
                  styles.tabLabel,
                  { color: activeTab === 'dashboard' ? colors.accent.primary : colors.text.secondary },
                  activeTab === 'dashboard' && styles.activeTabLabel
                ]}>
                  Dashboard
                </Text>
              </View>
              {activeTab === 'dashboard' && <View style={[styles.activeIndicator, { backgroundColor: colors.accent.primary }]} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
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
  },
  activeTabLabel: {
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 4,
    borderRadius: 2,
  },
});

