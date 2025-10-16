import React from "react";
import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <h1 className="header-title">Tienda del Sol</h1>
            <form className="search-form" role="search">
                <label htmlFor="search-bar" className="visually-hidden">Buscar en el sitio</label>
                <input 
                    id="search-bar"
                    className="search-bar" 
                    type="search" 
                    placeholder="Buscar productos..."
                />
                <button type="submit" className="search-button">Buscar</button>
            </form>
        </header>
    );
}

export default Header;