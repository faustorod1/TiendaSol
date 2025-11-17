import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cart from '../mainPage/Cart';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.items ?? [];

  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/', { replace: true });
    }
  }, [items, navigate]);

  const total = items.reduce((s, it) => s + (it.precio ?? 0) * (it.cantidad ?? 0), 0);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);

        setFirstName(user.nombre || '');
        setLastName(user.apellido || '');
        setAddress(user.direccion || '');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Checkout submit:', { paymentMethod, firstName, lastName, address, items, total });
    alert('Simulación: formulario enviado. Revisa la consola.');
    navigate('/', { replace: true });
  };

  return (
    <div className="cart-page">
      <h1>Checkout</h1>

      {items.length === 0 ? (
        <p>Redirigiendo…</p>
      ) : (
        <>
          <section className="cart-column">
            <Cart items={items} hideHeader />
          </section>

          <aside className="checkout-column">
            <div className="checkout-panel">
              <h2>Datos y forma de pago</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Nombre</label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nombre"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Apellido</label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Apellido"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Dirección</label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, ciudad"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="payment">Forma de pago</label>
                  <select
                    id="payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="card">Tarjeta (crédito/débito)</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash">Efectivo</option>
                  </select>
                </div>

                <button type="submit" className="place-order-button">
                  Finalizar compra
                </button>
              </form>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default Checkout;