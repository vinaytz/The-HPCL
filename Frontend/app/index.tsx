import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, Button, ActivityIndicator } from "react-native";
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const { width, height } = Dimensions.get('window');

export default function Index() {
  const handleSignIn = () => {
    router.push('/auth/login' as any);
  };

  const handleSignUp = () => {
    router.push('/auth/signup' as any);
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in
    console.log('Google sign in');
  };

  let storage;

if (typeof window !== 'undefined') {
  // Running in browser
  storage = {
    getItem: async (key:any) => localStorage.getItem(key),
    setItem: async (key:any, value:any) => localStorage.setItem(key, value),
    removeItem: async (key:any) => localStorage.removeItem(key),
  };
} else {
  // Running in React Native
  import('@react-native-async-storage/async-storage').then((mod) => {
    storage = mod.default;
  });
}

  const [isLoading, setIsLoading] = useState(true); // check in progress
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:9888/api/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          await AsyncStorage.removeItem('userToken');
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.log('Token verification failed:', err);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);


   if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Checking login status...</Text>
      </View>
    );
  }


  if(isLoggedIn) {
    return <View>Dashboad</View>
  } 

  return (
    <>
    
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        
        <View style={styles.statusBarIcons}>
        
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
       
        <View style={styles.illustrationContainer}>
          <View style={styles.gasPump}>
            {/* Pump Body */}
            <View style={styles.pumpBody}>
              {/* Top Cap */}
              <View style={styles.pumpCap} />
              
              {/* Front Panel */}
              <View style={styles.frontPanel}>
                {/* Display Screen */}
                <View style={styles.displayScreen}>
                  <View style={styles.screenBorder} />
                  <View style={styles.screenContent} />
                </View>
                
                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                  <View style={styles.button}>
                    <View style={styles.buttonInner} />
                  </View>
                  <View style={styles.button}>
                    <View style={styles.buttonInner} />
                  </View>
                </View>
                
                {/* Lower Red Section */}
                <View style={styles.lowerSection} />
              </View>
              
              {/* Right Side Panel */}
              <View style={styles.rightPanel}>
                <View style={styles.rightStrip} />
              </View>
            </View>
            
            {/* Hose and Nozzle */}
            <View style={styles.hoseContainer}>
              <View style={styles.hose} />
              <View style={styles.nozzle}>
                <View style={styles.nozzleBody} />
                <View style={styles.hpLogo}>
                  <Text style={styles.hpText}>HP</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          <Text style={styles.welcomeSubtitle}>
            Access HP Vensyne - your one-stop solution for retail operations.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Ionicons name="logo-google" size={20} color="#000" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    
    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700', // Yellow background
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  statusBarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusBarIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  gasPump: {
    alignItems: 'center',
    position: 'relative',
  },
  pumpBody: {
    position: 'relative',
    width: 80,
    height: 120,
    marginBottom: 20,
  },
  pumpCap: {
    width: 80,
    height: 15,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    marginBottom: 2,
  },
  frontPanel: {
    position: 'absolute',
    left: 0,
    top: 17,
    width: 50,
    height: 100,
  },
  displayScreen: {
    position: 'relative',
    width: 40,
    height: 25,
    marginLeft: 5,
    marginBottom: 8,
  },
  screenBorder: {
    position: 'absolute',
    width: 40,
    height: 25,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 4,
  },
  screenContent: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 36,
    height: 21,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  button: {
    width: 15,
    height: 15,
    backgroundColor: '#6B7280',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    width: 8,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 1,
  },
  lowerSection: {
    width: 50,
    height: 40,
    backgroundColor: '#DC2626',
    borderRadius: 4,
  },
  rightPanel: {
    position: 'absolute',
    right: 0,
    top: 17,
    width: 30,
    height: 100,
    backgroundColor: '#F97316',
    borderRadius: 4,
  },
  rightStrip: {
    position: 'absolute',
    right: 5,
    top: 10,
    width: 4,
    height: 80,
    backgroundColor: '#6B7280',
    borderRadius: 2,
  },
  hoseContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  hose: {
    width: 8,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 4,
    marginBottom: 5,
  },
  nozzle: {
    position: 'relative',
    alignItems: 'center',
  },
  nozzleBody: {
    width: 30,
    height: 20,
    backgroundColor: '#DC2626',
    borderRadius: 4,
    marginBottom: 5,
  },
  hpLogo: {
    position: 'absolute',
    top: 2,
    left: 8,
    width: 14,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hpText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: width < 400 ? 32 : 36,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: width < 400 ? 14 : 16,
    color: '#000',
    textAlign: 'center',
    lineHeight: width < 400 ? 20 : 24,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 16,
  },
  signInButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  signUpButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    gap: 12,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});
