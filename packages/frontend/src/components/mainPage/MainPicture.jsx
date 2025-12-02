import React from 'react';
import './MainPicture.css';

const MainPicture = () => {
  return (
    <div className="main-picture">
      <img 
        src="/images/imagen-principal.jpg" 
        alt="Oferta especial - Descuentos hasta 50%" 
        className="promotional-image"
      />
      <div className="promotional-overlay">
        <h2>Todo lo que buscas en un solo lugar</h2>
      </div>
    </div>
  );
};

export default MainPicture;