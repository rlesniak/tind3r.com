import './Button.scss';

import React from 'react';
import cx from 'classnames';

const Button = ({ disabled, children, onClick, active, color }) => {
  const className = cx('action-button', className, {
    'action-button__active': active,
    'action-button__disabled': disabled,
    [`action-button__color--${color}`]: color,
  });

  return (
    <button onClick={onClick} className={className} disabled={disabled}>{children}</button>
  );
};

export default Button;
