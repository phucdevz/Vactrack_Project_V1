
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check for existing login on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    // In a real app, we would validate credentials with the backend
    // For now, we'll simulate a successful login
    const mockUser = {
      id: "user-1",
      name: "Nguyễn Văn A",
      email,
    };
    
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoggedIn(true);
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    // In a real app, we would send registration data to the backend
    // For now, we'll simulate a successful registration
    const mockUser = {
      id: "user-" + Date.now(),
      name,
      email,
    };
    
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoggedIn(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>
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
