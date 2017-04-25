// @flow

import './Matches.scss';

import React, { Component } from 'react';
import { withHandlers, compose } from 'recompose';
import { Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import Match from '../Match';

import MatchList from 'Components/matches/MatchList';
import { MatchStore } from 'stores/MatchStore';

type PropsTypes = {
  handleMatchClick: (matchId: string) => void,
  matchStore: MatchStore,
};

const enhance = compose(
  withHandlers({
    handleMatchClick: ({ history, ...rest}) => matchId => {
      history.push(`/matches/${matchId}`);
    },
  }),
  inject('matchStore'),
  observer
);

const Matches = ({ handleMatchClick, matchStore }: PropsTypes) => {
  return (
    <div className="matches">
      <div className="matches__list">
        <MatchList handleMatchClick={handleMatchClick} matchStore={matchStore} />
      </div>
      <div className="matches__conversation">
        <Route path="/matches/:id" component={props => <Match matchStore={matchStore} {...props} />} />
      </div>
    </div>
  )
}

export default enhance(Matches);
