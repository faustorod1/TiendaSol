import React, { useState, useEffect } from "react";
import ProductSearchBar from './components/ProductSearchBar/ProductSearchBar';

import Footer from "./components/mainPage/Footer";
import SiteHeader from "./components/mainPage/SiteHeader";

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
        <p>Contenido principal de tu página...</p>
        <div style={{ height: '200vh' }}></div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
