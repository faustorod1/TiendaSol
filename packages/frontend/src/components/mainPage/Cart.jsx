import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Cart.css';

const Cart = ({ items: propsItems, onClosePanel }) => {
  const location = useLocation();
  const items = propsItems ?? location.state?.items ?? [];

  return (
    <div className="cart-panel-inner">
      <div className="cart-panel-header">
        <h3>Tu Carrito Completo</h3>
        {onClosePanel && <button className="close-panel" onClick={onClosePanel}>&times;</button>}
      </div>

      {items.length === 0 ? (
        <p>No hay items en el carrito.</p>
      ) : (
        <ul className="cart-list">
          {items.map(item => (
            <li key={item.id} className="cart-list-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <strong>{item.name}</strong>
                <div className="cart-item-meta">{item.quantity} x ${item.price.toFixed(2)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Cart.propTypes = {
  items: PropTypes.array,
  onClosePanel: PropTypes.func,
};

export default Cart;