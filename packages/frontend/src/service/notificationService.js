import axios from 'axios';

const API_URL = 'http://localhost:8000/usuarios/notificaciones';


/**
 * Función para obtener notificaciones con parámetros de búsqueda (paginación, filtros).
 * @param {URLSearchParams} searchParams Los parámetros de consulta (ej. ?leida=true&page=1)
 */
export async function fetchNotifications(searchParams = new URLSearchParams({leida: false})) {
  const queryString = searchParams.toString();

  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error(`Error al cargar notificaciones: Usuario no autenticado.`);
  }
  
  try {
    const response = await axios.get(`${API_URL}?${queryString}`, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
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
      throw new Error(`Error ${error.response.status} al cargar notificaciones: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor.");
    } else {
      throw new Error(`Error al procesar la petición: ${error.message}`);
    }
  }
};