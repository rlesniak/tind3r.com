import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import CSSModules from 'react-css-modules'
import { getFacebookToken } from '../runtime'
import styles from './fb-connect.scss'

@CSSModules(styles)
export default class FbConnect extends Component {
  @autobind
  connect() {
    getFacebookToken()
  }

  componentDidMount() {
    window.onfocus = () => {
      browserHistory.push('/home');
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
