// @flow

import './Matches.scss';

import React from 'react';
import ReactGA from 'react-ga';
import { withState, withHandlers, compose } from 'recompose';
import { Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';

import Match from '../Match';

import MatchList from 'components/matches/MatchList';
import MatchFilters from 'components/matches/MatchFilters';
import { MatchStore, FILTER_TYPES } from 'stores/MatchStore';
import SideMenu from 'components/SideMenu';

import LS from 'utils/localStorage';

type PropsType = {
  handleMatchClick: (matchId: string) => void,
  matchStore: MatchStore,
  activeId: string,
  props: any,
};

const enhance = compose(
  inject('matchStore'),
  withState('activeId', 'setActiveId', props => props.location.pathname.split('/matches/')[1]),
  withHandlers({
    handleMatchClick: ({ history, setActiveId }) => matchId => {
      history.push(`/matches/${matchId}`);
      setActiveId(matchId);
    },
    handleAllMatches: ({ matchStore }) => () => {
      matchStore.visibilityFilter = FILTER_TYPES.ALL;
    },
    handleNewMatches: ({ matchStore }) => () => {
      matchStore.visibilityFilter = FILTER_TYPES.NEW;
    },
    handleUnreadMatches: ({ matchStore }) => () => {
      matchStore.visibilityFilter = FILTER_TYPES.UNREAD;
    },
    handleUnansweredMatches: ({ matchStore }) => () => {
      matchStore.visibilityFilter = FILTER_TYPES.UNANSWERED;
    },
    handleBlockedMatches: ({ matchStore }) => () => {
      matchStore.visibilityFilter = FILTER_TYPES.BLOCKED;
    },
    handleSuperlikes: ({ matchStore }) => () => {
      matchStore.visibilityFilter = FILTER_TYPES.SUPERLIKE;
    },
    handleHardRefresh: ({ matchStore }) => () => {
      LS.clear();
      matchStore.items = [];
      matchStore.fetch();

      ReactGA.event({
        category: 'Matches',
        action: 'Hard refresh',
      });
    },
    handleMarkAllAsRead: ({ matchStore }) => () => {
      ReactGA.event({
        category: 'Matches',
        action: 'Mark as read',
      });

      matchStore.markAllAsRead();
    }
  }),
  observer,
);

const filterTypesMap = [
  { text: 'All', type: FILTER_TYPES.ALL, size: 'all', handle: 'handleAllMatches' },
  { text: 'New', type: FILTER_TYPES.NEW, size: 'new', handle: 'handleNewMatches' },
  { text: 'Unread', type: FILTER_TYPES.UNREAD, size: 'unread', handle: 'handleUnreadMatches' },
  { text: 'Unanswered', type: FILTER_TYPES.UNANSWERED, size: 'unaswered', handle: 'handleUnansweredMatches' },
  { text: 'Superliked', type: FILTER_TYPES.SUPERLIKE, size: 'superlike', handle: 'handleSuperlikes' },
  { text: 'Blocked', type: FILTER_TYPES.BLOCKED, size: 'blocked', handle: 'handleBlockedMatches' },
];

const Matches = ({
  handleMatchClick, matchStore, activeId, handleHardRefresh, handleMarkAllAsRead, ...props
}: PropsType) => (
  <div className="matches">
    <SideMenu title="Matches">
      {filterTypesMap.map(filter => (
        <SideMenu.Item
          key={filter.text}
          active={matchStore.visibilityFilter === filter.type}
          rightText={matchStore.size[filter.size]}
          onClick={props[filter.handle]}
          asLink
        >
          <span>{filter.text}</span>
        </SideMenu.Item>
      ))}
      <SideMenu.Separator />
      <SideMenu.Item
        asAction
        onClick={handleMarkAllAsRead}
        disabled={matchStore.unreadCount === 0}
      >
        <i className="fa fa-check-circle-o" /> Mark all as read
      </SideMenu.Item>
      <SideMenu.Separator />
      {<SideMenu.Item>
        <p className="emergency-info">
          If you have any problems with matches click below to try again. <br/>
          I hope it helps. Please let me know.<br />
          <a onClick={handleHardRefresh}>Refresh</a>
        </p>
      </SideMenu.Item>}
    </SideMenu>
    <SideMenu.Right>
      <div className="matches__wrapper">
        <div className="matches__filters">
          <MatchFilters matchStore={matchStore} />
        </div>
        <div className="matches__list">
          <MatchList handleMatchClick={handleMatchClick} matchStore={matchStore} activeId={activeId} />
        </div>
      </div>
      <div className="matches__conversation">
        <Route path="/matches/:id" component={Match} />
      </div>
    </SideMenu.Right>
  </div>
  );

export default enhance(Matches);
