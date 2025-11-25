import React, { useCallback, useEffect, useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import * as notificationService from '../../service/notificationService.js';
import './AllNotifications.css';

const AllNotifications = () => {
  const { decrementUnreadCount, markAllAsRead: contextMarkAll } = useNotifications();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread'); // 'all', 'unread', 'read'
  const [totalUnfiltered, setTotalUnfiltered] = useState(0);
  const [totalUnread, setTotalUnread] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let filterParam = 'all';
      if (filter === 'unread') filterParam = 'false';
      if (filter === 'read') filterParam = 'true';

      const response = await notificationService.fetchNotifications(page, 10, filterParam);

      if (page === 1) {
        setNotifications(response.data);
      } else {
        setNotifications(prev => [...prev, ...response.data]);
      }
      setTotalPages(response.totalPages);
      setTotalUnfiltered(response.totalUnfilteredCount);
      setTotalUnread(response.totalUnreadCount);
    } catch (err) {
      console.error('Error al cargar notificaciones: ', err);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    setPage(1);
    loadData();
  }, [filter]);

  useEffect(() => {
    if (page > 1) loadData();
  }, [page]);

  
  const handleMarkRead = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.markNotificationAsRead(id);
      
      // Contexto local
      const notif = notifications.find(n => n._id === id);
      setNotifications(prev => prev.map(n => n._id === id ? {...n, leida: true} : n));
      
      // Contexto Global (NotificationContext)
      if (notif && !notif.leida) {
        decrementUnreadCount(); 
        setTotalUnread(prev => prev - 1);
      }
      
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("¿Eliminar notificación?")) return;

    const prevNotifications = [...notifications];
    const prevTotalUnfiltered = totalUnfiltered;
    const prevTotalUnread = totalUnread;

    const notifTarget = notifications.find(n => n._id === id);
    const eraNoLeida = notifTarget && !notifTarget.leida;

    setNotifications(prev => prev.filter(n => n._id !== id));
    setTotalUnfiltered(prev => Math.max(0, prev - 1));
    
    if (eraNoLeida) {
        setTotalUnread(prev => Math.max(0, prev - 1));
        decrementUnreadCount();
    }

    try {
        await notificationService.deleteNotificationById(id);
    } catch (err) {
        console.error("Error al eliminar, revirtiendo cambios:", err);
        
        // Rollback si falló
        setNotifications(prevNotifications);
        setTotalUnfiltered(prevTotalUnfiltered);
        setTotalUnread(prevTotalUnread);
        
        alert("Hubo un error de conexión al eliminar la notificación.");
    }
};

  const handleMarkAll = async () => {
      await contextMarkAll();
      setNotifications(prev => prev.map(n => ({...n, leida: true})));
      setTotalUnread(0);
  };


  return (
    <div className="all-notifications">
      <div className="notifications-header">
        <h1>Todas las notificaciones</h1>
        <div className="notifications-actions">
          <button onClick={handleMarkAll} className="mark-all-read">
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <div className="notifications-filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          Todas ({totalUnfiltered})
        </button>
        <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>
          No leídas ({totalUnread})
        </button>
        <button className={filter === 'read' ? 'active' : ''} onClick={() => setFilter('read')}>
          Leídas ({totalUnfiltered - totalUnread})
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 && !loading ? (
          <div className="no-notifications">
            No hay notificaciones para mostrar
          </div>
        ) : (
          <>
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`notification-item ${notification.leida ? 'read' : 'unread'}`}
                onClick={() => navigate(`/notifications/${notification._id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* ... Contenido de la notificación ... */}
                <div className="notification-content">
                    <p>{notification.mensaje}</p>
                    <span className="notification-time">
                    {new Date(notification.fechaAlta).toLocaleString()}
                    </span>
                </div>
                
                <div className="notification-actions">
                    {!notification.leida && (
                    <button onClick={(e) => handleMarkRead(e, notification._id)} className="mark-read-btn">
                        Marcar como leída
                    </button>
                    )}
                    <button onClick={(e) => handleDelete(e, notification._id)} className="delete-btn">
                        Eliminar
                    </button>
                </div>
              </div>
            ))}

            {/* --- AQUÍ ESTÁ LA PAGINACIÓN AGREGADA --- */}
            {page < totalPages && (
              <div className="pagination-container">
                <button 
                  className="load-more-btn"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Cargar más notificaciones'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllNotifications;