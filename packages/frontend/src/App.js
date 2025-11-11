import React, { useState, useEffect } from "react";
import ProductSearchBar from './components/ProductSearchBar/ProductSearchBar';
import { Route, Routes } from "react-router-dom";
import Footer from "./components/mainPage/Footer";
import SiteHeader from "./components/mainPage/SiteHeader";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import Landing from "./components/mainPage/Landing.jsx";
import ProductDetailPage from "./components/ProductDetailPage/ProductDetailPage";
import Checkout from './components/Checkout/Checkout';
import AllProducts from './components/AllProducts/AllProducts';
import Account from './components/Account/Account';
import AccountInfo from './components/Account/AccountInfo';
import AllNotifications from './components/Notifications/AllNotifications';
import AllOrders from './components/Pedidos/AllOrders';
import OrderDetailPage from './components/Pedidos/OrderDetailPage';
import CancelOrder from './components/Pedidos/CancelOrder';
import SignIn from './components/SignIn/SignIn';
import Contacto from './components/Contacto/Contacto';
import { Notificaciones } from './components/mockData/Notificaciones.js';
import { FilterProvider } from "./contexts/FilterContext";
import { NotificationProvider } from "./contexts/NotificationContext"; // Nuevo import
import NotificationDetailPage from './components/Notifications/NotificationDetailPage';

import "./App.css";
import { CartProvider } from "./contexts/CartContext.jsx";

function App() {

  // Estado para manejar las notificaciones
  const [notifications, setNotifications] = useState(Notificaciones);

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
    <CartProvider>
      <FilterProvider>
        <NotificationProvider> {/* Envolver la app */}
          <div className="App">
            <SiteHeader 
              notifications={notifications}
              setNotifications={setNotifications}
            />
            <Breadcrumbs />
            <main>
              <Routes>
              
                <Route path="/" element={<Landing />} />

                {/* Ruta dinámica para productos */}
                <Route path="/productos/:id" element={<ProductDetailPage />} />

                {/* Podés agregar más rutas aquí */}
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/productos" element={<AllProducts />} />

                <Route path="/account" element={<Account />} />
                <Route path="/account/manage" element={<AccountInfo />} />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/signin/manage" element={<AccountInfo />} />

                <Route path="/notifications" element={<AllNotifications />} />
                <Route path="/notification/:id" element={<NotificationDetailPage />} />

                <Route path="/account/pedidos" element={<AllOrders />} />
                <Route path="/account/pedidos/:id" element={<OrderDetailPage />} />
                <Route path="/account/pedidos/:id/cancelar" element={<CancelOrder />} />

                <Route path="/contacto" element={<Contacto />} />
              </Routes>

              
            </main>

            <Footer />
          </div>
        </NotificationProvider>
      </FilterProvider>
    </CartProvider>
  );
}

export default App;
