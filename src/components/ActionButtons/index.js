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
  constructor(props) {
    super(props)

    this.checkLiked()
  }

  checkLiked() {
    Data.getActions().where('_id').equals(this.props.user.id).first(r => {
      this.isLiked = r && r.type == 'like'
    })
  }

  @autobind
  handleLike() {
    this.isLiked = true
    this.props.user.like()
  }

  render() {
    return (
      <div styleName="buttons">
        {!this.isLiked &&
        <div>
          <i className="fa fa-thumbs-o-down" />
        </div>}
        {!this.isLiked &&
        <div>
          <i className="fa fa-star" />
        </div>}
        <div onClick={this.handleLike}>
          <i className="fa fa-heart" />
        </div>
      </div>
    );
  }
}
