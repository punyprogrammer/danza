import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../../styles/globalStyles';
import { useTheme } from '../ThemeProvider';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'social';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
}) => {
  const { colors } = useTheme();
  const getButtonStyle = () => {
    const baseStyle = [styles.button, GlobalStyles.row, GlobalStyles.centerContent];
    
    // Apply theme colors based on variant
    switch (variant) {
      case 'primary':
        baseStyle.push({
          backgroundColor: colors.accent.primary,
          borderColor: colors.accent.primary,
          shadowColor: colors.accent.primary,
        });
        break;
      case 'secondary':
        baseStyle.push({
          backgroundColor: colors.glass.backgroundLight,
          borderColor: colors.glass.borderLight,
          shadowColor: colors.glass.shadow,
        });
        break;
      case 'outline':
        baseStyle.push({
          backgroundColor: 'transparent',
          borderColor: colors.accent.primary,
          shadowColor: colors.glass.shadow,
        });
        break;
      case 'social':
        baseStyle.push({
          backgroundColor: colors.glass.backgroundLight,
          borderColor: colors.glass.borderLight,
          shadowColor: colors.glass.shadow,
        });
        break;
    }
    
    // Size adjustments
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge);
        break;
    }
    
    if (disabled) {
      baseStyle.push({
        ...styles.buttonDisabled,
        backgroundColor: 'rgba(66, 133, 244, 0.4)', // Lighter blue for disabled
        borderColor: 'rgba(66, 133, 244, 0.4)', // Lighter blue border
        opacity: 1, // Don't reduce opacity since we're using lighter color
      });
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    // Apply theme colors based on variant
    switch (variant) {
      case 'primary':
        baseStyle.push({
          color: '#FFFFFF', // Explicit white color for primary button
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        });
        break;
      case 'secondary':
        baseStyle.push({
          color: colors.text.primary,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        });
        break;
      case 'outline':
        baseStyle.push({
          color: colors.accent.primary,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        });
        break;
      case 'social':
        baseStyle.push({
          color: colors.text.primary,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        });
        break;
    }
    
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonTextSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonTextLarge);
        break;
    }
    
    if (disabled) {
      baseStyle.push({
        color: '#FFFFFF', // Explicit white color for disabled text
        opacity: 0.8, // Slightly reduce opacity for disabled text
      });
    }
    
    return baseStyle;
  };

  const getIconColor = () => {
    if (disabled) {
      return '#FFFFFF'; // Explicit white icon for disabled state
    }
    
    switch (variant) {
      case 'primary':
        return '#FFFFFF'; // Explicit white icon for primary button
      case 'outline':
      case 'secondary':
        return colors.accent.primary;
      case 'social':
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={getIconColor()} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={getIconColor()} 
              style={styles.iconLeft}
            />
          )}
          <Text style={getTextStyle()}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={getIconColor()} 
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 4,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonSmall: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonLarge: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
