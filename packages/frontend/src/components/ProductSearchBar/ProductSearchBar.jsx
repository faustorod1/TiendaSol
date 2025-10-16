import React from 'react';
import "./ProductSearchBar.css";
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const ProductSearchBar = () => {
    return (
        <div className="product-search">
            <div className='search-field'>
                <label className='field-label'>DESTINO</label>
                <div className='input-wrapper'>
                    <FaMapMarkerAlt className='search-icon' />
                    <input 
                        type="text" 
                        className='search-input' 
                        placeholder="¿A dónde vas?" 
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

export default ProductSearchBar;