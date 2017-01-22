import React from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import styles from './MatchAlert.scss'

const MatchAlert = ({ customFields }) => (
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


export default CSSModules(MatchAlert, styles)
