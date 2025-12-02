import React from 'react';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-container">
            <h1>Política de Privacidad</h1>
            <div className="privacy-content">
                <h2>1. Información que Recopilamos</h2>
                <p>Recopilamos información personal que usted nos proporciona directamente, como su nombre, dirección de correo electrónico, dirección de envío y detalles de pago. También recopilamos información automáticamente a través de cookies y tecnologías similares.</p>
                <h2>2. Uso de la Información</h2>
                <p>Utilizamos la información recopilada para procesar sus pedidos, mejorar nuestros servicios, comunicarnos con usted sobre su cuenta y enviarle promociones y ofertas especiales.</p>
                <h2>3. Compartir Información</h2>
                <p>No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información con proveedores de servicios que nos ayudan a operar nuestro negocio, como procesadores de pagos y servicios de envío.</p>
            </div>
        </div>
    );
};

export default Privacy;