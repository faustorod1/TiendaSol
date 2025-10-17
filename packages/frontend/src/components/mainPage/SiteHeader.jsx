import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './SiteHeader.css';
import MiniCart from './MiniCart.jsx';

const mockCartItems = [
    { id: 1, name: 'Producto A', price: 29.99, quantity: 2, image: 'https://via.placeholder.com/60' },
    { id: 2, name: 'Producto B', price: 49.99, quantity: 1, image: 'https://via.placeholder.com/60' },
];

const SiteHeader = ({ 
    cartItems = [], 
    handleIncrease, 
    handleDecrease, 
    handleRemove 
}) => {

    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleToggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    cartItems = mockCartItems; 
    const cartItemCount = cartItems.length;

    return (
        <div className="header-wrapper">
            <header className="header-main">
                <div className="header-group left">
                    <button className="menu-button" aria-label="Abrir menú">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Link to="/" className="brand-link">
                        <h1 className="brand-text">Tienda Sol</h1>
                    </Link>
                </div>

                <form className="search-form" role="search">
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Buscar productos..."
                    />
                    <button type="submit" className="search-button">Buscar</button>
                </form>

                <div className="header-group right">
                    <button onClick={handleToggleCart} className="cart-button" aria-label={`Ver carrito con ${cartItemCount} artículos`}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {cartItemCount > 0 && (
                            <span className="cart-count">{cartItemCount}</span>
                        )}
                    </button>
                </div>
            </header>

            <nav className="categories-nav">
                <a href="/categoria/ofertas" className="category-link">Ofertas</a>
                <a href="/categoria/nuevos" className="category-link">Nuevos</a>
                <a href="/categoria/electronica" className="category-link">Electrónica</a>
                <a href="/categoria/ropa" className="category-link">Ropa</a>
            </nav>

            <MiniCart 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
            />
        </div>
    );
};

export default SiteHeader;