// @flow

import './MatchRow.scss';

import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';

import Avatar from 'Components/Avatar';

type PropsTypes = {
  active: ?boolean,
  name: string,
  content: string,
  avatarUrl: string,
  date: string,
}

const MatchRow = ({ active, name, content, avatarUrl, date }: PropsTypes) => {
  return (
    <div className={cx('match-row', { 'match-row--active': active })}>
      <div className="match-row__wrapper">
        <div className="match-row__avatar">
          <Avatar url={avatarUrl} />
        </div>
        <div className="match-row__details">
          <div className="match-row__person-details">{name}</div>
          <div className="match-row__message-content">
            {content}
          </div>
          <div className="match-row__date">{moment(date).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}

export default MatchRow;
