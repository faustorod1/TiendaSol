import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../service/usuarioService';
import { useNotifications } from '../../contexts/NotificationContext';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { refreshContext: refreshNotifications } = useNotifications();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      setIsLoading(false);
      return;
    }

    try {
      const credentials = {
        email: formData.email.trim(),
        password: formData.password
      };

      const result = await loginUser(credentials);
      
      if (result && result.success) {
        
        // Guardar información de autenticación
        if (result.data && result.data.token) {
          localStorage.setItem('authToken', result.data.token);
        }
        
        if (result.data && (result.data.usuario || result.data.user)) {
          const userData = result.data.usuario || result.data.user;
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userId', userData._id || userData.id);
          localStorage.setItem('userType', userData.tipo || 'COMPRADOR');
        }

        window.dispatchEvent(new CustomEvent('authChange'));

        refreshNotifications();
        navigate('/', { replace: true });
        
      } else if (result && result.success === false) {
    
        if (result.status === 401) {
          setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (result.status === 404) {
          setError('Usuario no encontrado. ¿Te has registrado?');
        } else if (result.status === 500) {
          setError('Error del servidor. Inténtalo de nuevo más tarde.');
        } else {
          setError(result.error || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
      } else {
        setError('Respuesta inesperada del servidor. Inténtalo de nuevo.');
      }
      
    } catch (err) {

      if (err.name === 'NetworkError' || err.message.includes('Network')) {
        setError('Error de conexión. Verifica tu conexión a internet.');
      } else if (err.message.includes('timeout')) {
        setError('El servidor tardó demasiado en responder. Inténtalo de nuevo.');
      } else {
        setError('Error de conexión. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const rememberMeStatus = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && rememberMeStatus) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1 className="signin-title">Iniciar Sesión</h1>
          <p className="signin-subtitle">Accede a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@ejemplo.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tu contraseña"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={`signin-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="signup-link">
          ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
