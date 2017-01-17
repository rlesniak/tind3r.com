import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import Slider from 'react-slick'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import cx from 'classnames'
import styles from './UserCard.scss'
import ActionButtons from '../../../shared/ActionButtons'
import Loader from '../../../shared/Loader'
import Img from '../../../../../shared/Img'

@CSSModules(styles)
export default class UserCard extends Component {
  constructor(props) {
    super(props)

    this.sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      currentSlide: 0,
      slide: 0,
    }
  }

  componentDidMount() {
    if (!this.props.simple) {
      document.addEventListener('keydown', this.onKeydown)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.simple && this.sliderRef) {
      setTimeout(() => this.sliderRef.slickGoTo(0), 0)
    }
  }

  componentWillUnmount() {
    if (!this.props.simple) {
      document.removeEventListener('keydown', this.onKeydown)
    }
  }

  @autobind
  onKeydown(e) {
    if (e.keyCode === 39 || e.keyCode === 37) {
      e.preventDefault()
    }

    if (!this.sliderRef) return

    switch (e.keyCode) {
      case 39:
        this.nextSlide()
        break;
      case 37:
        this.prevSlide()
        break;
      default:
    }
  }

  nextSlide() {
    this.sliderRef.slickNext()
  }

  prevSlide() {
    this.sliderRef.slickPrev()
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
        <Slider ref={ref => { this.sliderRef = ref }} {...this.sliderSettings}>
          {_.map(user.photosUrls, url => (
            <div key={_.uniqueId()}><Img src={url} style={{ width }} /></div>
          ))}
        </Slider>
      </div>
    )
  }

  renderActionsRow() {
    const { user, simple } = this.props
    return (
      <tr styleName="actions">
        <td colSpan="3">
          <ActionButtons
            user={user}
            withKeyActions={!simple}
            withSuperLikeCounter={this.props.withSuperLikeCounter}
          />
        </td>
      </tr>
    )
  }

  renderHorizontalLayout() {
    const { user, simple } = this.props

    return (
      <div styleName="horizontal" className="body">
        <div styleName="photos">
          <Slider ref={ref => { this.sliderRef = ref }} {...this.sliderSettings} slidesToShow="3" infinite>
            {_.map(user.photosUrls, url => (
              <div key={_.uniqueId()}><Img src={url} style={{ width: 250 }} /></div>
            ))}
          </Slider>
        </div>
        <div styleName="details">
          <table>
            <colgroup>
              <col width="33%" />
              <col width="33%" />
              <col width="33%" />
            </colgroup>
            <tbody>
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
              {this.renderActionsRow()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderVerticalLayout() {
    const { user, simple } = this.props

    return (
      <div styleName="content" className="body">
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
    )
  }

  render() {
    const { user, simple, asLoader, horizontal } = this.props

    const className = cx({
      simple
    })

    if (asLoader) {
      return (
        <div styleName="wrapper" className="simple">
          <Loader isSimpleLoader />
        </div>
      )
    }

    return (
      <div styleName="wrapper" className={className}>
        {horizontal ? this.renderHorizontalLayout() : this.renderVerticalLayout()}
      </div>
    );
  }
}

UserCard.propTypes = {
  withSuperLikeCounter: PropTypes.bool,
  horizontal: PropTypes.bool,
}
