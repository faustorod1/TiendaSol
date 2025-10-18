import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MiniCart.css';

const MiniCart = ({ isOpen, onClose, items, onIncrease, onDecrease, onRemove }) => {
    if (!isOpen) {
        return null;
    }
    //aca tal vez es conveniente calcular el subtotal y comparar con lo que viene del backend
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="mini-cart-overlay" onClick={onClose}>
            <div className="mini-cart-content" onClick={(e) => e.stopPropagation()}>
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
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-details">
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-price">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="item-quantity-controls">
                                    <button onClick={() => onDecrease(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => onIncrease(item.id)}>+</button>
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
                        <Link to="/cart" className="view-cart-button" onClick={onClose}>
                            Ver Carrito Completo
                        </Link>
                        <button className="checkout-button">Comprar Ahora</button>
                    </div>
                )}
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