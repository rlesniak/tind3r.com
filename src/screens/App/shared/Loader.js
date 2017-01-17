import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import CSSModules from 'react-css-modules';
import _ from 'lodash'
import styles from './Loader.scss'

export default inject('currentUser')(observer(CSSModules(({ currentUser, isSimpleLoader, noAnimation }) => {
  const pulse = (
    currentUser.photos ? <img src={currentUser.photos[0].url} alt="avatar" /> : null
  )

  return (
    <div>
      {!isSimpleLoader && <div
        styleName="containter"
        className={noAnimation && 'no-animation'}
      >
        <div styleName="dot" />
        {!currentUser.isLoading && pulse && <div styleName="pulse">
          {pulse}
        </div>}
      </div>}

      {isSimpleLoader && <div styleName="simple-loader" />}
    </div>
  )
}, styles)))
