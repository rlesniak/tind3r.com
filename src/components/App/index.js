import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import styles from './app.scss'

@CSSModules(styles)
export default class App extends Component {
  render() {
    return (
      <div styleName="page">
        <h1>Main</h1>
        {this.props.children}
      </div>
    );
  }
}
