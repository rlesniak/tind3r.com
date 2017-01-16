import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.scss'
import Logo from '../../shared/Logo'

@CSSModules(styles)
export default class App extends Component {
  render() {
    return (
      <div styleName="wrapper">
        <Logo />
        {this.props.children && React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
}
