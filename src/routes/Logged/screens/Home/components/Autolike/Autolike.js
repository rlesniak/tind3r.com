// @flow

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Switch } from '@blueprintjs/core';
import { head, noop } from 'lodash';
import ReactGA from 'react-ga';

import counterService from 'services/counterService';
import recsStore from 'stores/RecsStore';
import Person from 'models/Person';
import { CurrentUser } from 'models/CurrentUser';
import { ACTION_TYPES } from 'const';
import LS from 'utils/localStorage';

import type { ActionsType } from 'types/person';

import './Autolike.scss';

type PropsType = {
  currentUser: CurrentUser,
  enabled: boolean,
  handleSetEnabled: () => void,
  onButtonClick: (payload: Object) => void,
  onError: (reason: ActionsType) => void,
  onMatch: (person: Person) => void,
};

@inject('currentUser')
@observer
class Autolike extends Component<PropsType> {
  componentWillUnmount() {
    counterService.unsubscribe(this.handleAutolike);
  }

  @observable enabled = false;
  @observable velocity = parseInt(LS.get('settings.autolikeVelocity', 1), 10);
  @observable giveUp = parseInt(LS.get('settings.autolikeGiveUp', 5), 10);
  @observable retryNumber = 0;

  handleSetEnabled = () => {
    ReactGA.event({
      category: 'Autolike',
      action: `Turn ${!this.enabled ? 'on' : 'off'}`,
    });

    if (!this.enabled) {
      counterService.subscribe({
        handler: this.handleAutolike,
        delay: this.velocity * 1000,
      });
      this.retryNumber = 0;
    } else {
      counterService.unsubscribe(this.handleAutolike);
    }

    this.enabled = !this.enabled;
  };

  handleSetVelocity = ({ target: { value } }: SyntheticInputEvent<>) => {
    this.velocity = parseInt(value, 10);
    LS.setSettings({ autolikeVelocity: value });

    ReactGA.event({
      category: 'Autolike',
      action: 'Velocity',
      label: value,
    });

    counterService.unsubscribe(this.handleAutolike);

    if (this.enabled) {
      counterService.subscribe({
        handler: this.handleAutolike,
        delay: parseInt(value, 10) * 1000,
      });
    }
  };

  handleSetGiveUp = ({ target: { value } }: SyntheticInputEvent<>) => {
    const val = parseInt(value, 10);

    if (val < 0) {
      return;
    }

    ReactGA.event({
      category: 'Autolike',
      action: 'Give up',
      label: value,
    });

    LS.setSettings({ autolikeGiveUp: value });
    this.giveUp = val;
  };

  handleAutolike = () => {
    const person = head(recsStore.allVisible);

    if (this.props.currentUser.likeReset.seconds > 0) {
      this.enabled = false;
      this.retryNumber = 0;

      counterService.unsubscribe(this.handleAutolike);

      return;
    }

    if (person) {
      person.callAction(ACTION_TYPES.LIKE, noop, this.props.onMatch, this.props.onError);
    }

    if (!recsStore.is_fetching && !recsStore.is_loading_more) {
      if (this.retryNumber >= this.giveUp && this.giveUp > 0) {
        counterService.unsubscribe(this.handleAutolike);
        this.enabled = false;
        this.retryNumber = 0;
      } else {
        recsStore.fetchCore();
      }
    }

    if (recsStore.allVisible.length === 0) {
      this.retryNumber = this.retryNumber + 1;
    } else {
      this.retryNumber = 0;
    }
  };

  render() {
    return (
      <div className="autolike">
        <Switch
          className="pt-align-right autolike__toggle"
          checked={this.enabled}
          disabled={this.props.currentUser.likeReset.seconds > 0}
          label="Autolike"
          onChange={this.handleSetEnabled}
        />

        <label className="pt-label pt-inline">
          Velocity:
          <div className="pt-select">
            <select value={this.velocity} onChange={this.handleSetVelocity}>
              <option value="0.5">0.5s</option>
              <option value="1">1s</option>
              <option value="2">2s</option>
              <option value="4">4s</option>
            </select>
          </div>
        </label>

        <div className="pt-form-group">
          <label className="pt-label">
            Give up after N fails:
          </label>
          <div className="pt-form-content">
            <input className="pt-input" type="number" value={this.giveUp} onChange={this.handleSetGiveUp} />
            <div className="pt-form-helper-text">0 = don{'\''}t care</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Autolike;
