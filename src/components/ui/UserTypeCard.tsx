import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

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
  const getCardStyle = () => {
    if (isSelected) {
      return [styles.card, styles.selectedCard];
    }
    return [styles.card, styles.defaultCard];
  };

  const getIconContainerStyle = () => {
    if (isSelected) {
      return [styles.iconContainer, styles.selectedIconContainer];
    }
    return [styles.iconContainer, styles.defaultIconContainer];
  };

  const getIconColor = () => {
    if (isSelected) {
      return Colors.blue.primary;
    }
    return Colors.text.tertiary;
  };

  const getTitleColor = () => {
    if (isSelected) {
      return Colors.text.primary;
    }
    return Colors.text.primary;
  };

  const getDescriptionColor = () => {
    if (isSelected) {
      return Colors.text.secondary;
    }
    return Colors.text.tertiary;
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
            <Ionicons name="checkmark" size={16} color={Colors.text.primary} />
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
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  defaultCard: {
    backgroundColor: Colors.glass.light,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  selectedCard: {
    backgroundColor: Colors.glass.medium,
    borderWidth: 2,
    borderColor: Colors.blue.primary,
  },
  comingSoonCard: {
    opacity: 0.6,
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
  defaultIconContainer: {
    backgroundColor: Colors.glass.dark,
  },
  selectedIconContainer: {
    backgroundColor: Colors.blue.primary,
    opacity: 0.2,
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
    backgroundColor: Colors.glass.dark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.tertiary,
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
