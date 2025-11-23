import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import './AllNotifications.css';

const AllNotifications = () => {
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const navigate = useNavigate();

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  if (loading) return <div className="loading">Cargando notificaciones...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="all-notifications">
      <div className="notifications-header">
        <h1>Todas las notificaciones</h1>
        
        <div className="notifications-actions">
          <button onClick={markAllAsRead} className="mark-all-read">
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <div className="notifications-filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </button>
        <button 
          className={filter === 'unread' ? 'active' : ''} 
          onClick={() => setFilter('unread')}
        >
          No leídas ({notifications.filter(n => !n.read).length})
        </button>
        <button 
          className={filter === 'read' ? 'active' : ''} 
          onClick={() => setFilter('read')}
        >
          Leídas ({notifications.filter(n => n.read).length})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            No hay notificaciones para mostrar
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.leida ? 'read' : 'unread'}`}
              onClick={() => navigate(`/notification/${notification._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="notification-content">
                {/* <h3>{notification.title}</h3> */}
                <p>{notification.mensaje}</p>
                <span className="notification-time">
                  {new Date(notification.fechaAlta).toLocaleString()}
                </span>
              </div>
              
              <div className="notification-actions">
                {!notification.leida && (
                  <button 
                    onClick={() => markAsRead(notification._id)}
                    className="mark-read-btn"
                  >
                    Marcar como leída
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notification._id)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllNotifications;