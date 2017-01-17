import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import { Link, browserHistory } from 'react-router'
import CSSModules from 'react-css-modules'
import moment from 'moment'
import { checkIfInstalled, getFacebookToken, getTokenDate } from 'runtime'
import { pageTitle } from 'utils'
import styles from './index.scss'

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
    getTokenDate((date) => {
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
    checkIfInstalled((status) => {
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

  render() {
    const isChrome = !!window.chrome && !!window.chrome.webstore

    if (isChrome) {
      if (this.isInstalled) {
        return this.renderIfInstalled()
      }

      return (
        <div className="static-wrapper">
          <div styleName="content">
            <h3>To be able to use tind3r.com you must download Chrome Extension:</h3>
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
              When installation is complete you are free to use web client! <a href="/">Click here!</a>
            </h4>
          </div>
        </div>
      );
    } else {
      return (
        <div className="static-wrapper">
          <div styleName="content">
            <h3>To be able to use tind3r.com you must use Google Chrome browser. (Firefox version under development)</h3>
          </div>
        </div>
      )
    }
  }
}
