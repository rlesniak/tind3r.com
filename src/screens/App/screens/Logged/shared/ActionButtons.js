import React, { Component } from 'react';
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import moment from 'moment'
import autobind from 'autobind-decorator'
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import ReactGA from 'react-ga'
import { IntercomAPI } from 'react-intercom'
import cx from 'classnames'
import Alert from 'react-s-alert'
import Data from 'data'
import ls from 'local-storage'
import styles from './ActionButtons.scss'

// TODO: Optimize this class!!!

@observer
@CSSModules(styles)
export default class ActionButtons extends Component {
  @observable isLiked = false
  @observable isPassed = false
  @observable isSuper = false
  @observable isMatch = false
  @observable counterSuperLike = ''
  @observable counterLike = ''
  @observable superlikeDiffMin = 0
  @observable likeDiffMin = 0

  constructor(props) {
    super(props)

    this.checkLiked(props.user._id)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user._id) return
    this.checkLiked(nextProps.user._id)
  }

  componentDidMount() {
    if (this.props.withSuperLikeCounter) {
      this.superLikecount()
      setInterval(() => this.superLikecount(), 500)
    }

    if (this.props.withKeyActions) {
      document.addEventListener('keydown', this.onKeydown)
    }
  }

  componentWillUnmount() {
    if (this.props.withKeyActions) {
      document.removeEventListener('keydown', this.onKeydown)
    }
  }

  superLikecount() {
    if (this.superLikeExpiration) {
      this.counterSuperLike = moment.utc(moment(this.superLikeExpiration).diff(moment())).format('HH:mm:ss')
    }

    if (this.likeExpiration) {
      this.counterLike = moment.utc(moment(Number(this.likeExpiration)).diff(moment())).format('HH:mm:ss')
    }
  }

  getSuperLikeDiffInMin() {
    this.superlikeDiffMin = moment(this.superLikeExpiration).diff(moment(), 'minutes')
  }

  getLikeDiffInMin() {
    this.likeDiffMin = moment.utc(Number(this.likeExpiration)).diff(moment(), 'minutes')
  }

  initExpirationTimes() {
    this.superLikeExpiration = ls.data.superLikeExpiration
    this.likeExpiration = ls.data.likeExpiration

    this.getSuperLikeDiffInMin()
    this.getLikeDiffInMin()
  }

  checkLiked(id) {
    this.initExpirationTimes()

    Data.getActions().where('_id').equals(id).first(r => {
      if (r) {
        this.props.user.done = true
      }

      this.isLiked = (r && r.type == 'like')
      this.isPassed = (r && r.type == 'pass')
      this.isSuper = (r && r.type == 'superlike')
    })
    Data.db().matches.where('userId').equals(id).first(r => {
      if (!r) return

      if (r.isSuperLike === 0) {
        this.isLiked = true
      } else {
        this.isSuper = true
      }

      this.isMatch = true
    })
  }

  showAlert() {
    Alert.success('Match', {
      position: 'top',
      timeout: 2000,
      customFields: {
        userName: this.props.user.name,
        avatar: this.props.user.mainPhoto,
      }
    })
  }

  /**
   * 65 - a
   * 83 - s
   * 68 - d
   */
  @autobind
  onKeydown(e) {
    if (e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68) {
      e.preventDefault()
    }

    ReactGA.event({
      category: 'User',
      action: 'Keydown',
    })

    switch (e.keyCode) {
      case 65:
        this.handlePass()
        break;
      case 68:
        this.handleLike()
        break;
      case 83:
        this.handleSuperlike()
        break;
      default:
    }
  }

  @autobind
  handleLike() {
    if (this.isLiked || this.likeDiffMin > 0) {
      return
    }

    ReactGA.event({
      category: 'User',
      action: 'Like',
      label: this.props.user._id
    })

    this.isLiked = true
    this.props.user.like().then(resp => {
      IntercomAPI('trackEvent', 'like', {
        user_id: this.props.user._id,
      });

      if (resp.match) {
        this.showAlert()

        ReactGA.event({
          category: 'User',
          action: 'Like',
          label: 'Match',
          nonInteraction: true
        })

        IntercomAPI('trackEvent', 'match');
      }
    }).catch(r => {
      this.initExpirationTimes()

      this.isLiked = false
    })
  }

  @autobind
  handlePass() {
    if (this.isPassed) {
      return
    }

    ReactGA.event({
      category: 'User',
      action: 'Pass',
      label: this.props.user._id
    })
    IntercomAPI('trackEvent', 'pass');

    this.isPassed = true
    this.props.user.pass()
  }

  @autobind
  handleSuperlike() {
    if (this.isSuper || this.superlikeDiffMin > 0) {
      return
    }

    ReactGA.event({
      category: 'User',
      action: 'Superlike',
      label: this.props.user._id
    })

    this.isSuper = true
    this.props.user.superLike().then(resp => {
      IntercomAPI('trackEvent', 'superlike', {
        user_id: this.props.user._id,
      })

      this.getSuperLikeDiffInMin()

      if (resp.match) {
        this.showAlert()

        ReactGA.event({
          category: 'User',
          action: 'Superlike',
          label: 'Match',
          nonInteraction: true
        })

        IntercomAPI('trackEvent', 'superlike-match');
      }
    }).catch(err => {
      this.initExpirationTimes()

      this.isSuper = false
    })
  }

  render() {
    const { user } = this.props

    const matchText = this.isMatch ? 'Match!' : null

    const passedClass = cx({ done: this.isPassed })
    const superClassN = cx({ done: this.isSuper, disabled: this.superlikeDiffMin > 0 && !this.isSuper })
    const likedClass = cx({ done: this.isLiked, disabled: this.likeDiffMin > 0 && !this.isLiked })

    return (
      <div styleName="buttons">
        {(this.isPassed || (!this.isSuper && !this.isLiked)) &&
        <div onClick={this.handlePass} className={passedClass}>
          <i className="fa fa-thumbs-o-down" />
        </div>}
        {(this.isSuper || (!this.isPassed && !this.isLiked)) && <div onClick={this.handleSuperlike} className={superClassN}>
          <i className="fa fa-star" />
          <span styleName="match-text">{matchText}</span>
          {this.superlikeDiffMin > 0 && !this.isSuper && <span styleName="counter">{this.counterSuperLike}</span>}
        </div>}
        {(this.isLiked || (!this.isPassed && !this.isSuper)) &&
        <div onClick={this.handleLike} className={likedClass}>
          <i className="fa fa-heart" />
          <span styleName="match-text">{matchText}</span>
          {this.likeDiffMin > 0 && !this.isLiked && <span styleName="counter">{this.counterLike}</span>}
        </div>}
      </div>
    );
  }
}
