import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

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
  const [isFocused, setIsFocused] = useState(false);

  const getInputContainerStyle = () => {
    return [
      GlobalStyles.glassInput, 
      GlobalStyles.row,
      error && styles.inputError,
      !error && isFocused && styles.inputFocused,
      !editable && styles.inputDisabled,
      multiline && styles.inputMultiline,
      style,
    ].filter(Boolean);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[GlobalStyles.label, styles.label]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textInputMultiline,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.placeholder}
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
              color={isFocused ? Colors.blue.primary : Colors.text.placeholder} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>
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
  inputError: {
    borderColor: Colors.status.error,
    borderWidth: 2,
  },
  inputFocused: {
    borderColor: Colors.blue.primary,
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: Colors.glass.dark,
    opacity: 0.6,
  },
  inputMultiline: {
    minHeight: 80,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  textInputMultiline: {
    textAlignVertical: 'top',
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: 14,
    marginTop: 4,
  },
});
