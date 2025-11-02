import React from 'react';
import { Link } from 'react-router-dom';
import './Notifications.css';

const Notifications = ({ isOpen, onClose, notifications = [] }) => {
  // Limitar a máximo 5 notificaciones para mostrar en el dropdown
  const displayNotifications = notifications.slice(0, 5);
  const hasMoreNotifications = notifications.length > 5;

  const handleNotificationClick = (notificationId) => {
    console.log('Notification clicked:', notificationId);
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
      {}
      <div className="notifications-overlay" onClick={onClose}></div>
      
      <div className="notifications-dropdown">
        <div className="notifications-header">
          <h3>Notificaciones</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="notifications-content">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <>
              <div className="notifications-list">
                {displayNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="notification-item"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">
                        {formatTimeAgo(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreNotifications && (
                <div className="notifications-footer">
                  <Link 
                    to="/notifications" 
                    className="view-all-button"
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