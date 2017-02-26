import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import cx from 'classnames'
import { Link } from 'react-router'
import { observer } from 'mobx-react'
import Data from 'data'
import styles from './Match.scss'

@observer
@CSSModules(styles)
export default class Match extends Component {
  constructor(props) {
    super(props)

    if (window.Raven && !props.match.user.name) {
      Raven.captureMessage('no match data')
    }
  }

  @autobind
  remove() {
    Data.db().matches.where('_id').equals(this.props.match.id).delete()
  }

  hasUnread() {
    const { match } = this.props

    if (match.isNewMatch) {
      return true
    }

    if (match.areUnread && match.messageStore.last.isAuthor) {
      return true
    }

    return false
  }

  renderLastMessageContent() {
    const { match } = this.props
    const { last } = match.messageStore

    return last.type === 'gif' ? '[ GIF ]' : last.message
  }

  renderIcon() {
    const { match } = this.props

    if (!match.messageStore.last.message) {
      return null
    }

    if (match.messageStore.last.isAuthor) {
      return <i className="fa fa-arrow-down" aria-hidden="true" />
    }

    return <i className="fa fa-arrow-up" aria-hidden="true" />
  }

  renderTypeIcon() {
    const { match } = this.props

    if (match.isBlocked) {
      return <i className="fa fa-ban" />
    }

    if (match.isSuperLike) {
      return <i className="fa fa-star" />
    }

    if (match.isBoostMatch) {
      return <i className="fa fa-bolt" />
    }

    return null
  }

  render() {
    const { match } = this.props
    const className = cx({
      unread: this.hasUnread(),
      super: match.isSuperLike,
      blocked: match.isBlocked,
    })

    return (
      <Link to={`/matches/${match.id}`} styleName="match" className={className} activeClassName="active">
        <div styleName="type-icon">{this.renderTypeIcon()}</div>
        <div styleName="avatar">
          <img src={match.user.mainPhoto} />
        </div>
        <div styleName="name">{match.user.name}, {match.user.age}</div>
        <div styleName="message">
          <span>{this.renderIcon()} {this.renderLastMessageContent()}</span>
          <div styleName="date">{match.ago}</div>
        </div>
      </Link>
    )
  }
}
