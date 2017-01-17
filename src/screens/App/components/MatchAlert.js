import React, { Component } from 'react'
import Alert from 'react-s-alert'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import styles from './MatchAlert.scss'

@CSSModules(styles)
class MatchAlert extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { customFields } = this.props

    return (
      <div className={this.props.classNames} id={this.props.id} style={this.props.styles}>
        <div className="s-alert-box-inner">
          <div className="alert-match-avatar">
            <img src={customFields.avatar} alt="avatar" />
            <span>New match! It is <b>{customFields.userName}</b>!</span>
            <Link to="/matches">Message.</Link>
          </div>
        </div>
        <span className="s-alert-close" onClick={this.props.handleClose} />
      </div>
    )
  }
}

export default MatchAlert
