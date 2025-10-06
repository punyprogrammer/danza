import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../../styles/globalStyles';
import { useTheme } from '../ThemeProvider';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  editable?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  style?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  error,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  editable = true,
  rightIcon,
  onRightIconPress,
  style,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getInputContainerStyle = () => {
    return [
      styles.inputContainer,
      {
        backgroundColor: colors.glass.backgroundLight,
        borderColor: error ? colors.status.error : isFocused ? colors.accent.primary : colors.glass.borderLight,
        shadowColor: colors.glass.shadow,
      },
      GlobalStyles.row,
      error && styles.inputError,
      !editable && styles.inputDisabled,
      multiline && styles.inputMultiline,
      style,
    ].filter(Boolean);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[GlobalStyles.label, styles.label, { color: colors.text.primary }]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        <TextInput
          style={[
            styles.textInput,
            { color: colors.text.primary },
            multiline && styles.textInputMultiline,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.text.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={isFocused ? colors.accent.primary : colors.text.placeholder} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: colors.status.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  inputError: {
    borderWidth: 2,
  },
  inputFocused: {
    borderWidth: 2,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  inputMultiline: {
    minHeight: 80,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  textInputMultiline: {
    textAlignVertical: 'top',
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
});
