import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import Slider from 'react-slick'
import _ from 'lodash'
import styles from './home-user-card.scss'

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
  render() {
    const { user } = this.props
    return (
      <div styleName="wrapper">
        <div styleName="content">
          <table>
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
              </tr>
              <tr styleName="info">
                <td styleName="age">
                  {user.km}
                  <div>KM</div>
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
