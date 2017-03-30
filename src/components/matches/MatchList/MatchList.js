// @flow

import './MatchList.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import MatchRow from 'Components/matches/MatchRow';

import MatchStore from 'stores/MatchStore';

import type { MatchStoreType } from 'stores/MatchStore';

@observer
class MatchList extends Component {
  matchStore: MatchStoreType;

  constructor(props: any) {
    super(props);

    this.matchStore = MatchStore;
  }

  componentDidMount() {
    this.matchStore.fetch();
  }

  render() {
    return (
      <div className="match-list">
        LIS
        {this.matchStore.matches.map(match => (
          <div key={match.id} className="match-list__match">
            <MatchRow
              name={match.person.name}
              content="Testowa wiadomosc"
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
