import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface HPLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const { width } = Dimensions.get('window');

export const HPLogo: React.FC<HPLogoProps> = ({
  size = 'medium',
  showText = true,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          text: styles.smallText,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          text: styles.largeText,
        };
      default:
        return {
          container: styles.mediumContainer,
          text: styles.mediumText,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={styles.logoContainer}>
      <View style={[styles.logo, sizeStyles.container]}>
        <Text style={[styles.logoText, sizeStyles.text]}>HP</Text>
      </View>
      {showText && (
        <Text style={styles.brandText}>Hindustan Petroleum</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: width < 400 ? 16 : 20,
  },
  logo: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1E3A8A',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  smallContainer: {
    width: width < 400 ? 50 : 60,
    height: width < 400 ? 50 : 60,
  },
  mediumContainer: {
    width: width < 400 ? 70 : 80,
    height: width < 400 ? 70 : 80,
  },
  largeContainer: {
    width: width < 400 ? 90 : 100,
    height: width < 400 ? 90 : 100,
  },
  logoText: {
    color: '#DC2626',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallText: {
    fontSize: width < 400 ? 16 : 20,
  },
  mediumText: {
    fontSize: width < 400 ? 24 : 28,
  },
  largeText: {
    fontSize: width < 400 ? 32 : 36,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: width < 400 ? 12 : 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});
