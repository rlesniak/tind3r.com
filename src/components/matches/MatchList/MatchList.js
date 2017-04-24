// @flow

import './MatchList.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';
import { List, AutoSizer } from 'react-virtualized';

import MatchRow from 'Components/matches/MatchRow';

import { MatchStore } from 'stores/MatchStore';

type PropsTypes = {
  matchStore: MatchStore,
  className: string,
  handleMatchClick: (matchId: string) => void,
};

@inject('matchStore')
@observer
class MatchList extends Component {
  props: PropsTypes;

  handleMatchClick = (matchId: string) => {
    this.props.handleMatchClick(matchId);
  };

  rowRenderer = ({ index, key, style }: Object) => {
    const { matchStore: { matches } } = this.props;
    const match = matches[index];

    return (
      <div
        key={key}
        style={style}
        className="match-list__match"
      >
        {/*<button onClick={() => match.remove()}>X</button>*/}
        <MatchRow
          match={match}
          onClick={this.handleMatchClick}
        />
      </div>
    );
  }

  render() {
    const { matchStore, className } = this.props;

    return (
      <div className={cx('match-list', className)}>
        {matchStore.isLoading ? 'Loading' : null}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref='List'
              height={height}
              overscanRowCount={10}
              rowCount={matchStore.matches.length}
              rowHeight={80}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}

export default MatchList;
