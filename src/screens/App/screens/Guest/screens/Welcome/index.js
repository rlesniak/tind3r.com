import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import { browserHistory } from 'react-router'
import CSSModules from 'react-css-modules'
import moment from 'moment'
import _ from 'lodash'
import Slider from 'react-slick'
import { checkIfInstalled, getFacebookToken, getTokenDate } from 'runtime'
import { pageTitle } from 'utils'
import Img from 'screens/App/shared/Img'
import styles from './index.scss'

const pre = 'images/intro/'
const introPhotos = [
  { url: require(`images/intro/2.png`), desc: 'See up to 15 profiles at once' },
  { url: require(`images/intro/1.png`), desc: 'Choose from two available layouts' },
  { url: require(`images/intro/3.png`), desc: 'Quick look at last seen time!' },
  { url: require(`images/intro/4.png`), desc: 'Direct access to Instagram account' },
  { url: require(`images/intro/5.png`), desc: 'You are run out of recomendations? Change quickly your search distance from pop-up menu!' },
  { url: require(`images/intro/6.png`), desc: 'Advanced filtering in your matches! Emojis and GIFs are here!' },
  { url: require(`images/intro/8.png`), desc: 'Delayed sending messages! Up to 3 seconds!' },
  { url: require(`images/intro/7.png`), desc: 'History of people you liked or super liked' },
]

@observer
@CSSModules(styles)
export default class Welcome extends Component {
  @observable isInstalled = false

  constructor(props) {
    super(props)

    this.isInstalled = props.isInstalled

    this.checkExtension()
  }

  @autobind
  connect() {
    getFacebookToken()
  }

  checkTokenDate() {
    getTokenDate(date => {
      const tokenDate = moment(date)
      const nowDate = moment()

      if (nowDate.diff(tokenDate, 'seconds') >= 0) {
        this.props.fetchMeta(() => {
          browserHistory.push('/home')
        })
      }
    })
  }

  checkExtension(isFetchMeta = false) {
    checkIfInstalled(status => {
      this.isInstalled = status

      if (isFetchMeta && status) {
        this.checkTokenDate()
      }
    })
  }

  componentDidMount() {
    window.onfocus = () => {
      this.checkExtension(true)
    }

    document.title = pageTitle()
  }

  componentWillUnmount() {
    window.onfocus = n => n
  }

  renderIfInstalled() {
    return (
      <div styleName="content">
        <h1>Your Tinder session has expired or first visit. <br />Refresh it here:</h1>
        <button className="button blue" onClick={this.connect}>Refresh</button>
      </div>
    )
  }

  renderIntro() {
    return (
      <div styleName="intro">
        <h1>Welcome to tind3r.com - unofficial Tinder web client you fall in love!</h1>

        <div styleName="features">
          <Slider autoplay autoplaySpeed={4000} pauseOnHover>
            {_.map(introPhotos, image => (
              <div key={_.uniqueId()}>
                <h3>{image.desc}</h3>
                <Img src={image.url} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    )
  }

  render() {
    const isChrome = !!window.chrome && !!window.chrome.webstore

    if (isChrome) {
      if (this.isInstalled) {
        return this.renderIfInstalled()
      }

      return (
        <div className="static-wrapper">
          {this.renderIntro()}
          <div styleName="content">
            <h3>To be able to use tind3r.com you must download Chrome Extension from web store here:</h3>
            <a
              target="_blank"
              href="https://chrome.google.com/webstore/detail/tnder-tind3r-tinder-web-c/iopleohdgiomebidpblllpaigodfhoia"
            >
              <img src="https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_340x96.png" alt="Download" />
            </a>
            <p>
              Why do I need this? <br />
              To be able to comunicate with official Tinder Service.
            </p>

            <h4>
              When installation is complete you are free to use web client!
            </h4>
          </div>
        </div>
      )
    }

    return (
      <div className="static-wrapper">
        {this.renderIntro()}
        <div styleName="content">
          <h3>To be able to use tind3r.com you must use Google Chrome browser.</h3>
        </div>
      </div>
    )
  }
}
