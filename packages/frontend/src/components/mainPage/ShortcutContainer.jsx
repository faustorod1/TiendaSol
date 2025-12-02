import React from 'react';
import { Link } from 'react-router-dom';
import './ShortcutContainer.css';

const ShortcutContainer = ({ label, path }) => {
  return (
    <Link to={path} className="shortcuts-container">
      <span className="shortcuts-label">{label}</span>
    </Link>
  );
};

export default ShortcutContainer;