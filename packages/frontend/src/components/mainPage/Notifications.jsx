import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = ({ isOpen, onClose, notifications = [] }) => {
  const navigate = useNavigate();
  
  // Limitar a máximo 5 notificaciones para mostrar en el dropdown
  const displayNotifications = notifications.slice(0, 5);
  const hasMoreNotifications = notifications.length > 5;

  const handleNotificationClick = (notificationId) => {
    // Navegar al detalle y cerrar dropdown
    navigate(`/notification/${notificationId}`);
    onClose();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="notif-overlay" onClick={onClose}></div>
      
      <div className="notif-dropdown">
        <div className="notif-header">
          <h3>Notificaciones</h3>
          <button onClick={onClose} className="notif-close">×</button>
        </div>

        <div className="notif-content">
          {notifications.length === 0 ? (
            <div className="notif-empty">
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <>
              <div className="notif-list">
                {displayNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="notif-item"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="notif-item-content">
                      <div className="notif-title">{notification.title}</div>
                      <div className="notif-message">{notification.message}</div>
                      <div className="notif-time">
                        {formatTimeAgo(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreNotifications && (
                <div className="notif-footer">
                  <Link 
                    to="/notifications" 
                    className="notif-view-all"
                    onClick={onClose}
                  >
                    Ver todas ({notifications.length})
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;