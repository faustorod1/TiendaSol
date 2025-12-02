import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const API_URL = `${BASE_URL}/productos`;


/**
 * Función para obtener productos con parámetros de búsqueda (paginación, filtros).
 * @param {URLSearchParams} searchParams Los parámetros de consulta (ej. ?page=2&sort=price)
 */
export async function fetchProducts(searchParams) {
  const queryString = searchParams.toString();
  
  try {
    const response = await axios.get(`${API_URL}?${queryString}`);
    
    if (response.status === 204) {
      return { data: [], totalPages: 1, page: 1, status: 204 };
    }
    
    return {
      data: response.data.data || [],
      totalPages: response.data.totalPages || 1,
      page: response.data.page || 1,
      status: response.status
    };

  } catch (error) {
    if (error.response) {
      throw new Error(`Error ${error.response.status} al cargar productos: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor.");
    } else {
      throw new Error(`Error al procesar la petición: ${error.message}`);
    }
  }
};


export async function fetchProductById(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
        if (error.response.status === 404) {
        return null;
      }
      throw new Error(`Error ${error.response.status} al cargar producto: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor.");
    } else {
      throw new Error(`Error al procesar la petición: ${error.message}`);
    }
  }
}

export async function createProduct(productData) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return {
        success: false,
        error: 'Usuario no autenticado'
      };
    }

    const isFormData = productData instanceof FormData;
    if (!isFormData) {
        const validation = validateProductData(productData);
        if (!validation.isValid) {
          return { success: false, error: validation.errors.join(', ') };
        }
    }
    
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    const response = await axios.post(`${API_URL}`, productData, { headers });

    if (response.data && response.data.success !== false) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Producto creado exitosamente'
      };
    } else {
      return {
        success: false,
        error: response.data.error || response.data.message || 'Error desconocido al crear producto'
      };
    }

  } catch (error) {
    console.error('Error al crear producto:', error);

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 400:
          return {
            success: false,
            error: errorData.message || errorData.error || 'Datos del producto inválidos'
          };
        case 401:
          return {
            success: false,
            error: 'Token de autenticación inválido o expirado'
          };
        case 403:
          return {
            success: false,
            error: 'No tienes permisos para crear productos'
          };
        case 409:
          return {
            success: false,
            error: 'Ya existe un producto con ese nombre o código'
          };
        case 422:
          return {
            success: false,
            error: errorData.message || 'Datos de validación incorrectos'
          };
        default:
          return {
            success: false,
            error: `Error ${status}: ${errorData.message || errorData.error || error.response.statusText}`
          };
      }
    } else if (error.request) {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor. Verifica tu conexión.'
      };
    } else {
      return {
        success: false,
        error: `Error al procesar la petición: ${error.message}`
      };
    }
  }
}

export async function updateStock(productId, nuevoStock) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return {
        success: false,
        error: 'Usuario no autenticado'
      };
    }

    const response = await axios.patch(
      `${API_URL}/${productId}/stock`,
      { stock: parseInt(nuevoStock) },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      data: response.data.producto,
      message: response.data.message
    };

  } catch (error) {
    console.error('Error al actualizar stock:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      return {
        success: false,
        error: 'Token expirado. Por favor, inicia sesión nuevamente.'
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.error || 'Error al actualizar el stock'
    };
  }
}

/**
 * Función para validar los datos del producto según la estructura esperada
 * @param {Object} productData Los datos del producto a validar
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateProductData(productData) {
  const errors = [];
  
  // Validar título (obligatorio)
  if (!productData.titulo || typeof productData.titulo !== 'string' || productData.titulo.trim().length === 0) {
    errors.push('El título del producto es obligatorio');
  } else if (productData.titulo.length > 200) {
    errors.push('El título no puede exceder los 200 caracteres');
  }
  
  // Validar descripción (obligatoria)
  if (!productData.descripcion || typeof productData.descripcion !== 'string' || productData.descripcion.trim().length === 0) {
    errors.push('La descripción del producto es obligatoria');
  } else if (productData.descripcion.length > 1000) {
    errors.push('La descripción no puede exceder los 1000 caracteres');
  }
  
  // Validar precio (obligatorio y mayor a 0)
  if (!productData.precio || typeof productData.precio !== 'number' || productData.precio <= 0) {
    errors.push('El precio debe ser un número mayor a 0');
  }
  
  // Validar moneda (obligatorio)
  const monedasValidas = ['PESO_ARG', 'DOLAR_USA', 'REAL'];
  if (!productData.moneda || !monedasValidas.includes(productData.moneda)) {
    errors.push('La moneda debe ser una de: ' + monedasValidas.join(', '));
  }
  
  // Validar stock (obligatorio, mayor o igual a 0)
  if (productData.stock === undefined || typeof productData.stock !== 'number' || productData.stock < 0) {
    errors.push('El stock debe ser un número mayor o igual a 0');
  }
  
  // Validar fotos (opcional, pero si existe debe ser array)
  if (productData.fotos) {
    if (!Array.isArray(productData.fotos)) {
      errors.push('Las fotos deben ser un array de URLs');
    } else {
      productData.fotos.forEach((foto, index) => {
        if (typeof foto !== 'string' || !isValidUrl(foto)) {
          errors.push(`La foto ${index + 1} debe ser una URL válida`);
        }
      });
    }
  }
  
  // Validar categorías (obligatorio, pero sin límite de cantidad)
  if (!productData.categorias || !Array.isArray(productData.categorias) || productData.categorias.length === 0) {
    errors.push('Debe seleccionar al menos una categoría');
  } else {
    productData.categorias.forEach((categoria, index) => {
      if (!categoria._id || typeof categoria._id !== 'string') {
        errors.push(`La categoría ${index + 1} debe tener un _id válido`);
      }
      if (!categoria.nombre || typeof categoria.nombre !== 'string') {
        errors.push(`La categoría ${index + 1} debe tener un nombre válido`);
      }
    });
  }
  
  // Validar activo (opcional, por defecto true)
  if (productData.activo !== undefined && typeof productData.activo !== 'boolean') {
    errors.push('El campo activo debe ser true o false');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Función auxiliar para validar URLs
 * @param {string} url La URL a validar
 * @returns {boolean} True si es una URL válida
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Función helper para crear la estructura de producto desde un formulario
 * @param {Object} formData Datos del formulario
 * @returns {Object} Producto con la estructura correcta
 */
export function formatProductData(formData) {
  return {
    titulo: formData.titulo?.trim(),
    descripcion: formData.descripcion?.trim(),
    precio: parseFloat(formData.precio),
    moneda: formData.moneda || 'PESO_ARG',
    stock: parseInt(formData.stock),
    activo: formData.activo !== undefined ? formData.activo : true,
    fotos: formData.fotos || [],
    categorias: formData.categorias || []
  };
}