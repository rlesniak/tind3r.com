import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import CSSModules from 'react-css-modules';
import _ from 'lodash'
import styles from '../styles/loader.scss'

export default inject('currentUser')(observer(CSSModules(({ currentUser, isSimpleLoader }) => (
  <div>
    {!isSimpleLoader && <div styleName="containter">
      <div styleName="dot"></div>
      <div styleName="pulse">
        {!currentUser.isLoading && <img src={currentUser.photos[0].url} alt="avatar" />}
      </div>
    </div>}

    {isSimpleLoader && <div styleName="simple-loader" />}
  </div>
), styles)))
