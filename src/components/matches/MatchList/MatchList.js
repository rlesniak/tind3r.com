// @flow

import './MatchList.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import MatchRow from 'Components/matches/MatchRow';

import matchStore from 'stores/MatchStore';

import type { MatchStoreType } from 'stores/MatchStore';

@observer
class MatchList extends Component {
  componentDidMount() {
    matchStore.fetch();
    console.log(matchStore)
  }

  render() {
    return (
      <div className="match-list">
        LIS
        {matchStore.matches.map(match => (
          <div key={match._id} className="match-list__match">
            <MatchRow
              name={match.person.name}
              content={'match.lastMessage.body'}
              date="5 minutes ago"
              avatarUrl="http://placebeard.it/120.jpg"
            />
          </div>
        ))}
      </div>
    )
  }
}

export default MatchList;
