// @flow

import './MatchRow.scss';

import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { withHandlers } from 'recompose';
import { observer } from 'mobx-react';

import Avatar from 'components/Avatar';

import Match from 'models/Match';

type PropsType = {
  onClick: (matchId: string) => void,
  handleOnClick: () => void,
  match: Match,
  active: boolean,
};

const enhance = withHandlers({
  handleOnClick: ({ match: { _id }, onClick }: PropsType) => () => {
    onClick(_id);
  },
});

const getMatchTypeIcon = (match: Match) => {
  if (match.is_blocked) {
    return <i className="fa fa-ban" />;
  }

  if (match.is_super_like) {
    return <i className="fa fa-star" />;
  }

  if (match.is_boost_match) {
    return <i className="fa fa-bolt" />;
  }

  return null;
};

const MatchRow = ({ handleOnClick, match, active }: PropsType) => (
  <div
    className={cx('match-row', {
      'match-row--active': active,
      'match-row--unread': match.isUnread,
      'match-row--blocked': match.is_blocked,
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
          <span>{match.lastMessage.body}</span>
          <div className="match-row__date">{moment(match.lastActivity).fromNow()}</div>
        </div>
      </div>
    </div>
  </div>
  );

export default enhance(observer(MatchRow));
