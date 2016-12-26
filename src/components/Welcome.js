import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import CSSModules from 'react-css-modules'
import styles from './fb-connect.scss'

@CSSModules(styles)
export default class Welcome extends Component {

  render() {
    return (
      <div styleName="wrapper">
        <h1>LANDINGPAGE</h1>
        <h3>Download extension:</h3>
        <a href="https://chrome.google.com/webstore/detail/tnder-tind3r-tinder-web-c/iopleohdgiomebidpblllpaigodfhoia">HERE</a>

        <h4>If installed go: <a href="/">homepage</a></h4>
      </div>
    );
  }
}
