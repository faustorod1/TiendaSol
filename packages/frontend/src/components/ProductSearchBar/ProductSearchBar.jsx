import React from 'react'
import './ProductSearchBar.css';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { GiClothes } from "react-icons/gi";

const ProductSearchBar = () => {
  return (
    <div className="product-search">
      
      <div className='search-field'>
        <label className='field-label'>Producto</label>
        <div className='input-wrapper'>
          <GiClothes className='search-icon'/>
          <input 
            type="text" 
            className='search-input' 
            placeholder="¿Que buscas?" 
          />
        </div>
      </div>
      
      <button className='search-button'>
        <FaSearch className='button-icon' />
        Buscar
      </button>
    </div>
  )
}

export default ProductSearchBar