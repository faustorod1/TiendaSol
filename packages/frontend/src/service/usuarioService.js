import axios from "axios";

const API_URL = 'http://localhost:8000/usuarios';

export async function registerUser(userData) {
  try {
    // Realizar petición POST al endpoint de registro
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: 'Usuario registrado exitosamente'
      };
    }

    throw new Error('Error en el registro del usuario');
    
  } catch (error) {
    console.error('Error en registerUser:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          'Error del servidor al registrar usuario';
      
      return {
        success: false,
        error: errorMessage,
        status: error.response.status
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor'
      };
    } else {
      return {
        success: false,
        error: error.message || 'Error inesperado al registrar usuario'
      };
    }
  }
}

export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Login exitoso'
      };
    }

    throw new Error('Error en el login');
    
  } catch (error) {
    console.error('Error en loginUser:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          'Credenciales incorrectas';
      
      return {
        success: false,
        error: errorMessage,
        status: error.response.status
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor'
      };
    } else {
      return {
        success: false,
        error: error.message || 'Error inesperado en login'
      };
    }
  }
}

export async function getUserProfile(userId) {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('authToken') && {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        })
      }
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }

    throw new Error('Error al obtener perfil de usuario');
    
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Error al obtener perfil',
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