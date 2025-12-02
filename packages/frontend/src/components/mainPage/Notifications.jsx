import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = ({ isOpen, onClose, notifications = [], unreadCount = 0 }) => {
  
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return token && user;
  };

  const navigate = useNavigate();
  
  const displayNotifications = notifications;
  //const hasMoreNotifications = notifications.length > 5;

  const handleNotificationClick = (notificationId) => {
    navigate(`/notifications/${notificationId}`);
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

        {!isAuthenticated() ? (
          <div className="notif-signin-prompt">
            <div className="signin-message">
              <Link 
                to="/signin" 
                className="signin-link"
                onClick={onClose}
              >
                Inicie sesión para ver las notificaciones
              </Link>
            </div>
          </div>
        ) : (
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
                      key={notification._id}
                      className={`notif-item ${notification.leida ? 'leida' : ''}`}
                      onClick={() => handleNotificationClick(notification._id)}
                    >
                      <div className="notif-item-content">
                        {/* <div className="notif-title">{notification.title}</div> */}
                        <div className="notif-message" style={{ whiteSpace: 'pre-wrap' }}>{notification.mensaje}</div>
                        <div className="notif-time">
                          {formatTimeAgo(notification.fechaAlta)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {notifications.length > 0 && (
                  <div className="notif-footer">
                    <Link 
                      to="/notifications" 
                      className="notif-view-all"
                      onClick={onClose}
                    >
                      Ver todas ({unreadCount > 99 ? '+99' : unreadCount})
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;