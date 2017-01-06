import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import { observable } from 'mobx'
import _ from 'lodash'
import cx from 'classnames'
import ReactGA from 'react-ga'
import { observer } from 'mobx-react'
import styles from './settings.scss'

@observer
@CSSModules(styles)
export default class Settings extends Component {
  @observable isOpen = false

  constructor(props) {
    super(props)
  }

  @autobind
  showSettings() {
    this.isOpen = !this.isOpen
  }

  @autobind
  setVertical() {
    this.props.handleSetLayout('vertical')
  }

  @autobind
  setHorizontal() {
    this.props.handleSetLayout('horizontal')
  }

  render() {
    const className = cx({ open: this.isOpen })
    return (
      <div styleName="wrapper" className={className}>
        <div styleName="trigger" onClick={this.showSettings}>
          <i className="fa fa-cog" />
        </div>
        <div styleName="main">
          <div styleName="option">
            <span styleName="label">Layout: </span>
            <span onClick={this.setVertical}>Vertical</span>
            <span onClick={this.setHorizontal}>Horizontal</span>
          </div>
        </div>
      </div>
    )
  }
}
