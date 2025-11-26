import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersHistory } from '../../service/pedidoService';
import './AllOrders.css';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      
      try {
        const result = await getOrdersHistory();
        
        if (result.success && result.data) {
          const sortedOrders = result.data.sort((a, b) => 
            new Date(b.fechaCreacion || b.createdAt) - new Date(a.fechaCreacion || a.createdAt)
          );
          
          setOrders(sortedOrders);
        } else {
          console.error('Error al obtener pedidos:', result.error);
          setError(result.error || 'Error al cargar los pedidos');
          setOrders([]);
        }
        
      } catch (error) {
        console.error('Error inesperado al cargar pedidos:', error);
        setError('Error inesperado al cargar los pedidos');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    const estadoLower = estado?.toLowerCase();
    switch (estadoLower) {
      case 'pendiente':
      case 'pending':
        return 'status-pending';
      case 'confirmado':
      case 'confirmed':
        return 'status-confirmed';
      case 'en_preparacion':
      case 'preparing':
        return 'status-preparing';
      case 'enviado':
      case 'shipped':
        return 'status-shipped';
      case 'entregado':
      case 'delivered':
        return 'status-delivered';
      case 'cancelado':
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const getStatusText = (estado) => {
    const estadoLower = estado?.toLowerCase();
    switch (estadoLower) {
      case 'pendiente':
      case 'pending':
        return 'Pendiente';
      case 'confirmado':
      case 'confirmed':
        return 'Confirmado';
      case 'en_preparacion':
      case 'preparing':
        return 'En Preparación';
      case 'enviado':
      case 'shipped':
        return 'Enviado';
      case 'entregado':
      case 'delivered':
        return 'Entregado';
      case 'cancelado':
      case 'cancelled':
        return 'Cancelado';
      default:
        return estado || 'Desconocido';
    }
  };

  const calculateTotal = (order) => {
    if (!order?.items || !Array.isArray(order.items)) return 0;
    
    return order.items.reduce((total, item) => {
      const precio = item.precio || item.precioUnitario || 0;
      const cantidad = item.cantidad || 0;
      const subtotal = item.subtotal || (precio * cantidad);
      
      return total + subtotal;
    }, 0);
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

  if (error) {
    return (
      <div className="all-orders-container">
        <h1>Mis Pedidos</h1>
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Intentar nuevamente
          </button>
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
      <div className="orders-header">
        <h1>Mis Pedidos</h1>
      </div>

      <div className="orders-list">
        {currentOrders.map(order => (
          <div key={order._id || order.id} className="order-card">
            <div className="order-header">
              <div className="order-id">
                <span className="order-label">Pedido:</span>
                <span className="order-number">
                  #{(order._id || order.id)?.toString().slice(-8)}
                </span>
              </div>
              <div className={`order-status ${getStatusColor(order.estado)}`}>
                {getStatusText(order.estado)}
              </div>
            </div>
            
            <div className="order-body">
              <div className="order-date">
                <span className="date-label">Fecha de pedido:</span>
                <span className="date-value">
                  {formatDate(order.fechaCreacion || order.createdAt)}
                </span>
              </div>
              
              <div className="order-items-summary">
                <span className="items-count">
                  {order.items?.length || 0} {(order.items?.length === 1) ? 'producto' : 'productos'}
                </span>
                <span className="order-total">
                  Total: {order.moneda || '$'} ${calculateTotal(order).toLocaleString() || '0'}
                </span>
              </div>
              
              {/*<div className="order-vendor">
                <span className="vendor-label">Vendedor:</span>
                <span className="vendor-name">
                  {order.vendedor?.nombre || 'No especificado'}
                </span>
              </div>*/}
            </div>
            
            <div className="order-actions">
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(order._id || order.id)}
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Anterior
          </button>
          
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default AllOrders;