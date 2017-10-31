// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { withHandlers } from 'recompose';

import recsStore from 'stores/RecsStore';

import type { ActionsType } from 'types/person';

import './ActionNotification.scss';

type PropsType = {
  payload: {
    name: string,
    type: ActionsType,
    _id: string,
  },
  handleRevert?: () => void,
};

const ACTIONS_MAP: { [ActionsType]: string } = {
  like: 'liked ',
  pass: 'passed ',
  superlike: 'superliked ',
};

const enhance = withHandlers({
  handleRevert: ({ payload }: PropsType) => () => {
    recsStore.revert(payload._id);
  },
});

const ActionNotification = ({ payload: { name, type, _id }, handleRevert }: PropsType) => (
  <div className="action-notification">
      You {ACTIONS_MAP[type]} <Link to={`/user/${_id}`}>{name}</Link>
    <button className="action-notification__revert" onClick={handleRevert}>
      <i className="fa fa-undo" />
    </button>
  </div>
  );

export default enhance(ActionNotification);
