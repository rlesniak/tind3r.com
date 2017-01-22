import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './Logo.scss'

export default CSSModules(() => (
  <div styleName="logo-wrapper">
    <div styleName="logo">
      <a href="/">
        <h1>
          tind<span>
            <i className="fa fa-heart" styleName="atop" />
            <i className="fa fa-heart" styleName="border" />
          </span>r
        </h1>
        <div styleName="sub">Unofficial web client for Tinder</div>
      </a>
    </div>
  </div>
), styles)
