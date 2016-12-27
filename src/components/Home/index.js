import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import CSSModules from 'react-css-modules'
import moment from 'moment'
import ReactGA from 'react-ga'
import _ from 'lodash'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import UserStore from '../../stores/UserStore'
import UserCard from './UserCard'
import UserCardList from './UserCardList'
import Loader from '../Loader'
import styles from './styles.scss'

@observer
@CSSModules(styles)
export default class Home extends Component {
  @observable isShowingModal = false

  componentDidMount() {
    const shouldShow = !localStorage.getItem('homepage-tour')

    this.isShowingModal = shouldShow;
  }

  @autobind
  refresh() {
    const { userStore } = this.props
    userStore.core()

    ReactGA.event({
      category: 'Manual refresh',
      action: 'Refresh',
    })
  }

  @autobind
  handleClose() {
    this.isShowingModal = false
    localStorage.setItem('homepage-tour', true)
  }

  renderModal() {
    if (!this.isShowingModal) {
      return null
    }

    return (
      <ModalContainer onClose={this.handleClose}>
        <ModalDialog onClose={this.handleClose}>
          <h1>Protips:</h1>
          <ul>
            <li>Use your arrows to sliding photos</li>
            <li>Use your keys to:
              <ul>
                <li>a - pass</li>
                <li>s - super like</li>
                <li>d - like</li>
              </ul>
            </li>
          </ul>
          <h1>(layout will be improved)</h1>
        </ModalDialog>
      </ModalContainer>
    )
  }

  renderLoader() {
    const { userStore, currentUser } = this.props

    if (!userStore.isLoading) {
      return null
    }

    return (
      <div>
        <Loader currentUser={currentUser} />
        <div styleName="message">Finding people near you...</div>
      </div>
    )
  }

  renderMsg() {
    const { userStore, currentUser } = this.props

    return (
      <div>
        <Loader currentUser={currentUser} noAnimation />
        <div styleName="message">
          {userStore.message}
          <button onClick={this.refresh}><i className="fa fa-refresh" /></button>
        </div>
      </div>
    )
  }

  renderRecs() {
    const { userStore } = this.props

    if (userStore.isLoading) {
      return this.renderLoader()
    }

    if (userStore.message) {
      return this.renderMsg()
    }

    return (
      <div styleName="home">
        {this.renderModal()}
        <div styleName="recommendation">
          <UserCard user={userStore.first} withSuperLikeCounter />
        </div>
        <UserCardList userStore={userStore} />
      </div>
    )
  }

  render() {
    const { userStore, currentUser } = this.props

    return this.renderRecs()
  }
}
