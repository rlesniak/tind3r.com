import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import UserStore from '../../stores/UserStore'
import styles from './app.scss'
import NavBar from '../NavBar'
import User from '../../models/User'
import Data from '../../data'

@inject('currentUser')
@observer
@CSSModules(styles)
export default class App extends Component {
  constructor(props) {
    super(props)

    this.props.currentUser.fetchMeta()
    this.userStore = new UserStore()

    // setInterval(() => {
    //   Data.updates()
    // }, 2000)
  }

  render() {
    return (
      <div styleName="page">
        <NavBar user={this.props.currentUser} />
        {this.props.children && React.cloneElement(this.props.children, {
          userStore: this.userStore,
          currentUser: this.props.currentUser,
        })}
      </div>
    );
  }
}
