import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import autobind from 'autobind-decorator'
import moment from 'moment'
import { Link } from 'react-router'
import _ from 'lodash'
import CSSModules from 'react-css-modules'
import { getFacebookToken, getTokenDate } from '../../runtime'
import styles from './fb-connect.scss'
import Logo from '../Logo'

@CSSModules(styles)
export default class FbConnect extends Component {
  @autobind
  connect() {
    getFacebookToken()
  }

  checkTokenDate() {
    getTokenDate(date => {
      const tokenDate = moment(new Date(date))
      const nowDate = moment()

      if (nowDate.diff(tokenDate, 'seconds') >= 0) {
        browserHistory.push('/home');
      }
    })
  }

  componentDidMount() {
    window.onfocus = () => {
      this.checkTokenDate()
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
          <h1>Facebook token has expired or first visit. <br/>Renew it here:</h1>
          <button onClick={this.connect}>Renew</button>

          <div className="footer">
            Copyright &copy; <a href="https://goo.gl/6i11L7" target="_blank">Rafal Lesniak</a>
            | <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    );
  }
}
