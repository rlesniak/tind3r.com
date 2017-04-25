// @flow

import './MatchList.scss';

import React, { Component } from 'react';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { List, AutoSizer } from 'react-virtualized';

import MatchRow from 'Components/matches/MatchRow';

import { MatchStore } from 'stores/MatchStore';

type PropsTypes = {
  matchStore: MatchStore,
  className: string,
  handleMatchClick: (matchId: string) => void,
};

@observer
class MatchList extends Component {
  props: PropsTypes;
  listRef: ?any;
  lastMessageReactionDispose: () => void;

  componentDidMount() {
    this.lastMessageReactionDispose = reaction(
      () => this.props.matchStore.items.map(store => store.lastMessage),
      () => {
        if (this.listRef) {
          this.listRef.forceUpdateGrid()
        }
      }
    )
  }

  componentWillUnmount() {
    this.lastMessageReactionDispose()
  }

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
        {<button onClick={() => match.remove()}>X</button>}
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
              ref={ref => this.listRef = ref}
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
