import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../service/pedidoService';
import { fetchProductById } from '../../service/productoService.js';
import { getUserProfile } from '../../service/usuarioService.js';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [vendedor, setVendedor] = useState({});
  const [comprador, setComprador] = useState({});
  const [productos, setProductos] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);

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

      order.items.forEach((item, index) => {
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
      });

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
              console.log(`Producto ${id} agregado correctamente`);
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
            <h2>
              Pedido #{(order._id || order.id)?.toString().slice(-8) || 'N/A'}
            </h2>
            <div className={`order-status ${getStatusColor(order.estado)}`}>
              {getStatusText(order.estado)}
            </div>
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
                {comprador?.nombre || comprador?.email || comprador || 'No especificado'}
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
                {vendedor?.nombre || vendedor?.email || vendedor || 'No especificado'}
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

        {/* Dirección de entrega */}
        {order.direccionEntrega && (
          <div className="delivery-address-section">
            <h3>Dirección de Entrega</h3>
            <div className="address-info">
              {typeof order.direccionEntrega === 'object' ? (
                <>
                  <p>{order.direccionEntrega.calle || ''}</p>
                  <p>{order.direccionEntrega.ciudad || ''}, {order.direccionEntrega.provincia || ''}</p>
                  <p>{order.direccionEntrega.codigoPostal || ''}, {order.direccionEntrega.pais || ''}</p>
                </>
              ) : (
                <p>{order.direccionEntrega}</p>
              )}
            </div>
          </div>
        )}

        {/* Botón de cancelación */}
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