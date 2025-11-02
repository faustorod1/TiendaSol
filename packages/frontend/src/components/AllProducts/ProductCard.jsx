import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <article className="product-card">
      <Link to={`/producto/${product._id}`} className="product-link">
        <img src={product.fotos?.[0]} alt={product.titulo} className="product-thumb" />
        <div className="product-info">
          <h3 className="product-title">{product.titulo}</h3>
          <div className="product-meta">
            <span className="product-price">{product.moneda} ${product.precio?.toLocaleString()}</span>
            <span className="product-stock">Stock: {product.stock}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;