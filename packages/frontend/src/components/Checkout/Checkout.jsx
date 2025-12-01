import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../../service/pedidoService';
import Cart from '../mainPage/Cart';
import { useCartContext } from '../../contexts/CartContext';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { limpiarCarrito } = useCartContext();
  const items = location.state?.items ?? [];

  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/', { replace: true });
    }
  }, [items, navigate]);

  const total = items.reduce((s, it) => s + (it.precio ?? 0) * (it.cantidad ?? 0), 0);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [currency, setCurrency] = useState('PESO_ARG');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validación básica
      if (!firstName.trim() || !lastName.trim() || !address.trim()) {
        alert('Por favor, completa todos los campos obligatorios');
        setIsSubmitting(false);
        return;
      }

      if (!items || items.length === 0) {
        alert('No hay productos en el carrito');
        setIsSubmitting(false);
        return;
      }

      console.log('Creando pedido con datos:', { firstName, lastName, address, items, currency, total });
      
      // Verificar datos del usuario
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      console.log('Usuario actual:', user);
      console.log('ID del usuario:', user?.id || user?._id);

      // Formatear datos del pedido con el ID del vendedor real
      const orderData = {
        vendedor: items[0].vendedor,
        items: items.map(item => {
          console.log('Procesando item:', item);
          return {
            productoId: item.id || item._id || item.productoId,
            cantidad: item.cantidad.toString()
          };
        }),
        moneda: currency,
        direccionEntrega: {
          calle: address.split(',')[0]?.trim() || address,
          altura: address.split(',')[1]?.trim() || '1',
          piso: '',
          departamento: '',
          codigoPostal: '1000',
          ciudad: 'Buenos Aires',
          provincia: 'Buenos Aires',
          pais: 'Argentina',
          lat: '',
          lon: ''
        }
      };

      console.log('Datos del pedido formateados:', orderData);

      const result = await createOrder(orderData);

      if (result.success) {
        console.log('Pedido creado exitosamente:', result.data);
        alert(`¡Pedido creado con éxito! 
        ID del pedido: ${result.pedidoId || result.data?._id}
        Total: $${total.toFixed(2)}
        Moneda: ${currency}`);
        
        limpiarCarrito();
        
        navigate('/', { 
          replace: true,
          state: { 
            message: 'Pedido creado exitosamente',
            pedidoId: result.pedidoId || result.data?._id 
          }
        });
      } else {
        console.error('Error al crear pedido:', result.error);
        alert(`Error al crear el pedido: ${result.error}`);
      }

    } catch (error) {
      console.error('Error inesperado en handleSubmit:', error);
      alert('Error inesperado al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
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
                      disabled={isSubmitting}
                      required
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
                      disabled={isSubmitting}
                      required
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
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currency">Moneda</label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="PESO_ARG">PESO_ARG</option>
                    <option value="DOLAR_USA">DOLAR_USA</option>
                    <option value="REAL">REAL</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="place-order-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Finalizar compra'}
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