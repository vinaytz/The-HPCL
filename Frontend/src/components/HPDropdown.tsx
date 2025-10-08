import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownOption {
  label: string;
  value: string;
}

interface HPDropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  required?: boolean;
}

const { width } = Dimensions.get('window');

export const HPDropdown: React.FC<HPDropdownProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  style,
  labelStyle,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, labelStyle]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.dropdownText,
          !selectedOption && styles.placeholderText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedValue === item.value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedValue === item.value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                  {selectedValue === item.value && (
                    <Ionicons name="checkmark" size={20} color="#3B82F6" />
                  )}
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
    marginBottom: width < 400 ? 16 : 20,
  },
  label: {
    fontSize: width < 400 ? 14 : 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  required: {
    color: '#E74C3C',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingHorizontal: width < 400 ? 12 : 16,
    paddingVertical: width < 400 ? 12 : 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  dropdownText: {
    fontSize: width < 400 ? 14 : 16,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: '#B0B0B0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: width < 400 ? 16 : 20,
    maxHeight: '70%',
    minWidth: width < 400 ? '90%' : '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width < 400 ? 16 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: width < 400 ? 16 : 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width < 400 ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#EBF4FF',
  },
  optionText: {
    fontSize: width < 400 ? 14 : 16,
    color: '#2C3E50',
    flex: 1,
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});
