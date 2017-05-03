// @flow

import './MatchList.scss';

import React, { Component } from 'react';
import { reaction, computed } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { List, AutoSizer } from 'react-virtualized';

import MatchRow from 'components/matches/MatchRow';

import { MatchStore } from 'stores/MatchStore';

type PropsType = {
  matchStore: MatchStore,
  className: string,
  handleMatchClick: (matchId: string) => void,
};

@observer
class MatchList extends Component {
  props: PropsType;
  listRef: ?any;
  lastMessageReactionDispose: () => void;

  componentDidMount() {
    this.lastMessageReactionDispose = reaction(
      () => ({
        items: this.props.matchStore.items.map(store => store.lastMessage),
        filter: this.props.matchStore.matches.length,
      }),
      () => {
        if (this.listRef) {
          this.listRef.forceUpdateGrid();
          this.forceUpdate();
        }
      },
    );
  }

  componentWillUnmount() {
    this.lastMessageReactionDispose();
  }

  handleMatchClick = (matchId: string) => {
    this.props.handleMatchClick(matchId);
  };

  @computed get matches(): Array<Object> {
    return this.props.matchStore.matches;
  }

  rowRenderer = ({ index, key, style }: Object) => {
    const match = this.matches[index];

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
        <div className={cx('match-list__loading-indicator', { active: matchStore.isLoading })}>
          Loading...
        </div>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={ref => { this.listRef = ref; }}
              height={height}
              overscanRowCount={10}
              rowCount={this.matches.length}
              rowHeight={76}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default MatchList;
