import React from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import css from './MatchAlert.scss'

const MatchAlert = ({ customFields, classNames, id, styles, handleClose }) => (
  <div className={classNames} id={id} style={styles}>
    <div className="s-alert-box-inner">
      <div className="alert-match-avatar">
        <img src={customFields.avatar} alt="avatar" />
        <span>New match! It is <b>{customFields.userName}</b>!</span>
        <Link to="/matches">Message.</Link>
      </div>
    </div>
    <span className="s-alert-close" onClick={handleClose} />
  </div>
)


export default CSSModules(MatchAlert, css)
