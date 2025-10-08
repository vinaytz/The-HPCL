import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HPInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  required?: boolean;
}

const { width } = Dimensions.get('window');

export const HPInput: React.FC<HPInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  icon,
  rightIcon,
  onRightIconPress,
  keyboardType = 'default',
  style,
  labelStyle,
  required = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, labelStyle]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.inputContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#0B5ED7"
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#7A8AA2"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          underlineColorAndroid="transparent"
          selectionColor="#0B5ED7"
          cursorColor="#0B5ED7"
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon} size={20} color="#0B5ED7" />
          </TouchableOpacity>
        )}
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  leftIcon: {
    marginRight: width < 400 ? 8 : 12,
  },
  input: {
    flex: 1,
    fontSize: width < 400 ? 14 : 16,
    color: '#0B1220',
    fontWeight: '500',
    backgroundColor: '#FFFFFF',
    paddingVertical: width < 400 ? 12 : 14,
    paddingHorizontal: width < 400 ? 12 : 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  rightIcon: {
    padding: 4,
  },
});
