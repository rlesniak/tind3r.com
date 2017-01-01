import React, { Component } from 'react';
import { observer } from 'mobx-react'
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import Slider from 'react-slick'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import styles from './styles.scss'
import { user } from '../../runtime'
import Loader from '../Loader'
import ActionButtons from '../ActionButtons'
import UserCard from '../Home/UserCard'
import Img from '../Shared/Img'

@observer
@CSSModules(styles)
export default class User extends Component {
  constructor(props) {
    super(props)

    this.sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }

    this.user = props.userStore.find(props.params.userId)
    this.user.fetch()
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
  }

  @autobind
  onKeydown(e) {
    if (e.keyCode === 39 || e.keyCode === 37) {
      e.preventDefault()
    }

    switch (e.keyCode) {
      case 39:
        this.sliderRef.slickNext()
        break;
      case 37:
        this.sliderRef.slickPrev()
        break;
      default:
    }
  }

  renderUser() {
    const { user } = this
    const insta = user.instagram && user.instagram.photos

    return (
      <div styleName="wrapper">
        <div styleName="intro-wrapper">
          <div styleName="intro">
            <h1>
              {user.name}, {user.age}
              <div styleName="km">{user.km} km, <span>{user.seenMin}</span></div>
              <ul styleName="school-job">
                {_.map(_.filter(user.schools, s => s.id), s => (
                  <li key={s.id}>{s.name}</li>
                ))}
                {_.map(_.filter(user.jobs, s => s.id), s => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </h1>
            <h2 styleName="last-seen">
              Last seen: {user.seen}
            </h2>
            <p styleName="full-bio">
              {user.bio || '[NO BIO]'}
            </p>
            <div styleName="common">
              {!!user.common_interests.length && <h1>Common interests:</h1>}
              <ul styleName="commons">
                {_.map(user.common_interests, i => (
                  <li key={i.id}>{i.name}</li>
                ))}
              </ul>

              {!!user.common_connections.length && <h1>Common connections:</h1>}
              <ul styleName="commons">
                {_.map(user.common_connections, i => (
                  <li styleName="connection" key={i.id}>
                    {/* <img src={i.photo.small} alt="photo" /> */}
                    {i.name}
                  </li>
                ))}
              </ul>
            </div>
            {user.instaName && <div styleName="insta">
              <a href={user.instaLink} target="_blank">
                <i className="fa fa-instagram"></i>
                <span>{user.instaName}</span>
              </a>
            </div>}
          </div>
          <div styleName="actions">
            <ActionButtons user={user} withSuperLikeCounter withKeyActions />
          </div>
        </div>
        <div styleName="photos">
          <Slider ref={ref => { this.sliderRef = ref }} {...this.sliderSettings}>
            {_.map(user.photos, photo => (
              <div key={_.uniqueId()}><Img src={photo.url} style={{width: 600}} /></div>
            ))}
            {_.map(insta, photo => (
              <div key={_.uniqueId()}><Img src={photo.image} style={{width: 600}} /></div>
            ))}
          </Slider>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.user.isFetching && <Loader isSimpleLoader />}
        {!this.user.isFetching && this.renderUser()}
      </div>
    );
  }
}
