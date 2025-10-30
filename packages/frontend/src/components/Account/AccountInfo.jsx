import React, { useState } from 'react';
import './AccountInfo.css';

const AccountInfo = ({ user }) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    direccion: user?.direccion || '',
  });

  const [metodosPago, setMetodosPago] = useState(user?.metodosPago || []);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarMetodoPago = () => {
    if (metodosPago.length >= 3) {
      setError('Máximo 3 métodos de pago permitidos');
      return;
    }
    
    const nuevoMetodo = {
      id: Date.now(),
      tipo: 'tarjeta',
      numeroTarjeta: '',
      nombreTitular: '',
      vencimiento: ''
    };
    
    setMetodosPago(prev => [...prev, nuevoMetodo]);
    setError('');
  };

  const eliminarMetodoPago = (id) => {
    setMetodosPago(prev => prev.filter(metodo => metodo.id !== id));
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

    // Simulación de guardado
    console.log('Datos guardados:', { ...formData, metodosPago });
    setSuccess('Información actualizada correctamente');
    
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="account-info">
      <h2>Información de la cuenta</h2>
      
      <form onSubmit={handleSubmit} className="account-form">
        {/* Información personal */}
        <section className="form-section">
          <h3>Datos personales</h3>
          
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
            <h3>Métodos de pago ({metodosPago.length}/3)</h3>
            <button 
              type="button" 
              onClick={agregarMetodoPago}
              className="add-payment-button"
              disabled={metodosPago.length >= 3}
            >
              + Agregar método
            </button>
          </div>

          {metodosPago.map((metodo) => (
            <div key={metodo.id} className="payment-method">
              <div className="payment-header">
                <select
                  value={metodo.tipo}
                  onChange={(e) => actualizarMetodoPago(metodo.id, 'tipo', e.target.value)}
                  className="payment-type"
                >
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="paypal">PayPal</option>
                  <option value="efectivo">Efectivo</option>
                </select>
                
                <button
                  type="button"
                  onClick={() => eliminarMetodoPago(metodo.id)}
                  className="remove-payment"
                >
                  ✕
                </button>
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
            </div>
          ))}
        </section>

        {/* Mensajes y botón guardar */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="save-button">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default AccountInfo;