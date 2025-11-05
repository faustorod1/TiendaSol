import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cart from './Cart';
import './MiniCart.css';

const MiniCart = ({ isOpen, onClose, items, onIncrease, onDecrease, onRemove }) => {
    const [showCartPanel, setShowCartPanel] = useState(false);
    

    if (!isOpen) {
        return null;
    }

    //aca tal vez es conveniente calcular el subtotal y comparar con lo que viene del backend
    console.log(items);
    
    const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    return (
        <div className="mini-cart-overlay" onClick={onClose}>
            <div className="mini-cart-wrapper" onClick={(e) => e.stopPropagation()}>
                {showCartPanel && (
                    <div className="cart-panel">
                        <Cart items={items} onClosePanel={() => setShowCartPanel(false)} />
                    </div>
                )}

                <div className="mini-cart-content">
                    <div className="mini-cart-header">
                        <h3>Tu Carrito</h3>
                        <button onClick={onClose} className="close-button">&times;</button>
                    </div>

                    <div className="mini-cart-items">
                        {items.length === 0 ? (
                            <p className="empty-message">Tu carrito está vacío.</p>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img src={item.fotos[0]} alt={item.titulo} className="item-image" />
                                    <div className="item-details">
                                        <p className="item-name">{item.titulo}</p>
                                        <p className="item-price">${item.precio.toFixed(2)}</p>
                                    </div>
                                    <div className="item-quantity-controls">
                                        <button onClick={() => onDecrease(item)}>-</button>
                                        <span>{item.cantidad}</span>
                                        <button onClick={() => onIncrease(item)}>+</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="mini-cart-footer">
                            <div className="subtotal">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <button
                                className="view-cart-button"
                                onClick={() => setShowCartPanel(true)}
                            >
                                Ver Carrito Completo
                            </button>
                            <Link
                                to="/checkout"
                                state={{ items }}
                                className="checkout-button"
                                onClick={onClose}
                            >
                                Comprar Ahora
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

MiniCart.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    onIncrease: PropTypes.func.isRequired,
    onDecrease: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default MiniCart;