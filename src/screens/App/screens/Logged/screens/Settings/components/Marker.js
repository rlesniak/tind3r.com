import React from 'react'

const K_WIDTH = 10;
const K_HEIGHT = 10;

const greatPlaceStyle = {
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  borderRadius: K_HEIGHT,
  backgroundColor: 'red',
};

const myMarker = () => (
  <div className="marker">
    <div style={greatPlaceStyle} />
  </div>
);

export default myMarker
