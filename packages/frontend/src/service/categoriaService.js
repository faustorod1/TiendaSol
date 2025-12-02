import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const API_URL = `${BASE_URL}/categorias`;

export async function fetchCategorias() {
  try {
    const response = await axios.get(`${API_URL}`);
    
    if (response.status === 204) {
      return { data: [], status: 204 };
    }
    
    return {
      data: response.data || [],
      status: response.status
    };

  } catch (error) {
    if (error.response) {
      throw new Error(`Error ${error.response.status} al cargar categorias: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor.");
    } else {
      throw new Error(`Error al procesar la petición: ${error.message}`);
    }
  }
};