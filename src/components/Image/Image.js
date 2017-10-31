// @flow

import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import cx from 'classnames';

import './Image.scss';

const enhance = compose(
  withState('isFailed', 'setError', false),
  withHandlers({
    onError: ({ setError }) => () => {
      setError(true);
    },
  }),
);

const Image = ({ isFailed, onError, style, src, className, ...props }) => {
  if (isFailed) {
    return (
      <div
        className={cx('image__fallback', className)}
        style={{ width: style.width, height: style.width, lineHeight: `${style.width}px` }}
      >
        Image broken :(
      </div>
    );
  }

  return (
    <img alt="Error" src={src} onError={onError} style={style} className={cx(className)} />
  );
};

export default enhance(Image);
