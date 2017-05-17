// @flow

import './Settings.scss';

import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { observer } from 'mobx-react';
import { Button, Classes, Switch } from '@blueprintjs/core';

import LS from 'utils/localStorage';

import currentUser from 'models/CurrentUser';

const enhance = compose(
  withState('bio', 'setBio', () => currentUser.bio),
  withState('notif', 'setNotif', () => !!LS.get('settings.notifCloudEnabled', true)),
  withHandlers({
    handleChange: ({ setBio }) => ({ target }) => {
      setBio(target.value);
    },
    handleSave: ({ bio }) => () => {
      currentUser.updateProfile({
        bio,
      });
    },
    handleNotifChange: ({ setNotif }) => ({ target }) => {
      setNotif(target.checked);
      LS.set({ settings: { ...LS.get('settings'), notifCloudEnabled: target.checked } });
    },
  }),
  observer,
);

const Settings = ({ bio, handleChange, handleSave, handleNotifChange, notif }) => (
  <div className="settings">
    <div className="settings__row">
      <label>Bio</label>
      <div className="settings__field">
        <textarea className="pt-input" rows="4" value={bio} onChange={handleChange} />
      </div>
    </div>
    <div className="settings__row">
      <div className="settings__field">
        <Button
          className={Classes.LARGE}
          onClick={handleSave}
          loading={currentUser.isProcessing}
          disabled={currentUser.isProcessing}
          text="Save"
        />
      </div>
    </div>
    <div className="settings__separator" />
    <div className="settings__row">
      <Switch checked={notif} label="Show bottom left notification when swiping" onChange={handleNotifChange} />
    </div>
  </div>
);

export default enhance(Settings);
