import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import Slider from 'react-slick'
import _ from 'lodash'
import cx from 'classnames'
import styles from './user-card.scss'
import ActionButtons from '../ActionButtons'

@CSSModules(styles)
export default class UserCard extends Component {
  constructor(props) {
    super(props)

    this.sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }
  }

  renderDetailInfo() {
    const { user } = this.props
    return (
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
    )
  }

  renderBasicInfo() {
    const { user } = this.props
    return (
      <tr styleName="info">
        <td styleName="age">
          {user.age}
          <div>YO</div>
        </td>
        <td styleName="person" colSpan="2">
          <Link to={`/users/${user.id}`}>
            <h1 styleName="name">
              {user.name}
              <div styleName="seen">{user.seen} | {user.seenMin}</div>
            </h1>
            {user.bio && <h2 styleName="bio">{user.bio}</h2>}
            {!user.bio && <span>[NO BIO]</span>}
          </Link>
        </td>
      </tr>
    )
  }

  renderInstagramSection() {
    const { user } = this.props
    if (user.instaLink) {
      return <div styleName="with-insta">
        <a href={user.instaLink} target="_blank">
          <i className="fa fa-instagram"></i>
          <div styleName="instaname">{user.instaName}</div>
        </a>
      </div>
    }
    return <i className="fa fa-instagram"></i>
  }

  renderSimpleSlider() {
    const { user, extended } = this.props
    return (
      <div styleName="images">
        <Slider {...this.sliderSettings}>
          {_.map(user.photos, photo => (
            <div key={_.uniqueId()}><img src={photo.url} alt="img" style={{width: 350}} /></div>
          ))}
        </Slider>
      </div>
    )
  }

  render() {
    const { user, extended } = this.props
    const wrapperClassName = cx({
      extended
    })
    return (
      <div styleName="wrapper" className={wrapperClassName}>
        <div styleName="content">
          <table>
            <colgroup>
              <col width="33%" />
              <col width="33%" />
              <col width="33%" />
            </colgroup>
            <tbody>
              <tr>
                <td colSpan="3">
                  {extended ? this.renderDetailInfo() : this.renderSimpleSlider()}
                </td>
                {extended &&
                  <td rowSpan="4" styleName="all-photos">
                    <div styleName="all-images">
                      <Slider {...this.sliderSettings}>
                        {_.map(user.photosWithInsta, photo => (
                          <div key={_.uniqueId()}><img src={photo} alt="img" style={{width: 585}} /></div>
                        ))}
                      </Slider>
                    </div>
                  </td>}
              </tr>
              {!extended && this.renderBasicInfo()}

              {!extended && <tr styleName="additional">
                  <td>
                    ~{user.km} KM
                  </td>
                  <td styleName="insta">
                    {this.renderInstagramSection()}
                  </td>
                  <td styleName="school">
                    {user.school}
                  </td>
                </tr>}
              <tr>
                <td colSpan="3">
                  <ActionButtons user={user} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
