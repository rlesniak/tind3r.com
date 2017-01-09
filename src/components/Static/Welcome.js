import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import autobind from 'autobind-decorator'
import { Link } from 'react-router'
import _ from 'lodash'
import CSSModules from 'react-css-modules'
import styles from './welcome.scss'
import Logo from '../Logo'

@CSSModules(styles)
export default class Welcome extends Component {
  render() {
    const isChrome = !!window.chrome && !!window.chrome.webstore

    if (isChrome) {
      return (
        <div className="static-wrapper">
          <Logo />

          <div styleName="content">
            <h3>To be able to use tind3r.com you must download extension:</h3>
            <a
              target="_blank"
              href="https://chrome.google.com/webstore/detail/tnder-tind3r-tinder-web-c/iopleohdgiomebidpblllpaigodfhoia">
              <img src="https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_340x96.png" alt="Download" />
            </a>
            <p>
              Why do I need this? <br/>
              To be able to comunicate with official Tinder Service.
            </p>

            <h4>
              When installation is complete you are free to use web client! <a href="/">GO GO GO!</a>
            </h4>
          </div>

          <div className="footer">
            Copyright &copy; <a href="https://goo.gl/6i11L7" target="_blank">Rafal Lesniak</a>
            | <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="static-wrapper">
          <Logo />

          <div styleName="content">
            <h3>To be able to use tind3r.com you must use Google Chrome browser. (Firefox version under development)</h3>
          </div>

          <div className="footer">
            Copyright &copy; <a href="https://goo.gl/6i11L7" target="_blank">Rafal Lesniak</a>
            | <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      )
    }
  }
}
