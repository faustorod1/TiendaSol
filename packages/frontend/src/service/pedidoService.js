import axios from "axios";

const API_URL = 'http://localhost:8000/pedidos';

export async function createOrder(orderData) {
  try {
    console.log('📤 pedidoService: Enviando petición a:', `${API_URL}`);
    
    // AGREGAR: Obtener el ID del usuario desde localStorage
    const userString = localStorage.getItem('user');
    let userId = null;
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        userId = user.id || user._id;
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    if (!userId) {
      return {
        success: false,
        error: 'No se pudo obtener el ID del usuario. Inicia sesión nuevamente.'
      };
    }
    
    // AGREGAR: Incluir el comprador en los datos
    const orderDataWithBuyer = {
      ...orderData,
      comprador: userId // ← Este campo faltaba!
    };
    
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        error: 'Usuario no autenticado. Inicia sesión para crear un pedido.'
      };
    }


    const response = await axios.post(API_URL, orderDataWithBuyer, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 15000
    });

    console.log('pedidoService: Respuesta del servidor:', response);
    console.log('pedidoService: Status:', response.status);
    console.log('pedidoService: Data:', response.data);

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Pedido creado exitosamente',
        pedidoId: response.data._id || response.data.id
      };
    }

    throw new Error(`Status inesperado: ${response.status}`);
    
  } catch (error) {
    console.error('pedidoService: Error capturado:', error);
    console.error('pedidoService: Error response:', error.response);
    console.error('pedidoService: Error request:', error.request);
    console.error('pedidoService: Error message:', error.message);
    
    if (error.response) {
      console.log('pedidoService: Error del servidor - Status:', error.response.status);
      console.log('pedidoService: Error del servidor - Data:', error.response.data);
      
      let errorMessage = 'Error del servidor';
      
      if (error.response.status === 500) {
        const serverError = error.response.data;
        
        if (typeof serverError === 'string') {
          errorMessage = `Error interno: ${serverError}`;
        } else if (serverError && serverError.message) {
          errorMessage = `Error interno: ${serverError.message}`;
        } else if (serverError && serverError.error) {
          errorMessage = `Error interno: ${serverError.error}`;
        } else {
          errorMessage = 'Error interno del servidor. Usuario o vendedor no encontrado.';
        }
      } else if (error.response.status === 400) {
        const validationErrors = error.response.data;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map(err => err.message).join(', ');
        } else {
          errorMessage = error.response.data?.message || 'Datos del pedido inválidos';
        }
      } else if (error.response.status === 401) {
        errorMessage = 'No autorizado. Inicia sesión para crear un pedido.';
      } else if (error.response.status === 404) {
        errorMessage = 'Servicio no encontrado. Verifica la configuración.';
      } else if (error.response.status === 500) {
        errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
      } else {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      'Error del servidor';
      }
      
      return {
        success: false,
        error: errorMessage,
        status: error.response.status,
        details: error.response.data
      };
    } else if (error.request) {
      console.log('pedidoService: No se recibió respuesta del servidor');
      return {
        success: false,
        error: 'No se pudo conectar con el servidor.'
      };
    } else {
      console.log('pedidoService: Error en la configuración de la petición');
      return {
        success: false,
        error: error.message || 'Error inesperado'
      };
    }
  }
}

export function formatOrderData(checkoutData) {
  return {
    vendedor: checkoutData.vendedorId,
    items: checkoutData.items.map(item => ({
      productoId: item.id || item._id,
      cantidad: item.cantidad.toString()
    })),
    moneda: checkoutData.moneda || 'ARS',
    direccionEntrega: {
      calle: checkoutData.calle || checkoutData.direccion?.split(',')[0] || '',
      altura: checkoutData.altura || checkoutData.direccion?.split(',')[1]?.trim() || '',
      piso: checkoutData.piso || '',
      departamento: checkoutData.departamento || '',
      codigoPostal: checkoutData.codigoPostal || checkoutData.cp || '',
      ciudad: checkoutData.ciudad || 'Buenos Aires',
      provincia: checkoutData.provincia || 'Buenos Aires',
      pais: checkoutData.pais || 'Argentina',
      lat: checkoutData.lat || '',
      lon: checkoutData.lon || ''
    }
  };
}

export async function getOrderHistory() {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        error: 'Usuario no autenticado'
      };
    }

    const response = await axios.get(`${API_URL}/historial`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }

    throw new Error('Error al obtener historial de pedidos');
    
  } catch (error) {
    console.error('Error en getOrderHistory:', error);
    
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Error del servidor',
        status: error.response.status
      };
    } else {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor'
      };
    }
  }
}

export async function changeOrderStatus(orderId, newStatus, reason = '') {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        error: 'Usuario no autenticado'
      };
    }

    const response = await axios.put(`${API_URL}/${orderId}/estado`, {
      estado: newStatus,
      motivo: reason
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Estado del pedido actualizado'
      };
    }

    throw new Error('Error al cambiar estado del pedido');
    
  } catch (error) {
    console.error('Error en changeOrderStatus:', error);
    
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Error del servidor',
        status: error.response.status
      };
    } else {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor'
      };
    }
  }
}