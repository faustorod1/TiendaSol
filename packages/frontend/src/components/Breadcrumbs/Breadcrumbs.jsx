import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProductById } from '../../service/productoService';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const [productTitles, setProductTitles] = useState({});
  const [loadingTitles, setLoadingTitles] = useState(false);

  // Mapeo de rutas
  const routeNames = {
    'productos': 'Productos',
    'producto': 'Producto',
    'checkout': 'Checkout',
    'contacto': 'Contacto',
    'terms': 'Términos y Condiciones',
    'privacy': 'Política de Privacidad',
    'account': 'Mi cuenta',
    'manage': 'Gestionar cuenta',
    'signin': 'Iniciar Sesión',
    'signup': 'Registrarse',
    'notifications': 'Notificaciones',
    'pedidos': 'Pedidos',
    'cancelar': 'Cancelar Pedido'
  };

  useEffect(() => {
    const loadProductTitles = async () => {
      const currentPathnames = location.pathname.split('/').filter(x => x);
      
      const productIds = [];
      
      // Encontrar todos los IDs de productos en la ruta
      currentPathnames.forEach((pathname, index) => {
        const prevPathname = currentPathnames[index - 1];
        if (prevPathname === 'productos') {
          productIds.push(pathname);
        }
      });

      if (productIds.length === 0) {
        return;
      }

      const missingIds = productIds.filter(id => !productTitles[id]);
      if (missingIds.length === 0) {
        return;
      }

      setLoadingTitles(true);
      const newProductTitles = { ...productTitles };

      try {
        await Promise.all(
          missingIds.map(async (productId) => {
            try {
              const product = await fetchProductById(productId);
              
              if (product) {
                newProductTitles[productId] = product.titulo;
              }
            } catch (error) {
              console.error(`Error cargando producto ${productId}:`, error);
              newProductTitles[productId] = productId;
            }
          })
        );
        
        setProductTitles(newProductTitles);
      } catch (error) {
        console.error('Error general cargando títulos:', error);
      } finally {
        setLoadingTitles(false);
      }
    };

    loadProductTitles();
  }, [location.pathname]);

  // Función para obtener el nombre a mostrar
  const getDisplayName = (pathname, index) => {
    const prevPathname = pathnames[index - 1];
    
    if (prevPathname === 'productos') {
      if (loadingTitles && !productTitles[pathname]) {
        return 'Cargando...';
      }
      const title = productTitles[pathname] || pathname;
      return title;
    }
    
    return routeNames[pathname] || pathname;
  };

  // No mostrar breadcrumbs en la página de inicio
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Navegación de rutas">
      <ol className="breadcrumbs-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Inicio
          </Link>
        </li>

        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = getDisplayName(pathname, index);

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
