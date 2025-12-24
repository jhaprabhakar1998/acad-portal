import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card Component
 * Reusable card container component
 */
const Card = ({
  children,
  title,
  header,
  footer,
  className = '',
  ...props
}) => {
  const classes = ['card', className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {header && <div className="card__header">{header}</div>}
      {title && !header && (
        <div className="card__header">
          <div className="card__title">{title}</div>
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default Card;

