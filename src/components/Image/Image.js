import React from 'react';
import { compose, withHandlers, withState } from 'recompose';

const enhance = compose(
  withState('isFailed', 'setError', false),
  withHandlers({
    onError: ({ setError }) => () => {
      setError(true)
    },
  }),
);

const Image = ({ isFailed, onError, style, src, ...props }) => {
  if (isFailed) {
    return (
      <div
        className="image__fallback"
        style={{ width: style.width, height: style.width, lineHeight: `${style.width}px` }}
      >
        Image broken :(
      </div>
    )
  }

  return (
    <img src={src} onError={onError} style={style} />
  )
};

export default enhance(Image);
