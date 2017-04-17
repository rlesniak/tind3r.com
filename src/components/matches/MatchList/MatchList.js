// @flow

import './MatchList.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import MatchRow from 'Components/matches/MatchRow';

import matchStore from 'stores/MatchStore';

import type { MatchStoreType } from 'stores/MatchStore';

@inject('matchStore')
@observer
class MatchList extends Component {
  render() {
    const { matchStore } = this.props;

    return (
      <div className="match-list">
        {matchStore.is_sync ? 'Loaded' : 'Loading'}
        {matchStore.matches.map(match => (
          <div key={match._id} className="match-list__match">
            <MatchRow
              name={match.person.name}
              content={match.lastMessage.body}
              date={match.last_activity_date}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default MatchList;
