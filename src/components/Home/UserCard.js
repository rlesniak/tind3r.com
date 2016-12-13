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
      infinite: false,
      speed: 500,
    }
  }

  renderBasicInfo() {
    const { user, simple } = this.props

    return (
      <tr styleName="info">
        {!simple && <td styleName="age">
          {user.age}
          <div>YO</div>
        </td>}
        <td styleName="person" colSpan={simple ? 3 : 2}>
          <Link to={`/users/${user.id}`}>
            <h1 styleName="name">
              {user.name}
              {simple ? `, ${user.age}` : ''}
              <div styleName="seen">{user.seenMin}</div>
            </h1>
            <h2 styleName="bio" title={user.bio}>
              {user.bio ? user.bio : <span>[NO BIO]</span>}
            </h2>
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
    const { user, simple } = this.props
    const width = simple === true ? 220 : 350
    return (
      <div styleName="images">
        <Slider {...this.sliderSettings}>
          {_.map(user.photos, photo => (
            <div key={_.uniqueId()}><img src={photo.url} alt="img" style={{ width }} /></div>
          ))}
        </Slider>
      </div>
    )
  }

  renderActionsRow() {
    const { user } = this.props
    return (
      <tr styleName="actions">
        <td colSpan="3">
          <ActionButtons user={user} />
        </td>
      </tr>
    )
  }

  render() {
    const { user, simple } = this.props

    const className = cx({
      simple
    })

    return (
      <div styleName="wrapper" className={className}>
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
                  {this.renderSimpleSlider()}
                </td>
              </tr>
              {this.renderBasicInfo()}
              {simple && this.renderActionsRow()}
              <tr>
                <td colSpan="3" styleName="employ">
                  <span>{user.school}</span>
                </td>
              </tr>
              <tr styleName="additional">
                <td>
                  {user.km} KM
                </td>
                <td />
                <td styleName="insta">
                  {this.renderInstagramSection()}
                </td>
              </tr>
              {!simple && this.renderActionsRow()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
