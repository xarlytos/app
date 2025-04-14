import * as React from 'react';
import { ApplicationSettings } from '@nativescript/core';

export interface User {
  id: string;
  nombre: string;
  rol: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

  // Check if user is already logged in on component mount
  React.useEffect(() => {
    const storedToken = ApplicationSettings.getString('authToken', null);
    const storedUserData = ApplicationSettings.getString('userData', null);
    
    if (storedToken && storedUserData) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If there's an error parsing user data, clear the auth data
        ApplicationSettings.remove('authToken');
        ApplicationSettings.remove('userData');
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    // Save to state
    setToken(newToken);
    setUser(newUser);
    
    // Save to persistent storage
    ApplicationSettings.setString('authToken', newToken);
    ApplicationSettings.setString('userData', JSON.stringify(newUser));
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    
    // Clear persistent storage
    ApplicationSettings.remove('authToken');
    ApplicationSettings.remove('userData');
  };

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => React.useContext(AuthContext);