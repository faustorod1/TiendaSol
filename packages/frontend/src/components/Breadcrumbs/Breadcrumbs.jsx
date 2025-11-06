import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Mapeo de rutas a nombres amigables
  const routeNames = {
    'productos': 'Productos',
    'producto': 'Producto',
    'checkout': 'Checkout',
    'contacto': 'Contacto',
    'account': 'Mi cuenta',
    'manage': 'Gestionar cuenta',
    'signin': 'Iniciar Sesión',
    'notifications': 'Notificaciones'
  };

  // No mostrar breadcrumbs en la página de inicio
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Navegación de rutas">
      <ol className="breadcrumbs-list">
        {/* Enlace al inicio */}
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Inicio
          </Link>
        </li>

        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNames[pathname] || pathname;

          return (
            <li key={routeTo} className="breadcrumb-item">
              <span className="breadcrumb-separator">›</span>
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {displayName}
                </span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
