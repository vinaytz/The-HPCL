import React, { useEffect, useRef, useState } from 'react';
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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { HPInput } from '@/src/components/HPInput';
import { HPButton } from '@/src/components/HPButton';
import { HPLogo } from '@/src/components/HPLogo';
import { HPDropdown } from '@/src/components/HPDropdown';
import { apiCall } from '@/src/utils/callAPI';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // simple entrance animations & responsive helpers
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideUp]);

  const isSmall = width < 360;
  const containerPadH = Math.min(width * 0.06, 26);
  const titleSize = isSmall ? 22 : 26;
  const subtitleSize = isSmall ? 12 : 14;

  const userTypeOptions = [
    { label: 'RE Officer', value: 're_officer' },
    { label: 'Sales Officer', value: 'sales_officer' },
    { label: 'Dealer', value: 'dealer' },
    { label: 'Vendor', value: 'vendor' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { userType, firstName, lastName, email, phone, password, confirmPassword } = formData;
    
    if (!userType || !firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };


  const handleSignup = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);

      const { success, data, error } = await apiCall("/auth/signup", "POST", {
          userType: formData.userType,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });

      Alert.alert('Success', 'Account created successfully!');

      router.push(`/${data.userType}/dashboard`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
};



  const handleOAuthSignup = (provider: string) => {
    Alert.alert('OAuth Signup', `Sign up with ${provider} - Implementation needed`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={["#EAF2FF", "#F7FAFF"]}
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
              <Ionicons name="arrow-back" size={24} color="#0B1220" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}> Sign Up</Text>
          </View>

          {/* Logo Section */}
          <Animated.View style={[styles.logoSection, { opacity: fadeIn, transform: [{ translateY: slideUp }] }] }>
            <HPLogo size={width < 400 ? "medium" : "large"} showText={false} />
            <Text
              style={styles.brandLine}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Hindustan Petroleum
            </Text>
            <Text style={[styles.welcomeTitle, { fontSize: titleSize, color: '#0B1220' }]}>Create your account</Text>
            <Text style={[styles.welcomeText, { fontSize: subtitleSize, color: '#334155', paddingHorizontal: Math.max(20, width * 0.12) }]}>Join the HPCL experience — fast, secure, and professional.</Text>
          </Animated.View>


          {/* Form Section */}
          <Animated.View style={[styles.formSection, { paddingHorizontal: containerPadH, opacity: fadeIn, transform: [{ translateY: slideUp }] }] }>
            <HPDropdown
              label="Login As"
              options={userTypeOptions}
              selectedValue={formData.userType}
              onValueChange={(value) => handleInputChange('userType', value)}
              placeholder="Select your role"
              required
            />

            <View style={styles.nameRow}>
              <View style={[styles.nameInput, { flex: 1, marginRight: width * 0.02 }]}>
                <HPInput
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  required
                />
              </View>
              <View style={[styles.nameInput, { flex: 1, marginLeft: width * 0.02 }]}>
                <HPInput
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  required
                />
              </View>
            </View>

            <HPInput
              label="Email Id"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              icon="mail"
              keyboardType="email-address"
              required
            />

            <HPInput
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              icon="call"
              keyboardType="phone-pad"

              required
            />

            <HPInput
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              icon="lock-closed"
              rightIcon={showPassword ? "eye-off" : "eye"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              required
            />

            <HPInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              icon="lock-closed"
              rightIcon={showConfirmPassword ? "eye-off" : "eye"}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              required
            />
            <Text  style={styles.errorMsg}></Text>
            <HPButton
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              style={styles.signupButton}
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
                  onPress={() => handleOAuthSignup('Google')}
                  variant="outline"
                  size="medium"
                  style={{ ...(styles.oauthButton as any), flex: 1 }}
                  icon={<Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 6 }} />}
                />
                <HPButton
                  title="Microsoft"
                  onPress={() => handleOAuthSignup('Microsoft')}
                  variant="outline"
                  size="medium"
                  style={{ ...(styles.oauthButton as any), flex: 1 }}
                  icon={<Ionicons name="logo-microsoft" size={18} color="#00A4EF" style={{ marginRight: 6 }} />}
                />
              </View>
            </View>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity  onPress={() => router.push('auth/login' as any)}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorMsg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ca0c19ff',
    fontWeight:500,
    fontSize:19
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
    fontSize: width < 400 ? 22 : 26,
    fontWeight: '800',
    color: '#0B1220',
    marginLeft: 12,
  },
  logoSection: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
  },
  brandLine: {
    marginTop: 8,
    color: '#0B5ED7',
    fontWeight: '700',
    textAlign: 'center',
    width: '80%',
  },
  welcomeTitle: {
    marginTop: 10,
    color: '#E8F0FF',
    fontWeight: '800',
  },
  welcomeText: {
    fontSize: width < 400 ? 14 : 16,
    color: '#A6B3D0',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: width < 400 ? 20 : 22,
    opacity: 0.9,
    paddingHorizontal: width * 0.1,
  },
  formSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 18,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.02,
    marginTop: height * 0.02,
    flex: 1,
    borderColor: '#E6EEF9',
    borderWidth: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width < 400 ? 10 : 20,
  },
  nameInput: {
    marginBottom: 0,
  },
  signupButton: {
    marginTop: 8,
    marginBottom: height * 0.02,
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
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.025,
    flexWrap: 'wrap',
  },
  loginText: {
    color: '#6B7280',
    fontSize: width < 400 ? 14 : 16,
  },
  loginLink: {
    color: '#3B82F6',
    fontSize: width < 400 ? 14 : 16,
    fontWeight: '600',
  },
});











// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   Dimensions,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { HPInput } from '@/src/components/HPInput';
// import { HPButton } from '@/src/components/HPButton';
// import { HPLogo } from '@/src/components/HPLogo';
// import { HPDropdown } from '@/src/components/HPDropdown';
// import { apiCall } from '@/src/utils/callAPI';

// const { width, height } = Dimensions.get('window');

// export default function SignupScreen() {
//   const [formData, setFormData] = useState({
//     userType: '',
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const userTypeOptions = [
//     { label: 'RE Officer', value: 're_officer' },
//     { label: 'Sales Officer', value: 'sales_officer' },
//     { label: 'Dealer', value: 'dealer' },
//     { label: 'Vendor', value: 'vendor' },
//   ];

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const validateForm = () => {
//     const { userType, firstName, lastName, email, phone, password, confirmPassword } = formData;
    
//     if (!userType || !firstName || !lastName || !email || !phone || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return false;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return false;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters long');
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email address');
//       return false;
//     }

//     return true;
//   };


//   const handleSignup = async () => {
//     if (!validateForm()) return;
//     try {
//       setLoading(true);

//       const { success, data, error } = await apiCall("/auth/signup", "POST", {
//           userType: formData.userType,
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//           phone: formData.phone,
//           password: formData.password,
//           confirmPassword: formData.confirmPassword
//         });

//       Alert.alert('Success', 'Account created successfully!');


//       router.push(`/${data.userType}/dashboard`);
//     } catch (err) {
//       console.error(err);   if (!validateForm()) return;
//     } finally {
//       setLoading(false);
//     }
// };



//   const handleOAuthSignup = (provider: string) => {
//     Alert.alert('OAuth Signup', `Sign up with ${provider} - Implementation needed`);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <LinearGradient
//         colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
//         style={styles.gradient}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => router.back()}
//             >
//               <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>Sign Up</Text>
//           </View>

//           {/* Logo Section */}
//           <View style={styles.logoSection}>
//             <HPLogo size={width < 400 ? "medium" : "large"} showText={true} />
//           </View>


//           {/* Form Section */}
//           <View style={styles.formSection}>
//             <HPDropdown
//               label="Login As"
//               options={userTypeOptions}
//               selectedValue={formData.userType}
//               onValueChange={(value) => handleInputChange('userType', value)}
//               placeholder="Select your role"
//               required
//             />

//             <View style={styles.nameRow}>
//               <View style={[styles.nameInput, { flex: 1, marginRight: width * 0.02 }]}>
//                 <HPInput
//                   label="First Name"
//                   placeholder="Enter first name"
//                   value={formData.firstName}
//                   onChangeText={(value) => handleInputChange('firstName', value)}
//                   required
//                 />
//               </View>
//               <View style={[styles.nameInput, { flex: 1, marginLeft: width * 0.02 }]}>
//                 <HPInput
//                   label="Last Name"
//                   placeholder="Enter last name"
//                   value={formData.lastName}
//                   onChangeText={(value) => handleInputChange('lastName', value)}
//                   required
//                 />
//               </View>
//             </View>

//             <HPInput
//               label="Email Id"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChangeText={(value) => handleInputChange('email', value)}
//               icon="mail"
//               keyboardType="email-address"
//               required
//             />

//             <HPInput
//               label="Phone Number"
//               placeholder="Enter your phone number"
//               value={formData.phone}
//               onChangeText={(value) => handleInputChange('phone', value)}
//               icon="call"
//               keyboardType="phone-pad"
//               required
//             />

//             <HPInput
//               label="Password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChangeText={(value) => handleInputChange('password', value)}
//               secureTextEntry={!showPassword}
//               icon="lock-closed"
//               rightIcon={showPassword ? "eye-off" : "eye"}
//               onRightIconPress={() => setShowPassword(!showPassword)}
//               required
//             />

//             <HPInput
//               label="Confirm Password"
//               placeholder="Confirm your password"
//               value={formData.confirmPassword}
//               onChangeText={(value) => handleInputChange('confirmPassword', value)}
//               secureTextEntry={!showConfirmPassword}
//               icon="lock-closed"
//               rightIcon={showConfirmPassword ? "eye-off" : "eye"}
//               onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
//               required
//             />

//             <HPButton
//               title="Create Account"
//               onPress={handleSignup}
//               loading={loading}
//               style={styles.signupButton}
//             />

//             {/* OAuth Section */}
//             <View style={styles.oauthSection}>
//               <View style={styles.divider}>
//                 <View style={styles.dividerLine} />
//                 <Text style={styles.dividerText}>OR</Text>
//                 <View style={styles.dividerLine} />
//               </View>

//               <View style={styles.oauthButtons}>
//                 <HPButton
//                   title="Google"
//                   onPress={() => handleOAuthSignup('Google')}
//                   variant="outline"
//                   size="medium"
//                   style={[styles.oauthButton, { minWidth: width * 0.35 }] as any}
//                   icon={<Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 6 }} />}
//                 />
//                 <HPButton
//                   title="Microsoft"
//                   onPress={() => handleOAuthSignup('Microsoft')}
//                   variant="outline"
//                   size="medium"
//                   style={[styles.oauthButton, { minWidth: width * 0.35 }] as any}
//                   icon={<Ionicons name="logo-microsoft" size={18} color="#00A4EF" style={{ marginRight: 6 }} />}
//                 />
//               </View>
//             </View>

//             {/* Login Link */}
//             <View style={styles.loginSection}>
//               <Text style={styles.loginText}>Already have an account? </Text>
//               <TouchableOpacity  onPress={() => router.push('/login' as any)}>
//                 <Text style={styles.loginLink}>Sign In</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </LinearGradient>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradient: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: height * 0.05,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: width * 0.05,
//     paddingTop: height * 0.08,
//     paddingBottom: height * 0.025,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: width < 400 ? 20 : 24,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginLeft: 16,
//   },
//   logoSection: {
//     alignItems: 'center',
//     paddingHorizontal: width * 0.05,
//     marginBottom: height * 0.025,
//   },
//   welcomeText: {
//     fontSize: width < 400 ? 14 : 16,
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginTop: 16,
//     lineHeight: width < 400 ? 20 : 24,
//     opacity: 0.9,
//     paddingHorizontal: width * 0.1,
//   },
//   formSection: {
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     paddingHorizontal: width * 0.06,
//     paddingTop: height * 0.04,
//     paddingBottom: height * 0.025,
//     marginTop: height * 0.025,
//     flex: 1,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: -4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4.65,
//     elevation: 8,
//   },
//   nameRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: width < 400 ? 10 : 20,
//   },
//   nameInput: {
//     marginBottom: 0,
//   },
//   signupButton: {
//     marginTop: 8,
//     marginBottom: height * 0.03,
//   },
//   oauthSection: {
//     marginBottom: height * 0.03,
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: height * 0.025,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#E5E7EB',
//   },
//   dividerText: {
//     marginHorizontal: 16,
//     color: '#6B7280',
//     fontSize: width < 400 ? 12 : 14,
//     fontWeight: '500',
//   },
//   oauthButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: width * 0.03,
//   },
//   oauthButton: {
//     flex: 1,
//   },
//   loginSection: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: height * 0.025,
//     flexWrap: 'wrap',
//   },
//   loginText: {
//     color: '#6B7280',
//     fontSize: width < 400 ? 14 : 16,
//   },
//   loginLink: {
//     color: '#3B82F6',
//     fontSize: width < 400 ? 14 : 16,
//     fontWeight: '600',
//   },
// });
