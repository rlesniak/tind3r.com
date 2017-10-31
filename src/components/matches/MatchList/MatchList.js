// @flow
import React, { Component } from 'react';
import { reaction, computed } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { List, AutoSizer } from 'react-virtualized';
import { includes } from 'lodash';

import MatchRow from 'components/matches/MatchRow';
import LS from 'utils/localStorage';

import { MatchStore } from 'stores/MatchStore';

import './MatchList.scss';

type PropsType = {
  matchStore: MatchStore,
  className: string,
  handleMatchClick: (matchId: string) => void,
  activeId: string,
};

@observer
class MatchList extends Component {
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

  @computed get matches(): Array<Object> {
    return this.props.matchStore.matches;
  }

  props: PropsType;
  listRef: ?any;
  lastMessageReactionDispose: () => void;

  handleMatchClick = (matchId: string) => {
    this.props.handleMatchClick(matchId);
  };

  rowRenderer = ({ index, key, style }: Object) => {
    const match = this.matches[index];

    return (
      <div
        key={key}
        style={style}
        className="match-list__match"
      >
        {/* <button onClick={() => match.remove()}>X</button> */}
        <MatchRow
          match={match}
          onClick={this.handleMatchClick}
          active={includes(match._id, this.props.activeId)}
        />
      </div>
    );
  }

  render() {
    const { matchStore, className } = this.props;

    return (
      <div className={cx('match-list', className)}>
        <div
          className={cx('match-list__loading-indicator', {
            active: matchStore.isLoading && !LS.data.lastActivity,
          })}
        >
          Loading...
        </div>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={(ref) => { this.listRef = ref; }}
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
