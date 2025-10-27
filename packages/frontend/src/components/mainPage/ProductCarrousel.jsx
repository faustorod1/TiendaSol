import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCarrousel.css';

const ProductCarrousel = ({ products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!products || products.length === 0) {
    return <div className="carousel-empty">No hay productos para mostrar</div>;
  }

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="product-carousel">
      <div className="carousel-container">
        <button 
          className="carousel-button prev" 
          onClick={prevProduct}
          aria-label="Producto anterior"
        >
          ←
        </button>

        <Link to={`/producto/${currentProduct.id}`} className="carousel-content">
          <img 
            src={currentProduct.fotos?.[0]} 
            alt={currentProduct.titulo} 
            className="carousel-image"
          />
          <div className="carousel-info">
            <h3 className="carousel-product-title">{currentProduct.titulo}</h3>
          </div>
        </Link>

        <button 
          className="carousel-button next" 
          onClick={nextProduct}
          aria-label="Producto siguiente"
        >
          →
        </button>
      </div>

      <div className="carousel-indicators">
        {products.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir al producto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarrousel;