import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUser } from '../../service/usuarioService';
import './AccountInfo.css';

const AccountInfo = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
  });

  const [metodosPago, setMetodosPago] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString);

        setFormData({
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          telefono: userData.telefono || '',
          email: userData.email || '',
        });

        setMetodosPago(userData.metodosPago || []);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      if (user) {
        setFormData({
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          telefono: user.telefono || '',
          email: user.email || '',
        });
        setMetodosPago(user.metodosPago || []);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarMetodoPago = () => {
    if (metodosPago.length >= 3) {
      setError('Máximo 3 métodos de pago permitidos');
      return;
    }
    
    const nuevoMetodo = {
      id: Date.now(),
      tipo: 'tarjeta',
      numeroTarjeta: '',
      nombreTitular: '',
      vencimiento: ''
    };
    
    setMetodosPago(prev => [...prev, nuevoMetodo]);
    setError('');
  };

  const eliminarMetodoPago = (id) => {
    setMetodosPago(prev => prev.filter(metodo => metodo.id !== id));
  };

  const actualizarMetodoPago = (id, campo, valor) => {
    setMetodosPago(prev => prev.map(metodo => 
      metodo.id === id ? { ...metodo, [campo]: valor } : metodo
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      setLoading(false);
      return;
    }

    try {
      
      const result = await updateUser({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim() || null,
        email: formData.email.trim(),
        telefono: formData.telefono.trim() || null,
      });
      
      if (result.success) {
        console.log('Datos actualizados exitosamente:', result.data);
        
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...currentUser,
          ...result.data,
          metodosPago: metodosPago,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setSuccess('Información actualizada correctamente');
        
        setTimeout(() => setSuccess(''), 3000);
        
      } else {
        console.error('Error al actualizar:', result.error);
        setError(result.error || 'Error al actualizar los datos');
        
        // Manejar sesión expirada
        if (result.shouldRedirectToLogin) {
          setTimeout(() => {
            navigate('/signin');
          }, 2000);
        }
      }
      
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Error inesperado al guardar los cambios. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-info">
      <h2>Información de la cuenta</h2>
      
      <form onSubmit={handleSubmit} className="account-form">
        <section className="form-section">
          <h3>Datos personales</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="+54 9 11 1234 5678"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
  
        <button 
          type="submit" 
          className="save-button"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default AccountInfo;