// @flow

import React from 'react';

type PropsType = {
  text?: string,
};

const Bio = ({ text }: PropsType) => {
  if (!text) {
    return null;
  }

  return (
    <div>{
      text.split('\n').map((item, key) => (
        <span key={key}>{item}<br /></span> //eslint-disable-line
      ))
    }
    </div>
  );
};

export default Bio;
