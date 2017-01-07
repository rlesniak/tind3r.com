import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import RCSlider from 'rc-slider'
import _ from 'lodash'
import cx from 'classnames'
import ReactGA from 'react-ga'
import styles from './settings.scss'
import { miToKm, kmToMi } from '../../utils'
import 'rc-slider/assets/index.css'

@inject('currentUser')
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

    ReactGA.event({
      category: 'Settings',
      action: 'Layout change',
      label: 'To vertical'
    })
  }

  @autobind
  setHorizontal() {
    this.props.handleSetLayout('horizontal')

    ReactGA.event({
      category: 'Settings',
      action: 'Layout change',
      label: 'To horizontal'
    })
  }

  @autobind
  handleBlur() {
    this.isOpen = false
  }

  @autobind
  handleDistanceChange(value) {
    this.props.currentUser.updateProfile(kmToMi(value))

    ReactGA.event({
      category: 'Settings',
      action: 'Distance change',
      label: `To ${value}`,
    })
  }

  render() {
    const className = cx({ open: this.isOpen })
    const distance = this.props.currentUser.profileSettings.distance_filter

    return (
      <div styleName="wrapper" className={className} tabIndex="0" onBlur={this.handleBlur}>
        <div styleName="trigger" onClick={this.showSettings}>
          <i className="fa fa-cog" />
        </div>
        <div styleName="main">
          <div styleName="option">
            <div styleName="label">Layout: </div>
            <span onClick={this.setVertical}>Vertical</span>
            <span onClick={this.setHorizontal}>Horizontal</span>
          </div>

          <div styleName="option">
            <div styleName="label">Search distance: {miToKm(distance)}KM</div>
            <span>
              <RCSlider
                min={2}
                max={160}
                defaultValue={miToKm(distance) || 0}
                onAfterChange={this.handleDistanceChange}
                tipFormatter={v => `${v} KM`}
              />
            </span>
          </div>
        </div>
      </div>
    )
  }
}
