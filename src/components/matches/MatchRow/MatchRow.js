// @flow

import './MatchRow.scss';

import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { withHandlers } from 'recompose';

import Avatar from 'Components/Avatar';

type PropsTypes = {
  active: ?boolean,
  name: string,
  content: string,
  avatarUrl: string,
  date: string,
  isNew: boolean,
  onClick: (matchId: string) => void,
  handleOnClick: () => void,
}

const enhance = withHandlers({
  handleOnClick: ({ _id, onClick }) => () => {
    onClick(_id);
  },
})

const MatchRow = ({
  active, name, content, avatarUrl, date, isNew, handleOnClick,
}: PropsTypes) => {
  return (
    <div
      className={cx('match-row', { 'match-row--active': active })}
      onClick={handleOnClick}
    >
      <div className="match-row__wrapper">
        <div className="match-row__avatar">
          <Avatar url={avatarUrl} />
        </div>
        <div className="match-row__details">
          <div className="match-row__person-details">{name} {isNew}</div>
          <div className="match-row__message-content">
            {content}
          </div>
          <div className="match-row__date">{moment(date).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}

export default enhance(MatchRow);
