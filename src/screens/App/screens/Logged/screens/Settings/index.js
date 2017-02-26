import React, { Component } from 'react';
import { observable, reaction } from 'mobx'
import { observer, inject } from 'mobx-react'
import CSSModules from 'react-css-modules'
import Slider, { Range } from 'rc-slider';
import _ from 'lodash'
import GoogleMap from 'google-map-react';
import { miToKm, kmToMi } from 'utils'
import Marker from './components/Marker'

import styles from './index.scss'

const reactiveFileds = ['bio', 'age_filter_max', 'age_filter_min', 'distance_filter']
const RCSlider = Slider.createSliderWithTooltip(Slider)
const RangeT = Slider.createSliderWithTooltip(Range)

@inject('currentUser')
@observer
@CSSModules(styles)
export default class User extends Component {
  @observable isSaving = false

  constructor(props) {
    super(props)

    this.profileUpdateDispose = reaction(
      () => _.pick(props.currentUser, reactiveFileds),
      changed => {
        this.isSaving = true
        props.currentUser.updateProfile(changed).then(() => {
          this.isSaving = false
        })
      },
    )
  }

  componentWillUnmount() {
    this.profileUpdateDispose()
  }

  @autobind
  handleDistanceChange(value) {
    const { currentUser } = this.props

    currentUser.distance_filter = kmToMi(value)
  }

  @autobind
  handleRangeChange(value: Array) {
    const { currentUser } = this.props
    const [min, max] = value

    if (min !== currentUser.age_filter_min) {
      currentUser.age_filter_min = min
    }
    if (max !== currentUser.age_filter_max) {
      currentUser.age_filter_max = max
    }
  }

  render() {
    const { currentUser } = this.props

    return (
      <div styleName="container" className="main-wrapper">
        <div styleName="form">
          <table>
            <tbody>
              <tr>
                <td styleName="label">Distance:</td>
                <td styleName="value">
                  <RCSlider
                    min={2}
                    max={160}
                    defaultValue={miToKm(currentUser.distance_filter) || 0}
                    onAfterChange={this.handleDistanceChange}
                    tipFormatter={v => `${v} KM`}
                  />
                </td>
              </tr>
              <tr>
                <td styleName="label">Age range:</td>
                <td styleName="range">
                  <RangeT
                    min={18}
                    max={50}
                    allowCross={false}
                    defaultValue={[currentUser.age_filter_min, currentUser.age_filter_max]}
                    onAfterChange={this.handleRangeChange}
                  />
                </td>
              </tr>
              <tr>
                <td styleName="label">Bio:</td>
                <td styleName="value">
                  <textarea
                    defaultValue={currentUser.bio}
                    rows="5"
                    onBlur={({ target }) => { currentUser.bio = target.value }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div styleName="map">
          {!this.isSaving && !currentUser.pos.lat && <h1>Update any field to see your position</h1>}
          {this.isSaving && !currentUser.pos.lat && <h1>Loading...</h1>}
          {
            !!currentUser.pos.lat &&
            <GoogleMap
              bootstrapURLKeys={{ key: 'AIzaSyDd3XG700RoXgHsnnu53gMz13gO8SOWqZc' }}
              center={[currentUser.pos.lat, currentUser.pos.lon]}
              zoom={12}
            >
              <Marker lat={currentUser.pos.lat} lng={currentUser.pos.lon} />
            </GoogleMap>
          }
        </div>
      </div>
    );
  }
}
