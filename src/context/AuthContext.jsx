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

  // Admin Database Persistence State
  const [adminDatabase, setAdminDatabase] = useState(() => {
    const savedAdmins = localStorage.getItem('campusmart_admin_db');
    if (savedAdmins) {
      try {
        return JSON.parse(savedAdmins);
      } catch (e) {
        console.error('Failed to parse admin DB', e);
      }
    }
    // Default initial Admin accounts database
    const initialAdmins = [
      {
        id: 'admin-1',
        name: 'CampusMart Super Administrator',
        email: 'admin@campusmart.in',
        password: 'admin', // Stored password credential
        role: 'Super Administrator',
        isAdmin: true,
        college: 'CampusMart System HQ',
        department: 'Operations & Platform Moderation',
        year: 'Senior System Admin',
        phone: '+91 99000 11223',
        rating: 5.0,
        joinedDate: 'Jan 2024',
        location: 'Campus HQ Control Room',
        status: 'Active'
      }
    ];
    localStorage.setItem('campusmart_admin_db', JSON.stringify(initialAdmins));
    return initialAdmins;
  });

  useEffect(() => {
    localStorage.setItem('campusmart_admin_db', JSON.stringify(adminDatabase));
  }, [adminDatabase]);

  const login = (email, password) => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Check against Admin Database
    const foundAdmin = adminDatabase.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    if (foundAdmin) {
      // Validate password if provided
      if (password && foundAdmin.password && password !== foundAdmin.password) {
        return { success: false, error: 'Invalid admin password. Please check your credentials.' };
      }

      const adminUser = {
        ...foundAdmin,
        isAdmin: true,
        role: foundAdmin.role || 'Admin'
      };
      setUser(adminUser);
      localStorage.setItem('campusmart_user', JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    // Default fallback admin check for admin@campusmart.in
    if (cleanEmail === 'admin@campusmart.in') {
      const defaultAdmin = adminDatabase[0] || {
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
      setUser(defaultAdmin);
      localStorage.setItem('campusmart_user', JSON.stringify(defaultAdmin));
      return { success: true, user: defaultAdmin };
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
    const defaultAdmin = adminDatabase[0] || {
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
    setUser(defaultAdmin);
    localStorage.setItem('campusmart_user', JSON.stringify(defaultAdmin));
    return { success: true, user: defaultAdmin };
  };

  const register = (formData) => {
    const isAdminAccount = formData.accountType === 'Admin' || formData.isAdmin || formData.role === 'Admin';
    const newUser = {
      id: (isAdminAccount ? 'admin-' : 'user-') + Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password || 'admin',
      role: isAdminAccount ? (formData.role || 'Admin') : 'Student',
      isAdmin: isAdminAccount,
      college: formData.college || (isAdminAccount ? 'CampusMart System HQ' : 'IIT Delhi'),
      department: formData.department || (isAdminAccount ? 'Platform Operations & Safety' : 'Computer Science'),
      year: formData.year || (isAdminAccount ? 'System Administrator' : '1st Year'),
      phone: formData.phone || '+91 98765 00000',
      rating: 5.0,
      reviewsCount: 0,
      joinedDate: 'Sep 2026',
      status: 'Active',
      location: formData.location || (isAdminAccount ? 'Campus HQ Control Center' : (formData.college || 'Campus') + ' Hostel')
    };

    if (isAdminAccount) {
      // Save into persistent Admin Database
      setAdminDatabase((prev) => {
        const filtered = prev.filter((a) => a.email.toLowerCase() !== newUser.email.toLowerCase());
        return [newUser, ...filtered];
      });
    }

    setUser(newUser);
    localStorage.setItem('campusmart_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const addAdminAccount = (adminData) => {
    const newAdmin = {
      id: 'admin-' + Date.now(),
      name: adminData.name,
      email: adminData.email,
      password: adminData.password || 'admin123',
      role: adminData.role || 'Platform Moderator',
      isAdmin: true,
      college: adminData.college || 'CampusMart System HQ',
      department: adminData.department || 'Content Moderation & Verification',
      year: 'System Administrator',
      phone: adminData.phone || '+91 99000 00000',
      rating: 5.0,
      joinedDate: 'Sep 2026',
      status: 'Active',
      location: 'Admin Control Center'
    };
    setAdminDatabase((prev) => [newAdmin, ...prev]);
    return newAdmin;
  };

  const updateAdminPassword = (adminId, newPassword) => {
    setAdminDatabase((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, password: newPassword } : a))
    );
  };

  const deleteAdminAccount = (adminId) => {
    setAdminDatabase((prev) => prev.filter((a) => a.id !== adminId));
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
    localStorage.removeItem('campusmart_admin_db');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
      adminDatabase,
      addAdminAccount,
      updateAdminPassword,
      deleteAdminAccount,
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
