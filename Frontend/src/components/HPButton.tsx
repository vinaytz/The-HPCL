import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

interface HPButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const { width } = Dimensions.get('window');

export const HPButton: React.FC<HPButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary];
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'outline':
        return [...baseStyle, styles.outline];
      default:
        return [...baseStyle, styles.primary];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        return [...baseTextStyle, styles.primaryText];
      case 'secondary':
        return [...baseTextStyle, styles.secondaryText];
      case 'outline':
        return [...baseTextStyle, styles.outlineText];
      default:
        return [...baseTextStyle, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#1E3A8A' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: width < 400 ? 14 : 16,
    paddingHorizontal: width < 400 ? 20 : 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primary: {
    backgroundColor: '#1A1A1A',
  },
  secondary: {
    backgroundColor: '#3B82F6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  small: {
    paddingVertical: width < 400 ? 10 : 12,
    paddingHorizontal: width < 400 ? 16 : 20,
  },
  medium: {
    paddingVertical: width < 400 ? 12 : 14,
    paddingHorizontal: width < 400 ? 18 : 22,
  },
  large: {
    paddingVertical: width < 400 ? 14 : 16,
    paddingHorizontal: width < 400 ? 20 : 24,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#1E3A8A',
  },
  smallText: {
    fontSize: width < 400 ? 12 : 14,
  },
  mediumText: {
    fontSize: width < 400 ? 14 : 16,
  },
  largeText: {
    fontSize: width < 400 ? 16 : 18,
  },
});
