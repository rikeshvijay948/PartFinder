import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole, customData?: Partial<AuthUser>) => boolean;
  loginAsDemo: (role: UserRole) => void;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    workshopName?: string;
    shopName?: string;
    location?: string;
  }) => boolean;
  logout: () => void;
}

const DEMO_USERS: Record<UserRole, AuthUser> = {
  MECHANIC: {
    id: 'usr-mech-1',
    name: 'Ramesh Kumar',
    email: 'mechanic@partfinder.com',
    role: 'MECHANIC',
    phone: '+91 98420 77890',
    workshopName: 'Apex Auto Garage (5 Roads)',
    location: 'Salem, Tamil Nadu',
    joinedDate: 'Jan 2026',
  },
  SHOP: {
    id: 'usr-shop-1',
    name: 'Lakshmi Nathan',
    email: 'shop@partfinder.com',
    role: 'SHOP',
    phone: '+91 98427 11223',
    shopName: 'Sri Lakshmi Auto Spares',
    location: 'Salem • 5 Roads Hub',
    joinedDate: 'Nov 2025',
  },
  ADMIN: {
    id: 'usr-admin-1',
    name: 'Super Admin',
    email: 'admin@partfinder.com',
    role: 'ADMIN',
    phone: '+91 98400 00001',
    location: 'PartFinder HQ',
    joinedDate: 'Sep 2025',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('partfinder_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('partfinder_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('partfinder_auth_user');
    }
  }, [user]);

  const login = (email: string, role: UserRole = 'MECHANIC', customData?: Partial<AuthUser>): boolean => {
    if (email.toLowerCase().includes('shop') || role === 'SHOP') {
      setUser({ ...DEMO_USERS.SHOP, ...customData, email });
      return true;
    }
    if (email.toLowerCase().includes('admin') || role === 'ADMIN') {
      setUser({ ...DEMO_USERS.ADMIN, ...customData, email });
      return true;
    }
    setUser({
      ...DEMO_USERS.MECHANIC,
      ...customData,
      email,
      name: customData?.name || email.split('@')[0] || 'Ramesh Kumar',
    });
    return true;
  };

  const loginAsDemo = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const register = (data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    workshopName?: string;
    shopName?: string;
    location?: string;
  }): boolean => {
    const newUser: AuthUser = {
      id: 'usr-' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      workshopName: data.workshopName || (data.role === 'MECHANIC' ? 'Master Tech Auto Garage' : undefined),
      shopName: data.shopName || (data.role === 'SHOP' ? data.name + ' Spares' : undefined),
      location: data.location || 'Salem, Tamil Nadu',
      joinedDate: 'Today',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('partfinder_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        register,
        logout,
      }}
    >
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
