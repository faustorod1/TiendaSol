import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notificaciones } from '../components/mockData/Notificaciones.js';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(Notificaciones);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funciones para manejar notificaciones
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Función para obtener notificaciones desde el backend (para el futuro)
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // const response = await fetch('http://localhost:8000/notifications');
      // const data = await response.json();
      // setNotifications(data);
      
      // Por ahora usar mock data
      setNotifications(Notificaciones);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calcular notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
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