import React from 'react';
import { Productos } from '../mockData/Productos.js';
import ProductCard from './ProductCard';
import './AllProducts.css';

const AllProducts = () => {
  return (
    <div className="all-products-page">
      <h1>Productos</h1>
      <div className="products-grid">
        {Productos.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;