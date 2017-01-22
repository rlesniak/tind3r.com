import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import RCSlider from 'rc-slider'
import { IntercomAPI } from 'react-intercom'
import cx from 'classnames'
import Select from 'react-basic-dropdown'
import ReactGA from 'react-ga'
import styles from './Settings.scss'
import { miToKm, kmToMi } from 'utils'
import 'rc-slider/assets/index.css'
import 'styles/select.scss'

@inject('currentUser')
@observer
@CSSModules(styles)
export default class Settings extends Component {
  @observable isOpenSettings = false
  @observable isOpenFilter = false

  @autobind
  showSettings() {
    this.isOpenFilter = false
    this.isOpenSettings = !this.isOpenSettings
    IntercomAPI('trackEvent', 'open-settings');
  }

  @autobind
  showFilter() {
    this.isOpenSettings = false
    this.isOpenFilter = !this.isOpenFilter
  }

  @autobind
  setVertical() {
    this.props.handleSetLayout('vertical')

    ReactGA.event({
      category: 'Settings',
      action: 'Layout change',
      label: 'To vertical',
    })
  }

  @autobind
  setHorizontal() {
    this.props.handleSetLayout('horizontal')

    ReactGA.event({
      category: 'Settings',
      action: 'Layout change',
      label: 'To horizontal',
    })
  }

  @autobind
  handleBlur() {
    this.isOpenSettings = false
    this.isOpenFilter = false
  }

  @autobind
  handleDistanceChange(value) {
    this.props.currentUser.updateProfile(kmToMi(value))

    if (this.props.userStore.all.length === 0) {
      this.props.userStore.core()
    }

    ReactGA.event({
      category: 'Settings',
      action: 'Distance change',
      label: `To ${value}`,
    })
  }

  @autobind
  handleFilterChange({ value }) {
    this.props.userStore.setFilter(value)

    ReactGA.event({
      category: 'Settings',
      action: 'Filter change',
      label: value,
    })

    IntercomAPI('trackEvent', 'filter-change');
  }

  render() {
    const classNameSettings = cx({ open: this.isOpenSettings })
    const distance = this.props.currentUser.profileSettings.distance_filter

    const filterOptions = [
      { value: '', label: 'None' },
      { value: 'insta', label: 'Instagram' },
    ]

    return (
      <div styleName="wrapper" tabIndex="0" onBlur={this.handleBlur}>
        <div styleName="trigger">
          <i className="fa fa-cog" onClick={this.showSettings} />
        </div>

        <div styleName="main" className={classNameSettings}>
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

          <div styleName="option">
            <div styleName="label">Filter by: </div>
            <Select
              value=""
              options={filterOptions}
              onChange={this.handleFilterChange}
            />
          </div>
        </div>
      </div>
    )
  }
}
