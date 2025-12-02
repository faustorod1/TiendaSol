import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import { getPedidoById } from '../mockData/Pedidos.js';
import { getOrderById, changeOrderStatus } from '../../service/pedidoService';
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
    const loadOrder = async () => {
      setLoading(true);
      setError(null);
      
      try {

        const foundOrder = await getOrderById(id);

        if (foundOrder) {
          // Verificar si el pedido se puede cancelar
          const cancellableStates = ['pendiente', 'confirmado', 'en_preparacion'];
          if (cancellableStates.includes(foundOrder.data.estado.toLowerCase())) {
            setOrder(foundOrder.data);
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

  const handleConfirmCancellation = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;

    setIsSubmitting(true);

    try {
      // llamo al back
      const result = await changeOrderStatus(id, 'CANCELADO', cancelReason);
      
      if (result.success) {
        navigate(`/account/pedidos/${id}`, { 
          state: { message: 'Pedido cancelado exitosamente' }
        });
      } else {
        throw new Error(result.error);
      }
      
    } catch (err) {
      console.error('Error al cancelar:', err.message);
      alert(`No se pudo cancelar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (order.total) return order.total;
    return order?.items?.reduce((acc, item) => {
      const precio = item.precio || item.precioUnitario || 0;
      return acc + (precio * item.cantidad);
    }, 0) || 0;
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    }, []);

  const handleReasonChange = (e) => {
    setCancelReason(e.target.value);
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

  const getOrderId = () => {
    if (!order) return id;
    return (order._id || order.id || id).toString();
  };

  return (
    <div className="cancel-order-container">
      <div className="cancel-order-header">
        <button onClick={handleGoBack} className="back-button">
          ← Volver al pedido
        </button>
        <h1>Cancelar pedido #{getOrderId().slice(-8)}</h1>
      </div>

      <div className="cancel-order-card">
        <div className="order-summary">
          <h3>Resumen del pedido</h3>
          <div className="summary-info">
            <p><strong>Fecha:</strong> {new Date(order.fechaCreacion).toLocaleDateString('es-AR')}</p>
            <p><strong>Estado actual:</strong> {order.estado}</p>
            <p><strong>Vendedor:</strong> {order.vendedor.nombre}</p>
            <p><strong>Total:</strong> {order.moneda} ${calculateTotal().toLocaleString()}</p>
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