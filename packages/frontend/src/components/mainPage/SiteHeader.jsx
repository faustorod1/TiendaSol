import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faShoppingCart, faFilter, faComment, faBell } from '@fortawesome/free-solid-svg-icons';
import './SiteHeader.css';
import MiniCart from './MiniCart.jsx';
import Notifications from './Notifications.jsx';
import SideMenu from './SideMenu.jsx';
import { useFilters } from '../../contexts/FilterContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useCartContext } from '../../contexts/CartContext';


const SiteHeader = (props) => {
    const isAuthenticated = () => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        return token && user;
    };

    const { isFilterOpen, setIsFilterOpen } = useFilters();
    const { recentNotifications, unreadCount, markAsRead } = useNotifications();
    const {
        productos,
        aumentarCantidadProducto,
        reducirCantidadProducto,
        eliminarProducto,
    } = useCartContext();

    const location = useLocation();
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const handleToggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const targetPath = '/productos';

        if (location.pathname === targetPath) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('titulo', encodeURIComponent(searchTerm));
                return newParams;
            });
        } else {
            navigate(`/productos?titulo=${encodeURIComponent(searchTerm)}`);
        }
    };

    const cartItemCount = productos.length;

    return (
        <div className="header-wrapper">
            <header className="header-main">
                <div className="header-group left">
                    <button onClick={() => setIsMenuOpen(true)} className="menu-button" aria-label="Abrir menú">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Link to="/" className="brand-link">
                        <h1 className="brand-text">Tienda Sol</h1>
                    </Link>
                </div>

                {}
                <form className="search-form" role="search" onSubmit={handleSearchSubmit}>
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-button">Buscar</button>
                </form>

                <div className="header-group right">
                    {}
                    <div className="notifications-container">
                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                            className="notifications-button" 
                            aria-label={`Ver notificaciones (${unreadCount} no leídas)`}
                        >
                            <FontAwesomeIcon icon={faBell} />
                            {unreadCount > 0 && isAuthenticated() && (
                                <span className="notifications-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
                            )}
                        </button>
                        
                        <Notifications 
                            isOpen={isNotificationsOpen}
                            onClose={() => setIsNotificationsOpen(false)}
                            notifications={recentNotifications}
                            onMarkAsRead={markAsRead}
                        />
                    </div>

                    {}
                    <button onClick={handleToggleCart} className="cart-button" aria-label={`Ver carrito con ${cartItemCount} artículos`}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {cartItemCount > 0 && (
                            <span className="cart-count">{cartItemCount}</span>
                        )}
                    </button>
                </div>
            </header>

            <nav className="categories-nav">
                {location.pathname === '/productos' && (
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="filter-toggle-button" aria-label="Mostrar/ocultar filtros">
                        <FontAwesomeIcon icon={faFilter} />
                    </button>
                )}

                <a href="/categoria/ofertas" className="category-link">Ofertas</a>
                <a href="/productos?orderBy=fecha_creacion_desc" className="category-link">Nuevos</a>
                <a href="/productos?categorias=654c6c9a29a67a001a1d1d27" className="category-link">Electrónica</a>
                <a href="/productos?categorias=654c6c9a29a67a001a1d1d20" className="category-link">Ropa</a>
            </nav>

            <SideMenu 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <MiniCart 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={productos}
                onIncrease={aumentarCantidadProducto}
                onDecrease={reducirCantidadProducto}
                onRemove={eliminarProducto}
            />

            {}
        </div>
    );
};

export default SiteHeader;