import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Account.css';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapTipoUsuario = (tipo) => {
    const tiposMap = {
      'COMPRADOR': 'Comprador',
      'VENDEDOR': 'Vendedor', 
      'ADMIN': 'Administrador'
    };
    
    return tiposMap[tipo] || tipo;
  };

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userString = localStorage.getItem('user');
        const userId = localStorage.getItem('userId');
        
        if (userString) {
          const user = JSON.parse(userString);
          setUserData(user);
        } else {
          setUserData({
            nombre: 'Usuario',
            apellido: '',
            email: 'email@ejemplo.com',
            telefono: '',
            direccion: '',
            tipo: 'COMPRADOR'
          });
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setUserData({
          nombre: 'Usuario',
          apellido: '',
          email: 'email@ejemplo.com',
          telefono: '',
          direccion: '',
          tipo: 'COMPRADOR'
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
          <div className="user-type-grid">
            <div className="info-item">
              <span className="info-label">Tipo de usuario:</span>
              <span className="info-value">
                {mapTipoUsuario(userData.tipo)}
              </span>
            </div>
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