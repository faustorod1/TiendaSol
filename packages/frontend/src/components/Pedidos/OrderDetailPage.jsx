import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrderById } from '../../service/pedidoService';
import { changeOrderStatus } from '../../service/pedidoService.js';
import { fetchProductById } from '../../service/productoService.js';
import { getUserProfile } from '../../service/usuarioService.js';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [vendedor, setVendedor] = useState({});
  const [comprador, setComprador] = useState({});
  const [productos, setProductos] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const [pedidoCreado, setPedidoCreado] = useState(false);

  useEffect(() => {
    if (location.state?.pedidoCreado) {
      setPedidoCreado(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError('ID de pedido no válido');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const result = await getOrderById(id);
        
        if (result.success && result.data) {
          setOrder(result.data);
          
          const [vendedorData, compradorData] = await Promise.all([
            getUserProfile(result.data.vendedor),
            getUserProfile(result.data.comprador)
          ]);
          
          setVendedor(vendedorData.data || {});
          setComprador(compradorData.data || {});
          
        } else {
          console.error('Error en resultado:', result.error);
          setError(result.error || 'Pedido no encontrado');
        }
      } catch (err) {
        console.error("Error al cargar pedido:", err);
        setError('Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!order?.items || !Array.isArray(order.items)) {
        console.log('No hay items para cargar productos');
        return;
      }

      {/*order.items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          item_completo: item,
          _id: item._id,
          producto: item.producto,
          productoId: item.productoId,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          keys: Object.keys(item)
        });
      });*/}

      setLoadingProducts(true);
      const productosData = {};

      try {

        const productPromises = order.items.map(async (item) => {
          try {
            const productoId = item.producto || item.productoId || item._id;
            
            if (!productoId) {
              console.warn('Item sin ID de producto:', item);
              return {
                id: null,
                data: null,
                error: 'Sin ID de producto'
              };
            }
            
            const productResult = await fetchProductById(productoId);
            
            if (!productResult) {
              console.error('fetchProductById devolvió null/undefined para:', productoId);
              return {
                id: productoId,
                data: null,
                error: 'Respuesta nula del servicio'
              };
            }

            if (typeof productResult !== 'object') {
              console.error('Respuesta no es objeto para producto:', productoId, productResult);
              return {
                id: productoId,
                data: null,
                error: 'Formato de respuesta inválido'
              };
            }
            
            if ('success' in productResult) {
              if (productResult.success && productResult.data) {
                return {
                  id: productoId,
                  data: productResult.data,
                  error: null
                };
              } else {
                console.error('Error en formato success:', productoId, productResult.error || 'Sin error específico');
                return {
                  id: productoId,
                  data: null,
                  error: productResult.error || 'Error al cargar producto'
                };
              }
            }
            
            else if (productResult._id || productResult.id) {
              return {
                id: productoId,
                data: productResult,
                error: null
              };
            }
            
            else if (productResult.error || productResult.message) {
              console.error('Error directo en respuesta:', productoId, productResult.error || productResult.message);
              return {
                id: productoId,
                data: null,
                error: productResult.error || productResult.message
              };
            }
            
            else {
              console.error('Formato de respuesta desconocido:', productoId, productResult);
              return {
                id: productoId,
                data: null,
                error: `Formato de respuesta desconocido: ${JSON.stringify(productResult).substring(0, 100)}`
              };
            }
            
          } catch (productError) {
            console.error('Error inesperado al cargar producto:', productError);
            console.error('Stack del error:', productError.stack);
            const productoId = item.producto || item.productoId || item._id;
            return {
              id: productoId,
              data: null,
              error: `Error inesperado: ${productError.message}`
            };
          }
        });

        const productResults = await Promise.allSettled(productPromises);
        
        productResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value && result.value.id) {
            const { id, data, error } = result.value;
            
            if (data) {
              productosData[id] = data;
            } else {
              console.warn(`No se pudo cargar producto ${id}:`, error);
              productosData[id] = {
                nombre: `Producto ${id?.toString().slice(-8) || 'Desconocido'}`,
                descripcion: `Error: ${error || 'Información no disponible'}`,
                precio: 0,
                imagenes: [],
                error: error,
                isPlaceholder: true
              };
            }
          } else {
            const itemIndex = index;
            const item = order.items[itemIndex];
            const productoId = item?.producto || item?.productoId || item?._id || `unknown-${itemIndex}`;
            
            console.error(`Error al procesar producto ${productoId}:`, result.reason);
            
            productosData[productoId] = {
              nombre: `Producto ${productoId?.toString().slice(-8) || 'Desconocido'}`,
              descripcion: `Error de procesamiento: ${result.reason?.message || 'Error desconocido'}`,
              precio: 0,
              imagenes: [],
              error: result.reason?.message || 'Error de procesamiento',
              isPlaceholder: true
            };
          }
        });

        setProductos(productosData);

      } catch (error) {
        console.error('Error general al cargar productos:', error);
        
        if (order.items) {
          const fallbackProductos = {};
          order.items.forEach((item, index) => {
            const productoId = item.producto || item.productoId || item._id || `fallback-${index}`;
            fallbackProductos[productoId] = {
              nombre: `Producto ${productoId?.toString().slice(-8) || index + 1}`,
              descripcion: 'Error al cargar información del producto',
              precio: item.precio || item.precioUnitario || 0,
              imagenes: [],
              error: error.message || 'Error general',
              isPlaceholder: true
            };
          });
          setProductos(fallbackProductos);
        }
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [order]);

  const getStatusOrder = () => {
    return ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO'];
  };

  const normalizeStatus = (status) => {
    if (!status) return 'PENDIENTE';
    const statusUpper = status.toUpperCase();
    
    const statusMap = {
      'PENDING': 'PENDIENTE',
      'CONFIRMED': 'CONFIRMADO', 
      'PREPARING': 'EN_PREPARACION',
      'SHIPPED': 'ENVIADO',
      'DELIVERED': 'ENTREGADO',
      'CANCELLED': 'CANCELADO'
    };
    
    return statusMap[statusUpper] || statusUpper;
  };

  const getCurrentStatusIndex = () => {
    const currentStatus = normalizeStatus(order.estado);
    const statusOrder = getStatusOrder();
    const index = statusOrder.findIndex(status => status === currentStatus);
    return index === -1 ? 0 : index;
  };

  const canChangeToStatus = (targetStatus) => {
    const statusOrder = getStatusOrder();
    const currentIndex = getCurrentStatusIndex();
    const targetIndex = statusOrder.findIndex(status => status === targetStatus);
    
    return targetIndex === currentIndex + 1;
  };

  const isStatusCompleted = (targetStatus) => {
    const statusOrder = getStatusOrder();
    const currentIndex = getCurrentStatusIndex();
    const targetIndex = statusOrder.findIndex(status => status === targetStatus);
    
    return targetIndex <= currentIndex;
  };

  const handleChangeStatus = async (newStatus) => {
    if (!canChangeToStatus(newStatus)) {
      console.warn('No se puede cambiar a este estado:', newStatus);
      return;
    }

    const confirmMessage = `¿Estás seguro de que quieres cambiar el estado a "${getStatusText(newStatus)}"? Esta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const orderId = order._id || order.id;

      if (!orderId) {
        console.error('No se encontró ID del pedido');
        alert('Error: No se pudo identificar el pedido');
        return;
      }

      const result = await changeOrderStatus(orderId, newStatus);

      if (result && result.success) {
        setOrder(prevOrder => ({
          ...prevOrder,
          estado: newStatus
        }));
      } else {
        console.error('Error al cambiar estado:', result);
        alert(`Error al cambiar el estado: ${result?.error || result?.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error inesperado al cambiar estado:', error);
      console.error('Stack trace:', error.stack);
      alert('Error inesperado al cambiar el estado del pedido');
    }
  };

  const canChangeStatus = () => {
    return tipoUsuario === 'VENDEDOR' && (order.estado !== 'ENTREGADO' && order.estado !== 'CANCELADO');
  };

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    setTipoUsuario(userType);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible';
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (estado) => {
    if (!estado) return 'status-default';
    const estadoLower = estado.toLowerCase();
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
    if (!estado) return 'Estado desconocido';
    const estadoLower = estado.toLowerCase();
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
        return estado;
    }
  };

  const calculateTotal = () => {
    if (!order?.items || !Array.isArray(order.items)) return 0;
    
    return order.items.reduce((total, item) => {
      const precio = item.precio || item.precioUnitario || 0;
      const cantidad = item.cantidad || 0;
      const subtotal = item.subtotal || (precio * cantidad);
      
      return total + subtotal;
    }, 0);
  };

  const getProductData = (item) => {
    const productoId = item.producto || item.productoId || item._id;
    const productoData = productos[productoId];
    
    return {
      titulo: productoData?.titulo || item.titulo || `Producto ${productoId?.toString().slice(-6) || 'N/A'}`,
      descripcion: productoData?.descripcion || item.descripcion || 'Sin descripción disponible',
      precio: item.precio || item.precioUnitario || productoData?.precio || 0,
      isLoading: loadingProducts && !productoData,
      hasError: productoData?.error
    };
  };

  const handleGoBack = () => {
    navigate('/account/pedidos');
  };

  const canCancelOrder = () => {
    if (!order?.estado || tipoUsuario !== 'COMPRADOR') return false;
    const cancellableStates = ['pendiente', 'confirmado', 'en_preparacion', 'pending', 'confirmed', 'preparing'];
    return cancellableStates.includes(order.estado.toLowerCase());
  };

  const handleCancelOrder = () => {
    const orderId = order._id || order.id;
    navigate(`/account/pedidos/${orderId}/cancelar`);
  };

  const getDisplayName = (usuario) => {
    if (usuario?.nombre) {
      return usuario.apellido 
        ? `${usuario.nombre} ${usuario.apellido}`
        : usuario.nombre;
    }
    
    return usuario?.email || usuario || 'No especificado';
  };

  const OrderStatusTracker = ({ currentStatus }) => {
    const estados = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO'];
    
    const normalizeStatus = (status) => {
      if (!status) return 'PENDIENTE';
      const statusUpper = status.toUpperCase();
      
      const statusMap = {
        'PENDING': 'PENDIENTE',
        'CONFIRMED': 'CONFIRMADO', 
        'PREPARING': 'EN_PREPARACION',
        'SHIPPED': 'ENVIADO',
        'DELIVERED': 'ENTREGADO',
        'CANCELLED': 'CANCELADO'
      };
      
      return statusMap[statusUpper] || statusUpper;
    };
    
    const currentStatusNormalized = normalizeStatus(currentStatus);
    const currentIndex = estados.findIndex(estado => estado === currentStatusNormalized);
    
    const effectiveIndex = currentIndex === -1 ? 0 : currentIndex;
    
    const getPointClass = (index) => {
      if (index < effectiveIndex) {
        return 'status-point completed';
      } else if (index === effectiveIndex) {
        return 'status-point current';
      } else {
        return 'status-point pending';
      }
    };
    
    return (
      <div className="status-tracker-container">
        <div className="status-points">
          {estados.map((estado, index) => (
            <div key={estado} className="status-point-wrapper">
              <div className={getPointClass(index)}></div>
              {index < estados.length - 1 && (
                <div className={`status-line ${index < effectiveIndex ? 'completed' : 'pending'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
      {pedidoCreado && (
        <div className='success-message'>Pedido creado con éxito!</div>
      )}
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
            <h2>
              Pedido #{(order._id || order.id)?.toString().slice(-8) || 'N/A'}
            </h2>
            <div className={`order-status ${getStatusColor(order.estado)}`}>
              {getStatusText(order.estado)}
            </div>
          </div>

          <div className="order-status-tracker">
            <OrderStatusTracker currentStatus={order.estado} />
          </div>

          <div className="order-info-grid">
            <div className="info-item">
              <span className="info-label">Fecha de pedido:</span>
              <span className="info-value">
                {formatDate(order.fechaCreacion || order.createdAt)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Comprador:</span>
              <span className="info-value">
                {getDisplayName(comprador)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Email del comprador:</span>
              <span className="info-value">
                {comprador?.email || 'No especificado'}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Vendedor:</span>
              <span className="info-value">
                {getDisplayName(vendedor)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Email del vendedor:</span>
              <span className="info-value">
                {vendedor?.email || 'No especificado'}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Total del pedido:</span>
              <span className="info-value total-amount">
                {order.moneda || '$'} ${(order.total || calculateTotal()).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {order.direccionEntrega && (
          <div className="delivery-address-section">
            <h3>Dirección de Entrega</h3>
            <div className="address-info">
              {typeof order.direccionEntrega === 'object' ? (
                <>
                  <p>{order.direccionEntrega.calle || ''}, {order.direccionEntrega.altura || ''}</p>
                  <p>
                    {order.direccionEntrega.codigoPostal || ''}
                    {order.direccionEntrega.piso && `, Piso: ${order.direccionEntrega.piso}`}
                    {order.direccionEntrega.departamento && `, Depto.: ${order.direccionEntrega.departamento}`}
                  </p>
                  <p>{order.direccionEntrega.ciudad || ''}, {order.direccionEntrega.provincia || ''}, {order.direccionEntrega.pais || ''}</p>
                  {order.direccionEntrega.lat && order.direccionEntrega.lon && (
                    <p>Coordenadas: {order.direccionEntrega.lat || 'N/A'}, {order.direccionEntrega.lon || 'N/A'}</p>
                  )}
                </>
              ) : (
                <p>{order.direccionEntrega}</p>
              )}
            </div>
          </div>
        )}

        {canChangeStatus() && (
          <div className="change-status-section">
            <h3>Cambiar Estado del Pedido</h3>
            <div className="status-buttons-container">
              <button
                className={`status-button ${
                  isStatusCompleted('CONFIRMADO') ? 'completed' : 
                  canChangeToStatus('CONFIRMADO') ? 'available' : 'disabled'
                }`}
                onClick={() => handleChangeStatus('CONFIRMADO')}
                disabled={!canChangeToStatus('CONFIRMADO')}
              >
                <span className="status-text">Confirmado</span>
              </button>
              
              <div className="status-arrow">→</div>
              
              <button
                className={`status-button ${
                  isStatusCompleted('EN_PREPARACION') ? 'completed' : 
                  canChangeToStatus('EN_PREPARACION') ? 'available' : 'disabled'
                }`}
                onClick={() => handleChangeStatus('EN_PREPARACION')}
                disabled={!canChangeToStatus('EN_PREPARACION')}
              >
                <span className="status-text">En Preparación</span>
              </button>
              
              <div className="status-arrow">→</div>
              
              <button
                className={`status-button ${
                  isStatusCompleted('ENVIADO') ? 'completed' : 
                  canChangeToStatus('ENVIADO') ? 'available' : 'disabled'
                }`}
                onClick={() => handleChangeStatus('ENVIADO')}
                disabled={!canChangeToStatus('ENVIADO')}
              >
                <span className="status-text">Enviado</span>
              </button>
              
              <div className="status-arrow">→</div>
              
              <button
                className={`status-button ${
                  isStatusCompleted('ENTREGADO') ? 'completed' : 
                  canChangeToStatus('ENTREGADO') ? 'available' : 'disabled'
                }`}
                onClick={() => handleChangeStatus('ENTREGADO')}
                disabled={!canChangeToStatus('ENTREGADO')}
              >
                <span className="status-text">Entregado</span>
              </button>
            </div>
            
            <p className="status-help-text">
              Solo puedes avanzar al siguiente estado. Una vez cambiado, no podrás retroceder.
            </p>
          </div>
        )}

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

        <div className="order-items-section">
          <h3>Productos del Pedido</h3>
          
          {loadingProducts && (
            <div className="products-loading">
              <p>Cargando información de productos...</p>
            </div>
          )}
          
          <div className="items-list">
            {order.items && Array.isArray(order.items) ? (
              order.items.map((item, index) => {
                const productData = getProductData(item);
                
                return (
                  <div key={item._id || index} className="item-card">
                    <div className="item-info">
                      <h4 className="item-title">
                        {productData.isLoading ? (
                          <span className="loading-text">Cargando producto...</span>
                        ) : (
                          <>
                            {productData.titulo}
                            {productData.hasError && (
                              <span className="error-badge" title="Error al cargar producto">⚠️</span>
                            )}
                          </>
                        )}
                      </h4>
                      
                      <div className="item-details">
                        <span className="item-price">
                          Precio unitario: {order.moneda || '$'} ${productData.precio.toLocaleString()}
                        </span>
                        <span className="item-quantity">
                          Cantidad: {item.cantidad || 0}
                        </span>
                        <span className="item-subtotal">
                          Subtotal: {order.moneda || '$'} ${((item.precio || productData.precio) * (item.cantidad || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No hay productos en este pedido</p>
            )}
          </div>
        </div>

        {/* Resumen final */}
        <div className="order-summary">
          <div className="summary-row">
            <span className="summary-label">Total de productos:</span>
            <span className="summary-value">{order.items?.length || 0}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Cantidad total de items:</span>
            <span className="summary-value">
              {order.items?.reduce((total, item) => total + (item.cantidad || 0), 0) || 0}
            </span>
          </div>
          <div className="summary-row total-row">
            <span className="summary-label">Total a pagar:</span>
            <span className="summary-value">
              {order.moneda || '$'} ${(order.total || calculateTotal()).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;