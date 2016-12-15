import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import { observer } from 'mobx-react'
import styles from './app.scss'
import NavBar from '../NavBar'
import User from '../../models/User'

@observer
@CSSModules(styles)
export default class App extends Component {
  constructor(props) {
    super(props)

    this.currentUser = new User()
    this.currentUser.fetchMeta()
  }

  render() {
    return (
      <div styleName="page">
        <NavBar user={this.currentUser} />
        {this.props.children}
      </div>
    );
  }
}
