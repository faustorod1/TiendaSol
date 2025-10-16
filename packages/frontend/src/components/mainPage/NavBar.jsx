import { Link } from 'react-router-dom';
import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import "./NavBar.css";

const NavBar = ({ cartItemCount = 0 }) => {
    return (
        <header className="navbar-bg">
            <nav className="navbar">
                <div className="navbar-section left">
                    <button className="menu-button">
                        <Link to="/menu" className="menu-link" aria-label="Abrir menú de navegación">
                            <FontAwesomeIcon icon={faBars} className="menu-icon" />
                        </Link>
                    </button>
                </div>

                <div className="navbar-section center">
                    <div className="brand">
                        <Link to={`/`} className="link-no-style"><h1 className="brand-text"> Tienda Sol.com </h1></Link>
                    </div>
                </div>

                <div className="navbar-section right">
                    <button className="cart-button">
                        <Link to="/cart" className="cart-link" aria-label={`Ver carrito de compras con ${cartItemCount} artículos`}>
                            <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                            {cartItemCount > 0 && (
                                <span className="cart-count">{cartItemCount}</span>
                            )}
                        </Link>
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;