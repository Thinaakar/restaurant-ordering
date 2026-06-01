'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '@/data/types';

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, restaurantName: string, email: string, password: string) => boolean;
  resetPassword: (email: string, newPassword: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('aura_admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('aura_admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === 'admin@restaurant.com' && password === 'admin123') {
      const adminUser: AdminUser = {
        email: 'admin@restaurant.com',
        name: 'Executive Chef & Admin',
        role: 'admin',
        avatar: '👨‍🍳',
      };
      setUser(adminUser);
      localStorage.setItem('aura_admin_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const register = (name: string, restaurantName: string, email: string, _password: string): boolean => {
    // Mock: always succeeds and logs in as the new user
    const newUser: AdminUser = {
      email,
      name,
      role: 'admin',
      avatar: '👨‍🍳',
    };
    setUser(newUser);
    localStorage.setItem('aura_admin_user', JSON.stringify(newUser));
    localStorage.setItem('aura_restaurant_name', restaurantName);
    return true;
  };

  const resetPassword = (email: string, _newPassword: string): boolean => {
    // Mock: succeeds only if email matches the known admin email
    return email === 'admin@restaurant.com' || email.includes('@');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aura_admin_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, resetPassword, logout, isAuthenticated }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
