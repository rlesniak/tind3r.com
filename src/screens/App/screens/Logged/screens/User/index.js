import React, { Component } from 'react';
import { reaction } from 'mobx'
import { observer, inject } from 'mobx-react'
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import Slider from 'react-slick'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import Loader from 'screens/App/shared/Loader'
import Img from 'screens/App/shared/Img'
import styles from './index.scss'
import ActionButtons from '../../shared/ActionButtons'
import UserCard from '../Home/components/UserCard'

@inject('currentUser')
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

    this.documentTitleDispose = reaction(() => this.user.isFetching, () => {
      document.title = `${this.user.name}, ${this.user.age} - Tind3r - Unofficial Tinder client`
    })
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
    this.documentTitleDispose()
    document.title = 'Tind3r - Unofficial Tinder client'
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
      case 8:
        browserHistory.goBack()
        break;
      default:
    }
  }

  renderUser() {
    const { user, props: { currentUser } } = this
    const insta = (user.instagram && user.instagram.photos) || []

    return (
      <div styleName="wrapper">
        <div styleName="intro-wrapper">
          <div styleName="intro">
            <h1>
              <div styleName="back" onClick={browserHistory.goBack}><i className="fa fa-long-arrow-left" /></div>
              <span>{user.name}, {user.age}</span>
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
              {user.bio.split('\n').map(item => (
                <span key={_.uniqueId()}>
                  {item}
                  <br/>
                </span>
              ))}
              {!user.bio && '[NO BIO]'}
            </p>
            <div styleName="common">
              {user.common_interests && !!user.common_interests.length && <h1>Common interests:</h1>}
              <ul styleName="commons">
                {_.map(user.common_interests, i => (
                  <li key={i.id}>{i.name}</li>
                ))}
              </ul>

              {user.common_connections && !!user.common_connections.length && <h1>Common connections:</h1>}
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
          {user.id !== currentUser._id && <div styleName="actions">
            <ActionButtons user={user} withSuperLikeCounter withKeyActions />
          </div>}
        </div>
        <div styleName="photos">
          <Slider ref={ref => { this.sliderRef = ref }} {...this.sliderSettings}>
            {_.map(user.photosUrls, url => (
              <div key={_.uniqueId()}><Img src={url} style={{width: 600}} /></div>
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
      <div styleName="container">
        {this.user.isFetching && <Loader isSimpleLoader />}
        {!this.user.isFetching && this.renderUser()}
      </div>
    );
  }
}
