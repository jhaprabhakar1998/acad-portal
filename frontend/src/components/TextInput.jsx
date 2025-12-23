import React from 'react';

const TextInput = ({ label, placeholder, value, onChange }) => (
  <label className="field">
    <span className="field__label">{label}</span>
    <input
      type="text"
      className="field__input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </label>
);

export default TextInput;


