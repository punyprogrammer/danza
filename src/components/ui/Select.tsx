import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../../styles/globalStyles';
import { Colors } from '../../styles/colors';

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

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  const getSelectStyle = () => {
    const baseStyle = [GlobalStyles.glassInput, GlobalStyles.row];
    
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
        <Text style={[GlobalStyles.label, styles.label]}>
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
          { color: selectedOption ? Colors.text.primary : Colors.text.placeholder }
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        <Ionicons 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={Colors.text.placeholder} 
        />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>
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
          <View style={GlobalStyles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[GlobalStyles.title, styles.modalTitle]}>
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
                    selectedOption?.value === item.value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                >
                  <View style={GlobalStyles.spaceBetween}>
                    <Text style={[
                      styles.optionText,
                      selectedOption?.value === item.value && styles.selectedOptionText
                    ]}>
                      {item.label}
                    </Text>
                    {selectedOption?.value === item.value && (
                      <Ionicons name="checkmark" size={20} color={Colors.blue.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={GlobalStyles.primaryButton}
                onPress={() => {
                  setIsOpen(false);
                  setIsFocused(false);
                }}
              >
                <Text style={GlobalStyles.primaryButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
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
  selectError: {
    borderColor: Colors.status.error,
    borderWidth: 2,
  },
  selectFocused: {
    borderColor: Colors.blue.primary,
    borderWidth: 2,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: 14,
    marginTop: 4,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.border,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 0,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.border,
  },
  selectedOption: {
    backgroundColor: Colors.glass.light,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedOptionText: {
    color: Colors.blue.primary,
    fontWeight: '600',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.glass.border,
  },
});