import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeProvider';

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  isSelected: boolean;
  onPress: () => void;
  comingSoon?: boolean;
}

export const UserTypeCard: React.FC<UserTypeCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  onPress,
  comingSoon = false,
}) => {
  const { colors } = useTheme();
  
  const getCardStyle = () => {
    return [
      styles.card,
      {
        backgroundColor: colors.glass.backgroundLight,
        borderColor: isSelected ? colors.accent.primary : colors.glass.borderLight,
        borderWidth: isSelected ? 2 : 1,
        shadowColor: colors.glass.shadow,
      },
    ];
  };

  const getIconContainerStyle = () => {
    return [
      styles.iconContainer,
      {
        backgroundColor: isSelected ? colors.accent.primary : colors.glass.backdrop,
      },
    ];
  };

  const getIconColor = () => {
    return isSelected ? colors.text.inverse : colors.text.secondary;
  };

  const getTitleColor = () => {
    return colors.text.primary;
  };

  const getDescriptionColor = () => {
    return colors.text.secondary;
  };

  return (
    <TouchableOpacity
      style={[
        ...getCardStyle(),
        comingSoon && styles.comingSoonCard
      ]}
      onPress={onPress}
      disabled={comingSoon}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={getIconContainerStyle()}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={getIconColor()} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: getTitleColor() }]}>
              {title}
            </Text>
            {comingSoon && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>
                  Coming Soon
                </Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.description, { color: getDescriptionColor() }]}>
            {description}
          </Text>
        </View>
        
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark" size={16} color={colors.accent.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B8F9A',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.blue.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
