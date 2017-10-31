// @flow

import React from 'react';
import cx from 'classnames';

import './SearchingLoader.scss';

type PropsType = {
  children: any,
  noAnimation: boolean,
  photoUrl: string,
};

export default ({ noAnimation, photoUrl, children }: PropsType) => (
  <div className="searching-loader">
    <div
      className={cx('searching-loader__wrapper', { 'searching-loader--static': noAnimation })}
    >
      <div className="searching-loader__dot" />
      <div className="searching-loader__pulse">
        <img src={photoUrl} alt="avatar" />
      </div>
    </div>
    <div className="searching-loader__message">{children}</div>
  </div>
  );
