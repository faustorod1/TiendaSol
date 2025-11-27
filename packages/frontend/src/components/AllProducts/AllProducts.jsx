import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../../service/productoService';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { useFilters } from '../../contexts/FilterContext';
import './AllProducts.css';
import { useCartContext } from '../../contexts/CartContext';

const AllProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const { isFilterOpen } = useFilters();
  const { vendedorCarrito } = useCartContext();

  useEffect(() => {

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

    try {
      const result = await fetchProducts(searchParams);
      setProductos(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(result.page);

      } catch (err) {
        console.error("Error al traer productos:", err.message);
        setError(err.message);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();

  }, [searchParams]);


  const handleFilterChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);
    
    for (const [name, value] of Object.entries(newFilters)) {
      if (name === 'categorias') {
        handleCategoryUrl(newParams, value);
      } else if (value) {
        newParams.set(name, value);
      } else {
        newParams.delete(name);
      }
    }
    newParams.delete('page');

    setSearchParams(newParams);
  };

  const handleCategoryUrl = (params, categoriaIds) => {
    const name = 'categorias';
    params.delete(name);

    if (categoriaIds && Array.isArray(categoriaIds) && categoriaIds.length > 0) {
      categoriaIds.forEach(id => {
        params.append(name, id);
      });
    }
  }

  const urlCategories = searchParams.getAll('categorias');
  const currentFilters = {
    ...Object.fromEntries(searchParams),
    categorias: Array.isArray(urlCategories) ? urlCategories : (urlCategories ? [urlCategories] : [])
  };

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
          <ProductCard
            key={p._id}
            product={p}
            disabled={vendedorCarrito && vendedorCarrito !== p.vendedor}
            parentComponent="productos"
          /> 
        ))}
      </div>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());

    setSearchParams(newSearchParams);
  }

  return (
    <div className="all-products-page">
      {/* ProductFilters siempre se renderiza, pero se controla con CSS */}
      <ProductFilters 
        currentFilters={currentFilters} 
        onFilterChange={handleFilterChange} 
      />

      <div className="all-products-layout">
        
        <div className="layout-col-left"> 
          {/* En desktop, los filtros aparecen aquí a través del CSS */}
        </div>
      
        <div className="layout-col-middle products-grid-wrapper">
            
            <h1>Productos</h1>

            {renderContent()}

            {!loading && !error && totalPages > 1 && (
              <div className="pagination-controls" style={{ marginTop: '2rem' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
                <span> Página {currentPage} de {totalPages} </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Siguiente
                </button>
              </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default AllProducts;