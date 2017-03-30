// @flow

import './Avatar.scss';

import React, { Component } from 'react';

type PropsTypes = {
  url: string,
};

const Avatar = ({ url }: PropsTypes) => {
  return (
    <div className="avatar">
      <img src={url} className="avatar__image" />
    </div>
  )
}

export default Avatar;
