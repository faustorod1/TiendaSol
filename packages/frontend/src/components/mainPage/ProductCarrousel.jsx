import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductCarrousel.css';

const ProductCarrousel = ({ products = [], autoPlay = true, autoPlayDelay = 6000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Auto-play functionality - MOVER ANTES del return condicional
  useEffect(() => {
    if (!autoPlay || products.length <= 1) return;

    const interval = setInterval(() => {
      nextProduct();
    }, autoPlayDelay);

    // Limpiar interval al desmontar o cambiar dependencias
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, products.length, currentIndex]);

  // Return condicional DESPUÉS de todos los hooks
  if (!products || products.length === 0) {
    return <div className="carousel-empty">No hay productos para mostrar</div>;
  }

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

        <Link to={`/productos/${currentProduct.id}`} className="carousel-content">
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
    </div>
  );
};

export default ProductCarrousel;