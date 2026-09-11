import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

export type UserRole = 'STUDENT' | 'STAFF' | 'RESEARCHER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole | string | null;
  googleId?: string | null;
  createdAt?: string | Date;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsRoleCompletion: boolean;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<AuthUser | null>;
  loginWithGoogle: (googleData: { email: string; name: string; googleId?: string; role?: UserRole }) => Promise<AuthUser | null>;
  completeProfile: (role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('researchpilot_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsRoleCompletion, setNeedsRoleCompletion] = useState<boolean>(false);

  // Restore session on mount / refresh
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('researchpilot_token');
      if (storedToken) {
        const meRes = await apiService.getMe();
        if (meRes && meRes.user) {
          setUser(meRes.user);
          setIsAuthenticated(true);
          if (!meRes.user.role) {
            setNeedsRoleCompletion(true);
          }
        } else {
          // Token invalid or expired
          localStorage.removeItem('researchpilot_token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    setIsLoading(true);
    const res = await apiService.login(email, password);
    setIsLoading(false);

    if (res && res.token && res.user) {
      localStorage.setItem('researchpilot_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      return res.user;
    }
    return null;
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<AuthUser | null> => {
    setIsLoading(true);
    const res = await apiService.register(name, email, password, role);
    setIsLoading(false);

    if (res && res.token && res.user) {
      localStorage.setItem('researchpilot_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      return res.user;
    }
    return null;
  };

  const loginWithGoogle = async (googleData: { email: string; name: string; googleId?: string; role?: UserRole }): Promise<AuthUser | null> => {
    setIsLoading(true);
    const res = await apiService.googleAuth(googleData);
    setIsLoading(false);

    if (res && res.token) {
      localStorage.setItem('researchpilot_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);

      if (res.needsRole || !res.user.role) {
        setNeedsRoleCompletion(true);
      } else {
        setNeedsRoleCompletion(false);
      }
      return res.user;
    }
    return null;
  };

  const completeProfile = async (role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    const res = await apiService.completeProfile(role);
    setIsLoading(false);

    if (res && res.user) {
      setUser(res.user);
      if (res.token) {
        localStorage.setItem('researchpilot_token', res.token);
        setToken(res.token);
      }
      setNeedsRoleCompletion(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('researchpilot_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setNeedsRoleCompletion(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading,
      needsRoleCompletion,
      login,
      register,
      loginWithGoogle,
      completeProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
