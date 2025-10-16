import { Link } from 'react-router-dom';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './SiteHeader.css';

const SiteHeader = ({ cartItemCount }) => {
    return (
        <div className="header-wrapper">
            <header className="header-main">
                {/* Agrupamos menú y marca para mantenerlos juntos */}
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
                    <Link to="/cart" className="cart-link" aria-label={`Ver carrito con ${cartItemCount} artículos`}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {cartItemCount > 0 && (
                            <span className="cart-count">{cartItemCount}</span>
                        )}
                    </Link>
                </div>
            </header>

            <nav className="categories-nav">
                <a href="/categoria/ofertas" className="category-link">Ofertas</a>
                <a href="/categoria/nuevos" className="category-link">Nuevos</a>
                <a href="/categoria/electronica" className="category-link">Electrónica</a>
                <a href="/categoria/ropa" className="category-link">Ropa</a>
            </nav>
        </div>
    );
};

export default SiteHeader;