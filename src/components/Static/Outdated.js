import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import autobind from 'autobind-decorator'
import moment from 'moment'
import { Link } from 'react-router'
import _ from 'lodash'
import cmp from 'semver-compare'
import CSSModules from 'react-css-modules'
import { checkVersion } from '../../runtime'
import styles from './fb-connect.scss'
import Logo from '../Logo'

@CSSModules(styles)
export default class FbConnect extends Component {

  checkVersion() {
    checkVersion(version => {
      if (cmp(version, '0.2.0') !== -1) {
        browserHistory.push('/home')
      }
    })
  }

  componentDidMount() {
    window.onfocus = () => {
      this.checkVersion()
    }
  }

  componentWillUnmount() {
    window.onfocus = n => n
  }

  render() {
    return (
      <div className="static-wrapper">
        <Logo />
        <div styleName="content">
          <h1>Please update your extension. <br/>Minimal working version is: <b>0.2.0</b></h1>

          <h4>Short instruction is available <a href="http://www.howtogeek.com/64525/how-to-manually-force-google-chrome-to-update-extensions/" target="_blank">here</a></h4>

          <div className="footer">
            Copyright &copy; <a href="https://goo.gl/6i11L7" target="_blank">Rafal Lesniak</a>
            | <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    );
  }
}
