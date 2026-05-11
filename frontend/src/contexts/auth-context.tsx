'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, SignupCredentials, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        // Prevent SSR issues by checking if we're on the client
        if (typeof window === 'undefined') {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        const token = localStorage.getItem('auth-token');
        if (token) {
          // Single hardcoded user
          const singleUser: User = {
            id: '1',
            email: 'admin@enforcer.dev',
            name: 'Admin User',
            role: 'creator',
            plan: 'pro',
            createdAt: '2024-01-01T00:00:00Z',
            lastLogin: new Date().toISOString(),
            isPublisher: true,
          };
          dispatch({ type: 'SET_USER', payload: singleUser });
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
      
      // Single hardcoded user - anyone can login
      const singleUser: User = {
        id: '1',
        email: 'admin@enforcer.dev',
        name: 'Admin User',
        role: 'creator',
        plan: 'pro',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: new Date().toISOString(),
        isPublisher: true,
      };
      
      localStorage.setItem('auth-token', 'mock-jwt-token');
      localStorage.setItem('user-role', 'creator');
      localStorage.setItem('user-email', singleUser.email);
      localStorage.setItem('user-publishes-apis', 'true');
      dispatch({ type: 'SET_USER', payload: singleUser });
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
        isPublisher: credentials.role === 'creator',
      };
      
      localStorage.setItem('auth-token', 'mock-jwt-token');
      localStorage.setItem('user-role', credentials.role);
      localStorage.setItem('user-email', credentials.email);
      if (credentials.role === 'creator') {
        localStorage.setItem('user-publishes-apis', 'true');
      }
      dispatch({ type: 'SET_USER', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = (): void => {
    try {
      // Check if we're on the client side before accessing localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-email');
      }
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still dispatch logout even if localStorage fails
      dispatch({ type: 'LOGOUT' });
    }
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
  return context;
};