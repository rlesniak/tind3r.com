import React from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.scss'
import Logo from '../../shared/Logo'

const App = () => (
  <div styleName="wrapper">
    <Logo />
    {this.props.children && React.cloneElement(this.props.children, this.props)}
  </div>
)

export default CSSModules(App, styles)
