// @flow

import './MatchList.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';

import MatchRow from 'Components/matches/MatchRow';

import matchStore from 'stores/MatchStore';

import type { MatchStoreType } from 'stores/MatchStore';

@inject('matchStore')
@observer
class MatchList extends Component {
  handleMatchClick = (matchId: string) => {
    this.props.handleMatchClick(matchId);
  };

  render() {
    const { matchStore: MatchStoreType, className } = this.props;

    return (
      <div className={cx('match-list', className)}>
        {matchStore.matches.map(match => (
          <div
            key={match._id}
            className="match-list__match"
          >
            <button onClick={() => match.remove()}>X</button>
            <MatchRow
              _id={match._id}
              avatarUrl={match.person.mainPhoto}
              isNew={match.is_new}
              name={match.person.name}
              content={match.lastMessage.body}
              date={match.last_activity_date}
              onClick={this.handleMatchClick}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default MatchList;
