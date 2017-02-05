import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import cx from 'classnames'
import RDT from 'react-disqus-thread'
import styles from './index.scss'

@CSSModules(styles)
export default class History extends Component {
  render() {
    return (
      <div styleName="wrapper" className="main-wrapper">
        <RDT
          shortname="tind3r"
          identifier="tind3r"
          title="Example Thread"
          url="http://tind3r.com"
        />
      </div>
    )
  }
}
