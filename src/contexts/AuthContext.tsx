
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user types
export type UserRole = 'explorer' | 'business' | 'super-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: UserRole, city?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define the AuthProvider as a function component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Mock authentication functions
  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Create a mock user (in a real app, this would come from your API)
      const user: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0], // Use part of email as name
        email,
        role
      };
      
      setCurrentUser(user);
      // No longer returning user, to match the Promise<void> type
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, role: UserRole, city?: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Create a new user (in a real app, this would be done on your API)
      const user: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role,
        city
      };
      
      setCurrentUser(user);
      // No longer returning user, to match the Promise<void> type
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signUp,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
