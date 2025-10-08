import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
