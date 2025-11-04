import axios from 'axios';

const API_URL = 'http://localhost:8000/productos';


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