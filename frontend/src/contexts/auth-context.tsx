'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type UserRole = 'admin' | 'creator' | 'consumer';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing auth on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          // Get saved user role or default to consumer for subscriptions/marketplace access
          const savedRole = localStorage.getItem('user-role') as UserRole;
          const savedEmail = localStorage.getItem('user-email') || 'consumer@proxy.com';

          // Simulate API call to verify token
          const mockUser: User = {
            id: '1',
            email: savedEmail,
            name: savedRole === 'admin' ? 'Admin User' : savedRole === 'creator' ? 'Creator User' : 'Consumer User',
            role: savedRole || 'consumer', // Default to consumer for marketplace access
            plan: savedRole === 'creator' ? 'pro' : 'free',
            createdAt: '2024-01-01T00:00:00Z',
            lastLogin: new Date().toISOString(),
          };
          dispatch({ type: 'SET_USER', payload: mockUser });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Determine role based on email patterns
      let role: UserRole;
      if (credentials.email.includes('admin')) {
        role = 'admin';
      } else if (credentials.email.includes('creator') || credentials.email.includes('provider')) {
        role = 'creator';
      } else {
        role = 'consumer'; // Default to consumer for marketplace/subscriptions access
      }

      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: role === 'admin' ? 'Admin User' : role === 'creator' ? 'Creator User' : 'Consumer User',
        role: role,
        plan: role === 'creator' ? 'pro' : 'free',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem('auth-token', 'mock-jwt-token');
      localStorage.setItem('user-role', role);
      localStorage.setItem('user-email', credentials.email);
      dispatch({ type: 'SET_USER', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '2',
        email: credentials.email,
        name: credentials.name,
        role: credentials.role,
        plan: credentials.role === 'creator' ? 'pro' : 'free',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('auth-token', 'mock-jwt-token');
      localStorage.setItem('user-role', credentials.role);
      localStorage.setItem('user-email', credentials.email);
      dispatch({ type: 'SET_USER', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-email');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!state.user) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = { ...state.user, ...data };
    dispatch({ type: 'SET_USER', payload: updatedUser });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // <- this fixes the error
};