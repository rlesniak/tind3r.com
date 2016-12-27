import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import autobind from 'autobind-decorator'
import moment from 'moment'
import _ from 'lodash'
import CSSModules from 'react-css-modules'
import { getFacebookToken } from '../runtime'
import styles from './fb-connect.scss'
import { getTokenDate } from '../runtime'

@CSSModules(styles)
export default class FbConnect extends Component {
  @autobind
  connect() {
    getFacebookToken()
  }

  checkTokenDate() {
    getTokenDate(date => {
      const tokenDate = moment(date)
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
      <div styleName="wrapper">
        <h1>Connect with FC Clik:</h1>
        <button onClick={this.connect}>Click</button>
      </div>
    );
  }
}
