import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import CSSModules from 'react-css-modules';
import _ from 'lodash'
import styles from './spinner.scss'

export default CSSModules(({ align }) => (
  <div styleName="spinner" className={align}>
    <div styleName="double-bounce1"></div>
    <div styleName="double-bounce2"></div>
  </div>
), styles)
