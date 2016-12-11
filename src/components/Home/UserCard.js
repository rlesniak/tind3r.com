import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import Slider from 'react-slick'
import _ from 'lodash'
import cx from 'classnames'
import styles from './user-card.scss'

@CSSModules(styles)
export default class HomeUserCard extends Component {
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
                  <div styleName="images">
                    <Slider {...this.sliderSettings}>
                      {_.map(user.photos, photo => (
                        <div key={_.uniqueId()}><img src={photo.url} alt="img" style={{width: 350}} /></div>
                      ))}
                    </Slider>
                  </div>
                </td>
                {this.props.extended &&
                <td rowSpan="4" styleName="all-photos">
                  <div styleName="all-images">
                    <Slider {...this.sliderSettings}>
                      {_.map(user.photos, photo => (
                        <div key={_.uniqueId()}><img src={photo.url} alt="img" style={{width: 570}} /></div>
                      ))}
                    </Slider>
                  </div>
                </td>}
              </tr>
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
              <tr styleName="additional">
                <td>
                  ~{user.km} KM
                </td>
                <td styleName="insta">
                  {this.renderInstagramSection()}
                </td>
                <td styleName="school">
                  {user.school}
                </td>
              </tr>
              <tr styleName="actions">
                <td>
                  <i className="fa fa-thumbs-o-down" />
                </td>
                <td>
                  <i className="fa fa-star" />
                </td>
                <td>
                  <i className="fa fa-heart" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
