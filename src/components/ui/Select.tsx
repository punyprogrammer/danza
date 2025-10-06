import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../../styles/globalStyles';
import { useTheme } from '../ThemeProvider';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onSelect: (value: string) => void;
  options: SelectOption[];
  error?: string;
  style?: any;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  onSelect,
  options,
  error,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  const getSelectStyle = () => {
    const baseStyle = [
      styles.selectContainer,
      {
        backgroundColor: colors.glass.backgroundLight,
        borderColor: error ? colors.status.error : isFocused ? colors.accent.primary : colors.glass.borderLight,
        shadowColor: colors.glass.shadow,
      },
      GlobalStyles.row,
    ];
    
    if (error) {
      baseStyle.push(styles.selectError);
    } else if (isFocused) {
      baseStyle.push(styles.selectFocused);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[GlobalStyles.label, styles.label, { color: colors.text.primary }]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={getSelectStyle()}
        onPress={() => {
          setIsOpen(true);
          setIsFocused(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.selectText,
          { color: selectedOption ? colors.text.primary : colors.text.placeholder }
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        <Ionicons 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={colors.text.placeholder} 
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, { color: colors.status.error }]}>
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsOpen(false);
          setIsFocused(false);
        }}
      >
        <TouchableOpacity
          style={GlobalStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setIsOpen(false);
            setIsFocused(false);
          }}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.glass.backgroundHeavy, borderColor: colors.glass.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.glass.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                {label || 'Select an option'}
              </Text>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.glass.border },
                    selectedOption?.value === item.value && { backgroundColor: colors.glass.backdrop }
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                >
                  <View style={GlobalStyles.spaceBetween}>
                    <Text style={[
                      styles.optionText,
                      { color: selectedOption?.value === item.value ? colors.accent.primary : colors.text.primary },
                      selectedOption?.value === item.value && styles.selectedOptionText
                    ]}>
                      {item.label}
                    </Text>
                    {selectedOption?.value === item.value && (
                      <Ionicons name="checkmark" size={20} color={colors.accent.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  selectContainer: {
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
  selectError: {
    borderWidth: 2,
  },
  selectFocused: {
    borderWidth: 2,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
});