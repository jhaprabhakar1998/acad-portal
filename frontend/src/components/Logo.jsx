import React from 'react';
import './Logo.css';

/**
 * Logo Component
 * VMC Vidyamandir Classes logo
 */
const Logo = ({ className = '' }) => {
  return (
    <header className={`logo ${className}`}>
      <div className="logo__mark">VMC</div>
      <div className="logo__text">
        <span className="logo__title">Vidyamandir Classes</span>
        <span className="logo__subtitle">SINCE 1986</span>
        <span className="logo__tagline">IIT JEE | MEDICAL | FOUNDATION</span>
      </div>
    </header>
  );
};

export default Logo;

