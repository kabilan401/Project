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
        college: 'CampusMart HQ',
        department: 'Operations & Safety',
        year: 'System Administrator',
        phone: '+91 99000 11223',
        rating: 5.0,
        joinedDate: 'Jan 2024',
        location: 'Campus HQ Control Room'
      };
      setUser(adminUser);
      localStorage.setItem('campusmart_user', JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    // Standard student login
    const saved = localStorage.getItem('campusmart_user');
    const existingUser = saved ? JSON.parse(saved) : null;

    const loggedUser = existingUser ? {
      ...existingUser,
      email: email || existingUser.email
    } : {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
    };
    setUser(loggedUser);
    localStorage.setItem('campusmart_user', JSON.stringify(loggedUser));
    return { success: true, user: loggedUser };
  };

  const loginAsDemo = () => {
    const saved = localStorage.getItem('campusmart_user');
    const existingUser = saved ? JSON.parse(saved) : null;
    const demoUserToUse = existingUser || DEMO_USER;
    setUser(demoUserToUse);
    localStorage.setItem('campusmart_user', JSON.stringify(demoUserToUse));
    return { success: true, user: demoUserToUse };
  };

  const loginAsAdmin = () => {
    const adminUser = {
      id: 'admin-1',
      name: 'CampusMart Administrator',
      email: 'admin@campusmart.in',
      role: 'Admin',
      isAdmin: true,
      college: 'CampusMart System HQ',
      department: 'Platform Admin',
      year: 'System Administrator',
      phone: '+91 99000 11223',
      rating: 5.0,
      joinedDate: 'Jan 2024',
      location: 'Campus HQ Control Room'
    };
    setUser(adminUser);
    localStorage.setItem('campusmart_user', JSON.stringify(adminUser));
    return { success: true, user: adminUser };
  };

  const register = (formData) => {
    const isAdminAccount = formData.accountType === 'Admin' || formData.isAdmin || formData.role === 'Admin';
    const newUser = {
      id: (isAdminAccount ? 'admin-' : 'user-') + Date.now(),
      name: formData.name,
      email: formData.email,
      role: isAdminAccount ? 'Admin' : 'Student',
      isAdmin: isAdminAccount,
      college: formData.college || (isAdminAccount ? 'CampusMart System HQ' : 'IIT Delhi'),
      department: formData.department || (isAdminAccount ? 'Platform Operations & Safety' : 'Computer Science'),
      year: formData.year || (isAdminAccount ? 'System Administrator' : '1st Year'),
      phone: formData.phone || '+91 98765 00000',
      rating: 5.0,
      reviewsCount: 0,
      joinedDate: 'Sep 2026',
      location: formData.location || (isAdminAccount ? 'Campus HQ Control Center' : (formData.college || 'Campus') + ' Hostel')
    };
    setUser(newUser);
    localStorage.setItem('campusmart_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...(prev || DEMO_USER), ...updatedFields };
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
