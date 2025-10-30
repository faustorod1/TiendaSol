import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose }) => {
    const containerClasses = `side-menu-container ${isOpen ? 'open' : ''}`;

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
                    <li><Link to="/ofertas" onClick={onClose}>Ofertas</Link></li>
                    <li><Link to="/contacto" onClick={onClose}>Contacto</Link></li>
                    </ul>
                </div>
                <div className="side-menu-footer">
                    <ul className="side-menu-links">
                    <li><Link to="/account" onClick={onClose}>Mi Cuenta</Link></li>
                    </ul>
                    <p>© 2023 Tienda Sol. Todos los derechos reservados.</p>
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