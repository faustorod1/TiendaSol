import React, { useState, useEffect } from "react";
import ProductSearchBar from './components/ProductSearchBar/ProductSearchBar';
import { Routes, Route } from "react-router-dom"; // SIN BrowserRouter
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
import SignUp from './components/SignUp/SignUp';
import Contacto from './components/Contacto/Contacto';
import { Notificaciones } from './components/mockData/Notificaciones.js';
import { FilterProvider } from "./contexts/FilterContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationDetailPage from './components/Notifications/NotificationDetailPage';
import Terms from './components/Terms&Privacy/Terms';
import Privacy from './components/Terms&Privacy/Privacy';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

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
        <NotificationProvider>
          <div className="App">
            <SiteHeader 
              notifications={notifications}
              setNotifications={setNotifications}
            />
            <Breadcrumbs />
            <main>
              <Routes>
                
                <Route path="/" element={<Landing />} />

                <Route path="/productos/:id" element={<ProductDetailPage />} />

                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />

                <Route path="/productos" element={<AllProducts />} />

                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/account/manage" 
                  element={
                    <ProtectedRoute>
                      <AccountInfo />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/account/pedidos" 
                  element={
                    <ProtectedRoute>
                      <AllOrders />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/account/pedidos/:id" element={<OrderDetailPage />} />
                <Route path="/account/pedidos/:id/cancelar" element={<CancelOrder />} />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/signin/manage" element={<AccountInfo />} />

                <Route path="/signup" element={<SignUp />} />

                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute>
                      <AllNotifications />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/notifications/:id" element={<NotificationDetailPage />} />

                <Route path="/contacto" element={<Contacto />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
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
