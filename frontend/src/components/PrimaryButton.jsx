import React from 'react';

const PrimaryButton = ({ children, type = 'button' }) => (
  <button type={type} className="btn">
    {children}
  </button>
);

export default PrimaryButton;


