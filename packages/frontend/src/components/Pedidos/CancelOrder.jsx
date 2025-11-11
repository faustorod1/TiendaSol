import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidoById } from '../mockData/Pedidos.js';
import './CancelOrder.css';

const CancelOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadOrder = () => {
      setLoading(true);
      setError(null);
      
      try {
        const foundOrder = getPedidoById(id);
        if (foundOrder) {
          // Verificar si el pedido se puede cancelar
          const cancellableStates = ['pendiente', 'confirmado', 'en_preparacion'];
          if (cancellableStates.includes(foundOrder.estado.toLowerCase())) {
            setOrder(foundOrder);
          } else {
            setError('Este pedido no se puede cancelar en su estado actual');
          }
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

  const handleReasonChange = (e) => {
    setCancelReason(e.target.value);
  };

  const handleConfirmCancellation = async (e) => {
    e.preventDefault();
    
    if (!cancelReason.trim()) {
      alert('Por favor, ingresa un motivo para la cancelación');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para cancelar el pedido
      // Por ahora solo simulamos la operación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Cancelando pedido:', {
        orderId: id,
        reason: cancelReason
      });
      
      navigate(`/account/pedidos/${id}`, { 
        state: { message: 'Pedido cancelado exitosamente' }
      });
      
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      alert('Error al cancelar el pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/account/pedidos/${id}`);
  };

  if (loading) {
    return (
      <div className="cancel-order-container">
        <div className="loading-message">
          <p>Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="cancel-order-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'No se pudo cargar el pedido'}</p>
          <button onClick={() => navigate('/account/pedidos')} className="back-button">
            Volver a mis pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cancel-order-container">
      <div className="cancel-order-header">
        <button onClick={handleGoBack} className="back-button">
          ← Volver al pedido
        </button>
        <h1>Cancelar pedido #{order.id.slice(-8)}</h1>
      </div>

      <div className="cancel-order-card">
        <div className="order-summary">
          <h3>Resumen del pedido</h3>
          <div className="summary-info">
            <p><strong>Fecha:</strong> {new Date(order.fechaCreacion).toLocaleDateString('es-AR')}</p>
            <p><strong>Estado actual:</strong> {order.estado}</p>
            <p><strong>Vendedor:</strong> {order.vendedor.nombre}</p>
            <p><strong>Total:</strong> {order.moneda} ${order.items.reduce((total, item) => total + item.subtotal(), 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="warning-section">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h4>¿Estás seguro de que quieres cancelar este pedido?</h4>
            <p>Esta acción no se puede deshacer. Una vez cancelado, tendrás que realizar un nuevo pedido si cambias de opinión.</p>
          </div>
        </div>

        <form onSubmit={handleConfirmCancellation} className="cancel-form">
          <div className="form-group">
            <label htmlFor="cancelReason">
              Motivo de la cancelación <span className="required">*</span>
            </label>
            <textarea
              id="cancelReason"
              value={cancelReason}
              onChange={handleReasonChange}
              placeholder="Por favor, explica brevemente el motivo de la cancelación..."
              required
              disabled={isSubmitting}
              rows={4}
              maxLength={500}
            />
            <small className="char-count">
              {cancelReason.length}/500 caracteres
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="confirm-cancel-button"
              disabled={isSubmitting || !cancelReason.trim()}
            >
              {isSubmitting ? 'Cancelando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrder;