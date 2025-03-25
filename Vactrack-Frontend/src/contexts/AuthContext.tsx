
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Backend API URL
const API_URL = "http://localhost:8080/api";

interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check for existing login on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      // Configure axios to use the token for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsLoggedIn(true);
      setIsAdmin(userData.role === "ADMIN"); // Kiểm tra role "ADMIN" thay vì "admin"
    }
  }, []);

  // Login function that connects to Spring Boot backend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Set the authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      setIsAdmin(userData.role === "ADMIN"); // Kiểm tra role "ADMIN" thay vì "admin"
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function that connects to Spring Boot backend
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Set the authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      setIsAdmin(userData.role === "ADMIN"); // Kiểm tra role "ADMIN" thay vì "admin"
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from axios headers
    delete axios.defaults.headers.common["Authorization"];
    
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
