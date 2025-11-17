import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Account.css';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const loadUserData = () => {
      try {
        const userString = localStorage.getItem('user');
        const userId = localStorage.getItem('userId');
        
        if (userString) {
          const user = JSON.parse(userString);
          setUserData(user);
        } else {
          // Datos por defecto si no hay información guardada
          setUserData({
            nombre: 'Usuario',
            apellido: '',
            email: 'email@ejemplo.com',
            telefono: '',
            direccion: '',
            metodosPago: []
          });
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        // Datos por defecto en caso de error
        setUserData({
          nombre: 'Usuario',
          apellido: '',
          email: 'email@ejemplo.com',
          telefono: '',
          direccion: '',
          metodosPago: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="account">
        <div className="loading-message">
          <p>Cargando información de la cuenta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account">
      <div className="account-header">
        <h1>Mi Cuenta</h1>
      </div>
      
      <div className="account-overview">
        <section className="account-section">
          <h2>Información Personal</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nombre:</span>
              <span className="info-value">
                {userData.nombre} {userData.apellido || ''}
              </span>
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