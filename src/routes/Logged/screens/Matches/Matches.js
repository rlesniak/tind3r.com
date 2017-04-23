// @flow

import './Matches.scss';

import React, { Component } from 'react';
import { withHandlers } from 'recompose';
import { Route } from 'react-router-dom';

import Match from '../Match';

import MatchList from 'Components/matches/MatchList';

type PropsTypes = {
  handleMatchClick: (matchId: string) => void,
};

const enhance = withHandlers({
  handleMatchClick: ({ history, ...rest}) => matchId => {
    history.push(`/matches/${matchId}`);
  }
});

const Matches = ({ handleMatchClick }: PropsTypes) => {
  return (
    <div className="matches">
      <div className="matches__list">
        <MatchList handleMatchClick={handleMatchClick} />
      </div>
      <div className="matches__conversation">
        <Route path="/matches/:id" component={Match} />
      </div>
    </div>
  )
}

export default enhance(Matches);
