// @flow

import React from 'react';
import { compose, withStateHandlers, withHandlers, type HOC } from 'recompose';
import cx from 'classnames';

import './Image.scss';

type PropsType = {
  isFailed: boolean,
  style: { width: number },
  src: string,
  className: ?string,
};

const Image = ({ isFailed, onError, style, src, className }) => {
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

  return <img alt="Error" src={src} onError={onError} style={style} className={cx(className)} />;
};

const enhance: HOC<*, PropsType> = compose(
  withStateHandlers({ isFailed: false }, {
    setError: () => value => ({
      isFailed: value,
    }),
  }),
  withHandlers({
    onError: ({ setError }) => () => {
      setError(true);
    },
  }),
);

export default enhance(Image);
