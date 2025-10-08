import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { HPInput } from '@/src/components/HPInput';
import { HPButton } from '@/src/components/HPButton';
import { HPLogo } from '@/src/components/HPLogo';
import { apiCall } from '@/src/utils/callAPI';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
 const [errorMessage, setErrorMessage] = useState("");


   const dashboardRoutes = {
     re_officer: '/(re-officer)/dashboard',
     sales_officer: '/(sales-officer)/dashboard',
     dealer: '/dealer/dashboard',
     vendor: '/vendor/dashboard',
   } as const satisfies Record<string, Href>;

const validateForm = () => {
  if (!email || !password) {
    setErrorMessage("Please fill in all fields");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setErrorMessage("Please enter a valid email address");
    return false;
  }

  setErrorMessage(""); // clear previous error if valid
  return true;
};
const handleLogin = async () => {
  if (!validateForm()) return;

  setLoading(true);
  setErrorMessage("");
  // call the global apiCall instead of axios.post
  const { success, data, error } = await apiCall("/auth/login", "POST", {
    email,
    password,
  });

  if (success) {
    console.log(data); // data from backend
    Alert.alert("Success", "Account logged in successfully!");
    const path = dashboardRoutes[data.userType as keyof typeof dashboardRoutes] ?? '/';
    router.push(path as Href);
  } else {
    setErrorMessage(error || "Login failed. Please try again.");
  }

  setLoading(false);
};


  const handleOAuthLogin = (provider: string) => {
    Alert.alert('OAuth Login', `Login with ${provider} - Implementation needed`);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality - Implementation needed');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign In</Text>
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <HPLogo size={width < 400 ? "medium" : "large"} showText={true} />
            <Text style={styles.welcomeText}>
              Sign in to your account to get access of various M&R management features
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <HPInput
              label="Email Id"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              icon="mail"
              keyboardType="email-address"
              required
            />

            <HPInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon="lock-closed"
              rightIcon={showPassword ? "eye-off" : "eye"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              required
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <HPButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            {/* OAuth Section */}
            <View style={styles.oauthSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.oauthButtons}>
                <HPButton
                  title="Google"
                  onPress={() => handleOAuthLogin('Google')}
                  variant="outline"
                  size="medium"
                  style={[styles.oauthButton, { minWidth: width * 0.35 }] as any}
                  icon={<Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 6 }} />}
                />
                <HPButton
                  title="Microsoft"
                  onPress={() => handleOAuthLogin('Microsoft')}
                  variant="outline"
                  size="medium"
                  style={[styles.oauthButton, { minWidth: width * 0.35 }] as any}
                  icon={<Ionicons name="logo-microsoft" size={18} color="#00A4EF" style={{ marginRight: 6 }} />}
                />
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupSection}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.08,
    paddingBottom: height * 0.025,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: width < 400 ? 20 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  logoSection: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.025,
  },
  welcomeText: {
    fontSize: width < 400 ? 14 : 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: width < 400 ? 20 : 24,
    opacity: 0.9,
    paddingHorizontal: width * 0.1,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.025,
    marginTop: height * 0.025,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: height * 0.03,
  },
  forgotPasswordText: {
    color: '#E74C3C',
    fontSize: width < 400 ? 12 : 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: height * 0.03,
  },
  oauthSection: {
    marginBottom: height * 0.03,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: width < 400 ? 12 : 14,
    fontWeight: '500',
  },
  oauthButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: width * 0.03,
  },
  oauthButton: {
    flex: 1,
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.025,
    flexWrap: 'wrap',
  },
  signupText: {
    color: '#6B7280',
    fontSize: width < 400 ? 14 : 16,
  },
  signupLink: {
    color: '#3B82F6',
    fontSize: width < 400 ? 14 : 16,
    fontWeight: '600',
  },
});
