import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  options: MultiSelectOption[];
  error?: string;
  maxSelections?: number;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = 'Select options',
  selectedValues,
  onSelectionChange,
  options,
  error,
  maxSelections,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOptions = options.filter(option => selectedValues.includes(option.value));

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      // Remove from selection
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else {
      // Add to selection (check max selections)
      if (!maxSelections || selectedValues.length < maxSelections) {
        onSelectionChange([...selectedValues, value]);
      }
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    
    if (selectedValues.length === 1) {
      return selectedOptions[0]?.label || '';
    }
    
    return `${selectedValues.length} selected`;
  };

  return (
    <View className={`${className}`}>
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        className={`flex-row items-center justify-between border rounded-xl px-4 py-3 ${
          error ? 'border-red-500' : isFocused ? 'border-primary-500' : 'border-gray-300'
        } bg-white`}
        onPress={() => {
          setIsOpen(true);
          setIsFocused(true);
        }}
        activeOpacity={0.7}
      >
        <Text className={`flex-1 text-base ${
          selectedValues.length > 0 ? 'text-gray-900' : 'text-gray-500'
        }`}>
          {getDisplayText()}
        </Text>
        
        <Ionicons 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#6b7280" 
        />
      </TouchableOpacity>

      {/* Selected Items Preview */}
      {selectedValues.length > 0 && (
        <View className="flex-row flex-wrap mt-2">
          {selectedOptions.map((option) => (
            <View
              key={option.value}
              className="bg-primary-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
            >
              <Text className="text-primary-700 text-sm mr-1">
                {option.label}
              </Text>
              <TouchableOpacity
                onPress={() => handleToggleOption(option.value)}
                className="ml-1"
              >
                <Ionicons name="close" size={14} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {error && (
        <Text className="text-red-500 text-sm mt-1">
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
          className="flex-1 bg-black/50 justify-center px-4"
          activeOpacity={1}
          onPress={() => {
            setIsOpen(false);
            setIsFocused(false);
          }}
        >
          <View className="bg-white rounded-xl max-h-96">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">
                  {label || 'Select Options'}
                </Text>
                {maxSelections && (
                  <Text className="text-sm text-gray-500">
                    {selectedValues.length}/{maxSelections}
                  </Text>
                )}
              </View>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`px-4 py-3 border-b border-gray-100 ${
                    selectedValues.includes(item.value) ? 'bg-primary-50' : ''
                  } ${maxSelections && selectedValues.length >= maxSelections && !selectedValues.includes(item.value) ? 'opacity-50' : ''}`}
                  onPress={() => handleToggleOption(item.value)}
                  activeOpacity={0.7}
                  disabled={!!(maxSelections && selectedValues.length >= maxSelections && !selectedValues.includes(item.value))}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-base ${
                      selectedValues.includes(item.value) ? 'text-primary-600 font-medium' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </Text>
                    {selectedValues.includes(item.value) && (
                      <Ionicons name="checkmark" size={20} color="#3b82f6" />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            
            <View className="p-4 border-t border-gray-200">
              <TouchableOpacity
                className="bg-primary-600 py-3 rounded-lg items-center"
                onPress={() => {
                  setIsOpen(false);
                  setIsFocused(false);
                }}
              >
                <Text className="text-white font-semibold">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
