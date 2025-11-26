import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose, tipoUsuario }) => {
    const containerClasses = `side-menu-container ${isOpen ? 'open' : ''}`;

    const isAuthenticated = () => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        return token && user;
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
    
        window.location.href = '/';
    };

    return (
        <div className={containerClasses}>
            <div className="menu-overlay" onClick={onClose}></div>
            
            <nav className="side-menu-content" onClick={(e) => e.stopPropagation()}>
                <div className="side-menu-header">
                    <h3>Menú</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>

                <div className="side-menu-content-header">
                    <ul className="side-menu-links">
                    <li><Link to="/" onClick={onClose}>Inicio</Link></li>
                    <li><Link to="/productos" onClick={onClose}>Todos los Productos</Link></li>
                    <li>
                      <Link to="/account/pedidos" onClick={onClose}>
                        {isAuthenticated() ? (tipoUsuario === 'COMPRADOR' ? 'Mis Pedidos' : 'Pedidos Asignados') : 'Pedidos'}
                      </Link>
                    </li>
                    <li><Link to="/contacto" onClick={onClose}>Contacto</Link></li>
                    </ul>
                </div>
                <div className="side-menu-footer">
                    <ul className="side-menu-links">
                        { isAuthenticated() ? (
                            <>
                                <li><Link to="/account" onClick={onClose}>Mi Cuenta</Link></li>
                                <li><Link to="/" onClick={() => { handleLogout(); onClose(); }}>Cerrar Sesión</Link></li>
                            </>
                        ) : (
                            <li><Link to="/signin" onClick={onClose}>Iniciar sesión</Link></li>
                        )}
                    </ul>
                    <p>© 2025 Tienda Sol. Todos los derechos reservados.</p>
                </div>
            </nav>
        </div>
    );
};

SideMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default SideMenu;