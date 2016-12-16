import React, { Component } from 'react';
import { observer } from 'mobx-react'
import CSSModules from 'react-css-modules'
import Slider from 'react-slick'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import styles from './styles.scss'
import { user } from '../../runtime'
import User from '../../models/User'
import Loader from '../Loader'
import ActionButtons from '../ActionButtons'
import UserCard from '../Home/UserCard'

@observer
@CSSModules(styles)
export default class Home extends Component {
  constructor(props) {
    super(props)

    this.sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }

    this.user = new User(null, props.params.userId)
    this.user.fetch()
  }

  renderUser() {
    const { user } = this

    return (
      <div styleName="wrapper">
        <div styleName="intro-wrapper">
          <div styleName="intro">
            <h1>
              {user.name}, {user.age}
              <ul styleName="school-job">
                {_.map(user.schools, s => (
                  <li key={s.id}>{s.name}</li>
                ))}
                {_.map(user.jobs, s => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </h1>
            <h2 styleName="last-seen">Last seen: {user.seen}</h2>
            <p styleName="full-bio">
              {user.bio}
            </p>
            <div styleName="common">
              <h1>Common instersts:</h1>
              <ul>
                {_.map(user.common_interests, i => (
                  <li key={i.id}>{i.name}</li>
                ))}
              </ul>

              <h1>Common friends:</h1>
              <ul>
                {_.map(user.common_friends, i => (
                  <li key={i.id}>{i.name}</li>
                ))}
              </ul>
            </div>
            <a href={user.instaLink} target="_blank">
              <i className="fa fa-instagram"></i>
              <span>{user.instaName}</span>
            </a>
          </div>
          <div styleName="actions">
            <ActionButtons user={user} />
          </div>
        </div>
        <div styleName="photos">
          <Slider {...this.sliderSettings}>
            {_.map(user.photos, photo => (
              <div key={_.uniqueId()}><img src={photo.url} alt="img" style={{width: 600}} /></div>
            ))}
          </Slider>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.user.isFetching && <Loader />}
        {!this.user.isFetching && this.renderUser()}
      </div>
    );
  }
}
