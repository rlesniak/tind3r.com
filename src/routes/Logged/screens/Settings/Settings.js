// @flow

import './Settings.scss';

import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { observer } from 'mobx-react';

import currentUser from 'models/CurrentUser';

const enhance = compose(
  withState('bio', 'setBio', () => currentUser.bio),
  withHandlers({
    handleChange: ({ setBio }) => ({ target }) => {
      setBio(target.value);
    },
    handleSave: ({ bio }) => (e) => {
      currentUser.updateProfile({
        bio
      })
    }
  }),
  observer,
);

const Settings = ({ bio, handleChange, handleSave }) => (
  <div className="settings">
    <div className="settings__row">
      <label>Bio</label>
      <div className="settings__field">
        <textarea rows="4" value={bio} onChange={handleChange}></textarea>
      </div>
    </div>
    <div className="settings__row">
      <div className="settings__field">
        <button
          className="settings__button"
          onClick={handleSave}
          disabled={currentUser.isProcessing}
        >
          {currentUser.isProcessing ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  </div>
);

export default enhance(Settings);
