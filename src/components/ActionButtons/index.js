import React, { Component } from 'react';
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import autobind from 'autobind-decorator'
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import styles from './styles.scss'
import Data from '../../data'

@observer
@CSSModules(styles)
export default class ActionButtons extends Component {
  @observable isLiked = false
  @observable isPassed = false
  @observable user = null

  constructor(props) {
    super(props)

    this.user = props.user
    this.checkLiked(props.user.id)
  }

  componentWillReceiveProps(nextProps) {
    this.user = nextProps.user
    this.isPassed = false
    this.isLiked = false
    this.forceUpdate()
  }

  checkLiked(id) {
    Data.getActions().where('_id').equals(id).first(r => {
      this.isLiked = r && r.type == 'like'
    })
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

  render() {
    const { user } = this.props

    return (
      <div styleName="buttons">
        {user.done == 0 && !this.isPassed &&
        <div onClick={this.handlePass}>
          <i className="fa fa-thumbs-o-down" />
        </div>}
        <div>
          <i className="fa fa-star" />
        </div>
        {user.done == 0 && !this.isLiked &&
        <div onClick={this.handleLike}>
          <i className="fa fa-heart" />
        </div>}
      </div>
    );
  }
}
