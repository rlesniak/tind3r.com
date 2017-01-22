import React from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.scss'
import Logo from '../../shared/Logo'

const App = props => (
  <div styleName="wrapper">
    <Logo />
    {props.children && React.cloneElement(props.children, props)}
  </div>
)

export default CSSModules(App, styles)
