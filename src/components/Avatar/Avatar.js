// @flow

import './Avatar.scss';

import React from 'react';

type PropsTypes = {
  url: string,
  width?: number,
  height?: number,
};

const Avatar = ({ url, width, height }: PropsTypes) => {
  const style = {
    width, height,
  };

  return (
    <div className="avatar" style={width && height && style}>
      <img src={url} className="avatar__image" />
    </div>
  );
};

export default Avatar;
