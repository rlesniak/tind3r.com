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
import Settings from './Settings'
import styles from './styles.scss'
import ls from '../../local-storage'

@observer
@CSSModules(styles)
export default class Home extends Component {
  @observable isShowingModal = null

  constructor(props) {
    super(props)

    this.layout = ls.data.layout || 'horizontal'
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
    ls.set({ homepageTourDone: true })
  }

  @autobind
  setLayout(type) {
    this.layout = type
    this.forceUpdate()
    ls.set({ layout: type })
  }

  renderModal() {
    if (this.isShowingModal === false) {
      return null
    }

    return (
      <ModalContainer onClose={this.handleClose}>
        <ModalDialog onClose={this.handleClose}>
          <div styleName="popup">
            <h1>
              <i className="fa fa-keyboard-o" />Keyboard protips:
            </h1>
            <ul>
              <li>Use your arrows (left, right) to sliding photos.</li>
              <li>a - pass</li>
              <li>s - super like</li>
              <li>d - like</li>
            </ul>
          </div>
        </ModalDialog>
      </ModalContainer>
    )
  }

  renderLoader() {
    const { userStore, currentUser } = this.props

    return (
      <div styleName="home">
        <Loader currentUser={currentUser} />
        <div styleName="message">Finding people near you...</div>
      </div>
    )
  }

  renderMsg() {
    const { userStore, currentUser } = this.props

    const filterMsg = userStore.activeFilter ? '(with custom filter)' : ''
    return (
      <div styleName="home">
        <Loader currentUser={currentUser} noAnimation />
        <Settings handleSetLayout={this.setLayout} userStore={userStore} />
        <div styleName="message">
          There's no one new around you. {filterMsg}<br/>
          (TIP: Try to change distance filter <i className="fa fa-arrow-up" />) <br/>
          <button onClick={this.refresh}><i className="fa fa-refresh" /></button>
        </div>
      </div>
    )
  }

  renderVerticalLayout() {
    const { userStore } = this.props

    return (
      <div styleName="recommendation">
        <UserCard user={userStore.first} withSuperLikeCounter />
      </div>
    )
  }

  renderHorizontalLayout() {
    const { userStore } = this.props

    return (
      <div styleName="horizontal" className="horizontal">
        <UserCard user={userStore.first} withSuperLikeCounter horizontal />
      </div>
    )
  }

  render() {
    const { userStore, currentUser } = this.props

    if (userStore.isLoading || userStore.isCharging && userStore.all.length == 0) {
      return this.renderLoader()
    }

    if (userStore.noRecs && userStore.all.length === 0) {
      return this.renderMsg()
    }

    if (!userStore.isCharging && !userStore.isLoading && userStore.all.length === 0) {
      return this.renderMsg()
    }

    const shouldShowTour = !ls.data.homepageTourDone

    return (
      <div styleName="home">
        <Settings handleSetLayout={this.setLayout} userStore={userStore} />
        {shouldShowTour && this.renderModal()}
        {this.layout === 'horizontal' ? this.renderHorizontalLayout() : this.renderVerticalLayout()}

        <UserCardList userStore={userStore} />
      </div>
    )
  }
}
