import './Gallery.scss';

import React, { PureComponent } from 'react';
import Slider from 'react-slick';
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
  withArrowNav: boolean,
};

const ARROW_LEFT = 37;
const ARROW_RIGHTT = 39;

class Gallery extends PureComponent {
  props: PropsType;
  timeout: number = 0;
  sliderRef: ?any;

  state = {
    show: !this.props.delay,
  }

  componentDidMount() {
    const { delay, withArrowNav, scrolling } = this.props;

    if (delay) {
      this.timeout = setTimeout(() => {
        this.setState({ show: true });
      }, delay);
    }

    if (withArrowNav && !scrolling) {
      window.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = 0;
    }
    const { withArrowNav, scrolling } = this.props;

    if (withArrowNav && !scrolling) {
      window.removeEventListener('keydown', this.handleKeydown);
    }
  }

  handleKeydown = ({ keyCode }: Event) => {
    if (!this.sliderRef) {
      return;
    }

    if (keyCode === ARROW_LEFT) {
      this.sliderRef.slickPrev();
    } else if (keyCode === ARROW_RIGHTT) {
      this.sliderRef.slickNext();
    }
  }

  render() {
    const { images = [], width, scrolling } = this.props;

    if (!this.state.show) return null;

    return (
      <div className={cx('gallery', { 'gallery--scrolling': scrolling })}>
        {!scrolling && images.length && <div className="gallery__slider">
          <Slider {...sliderOptions} ref={ref => { this.sliderRef = ref; }}>
            {map(images, image => (
              <div key={image.id}><Image src={image.url} style={{ width }} /></div>
            ))}
          </Slider>
        </div>}
        {scrolling && <div className="gallery__scrolling-area" style={{ width: width * images.length }}>
          {map(images, image => (
            <div key={uniqueId()} className="gallery__scrolling-area--image">
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src={image.url} style={{ width }} />
              </a>
            </div>
          ))}
        </div>}
      </div>
    );
  }
}
export default Gallery;
