import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('campusmart_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('campusmart_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (title, message, type = 'info', link = '/notifications') => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      type,
      read: false,
      link
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
