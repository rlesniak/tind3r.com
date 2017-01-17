import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import CSSModules from 'react-css-modules';
import _ from 'lodash'
import styles from './Spinner.scss'

export default CSSModules(({ align, children }) => (
  <div styleName="spinner" className={align}>
    <div styleName="double-bounce1" />
    <div styleName="double-bounce2" />
    {children}
  </div>
), styles)
