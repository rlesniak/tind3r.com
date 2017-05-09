// @flow

import './Login.scss';

import React from 'react';

type PropsType = {
  children?: React.Element<*>,
  onClick: () => void,
}

export default ({ onClick, children }: PropsType) => (
  <div className="login">
    <div className="login__wrapper">
      {children && <div className="login__text">{children}</div>}
      <div className="login__facebook--before">
        <i className="fa fa-facebook" />
      </div>
      <button onClick={onClick} className="login__facebook">Continue with Facebook</button>
    </div>
  </div>
);
