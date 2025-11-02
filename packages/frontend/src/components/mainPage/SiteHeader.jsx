import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faShoppingCart, faFilter, faComment, faBell } from '@fortawesome/free-solid-svg-icons';
import './SiteHeader.css';
import MiniCart from './MiniCart.jsx';
import Notifications from './Notifications.jsx';
import SideMenu from './SideMenu.jsx';
import { useFilters } from '../../contexts/FilterContext';

const mockCartItems = [
    { id: 1, name: 'Producto A', price: 29.99, quantity: 2, image: 'https://via.placeholder.com/60' },
    { id: 2, name: 'Producto B', price: 49.99, quantity: 1, image: 'https://via.placeholder.com/60' },
];

const SiteHeader = ({ 
    cartItems = [], 
    handleIncrease, 
    handleDecrease, 
    handleRemove,
    notifications = [],
    setNotifications
}) => {
    const { isFilterOpen, setIsFilterOpen } = useFilters();
    const location = useLocation();
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const navigate = useNavigate();

    const handleToggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/productos?titulo=${encodeURIComponent(searchTerm)}`);
        }
    };

    cartItems = mockCartItems;
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const cartItemCount = cartItems.length;

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
                            {unreadCount > 0 && (
                                <span className="notifications-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
                            )}
                        </button>
                        
                        <Notifications 
                            isOpen={isNotificationsOpen}
                            onClose={() => setIsNotificationsOpen(false)}
                            notifications={notifications}
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
                <a href="/categoria/nuevos" className="category-link">Nuevos</a>
                <a href="/categoria/electronica" className="category-link">Electrónica</a>
                <a href="/categoria/ropa" className="category-link">Ropa</a>
            </nav>

            <SideMenu 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <MiniCart 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
            />

            {}
        </div>
    );
};

export default SiteHeader;