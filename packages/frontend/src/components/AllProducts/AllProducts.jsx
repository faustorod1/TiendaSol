import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
//import { Productos } from '../mockData/Productos.js';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { useFilters } from '../../contexts/FilterContext';
import './AllProducts.css';

const AllProducts = () => {

  
  //const [filteredProducts, setFilteredProducts] = useState(Productos); datos mockeados fuera, ya implemente la llamda al backend

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const { isFilterOpen } = useFilters();

  useEffect(() => {

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

    try {
      const queryString = searchParams.toString();
      const response = await fetch(`http://localhost:8000/productos?${queryString}`);
      if (response.status === 204) {
          setProductos([]);
          setTotalPages(1);
          setCurrentPage(1);
          return; 
        }
      
      if (!response.ok) {
        throw new Error(`Error ${response.status} al cargar productos: ${response.statusText}`);
      }

      const data = await response.json();

      setProductos(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.page || 1);
      } catch (err) {
        console.error("Error al traer productos:", err);
        setError(err.message);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();

  }, [searchParams]);


  const handleFilterChange = (name, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const currentFilters = Object.fromEntries(searchParams);

  const renderContent = () => {
    if (loading) {
      return <p>Cargando productos...</p>;
    }
    
    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }
    
    if (productos.length === 0) {
      return <p>No se encontraron productos para tu búsqueda.</p>;
    }

    return (
      <div className="products-grid">
        {productos.map(p => (
          <ProductCard key={p._id} product={p} /> 
        ))}
      </div>
    );
  };

  return (
    <div className="all-products-page">
      <div className="all-products-layout">
        
        <div className="layout-col-left"> 
          {isFilterOpen && (
            <ProductFilters 
              currentFilters={currentFilters} 
              onFilterChange={handleFilterChange} 
            />
          )}
        </div>
      
        <div className="layout-col-middle products-grid-wrapper">
            
            <h1>Productos</h1>

            {renderContent()}

            {!loading && !error && totalPages > 1 && (
              <div className="pagination-controls" style={{ marginTop: '2rem' }}>
                <button disabled={currentPage === 1}>Anterior</button>
                <span> Página {currentPage} de {totalPages} </span>
                <button disabled={currentPage === totalPages}>Siguiente</button>
              </div>
            )}
        </div>

        {/*  COLUMNA 3: DERECHA (Vacio para que quede centrado)  */}
        <div className="layout-col-right">
        </div>

      </div>
    </div>
  );
};

export default AllProducts;