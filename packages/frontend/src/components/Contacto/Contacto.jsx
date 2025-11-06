import React, { useState } from 'react';
import './Contacto.css';

const Contacto = () => {
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // validación simple: al menos email o teléfono
    if (!email.trim() && !telefono.trim()) {
      setError('Proporciona al menos un email o teléfono.');
      return;
    }

    const payload = { email, telefono, asunto, mensaje };
    console.log('Contacto enviado (simulado):', payload);
    alert('Mensaje enviado (simulación).');

    setEmail('');
    setTelefono('');
    setAsunto('');
    setMensaje('');
  };

  return (
    <form className="contacto-form" onSubmit={handleSubmit}>
      <h2>Contacto</h2>

      <div className="form-group">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@ejemplo.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact-telefono">Teléfono</label>
        <input
          id="contact-telefono"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="+54 9 11 1234 5678"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact-asunto">Asunto</label>
        <input
          id="contact-asunto"
          type="text"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          placeholder="Asunto"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact-mensaje">Mensaje</label>
        <textarea
          id="contact-mensaje"
          rows="5"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
      </div>

      {error && <div className="contact-error" role="alert">{error}</div>}

      <button type="submit" className="send-button">Enviar mensaje</button>
    </form>
  );
};

export default Contacto;