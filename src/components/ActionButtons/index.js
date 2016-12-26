import React, { Component } from 'react';
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import moment from 'moment'
import autobind from 'autobind-decorator'
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import cx from 'classnames'
import styles from './styles.scss'
import Data from '../../data'

@observer
@CSSModules(styles)
export default class ActionButtons extends Component {
  @observable isLiked = false
  @observable isPassed = false
  @observable isSuper = false
  @observable counter = ''
  @observable diffMin = 0

  constructor(props) {
    super(props)

    this.expiration = localStorage.getItem('superLikeExpiration')
    this.checkLiked(props.user._id)
  }

  componentWillReceiveProps(nextProps) {
    this.checkLiked(nextProps.user._id)
    this.forceUpdate()
  }

  componentDidMount() {
    if (this.props.withSuperLikeCounter) {
      this.superLikecount()
      setInterval(() => this.superLikecount(), 1000)
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
    if (this.expiration) {
      this.counter = moment.utc(moment(this.expiration).diff(moment())).format('HH:mm:ss')
    }
  }

  getSuperLikeDiffInMin() {
    this.diffMin = moment(this.expiration).diff(moment(), 'minutes')
  }

  checkLiked(id) {
    this.getSuperLikeDiffInMin()
    Data.getActions().where('_id').equals(id).first(r => {
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
    if (this.isLiked) {
      return
    }

    this.isLiked = true
    this.props.user.like().then(resp => {
      if (resp.match) {
        console.log('match');
      }
    })
  }

  @autobind
  handlePass() {
    if (this.isPassed) {
      return
    }

    this.isPassed = true
    this.props.user.pass()
  }

  @autobind
  handleSuperlike() {
    if (this.isSuper || this.diffMin > 0) {
      return
    }
    this.isSuper = true
    this.props.user.superLike().then(r => {
      this.getSuperLikeDiffInMin()
    }).catch(err => {
      this.isSuper = false
      console.log('catch', err);
    })
  }

  render() {
    const { user } = this.props

    if (user.isLoading) {
      return (
        <div styleName="buttons">
          <div>Submitting...</div>
        </div>
      )
    }

    const superClass = cx({ disabled: this.diffMin > 0 })
    const passedClass = cx({ done: this.isPassed })
    const superClassN = cx({ done: this.isSuper })
    const likedClass = cx({ done: this.isLiked })

    return (
      <div styleName="buttons">
        {(this.isPassed || (!this.isSuper && !this.isLiked)) &&
        <div onClick={this.handlePass} className={passedClass}>
          <i className="fa fa-thumbs-o-down" />
        </div>}
        {(this.isSuper || (!this.isPassed && !this.isLiked)) && <div onClick={this.handleSuperlike} styleName={superClass} className={superClassN}>
          <i className="fa fa-star" />
          {this.diffMin > 0 && <span styleName="counter">{this.counter}</span>}
        </div>}
        {(this.isLiked || (!this.isPassed && !this.isSuper)) &&
        <div onClick={this.handleLike} className={likedClass}>
          <i className="fa fa-heart" />
        </div>}
      </div>
    );
  }
}
