import './Gallery.scss';

import React, { Component } from 'react';
import Slider from 'react-slick';
import { pure } from 'recompose';
import uniqueId from 'lodash/uniqueId';
import map from 'lodash/map';
import cx from 'classnames';

import Image from 'components/Image';

const sliderOptions = {
  dots: true,
  infinite: false,
  speed: 500,
  currentSlide: 0,
  slide: 0,
};

const Gallery = ({ images = [], width, scrolling }) => (
  <div className={cx('gallery', { 'gallery--scrolling': scrolling })}>
    {!scrolling && images.length && <div className="gallery__slider">
      <Slider {...sliderOptions}>
        {map(images, image => (
          <div key={uniqueId()}><Image src={image.url} style={{ width }} /></div>
        ))}
      </Slider>
    </div>}
    {scrolling && <div className="gallery__scrolling-area" style={{ width: width * images.length }}>
      {map(images, image => (
        <div key={uniqueId()} className="gallery__scrolling-area--image">
          <Image src={image.url} style={{ width }} />
        </div>
      ))}
    </div>}
  </div>
);

export default pure(Gallery);
