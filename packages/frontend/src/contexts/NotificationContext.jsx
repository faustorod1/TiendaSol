import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as notificationService from '../service/notificationService.js';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshContext = useCallback(async () => {
    setLoading(true);
    try {
      const response = await notificationService.fetchNotifications(1, 5);
      setRecentNotifications(response.data);
      setUnreadCount(response.totalUnreadCount);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) refreshContext();
  }, [refreshContext]);

  // Funciones para manejar notificaciones
  const markAsRead = async (id) => {
    const target = recentNotifications.find(n => n._id === id);
    const estabaNoLeida = target && !target.leida;

    setRecentNotifications(prev => prev.map(n => 
      n._id === id ? { ...n, leida: true } : n
    ));
    
    if (estabaNoLeida) decrementUnreadCount();

    try {
      await notificationService.markNotificationAsRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    setUnreadCount(0);
    setRecentNotifications(prev => prev.map(n => ({ ...n, leida: true })));
    try {
      await notificationService.markAllNotificationsAsRead();
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (id) => {
    const target = recentNotifications.find(n => n._id === id);
    const estabaNoLeida = target && !target.leida;

    setRecentNotifications(prev => prev.filter(n => n._id !== id));
    if (estabaNoLeida) decrementUnreadCount();

    try {
      await notificationService.deleteNotificationById(id);
    } catch (err) { console.error(err); }
  };

  
  const decrementUnreadCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const value = {
    recentNotifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshContext,
    decrementUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};