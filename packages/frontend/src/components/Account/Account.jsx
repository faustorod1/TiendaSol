import React from 'react';
import { Link } from 'react-router-dom';
import './Account.css';

const Account = ({ user }) => {
  // Datos de ejemplo
  const userData = user || {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@email.com',
    telefono: '+54 9 11 1234 5678',
    direccion: 'Av. Corrientes 1234, CABA',
    metodosPago: [
      { tipo: 'tarjeta', ultimosDigitos: '1234' },
      { tipo: 'paypal', email: 'juan@email.com' }
    ]
  };

  return (
    <div className="account">
      <h1>Mi Cuenta</h1>
      
      <div className="account-overview">
        <section className="account-section">
          <h2>Información Personal</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nombre:</span>
              <span className="info-value">{userData.nombre} {userData.apellido}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{userData.telefono || 'No especificado'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Dirección:</span>
              <span className="info-value">{userData.direccion || 'No especificada'}</span>
            </div>
          </div>
        </section>

        <section className="account-section">
          <h2>Métodos de Pago</h2>
          <div className="payment-summary">
            {userData.metodosPago && userData.metodosPago.length > 0 ? (
              userData.metodosPago.map((metodo, index) => (
                <div key={index} className="payment-item">
                  <span className="payment-type">
                    {metodo.tipo === 'tarjeta' ? '💳' : metodo.tipo === 'paypal' ? '🅿️' : '💵'}
                    {metodo.tipo === 'tarjeta' ? ` **** ${metodo.ultimosDigitos}` : 
                     metodo.tipo === 'paypal' ? ` ${metodo.email}` : ' Efectivo'}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-payment">No hay métodos de pago configurados</p>
            )}
          </div>
        </section>

        <div className="account-actions">
          <Link to="/account/manage" className="manage-account-button">
            Gestionar Cuenta
          </Link>
          <Link to="/account/pedidos" className="orders-list-button">
            Mis Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;