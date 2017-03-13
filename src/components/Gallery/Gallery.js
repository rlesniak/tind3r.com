import './Gallery.scss';

import React, { Component } from 'react';
import Slider from 'react-slick';
import uniqueId from 'lodash/uniqueId';
import map from 'lodash/map';

import Image from 'Components/Image';

const sliderOptions = {
  dots: true,
  infinite: false,
  speed: 500,
  currentSlide: 0,
  slide: 0,
};

const Gallery = ({ images = [], width }) => (
  <div className="gallery">
    {images.length && <div className="gallery__slider">
      <Slider {...sliderOptions}>
        {map(images, image => (
          <div key={uniqueId()}><Image src={image.url} style={{ width }} /></div>
        ))}
      </Slider>
    </div>}
  </div>
);

export default Gallery;
