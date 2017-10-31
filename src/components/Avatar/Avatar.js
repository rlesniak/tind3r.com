// @flow

import React from 'react';

import Image from 'components/Image';

import './Avatar.scss';

type PropsType = {
  url: string,
  width?: number,
  height?: number,
};

const Avatar = ({ url, width, height }: PropsType) => {
  const style = {
    width, height,
  };

  return (
    <div className="avatar" style={width && height && style}>
      <Image src={url} style={{ width }} className="avatar__image" />
    </div>
  );
};

export default Avatar;
