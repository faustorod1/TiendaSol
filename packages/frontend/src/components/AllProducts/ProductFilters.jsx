import React from 'react';
import './ProductFilters.css';

const ProductFilters = ({ currentFilters, onFilterChange }) => {

  const handleChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
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

      </form>
    </aside>
  );
};

export default ProductFilters;