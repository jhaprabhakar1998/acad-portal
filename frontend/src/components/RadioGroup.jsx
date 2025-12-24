import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from './ui';
import './RadioGroup.css';

/**
 * RadioGroup Component
 * Group of radio buttons with title
 */
const RadioGroup = ({
  name,
  title,
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`radio-group ${className}`}>
      {title && <div className="radio-group__title">{title}</div>}
      <div className="radio-group__options">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default RadioGroup;

