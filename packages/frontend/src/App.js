import React, { useState, useEffect } from "react";
import ProductSearchBar from './components/ProductSearchBar/ProductSearchBar';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from "react-router-dom";
import Footer from "./components/mainPage/Footer";
import SiteHeader from "./components/mainPage/SiteHeader";
import ProductDetailPage from "./components/ProductDetailPage/ProductDetailPage";

import "./App.css";


function App() {

  let itemCount = 3; // Cantidad de artículos en el carrito

  /*
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error cargando mensaje.", error));
  }, []);
  */
 
  return (
    <div className="App">
      <SiteHeader cartItemCount={itemCount} />
      {/*<ProductSearchBar></ProductSearchBar>*/}
      <main>
        <Routes>
          <Route path="/" element={<p>Inicio - contenido principal de tu página</p>} />

          {/* Ruta dinámica para productos */}
          <Route path="/producto/:id" element={<ProductDetailPage />} />

          {/* Podés agregar más rutas aquí */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
