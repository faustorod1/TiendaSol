import React from 'react';
import { UseScrollVisible } from '../../hooks/UseScrollVisible';
import './Footer.css';

const Footer = () => {

    return (
        <footer className="footer">
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