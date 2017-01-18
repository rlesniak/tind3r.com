import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './Tooltip.scss'

export default CSSModules(({ children, triggerEl, position }) => (
  <div styleName="tooltip" className={position}>
    {triggerEl}
    <span>{children}</span>
  </div>
), styles)
