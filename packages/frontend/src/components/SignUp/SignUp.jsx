import React, { useState } from 'react';
import './SignUp.css';

const SignUp = ({ user }) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    direccion: user?.direccion || '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica
    if (!formData.nombre.trim() || !formData.email.trim()) {
      setError('Nombre y email son obligatorios');
      return;
    }

    // Filtrar solo los métodos de pago que tienen información
    const metodosPagoCompletos = metodosPago.filter(metodo => {
      if (metodo.tipo === 'tarjeta') {
        return metodo.numeroTarjeta.trim() && metodo.nombreTitular.trim() && metodo.vencimiento.trim();
      }
      return true; // Para otros tipos como PayPal o efectivo
    });

    // Simulación de guardado
    console.log('Datos guardados:', { 
      ...formData, 
      metodosPago: metodosPagoCompletos 
    });
    setSuccess('Cuenta creada correctamente');
    
    setTimeout(() => setSuccess(''), 3000);
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