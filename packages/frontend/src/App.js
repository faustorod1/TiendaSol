import React, { useState, useEffect } from "react";
import ProductSearchBar from './components/ProductSearchBar/ProductSearchBar';
import { Route, Routes } from "react-router-dom";
import Footer from "./components/mainPage/Footer";
import SiteHeader from "./components/mainPage/SiteHeader";
import MainPicture from "./components/mainPage/MainPicture";
import ProductCarrousel from "./components/mainPage/ProductCarrousel";
import ProductDetailPage from "./components/ProductDetailPage/ProductDetailPage";
import Checkout from './components/Checkout/Checkout';
import AllProducts from './components/AllProducts/AllProducts';
import Contacto from './components/Contacto/Contacto';
import { Productos } from './components/mockData/Productos.js';

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
        <main>
          <Routes>
            <Route path="/" element={
            <div>
              <MainPicture />
              <ProductCarrousel products={Productos} />
            </div>
          } />

            {/* Ruta dinámica para productos */}
            <Route path="/producto/:id" element={<ProductDetailPage />} />

            {/* Podés agregar más rutas aquí */}
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/productos" element={<AllProducts />} />

            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>

        <Footer />
      </div>
  );
}

export default App;
