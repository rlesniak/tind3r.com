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
  infinite: true,
  speed: 500,
  currentSlide: 0,
  slide: 0,
  lazyLoad: true,
};

type PropsType = {
  delay?: number,
  scrolling?: boolean,
  width: number,
  images: Array<Object>,
};

class Gallery extends Component {
  props: PropsType;
  timeout: number = 0;

  state = {
    show: !this.props.delay,
  }

  componentDidMount() {
    const { delay } = this.props;

    if (delay) {
      this.timeout = setTimeout(() => {
        this.setState({ show: true });
      }, delay);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = 0;
    }
  }

  render() {
    const { images = [], width, scrolling } = this.props;

    if (!this.state.show) return null;

    return (
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
  }
}
export default Gallery;
