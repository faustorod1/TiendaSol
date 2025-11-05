import React, { useState, useEffect } from 'react';
import { fetchCategorias } from '../../service/categoriaService';
import './ProductFilters.css';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

const ProductFilters = ({ currentFilters, onFilterChange }) => {
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const result = await fetchCategorias();
        console.log(result);
        
        setCategoriasDisponibles(result.data);
      } catch (error) {
        
      }
    };
    loadCategorias();
  }, []);

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

  return (
    <aside className="product-filters">
      <h3>Filtros</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        
        <div className="filter-group">
          <label htmlFor="precioMin">Precio Mín.</label>
          <input
            type="number"
            id="precioMin"
            name="precioMin"
            value={currentFilters.precioMin || ''}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="precioMax">Precio Máx.</label>
          <input
            type="number"
            id="precioMax"
            name="precioMax"
            value={currentFilters.precioMax || ''}
            onChange={handleChange}
            placeholder="999999"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="orderBy">Ordenar por</label>
          <select 
            id="orderBy" 
            name="orderBy" 
            value={currentFilters.orderBy || ''} 
            onChange={handleChange}
          >
            <option value="">Relevancia</option>
            <option value="precio_asc">Precio (menor a mayor)</option>
            <option value="precio_desc">Precio (mayor a menor)</option>
            <option value="ventas_desc">Más vendidos</option>
            <option value="fecha_creacion_desc">Últimos agregados</option>
          </select>
        </div>

        <div className="filter-group category-filter">
                    <h4>Categorías</h4>
                    <div className="category-filter-list">
                      {categoriasDisponibles.length > 0 ? (
                          categoriasDisponibles.map(category => (
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
                          <p>Cargando categorías...</p>
                      )}
                    </div>
                </div>

      </form>
    </aside>
  );
};

export default ProductFilters;