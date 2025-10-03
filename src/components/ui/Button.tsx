import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

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
  const getButtonStyle = () => {
    const baseStyle = [styles.button, GlobalStyles.row, GlobalStyles.centerContent];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(GlobalStyles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(GlobalStyles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(GlobalStyles.outlineButton);
        break;
      case 'social':
        baseStyle.push(GlobalStyles.socialButton);
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
      baseStyle.push(styles.buttonDisabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(GlobalStyles.primaryButtonText);
        break;
      case 'secondary':
        baseStyle.push(GlobalStyles.secondaryButtonText);
        break;
      case 'outline':
        baseStyle.push(GlobalStyles.secondaryButtonText);
        break;
      case 'social':
        baseStyle.push(GlobalStyles.buttonText);
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
    
    return baseStyle;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'outline':
      case 'secondary':
        return Colors.blue.primary;
      case 'social':
        return Colors.text.primary;
      default:
        return Colors.text.primary;
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
  },
  buttonSmall: {
    paddingHorizontal: 16,
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
