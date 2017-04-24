// @flow

import './MatchRow.scss';

import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { withHandlers } from 'recompose';

import Avatar from 'Components/Avatar';

import Match from 'models/Match';

type PropsTypes = {
  onClick: (matchId: string) => void,
  handleOnClick: () => void,
  match: Match,
}

const enhance = withHandlers({
  handleOnClick: ({ match: { _id }, onClick }: PropsTypes) => () => {
    onClick(_id);
  },
});

const getMatchTypeIcon = (match: Match) => {
  if (match.isBlocked) {
    return <i className="fa fa-ban" />
  }

  if (match.is_super_like) {
    return <i className="fa fa-star" />
  }

  if (match.is_boost_match) {
    return <i className="fa fa-bolt" />
  }

  return null
}

const MatchRow = ({ handleOnClick, match }: PropsTypes) => {
  return (
    <div
      className={cx('match-row', {
        'match-row--active': false,
        'match-row--unread': match.is_new,
      })}
      onClick={handleOnClick}
    >
      <div className="match-row__wrapper">
        <div className="match-row__type-icon">
          {getMatchTypeIcon(match)}
        </div>
        <div className="match-row__avatar">
          <Avatar url={match.person.mainPhoto} />
        </div>
        <div className="match-row__details">
          <div className="match-row__person-details">{match.person.name}</div>
          <div className="match-row__message-content">
            <span>{match.last_message.body}</span>
            <div className="match-row__date">{moment(match.last_activity_date).fromNow()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default enhance(MatchRow);
