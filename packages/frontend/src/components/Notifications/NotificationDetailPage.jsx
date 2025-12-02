import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import * as notificationService from '../../service/notificationService';
import './NotificationDetailPage.css';

const NotificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { decrementUnreadCount } = useNotifications();
  
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Para saber si ya procesó el marcar como leída la notificación
  const processedRef = useRef(false);

  useEffect(() => {
    processedRef.current = false;
  }, [id]);

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const data = await notificationService.fetchNotificationById(id);
        setNotification(data);

        if (!data.leida && !processedRef.current) {
          processedRef.current = true;
          decrementUnreadCount();

          await notificationService.markNotificationAsRead(id);
          setNotification(prev => ({ ...prev, leida: true }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOne();
  }, [id]);

  const formatFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: '📦',
      promotion: '🎉',
      stock: '✅',
      shipping: '🚚',
      reminder: '⏰',
      review: '⭐',
      system: '⚙️'
    };
    return icons[type] || '📢';
  };

  if (loading) {
    return (
      <div className="notification-detail-container">
        <div className="loading">Cargando notificación...</div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="notification-detail-container">
        <div className="not-found">
          <h2>Notificación no encontrada</h2>
          <p>La notificación que buscas no existe o ha sido eliminada.</p>
          <Link to="/notifications" className="back-link">
            Volver a notificaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-detail-container">
      <div className="notification-detail-card">
        {/* Header con navegación */}
        <div className="notification-detail-header">
          <button 
            onClick={() => navigate(-1)} 
            className="back-button"
            aria-label="Volver atrás"
          >
            ← Volver
          </button>
          <Link to="/notifications" className="all-notifications-link">
            Ver todas las notificaciones
          </Link>
        </div>

        {/* Contenido principal */}
        <div className="notification-detail-content">
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          
          <h1 className="notification-detail-title">
            {notification.title}
          </h1>

          <div className="notification-detail-message" style={{ whiteSpace: 'pre-wrap' }}>
            {notification.mensaje}
          </div>
          
          <div className="notification-detail-meta">
            <span className="notification-date">
              {formatFullDate(notification.fechaAlta)}
            </span>
            {notification.type && (
              <span className={`notification-type-badge ${notification.type}`}>
                {notification.type}
              </span>
            )}
          </div>
          
        </div>

        {/* Footer con acciones opcionales */}
        <div className="notification-detail-footer">
          <span className="notification-status">
            {notification.leida ? 'Leída' : 'Nueva'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailPage;