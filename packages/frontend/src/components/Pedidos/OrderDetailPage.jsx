import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidoById } from '../mockData/Pedidos.js';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = () => {
      setLoading(true);
      setError(null);
      
      try {
        const foundOrder = getPedidoById(id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Pedido no encontrado');
        }
      } catch (err) {
        console.error("Error al cargar pedido:", err);
        setError('Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + item.subtotal(), 0);
  };

  const handleGoBack = () => {
    navigate('/account/pedidos');
  };

  const canCancelOrder = () => {
    const cancellableStates = ['pendiente', 'confirmado', 'en_preparacion'];
    return cancellableStates.includes(order.estado.toLowerCase());
  };

  // Función para manejar la cancelación del pedido
  const handleCancelOrder = () => {
    navigate(`/account/pedidos/${order.id}/cancelar`);
  };

  if (loading) {
    return (
      <div className="order-detail-container">
        <div className="loading-message">
          <p>Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'Pedido no encontrado'}</p>
          <button onClick={handleGoBack} className="back-button">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <button onClick={handleGoBack} className="back-button">
          ← Volver
        </button>
        <h1>Detalle del Pedido</h1>
      </div>

      <div className="order-detail-card">
        {/* Información principal del pedido */}
        <div className="order-main-info">
          <div className="order-id-section">
            <h2>Pedido #{order.id.slice(-8)}</h2>
            <div className={`order-status ${getStatusColor(order.estado)}`}>
              {getStatusText(order.estado)}
            </div>
          </div>

          <div className="order-info-grid">
            <div className="info-item">
              <span className="info-label">Fecha de pedido:</span>
              <span className="info-value">{formatDate(order.fechaCreacion)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Comprador:</span>
              <span className="info-value">{order.comprador.nombre}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Email del comprador:</span>
              <span className="info-value">{order.comprador.email}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Vendedor:</span>
              <span className="info-value">{order.vendedor.nombre}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Email del vendedor:</span>
              <span className="info-value">{order.vendedor.email}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Total del pedido:</span>
              <span className="info-value total-amount">
                {order.moneda} ${calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Dirección de entrega */}
        <div className="delivery-address-section">
          <h3>Dirección de Entrega</h3>
          <div className="address-info">
            <p>{order.direccionEntrega.calle}</p>
            <p>{order.direccionEntrega.ciudad}, {order.direccionEntrega.provincia}</p>
            <p>{order.direccionEntrega.codigoPostal}, {order.direccionEntrega.pais}</p>
          </div>
        </div>

        {/* Botón de cancelación (solo si se puede cancelar) */}
        {canCancelOrder() && (
          <div className="cancel-order-section">
            <button onClick={handleCancelOrder} className="cancel-order-button">
              Cancelar Pedido
            </button>
            <p className="cancel-order-note">
              Puedes cancelar este pedido mientras no haya sido enviado.
            </p>
          </div>
        )}

        {/* Lista de items */}
        <div className="order-items-section">
          <h3>Productos del Pedido</h3>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="item-card">
                <div className="item-info">
                  <h4 className="item-title">{item.producto.titulo}</h4>
                  <div className="item-details">
                    <span className="item-price">
                      Precio unitario: {order.moneda} ${item.precioUnitario.toLocaleString()}
                    </span>
                    <span className="item-quantity">
                      Cantidad: {item.cantidad}
                    </span>
                    <span className="item-subtotal">
                      Subtotal: {order.moneda} ${item.subtotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen final */}
        <div className="order-summary">
          <div className="summary-row">
            <span className="summary-label">Total de productos:</span>
            <span className="summary-value">{order.items.length}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Cantidad total de items:</span>
            <span className="summary-value">
              {order.items.reduce((total, item) => total + item.cantidad, 0)}
            </span>
          </div>
          <div className="summary-row total-row">
            <span className="summary-label">Total a pagar:</span>
            <span className="summary-value">
              {order.moneda} ${calculateTotal().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;