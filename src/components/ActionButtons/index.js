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
  @observable user = null
  @observable counter = 0
  diffMin = 0

  constructor(props) {
    super(props)

    this.user = props.user
    this.checkLiked(props.user.id)
  }

  componentWillReceiveProps(nextProps) {
    this.user = nextProps.user
    this.checkLiked(user.id)
    this.forceUpdate()
  }

  componentDidMount() {
    if (this.props.withSuperLikeCounter) {
      setInterval(() => this.superLikecount(), 1000)
    }
  }

  superLikecount() {
    const expiration = localStorage.getItem('superLikeExpiration')
    //
    // if (expiration) {
    //   this.diffMin = moment(expiration).diff(moment(), 'minutes')
    //   const diffTime = expiration - moment()
    //   const interval = 1000
    //
    //   const dur = moment.duration(diffTime * 1000, 'milliseconds')
    //   const duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
    //   console.log(moment(duration).seconds())
    // }
  }

  checkLiked(id) {
    Data.getActions().where('_id').equals(id).first(r => {
      this.isLiked = (r && r.type == 'like')
      this.isPassed = (r && r.type == 'pass')
      this.isSuper = (r && r.type == 'superlike')
    })
  }

  formatCounter() {
    if (!this.props.superLikeCounter) return

    this.diffMin = this.props.superLikeCounter.diff(moment(), 'minutes')
    const diff = this.props.superLikeCounter.diff(moment())

    return moment(diff).format('hh:mm:ss')
  }

  @autobind
  handleLike() {
    this.isLiked = true
    this.props.user.like().then(resp => {
      if (resp.match) {
        alert('Its a match!')
      }
    })
  }

  @autobind
  handlePass() {
    this.isPassed = true
    this.props.user.pass()
  }

  @autobind
  handleSuperlike() {
    this.isSuper = true
    this.props.user.superLike().catch(err => {
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
          <span styleName="counter">{this.formatCounter()}</span>
        </div>}
        {(this.isLiked || (!this.isPassed && !this.isSuper)) &&
        <div onClick={this.handleLike} className={likedClass}>
          <i className="fa fa-heart" />
        </div>}
      </div>
    );
  }
}
