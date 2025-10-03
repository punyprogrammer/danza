import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';

export interface YoureAllSetConfig {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  illustrationText: {
    main: string;
    sub: string;
  };
}

interface YoureAllSetScreenProps {
  config: YoureAllSetConfig;
  onComplete: () => void;
}

export const YoureAllSetScreen: React.FC<YoureAllSetScreenProps> = ({
  config,
  onComplete,
}) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(50));
  const [scaleAnim] = React.useState(new Animated.Value(0.8));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const CustomIllustration = () => (
    <View style={styles.illustrationBackground}>
      {/* Orange Circle */}
      <View style={styles.orangeCircle} />
      
      {/* Person Silhouette */}
      <View style={styles.personSilhouette}>
        {/* Body */}
        <View style={styles.personBody} />
        {/* Head */}
        <View style={styles.personHead} />
        {/* Arm reaching up */}
        <View style={styles.personArm} />
      </View>
      
      {/* Text elements */}
      <View style={styles.illustrationText}>
        <Text style={styles.illustrationTextMain}>{config.illustrationText.main}</Text>
        <Text style={styles.illustrationTextSub}>{config.illustrationText.sub}</Text>
      </View>
    </View>
  );

  const handleComplete = async () => {
    // Add exit animation before completing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleComplete}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              You're All Set!
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Central Illustration */}
          <View style={styles.illustrationContainer}>
            <Animated.View 
              style={[
                styles.illustrationWrapper,
                {
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <CustomIllustration />
            </Animated.View>
          </View>

          {/* Main Content */}
          <View style={styles.contentSection}>
            <Text style={styles.mainTitle}>
              {config.title}
            </Text>
            <Text style={styles.mainDescription}>
              {config.description}
            </Text>
          </View>

          {/* Start Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>
                {config.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationBackground: {
    width: 280,
    height: 200,
    backgroundColor: '#2A3A4A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  orangeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF8C69',
    position: 'absolute',
    top: 40,
    left: 80,
  },
  personSilhouette: {
    position: 'absolute',
    top: 60,
    left: 120,
    zIndex: 2,
  },
  personBody: {
    width: 20,
    height: 40,
    backgroundColor: '#1A1D29',
    borderRadius: 10,
    marginBottom: -5,
  },
  personHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1A1D29',
    marginBottom: 5,
    marginLeft: 2,
  },
  personArm: {
    width: 8,
    height: 25,
    backgroundColor: '#1A1D29',
    borderRadius: 4,
    position: 'absolute',
    top: -10,
    right: 5,
    transform: [{ rotate: '-30deg' }],
  },
  illustrationText: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  illustrationTextMain: {
    fontSize: 8,
    color: '#FFFFFF',
    opacity: 0.7,
    fontWeight: '500',
  },
  illustrationTextSub: {
    fontSize: 6,
    color: '#FFFFFF',
    opacity: 0.5,
    fontWeight: '400',
    marginTop: 2,
  },
  contentSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  mainDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  startButton: {
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
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

