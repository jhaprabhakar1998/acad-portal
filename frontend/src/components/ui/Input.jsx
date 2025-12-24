import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';

/**
 * Input Component
 * Reusable input field component
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
  const classes = ['field', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label htmlFor={fieldId} className="field__label">
          {label}
          {required && <span className="field__required">*</span>}
        </label>
      )}
      <input
        id={fieldId}
        type={type}
        className={`field__input ${error ? 'field__input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;

