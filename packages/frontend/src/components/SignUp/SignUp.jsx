import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import { registerUser, loginUser } from '../../service/usuarioService';
import { useNotifications } from '../../contexts/NotificationContext';

const SignUp = ({ user }) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'COMPRADOR'
  });

  const { refreshContext: refreshNotifications } = useNotifications();
  const navigate = useNavigate();

  // Inicializar con 3 métodos de pago fijos (opcionales)
  const [metodosPago, setMetodosPago] = useState([
    {
      id: 1,
      tipo: 'tarjeta',
      numeroTarjeta: '',
      nombreTitular: '',
      vencimiento: ''
    },
    {
      id: 2,
      tipo: 'tarjeta',
      numeroTarjeta: '',
      nombreTitular: '',
      vencimiento: ''
    },
    {
      id: 3,
      tipo: 'tarjeta',
      numeroTarjeta: '',
      nombreTitular: '',
      vencimiento: ''
    }
  ]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarMetodoPago = (id, campo, valor) => {
    setMetodosPago(prev => prev.map(metodo => 
      metodo.id === id ? { ...metodo, [campo]: valor } : metodo
    ));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe incluir al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe incluir al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe incluir al menos un número');
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Debe incluir al menos un carácter especial');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica
    if (!formData.nombre.trim() || !formData.email.trim()) {
      setError('Nombre y email son obligatorios');
      return;
    }

    // Validación de contraseña
    if (!formData.password.trim()) {
      setError('La contraseña es obligatoria');
      return;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join('. '));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const metodosPagoCompletos = metodosPago.filter(metodo => {
      if (metodo.tipo === 'tarjeta') {
        return metodo.numeroTarjeta.trim() && metodo.nombreTitular.trim() && metodo.vencimiento.trim();
      }
      return true; // Para otros tipos como PayPal o efectivo
    });

    try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido || undefined, // opcional
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono || undefined, // opcional
        tipo: formData.tipoUsuario,
      };

      const result = await registerUser(userData);
      
      if (result.success) {
        setSuccess('Cuenta creada correctamente');

        // Se loguea el usuario de una vez
        try {
              const credentials = {
                email: formData.email.trim(),
                password: formData.password
              };
        
              const result = await loginUser(credentials);
              
              if (result && result.success) {
                
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
              {/*setIsLoading(false);*/}
            }

      } else {
        setError(result.error || 'Error al crear la cuenta');
      }
      
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error inesperado al crear la cuenta');
    }
  };

  return (
    <div className="signup-info">
      <h2>Crear cuenta</h2>
      
      <form onSubmit={handleSubmit} className="signup-form">

        <section className="form-section">
          <div className="section-header">
            <h3>Seleccione el tipo de usuario</h3>
            <select
              className="user-type-select"
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleInputChange}
            >
              <option value="COMPRADOR">Comprador</option>
              <option value="VENDEDOR">Vendedor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
        </section>

        {/* Información personal */}
        <section className="form-section">
          <h3>Ingrese sus datos personales</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="+54 9 11 1234 5678"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </section>

        {/* Sección de contraseña */}
        <section className="form-section">
          <h3>Configurar contraseña</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <div className="password-input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña *</label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirma tu contraseña"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                  title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
          </div>
          
          <div className="password-info">
            <p>Tu contraseña será utilizada para iniciar sesión en tu cuenta.</p>
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="save-button">
          Crear cuenta
        </button>
      </form>
    </div>
  );
};

export default SignUp;