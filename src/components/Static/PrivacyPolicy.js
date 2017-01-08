import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import CSSModules from 'react-css-modules'
import styles from './privacy-policy.scss'
import Logo from '../Logo'

@CSSModules(styles)
export default class PrivacyPolicy extends Component {

  render() {
    return (
      <div className="static-wrapper">
        <Logo />
        <div styleName="content">
          <h1>Privacy Policy</h1>

          <h2>General</h2>
          <p>Your privacy is important to us. This privacy policy is intended to give you confidence in the privacy and security of the personal information we obtain from you.</p>

          <h2>Collection of personal information</h2>
          <p>
            Tind3r.com does not store any of your data on its server.<br/>
            We are using IndexedDB technology to store your data like: messages, likes, matches etc.
            IndexedDB is a low-level API for client-side.
          </p>
          <p>Cookie information, pages you have requested and your IP address may also be recorded by us and/or third parties from your browser as set out in this policy.</p>

          <h2>Third party libraries</h2>
          <p>We are using Google Analytics to record activity of users like amount of visits.</p>
          <p>We are using Sentry.io to record all app bugs and errors to be able to fix occured issues for best user experience.</p>
        </div>
      </div>
    );
  }
}
