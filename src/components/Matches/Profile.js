import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import { Link } from 'react-router'
import Slider from 'react-slick'
import cx from 'classnames'
import { observer } from 'mobx-react'
import styles from './profile.scss'
import MatchStore from '../../stores/MatchStore'
import Data from '../../data'
import Img from '../Shared/Img'

@observer
@CSSModules(styles)
export default class Profile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { user } = this.props

    const sliderSettings = {
      infinite: false,
      dots: true,
    }

    return (
      <div styleName="wrapper">
        <div styleName="images">
          <Slider {...sliderSettings}>
            {_.map(user.photos, photo => (
              <div key={_.uniqueId()}><img src={photo.url} alt="img" /></div>
            ))}
          </Slider>
        </div>
        <Link to={`/users/${user._id}`} styleName="name">
          {user.name}, {user.age}
        </Link>
        <div styleName="bio">
          {user.bio}
        </div>
      </div>
    );
  }
}
