import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, disabled }) => {
  return (
    <article className={`product-card ${ disabled ? 'disabled' : '' }`} title={ disabled ? 'No puedes agregar al carrito este producto porque ya tienes uno de otro vendedor.' : '' }>
      <Link to={`/productos/${product._id}`} className="product-link">
        <img 
          src={product.fotos?.[0]} 
          alt={product.titulo}
          className="product-thumb"
        />
        <div className="product-info">
          <div className="product-title-section">
            <h3 className="product-title">{product.titulo}</h3>
          </div>
          
          <div className="product-meta-section">
            <div className="product-meta">
              <span className="product-price">${product.precio}</span>
              <span className="product-stock">Stock: {product.stock}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  disabled: PropTypes.bool
};

export default ProductCard;