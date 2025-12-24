import React from 'react';
import PropTypes from 'prop-types';
import './Radio.css';

/**
 * Radio Component
 * Reusable radio button component
 */
const Radio = ({
  name,
  value,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  const radioId = `radio-${Math.random().toString(36).substr(2, 9)}`;
  const classes = ['radio', className].filter(Boolean).join(' ');

  return (
    <label className={classes} htmlFor={radioId}>
      <input
        id={radioId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="radio__input"
        {...props}
      />
      <span className="radio__label">{label}</span>
      <span className="radio__checkmark"></span>
    </label>
  );
};

Radio.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Radio;

