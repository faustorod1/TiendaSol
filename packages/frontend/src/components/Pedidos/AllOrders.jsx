import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidos } from '../mockData/Pedidos.js';
import './AllOrders.css';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Por ahora usamos un usuario mock - después esto vendría del contexto de autenticación
  const currentUserId = "654c6c9a29a67a001a1d1d01";

  useEffect(() => {
    const loadOrders = () => {
      setLoading(true);
      try {
        // Filtrar pedidos del usuario actual (como comprador)
        const userOrders = pedidos.filter(pedido => pedido.comprador._id === currentUserId);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentUserId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'status-pending';
      case 'confirmado':
        return 'status-confirmed';
      case 'en_preparacion':
        return 'status-preparing';
      case 'enviado':
        return 'status-shipped';
      case 'entregado':
        return 'status-delivered';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const getStatusText = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'confirmado':
        return 'Confirmado';
      case 'en_preparacion':
        return 'En Preparación';
      case 'enviado':
        return 'Enviado';
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/account/pedidos/${orderId}`);
  };

  if (loading) {
    return (
      <div className="all-orders-container">
        <h1>Mis Pedidos</h1>
        <div className="loading-message">
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="all-orders-container">
        <h1>Mis Pedidos</h1>
        <div className="no-orders-message">
          <p>No tienes pedidos realizados aún.</p>
          <a href="/productos" className="browse-products-link">
            Explorar productos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="all-orders-container">
      <h1>Mis Pedidos</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-id">
                <span className="order-label">Pedido:</span>
                <span className="order-number">#{order.id.slice(-8)}</span>
              </div>
              <div className={`order-status ${getStatusColor(order.estado)}`}>
                {getStatusText(order.estado)}
              </div>
            </div>
            
            <div className="order-body">
              <div className="order-date">
                <span className="date-label">Fecha de pedido:</span>
                <span className="date-value">{formatDate(order.fechaCreacion)}</span>
              </div>
              
              <div className="order-items-summary">
                <span className="items-count">
                  {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                </span>
                <span className="order-total">
                  Total: {order.moneda} ${order.items.reduce((total, item) => total + item.subtotal(), 0).toLocaleString()}
                </span>
              </div>
              
              <div className="order-vendor">
                <span className="vendor-label">Vendedor:</span>
                <span className="vendor-name">{order.vendedor.nombre}</span>
              </div>
            </div>
            
            <div className="order-actions">
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(order.id)}
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;