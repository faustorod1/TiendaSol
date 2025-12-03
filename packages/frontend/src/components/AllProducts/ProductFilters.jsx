import React, { useState, useEffect } from 'react';
import { fetchCategorias } from '../../service/categoriaService';
import { useFilters } from '../../contexts/FilterContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
import './ProductFilters.css';
import { useCartContext } from '../../contexts/CartContext';

const ProductFilters = ({ currentFilters, onFilterChange }) => {
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isFilterOpen, setIsFilterOpen } = useFilters();
  const { vendedorCarrito } = useCartContext();

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const result = await fetchCategorias();
        setCategoriasDisponibles(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    handleChange({target: {name: 'vendedor', value: ''}});
  }, [vendedorCarrito]);

  const handleVendedorChange = (e) => {
    let value = ''
    if (e.target.checked === true) {
      value = vendedorCarrito;
    }
    const params = {
      target: {
        name: 'vendedor',
        value: value
      }
    };
    handleChange(params);
  }

  const handleChange = (e) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (categoriaId) => {
    const currentCategories = currentFilters.categorias || [];
    let newCategories;

    if (currentCategories.includes(categoriaId)) {
        newCategories = currentCategories.filter(id => id !== categoriaId);
    } else {
        newCategories = [...currentCategories, categoriaId]; 
    }

    onFilterChange({categorias: newCategories});
  };

  const handleOverlayClick = () => {
    setIsFilterOpen(false);
  };

  const filteredCategories = categoriasDisponibles.filter(category => 
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div 
          className={`filters-overlay ${isFilterOpen ? 'open' : ''}`}
          onClick={handleOverlayClick}
      />
      
      <div className={`filters-container ${isFilterOpen ? 'open' : ''}`}>

          <aside className="product-filters">
            <button 
                className="filters-close-button"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Cerrar filtros"
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <h3>Filtros</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              { vendedorCarrito && (
                <div className="filter-group" style={{display: 'flex', textAlign: 'left', gap: '5px'}}>
                  <input type="checkbox" name="vendedorCarrito" id="vendedorCarrito" onChange={handleVendedorChange} />
                  <label htmlFor="vendedorCarrito">Ocultar productos de otros vendedores</label>
                </div>
              )}
              <div className="filter-group">
                <label htmlFor="precioMin">Precio Mín.</label>
                <input type="number" id="precioMin" name="precioMin" value={currentFilters.precioMin || ''} onChange={handleChange} placeholder="0" />
              </div>

              <div className="filter-group">
                <label htmlFor="precioMax">Precio Máx.</label>
                <input type="number" id="precioMax" name="precioMax" value={currentFilters.precioMax || ''} onChange={handleChange} placeholder="999999" />
              </div>
              
              <div className="filter-group">
                <label htmlFor="orderBy">Ordenar por</label>
                <select id="orderBy" name="orderBy" value={currentFilters.orderBy || ''} onChange={handleChange}>
                  <option value="precio_asc">Precio (menor a mayor)</option>
                  <option value="precio_desc">Precio (mayor a menor)</option>
                  <option value="ventas_desc">Más vendidos</option>
                  <option value="fecha_creacion_desc">Últimos agregados</option>
                </select>
              </div>

              <div className="filter-group category-filter">
                  <h4>Categorías</h4>
                  
                  <div className="category-search-container">
                    <input 
                      type="text"
                      placeholder="Buscar categoría..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="category-search-input"
                    />
                    
                    {searchTerm ? (
                      <FontAwesomeIcon 
                        icon={faXmark} 
                        className="search-icon clear-icon"
                        onClick={() => setSearchTerm('')}
                      />
                    ) : (
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className="search-icon" 
                      />
                    )}
                  </div>

                  <div className="category-filter-list">
                    {categoriasDisponibles.length > 0 ? (
                        // Usamos filteredCategories en lugar de categoriasDisponibles
                        filteredCategories.length > 0 ? (
                          filteredCategories.map(category => (
                            <div key={category._id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`cat-${category._id}`}
                                    checked={currentFilters.categorias.includes(category._id)}
                                    onChange={() => handleCategoryToggle(category._id)}
                                />
                                <label htmlFor={`cat-${category._id}`}>{category.nombre}</label>
                            </div>
                          ))
                        ) : (
                          <p className="no-results">No se encontraron categorías</p>
                        )
                    ) : (
                        <p>Cargando categorías...</p>
                    )}
                  </div>
              </div>

            </form>
          </aside>
      </div>
    </>
  );
};

export default ProductFilters;