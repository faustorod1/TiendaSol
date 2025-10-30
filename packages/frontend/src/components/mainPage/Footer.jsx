import React from 'react';
import { UseScrollVisible } from '../../hooks/UseScrollVisible';
import './Footer.css';

const Footer = () => {
    const isVisible = UseScrollVisible(150); //visible pasando 150 pixeles

    return (
        <footer className={`footer ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="footer-content">
                <p>{new Date().getFullYear()} Tienda Sol</p>
                <a href = "/terms"> Términos y Condiciones</a>
                <a href = "/privacy"> Política de Privacidad</a>
                <a href = "/contacto"> Contáctanos</a>
            </div>
        </footer>
    );
};

export default Footer;