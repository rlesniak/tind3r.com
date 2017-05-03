// @flow

import './Matches.scss';

import React, { Component } from 'react';
import { withState, withHandlers, compose } from 'recompose';
import { Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import Match from '../Match';

import MatchList from 'components/matches/MatchList';
import MatchFilters from 'components/matches/MatchFilters';
import { MatchStore, FILTER_TYPES } from 'stores/MatchStore';
import SideMenu from 'components/SideMenu';

type PropsTypes = {
  handleMatchClick: (matchId: string) => void,
  matchStore: MatchStore,
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
  }),
  observer,
);

const Matches = ({
  handleMatchClick, matchStore, handleAllMatches, handleNewMatches, handleUnreadMatches,
  handleUnansweredMatches, handleBlockedMatches, activeId,
}: PropsTypes) => (
  <div className="matches">
    <SideMenu title="Matches">
      <SideMenu.Item
        active={matchStore.visibilityFilter === FILTER_TYPES.ALL}
        rightText={matchStore.size.all}
        onClick={handleAllMatches}
      >
        <span>All matches</span>
      </SideMenu.Item>
      <SideMenu.Item
        active={matchStore.visibilityFilter === FILTER_TYPES.NEW}
        rightText={matchStore.size.new}
        onClick={handleNewMatches}
      >
        <span>New</span>
      </SideMenu.Item>
      <SideMenu.Item
        active={matchStore.visibilityFilter === FILTER_TYPES.UNREAD}
        rightText={matchStore.size.unread}
        onClick={handleUnreadMatches}
      >
        <span>Unread</span>
      </SideMenu.Item>
      <SideMenu.Item
        active={matchStore.visibilityFilter === FILTER_TYPES.UNANSWERED}
        rightText={matchStore.size.unaswered}
        onClick={handleUnansweredMatches}
      >
        <span>Unanswered</span>
      </SideMenu.Item>
      <SideMenu.Item
        active={matchStore.visibilityFilter === FILTER_TYPES.BLOCKED}
        rightText={matchStore.size.blocked}
        onClick={handleBlockedMatches}
      >
        <span>Blocked</span>
      </SideMenu.Item>
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
