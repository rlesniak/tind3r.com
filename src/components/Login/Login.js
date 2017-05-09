// @flow

import './Login.scss';

import React from 'react';

type PropsType = {
  onClick: () => void,
}

export default ({ onClick }: PropsType) => (
  <div className="login">
    <div className="login__wrapper">
      <div className="login__facebook--before">
        <i className="fa fa-facebook" />
      </div>
      <button onClick={onClick} className="login__facebook">Continue with Facebook</button>
    </div>
  </div>
);
