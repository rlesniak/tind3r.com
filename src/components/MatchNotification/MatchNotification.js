// @flow

import './MatchNotification.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { withHandlers } from 'recompose';

import Avatar from 'components/Avatar';

import Person from 'models/Person';

type PropsType = {
  person: Person,
};

const MatchNotification = ({ person }: PropsType) => {
  return (
    <div className="match-notification">
      <Avatar url={person.mainPhotoSmall} />
      New match <b>{person.name}</b>!
      <Link to="/matches"> Message <i className="fa fa-link" /></Link>
    </div>
  );
};

export default MatchNotification;
