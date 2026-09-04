import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USER } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusmart_user');
    return saved ? JSON.parse(saved) : null; // Starts clean / logged out by default
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusmart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campusmart_user');
    }
  }, [user]);

  const login = (email, password) => {
    // Check if admin login
    if (email === 'admin@campusmart.in') {
      const adminUser = {
        id: 'admin-1',
        name: 'CampusMart Administrator',
        email: 'admin@campusmart.in',
        role: 'Admin',
        isAdmin: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        college: 'CampusMart HQ',
        department: 'Operations & Safety',
        year: 'Staff',
        phone: '+91 99000 11223',
        rating: 5.0,
        joinedDate: 'Jan 2024'
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    // Standard student login
    const loggedUser = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
    };
    setUser(loggedUser);
    return { success: true, user: loggedUser };
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  };

  const loginAsAdmin = () => {
    const adminUser = {
      id: 'admin-1',
      name: 'CampusMart Administrator',
      email: 'admin@campusmart.in',
      role: 'Admin',
      isAdmin: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      college: 'CampusMart System HQ',
      department: 'Platform Admin',
      year: 'Staff',
      phone: '+91 99000 11223',
      rating: 5.0,
      joinedDate: 'Jan 2024'
    };
    setUser(adminUser);
    return { success: true, user: adminUser };
  };

  const register = (formData) => {
    const newUser = {
      id: 'user-' + Date.now(),
      name: formData.name,
      email: formData.email,
      role: 'Student',
      isAdmin: false,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      college: formData.college || 'IIT Delhi',
      department: formData.department || 'Computer Science',
      year: formData.year || '1st Year',
      phone: formData.phone || '+91 98765 00000',
      rating: 5.0,
      reviewsCount: 0,
      joinedDate: 'Sep 2026',
      location: (formData.college || 'Campus') + ' Hostel'
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('campusmart_user', JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
  };

  const clearAllApplicationData = () => {
    localStorage.removeItem('campusmart_user');
    localStorage.removeItem('campusmart_products');
    localStorage.removeItem('campusmart_chats');
    localStorage.removeItem('campusmart_notifications');
    localStorage.removeItem('campusmart_wishlist');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
      login,
      loginAsDemo,
      loginAsAdmin,
      register,
      updateProfile,
      logout,
      clearAllApplicationData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
