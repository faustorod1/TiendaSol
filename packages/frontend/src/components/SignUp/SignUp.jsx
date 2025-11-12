import React, { useState } from 'react';
import './SignUp.css';
import { registerUser } from '../../service/usuarioService';

const SignUp = ({ user }) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    direccion: user?.direccion || '',
    password: '',
    confirmPassword: ''
  });

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
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono || undefined, // opcional
        tipo: 'COMPRADOR' // o permitir que el usuario elija
      };

      const result = await registerUser(userData);
      
      if (result.success) {
        setSuccess('Cuenta creada correctamente');
        // Opcional: redirigir al login o dashboard
        // navigate('/login');
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

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <textarea
              id="direccion"
              name="direccion"
              rows="3"
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder="Calle, número, ciudad, código postal"
            />
          </div>
        </section>

        {/* Métodos de pago */}
        <section className="form-section">
          <div className="section-header">
            <h3>Métodos de pago (opcionales)</h3>
          </div>

          {metodosPago.map((metodo, index) => (
            <div key={metodo.id} className="payment-method">
              <div className="payment-header">
                <h4>Método de pago {index + 1}</h4>
                <div className="payment-controls">
                  <select
                    value={metodo.tipo}
                    onChange={(e) => actualizarMetodoPago(metodo.id, 'tipo', e.target.value)}
                    className="payment-type"
                  >
                    <option value="tarjeta">Tarjeta de crédito/débito</option>
                    <option value="paypal">PayPal</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
              </div>

              {metodo.tipo === 'tarjeta' && (
                <div className="payment-details">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Número de tarjeta</label>
                      <input
                        type="text"
                        value={metodo.numeroTarjeta}
                        onChange={(e) => actualizarMetodoPago(metodo.id, 'numeroTarjeta', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Vencimiento</label>
                      <input
                        type="text"
                        value={metodo.vencimiento}
                        onChange={(e) => actualizarMetodoPago(metodo.id, 'vencimiento', e.target.value)}
                        placeholder="MM/AA"
                        maxLength="5"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Nombre del titular</label>
                    <input
                      type="text"
                      value={metodo.nombreTitular}
                      onChange={(e) => actualizarMetodoPago(metodo.id, 'nombreTitular', e.target.value)}
                      placeholder="Como aparece en la tarjeta"
                    />
                  </div>
                </div>
              )}

              {metodo.tipo === 'paypal' && (
                <div className="payment-details">
                  <div className="form-group">
                    <label>Email de PayPal</label>
                    <input
                      type="email"
                      value={metodo.emailPaypal || ''}
                      onChange={(e) => actualizarMetodoPago(metodo.id, 'emailPaypal', e.target.value)}
                      placeholder="tu-email@paypal.com"
                    />
                  </div>
                </div>
              )}

              {metodo.tipo === 'efectivo' && (
                <div className="payment-details">
                  <div className="info-message">
                    <p>💵 Selecciona esta opción si prefieres pagar en efectivo al recibir el producto</p>
                  </div>
                </div>
              )}
            </div>
          ))}
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

        {/* Mensajes y botón guardar */}
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