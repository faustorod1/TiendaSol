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
  const [addressData, setAddressData] = useState({
    calle: '',
    altura: '',
    piso: '',
    departamento: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    pais: '',
    lat: '',
    lon: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);

        setFirstName(user.nombre || '');
        setLastName(user.apellido || '');
        setAddressData({
          calle: user.direccion?.calle || '',
          altura: user.direccion?.altura || '',
          piso: user.direccion?.piso || '',
          departamento: user.direccion?.departamento || '',
          codigoPostal: user.direccion?.codigoPostal || '',
          ciudad: user.direccion?.ciudad || '',
          provincia: user.direccion?.provincia || '',
          pais: user.direccion?.pais || '',
          lat: '',
          lon: ''
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!firstName.trim() || !lastName.trim()) {
        alert('Por favor, completa el nombre y apellido');
        setIsSubmitting(false);
        return;
      }

      const requiredAddressFields = ['calle', 'altura', 'codigoPostal', 'ciudad', 'provincia', 'pais'];
      const missingFields = requiredAddressFields.filter(field => !addressData[field]?.trim());
      
      if (missingFields.length > 0) {
        const fieldNames = {
          calle: 'Calle',
          altura: 'Altura',
          codigoPostal: 'Código Postal',
          ciudad: 'Ciudad',
          provincia: 'Provincia',
          pais: 'País'
        };
        const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
        alert(`Por favor, completa los siguientes campos obligatorios: ${missingFieldNames}`);
        setIsSubmitting(false);
        return;
      }

      if (!items || items.length === 0) {
        alert('No hay productos en el carrito');
        setIsSubmitting(false);
        return;
      }

      console.log('Creando pedido con datos:', { firstName, lastName, addressData, items, currency, total });
      
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

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
          calle: addressData.calle.trim(),
          altura: addressData.altura.trim(),
          piso: addressData.piso.trim() || '',
          departamento: addressData.departamento.trim() || '',
          codigoPostal: addressData.codigoPostal.trim(),
          ciudad: addressData.ciudad.trim(),
          provincia: addressData.provincia.trim(),
          pais: addressData.pais.trim(),
          lat: addressData.lat.trim() || '',
          lon: addressData.lon.trim() || ''
        }
      };

      console.log('Datos del pedido formateados:', orderData);

      const result = await createOrder(orderData);
      const pedidoId = result.pedidoId || result.data?._id;

      if (result.success) {
        limpiarCarrito();
        
        navigate(`/account/pedidos/${pedidoId}`, { 
          replace: true,
          state: { pedidoCreado: true }
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

  const handleAddressChange = (field, value) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
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

                <div className="address-section">
                  <h3>Dirección de entrega</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="calle">Calle</label>
                      <input
                        id="calle"
                        type="text"
                        value={addressData.calle}
                        onChange={(e) => handleAddressChange('calle', e.target.value)}
                        placeholder="Nombre de la calle"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="altura">Altura</label>
                      <input
                        id="altura"
                        type="text"
                        value={addressData.altura}
                        onChange={(e) => handleAddressChange('altura', e.target.value)}
                        placeholder="Número"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="piso">Piso</label>
                      <input
                        id="piso"
                        type="text"
                        value={addressData.piso}
                        onChange={(e) => handleAddressChange('piso', e.target.value)}
                        placeholder="Piso (opcional)"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="departamento">Departamento</label>
                      <input
                        id="departamento"
                        type="text"
                        value={addressData.departamento}
                        onChange={(e) => handleAddressChange('departamento', e.target.value)}
                        placeholder="Depto (opcional)"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="codigoPostal">Código Postal</label>
                      <input
                        id="codigoPostal"
                        type="text"
                        value={addressData.codigoPostal}
                        onChange={(e) => handleAddressChange('codigoPostal', e.target.value)}
                        placeholder="1234"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="ciudad">Ciudad</label>
                      <input
                        id="ciudad"
                        type="text"
                        value={addressData.ciudad}
                        onChange={(e) => handleAddressChange('ciudad', e.target.value)}
                        placeholder="Buenos Aires"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="provincia">Provincia</label>
                      <input
                        id="provincia"
                        type="text"
                        value={addressData.provincia}
                        onChange={(e) => handleAddressChange('provincia', e.target.value)}
                        placeholder="Buenos Aires"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pais">País</label>
                      <input
                        id="pais"
                        type="text"
                        value={addressData.pais}
                        onChange={(e) => handleAddressChange('pais', e.target.value)}
                        placeholder="Argentina"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <details className="coordinates-section">
                    <summary>Coordenadas (opcional)</summary>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="lat">Latitud</label>
                        <input
                          id="lat"
                          type="number"
                          step="any"
                          value={addressData.lat}
                          onChange={(e) => handleAddressChange('lat', e.target.value)}
                          placeholder="-34.6037"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="lon">Longitud</label>
                        <input
                          id="lon"
                          type="number"
                          step="any"
                          value={addressData.lon}
                          onChange={(e) => handleAddressChange('lon', e.target.value)}
                          placeholder="-58.3816"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </details>
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