// @flow

import './Settings.scss';

import React from 'react';
import ReactGA from 'react-ga';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { observer } from 'mobx-react';
import { Button, Classes, Switch } from '@blueprintjs/core';
import ReactTooltip from 'react-tooltip';

import LocationMap from 'components/LocationMap';

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
      ReactGA.event({
        category: 'Settings',
        action: 'Profile update',
      });
      currentUser.updateProfile({
        bio,
      });
    },
    handleNotifChange: ({ setNotif }) => ({ target }) => {
      setNotif(target.checked);
      LS.set({ settings: { ...LS.get('settings'), notifCloudEnabled: target.checked } });

      ReactGA.event({
        category: 'Settings',
        action: 'Notification change',
      });
    },
  }),
  lifecycle({
    componentDidMount: () => {
      ReactTooltip.rebuild();
    }
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
      <label>
        Your current location
        {!currentUser.pos.lat && <i className="fa fa-question-circle" data-for="main" data-tip="Be careful with significant changes! <br />I do not take responsibility for any possible problems with ban etc." />}
        {!!currentUser.pos.lat && <span>(update by clicking somewhere)</span>}
      </label>
      <div className="settings__field">
        <LocationMap currentUser={currentUser} />
      </div>
    </div>
    <div className="settings__row">
      <div className="settings__field">
        <Button
          className={Classes.LARGE}
          onClick={handleSave}
          loading={currentUser.isProcessing}
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
