import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_URL = `${BASE_URL}/usuarios/notificaciones`;


const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error("Usuario no autenticado");
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};


/**
 * Función para obtener notificaciones con parámetros de búsqueda (paginación, filtros).
 * @param {URLSearchParams} searchParams Los parámetros de consulta (ej. ?leida=true&page=1)
 */
export async function fetchNotifications(page = 1, limit = 10, leida = null) {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (leida !== null && leida !== 'all') {
      params.append('leida', leida);
    }

    const response = await axios.get(`${API_URL}?${params.toString()}`, getAuthHeaders());
    
    if (response.status === 204) {
      return { data: [], totalPages: 1, page: 1, total: 0, totalUnreadCount: 0, status: 204 };
    }
    
    return {
      data: response.data.data || [],
      page: response.data.page || 1,
      totalPages: response.data.totalPages || 1,
      total: response.data.total,
      totalUnfilteredCount: response.data.totalUnfiltered,
      totalUnreadCount: response.data.totalUnreadCount,
      status: response.status
    };

  } catch (error) {
    throw handleAxiosError(error);
  }
};


export async function fetchNotificationById(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}


export async function markNotificationAsRead(id) {
  try {
    await axios.patch(`${API_URL}/${id}`, {}, getAuthHeaders());
  } catch (error) {
    throw handleAxiosError(error);
  }
}


export async function markAllNotificationsAsRead() {
  try {
    await axios.patch(`${API_URL}/mark-all-read`, {}, getAuthHeaders());
  } catch (error) {
    throw handleAxiosError(error);
  }
}


export async function deleteNotificationById(id) {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    throw handleAxiosError(error);
  }
}


const handleAxiosError = (error) => {
  if (error.response) return new Error(error.response.data.message || error.response.statusText);
  if (error.request) return new Error("No hay conexión con el servidor");
  return new Error(error.message);
};