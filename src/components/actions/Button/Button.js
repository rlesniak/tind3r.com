// @flow

import React from 'react';
import cx from 'classnames';

import './Button.scss';

type PropsType = {
  children: any,
  onClick: () => void,
  disabled?: boolean,
  active?: boolean,
  color?: 'red' | 'green' | 'blue',
}

const Button = ({ disabled, children, onClick, active, color = '' }: PropsType) => {
  const className = cx('action-button', {
    'action-button__active': active,
    'action-button__disabled': disabled,
    [`action-button__color--${color}`]: color,
  });

  return (
    <button onClick={onClick} className={className} disabled={disabled}>{children}</button>
  );
};

export default Button;
