// @flow

import './Discussion.scss';

import React from 'react';
import RDT from 'react-disqus-thread';

const  Discussion = () => (
  <div className="discussion">
    <RDT
      shortname="tind3r"
      identifier="tind3r"
      title="Example Thread"
      url="http://tind3r.com"
    />
  </div>
)

export default Discussion;
