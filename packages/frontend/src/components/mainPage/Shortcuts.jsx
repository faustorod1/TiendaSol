import React from 'react';
import ShortcutContainer from './ShortcutContainer';
import './Shortcuts.css';

const Shortcuts = () => {
  const shortcutItems = [
    { id: 1, label: 'Mas Vendidos', path: '/productos' },
    { id: 2, label: 'Iniciar Sesion', path: '/contacto' },
    { id: 3, label: 'Metodos de pago', path: '/account/manage' },
    { id: 4, label: 'Ingresar Direccion', path: '/account/manage' },
  ];

  return (
    <div className="shortcuts">
      <div className="shortcuts-grid">
        {shortcutItems.map(item => (
          <ShortcutContainer
            key={item.id} 
            label={item.label} 
            path={item.path} 
          />
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;