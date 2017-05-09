// @flow

import './Home.scss';
import 'react-input-range/src/scss/index.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';
import NotificationSystem from 'react-notification-system';
import InputRange from 'react-input-range';

import PersonCard from 'components/PersonCard';
import LoadMoreCard from 'components/LoadMoreCard';
import SearchingLoader from 'components/SearchingLoader';
import SideMenu from 'components/SideMenu';
import ShortcutIcon from 'components/ShortcutIcon';
import ActionNotification from 'components/ActionNotification';
import MatchNotification from 'components/MatchNotification';

import counterService from 'services/counterService';
import recsStore from 'stores/RecsStore';
import Person from 'models/Person';

import {
  CurrentUser, MAX_DISTANCE, MIN_AGE, MAX_AGE,
} from 'models/CurrentUser';

const NOTIF_LEVELS_MAP = {
  like: 'success',
  pass: 'error',
  superlike: 'info',
};

type PropsType = {
  currentUser: CurrentUser,
};

@inject('currentUser') @observer
class Home extends Component {
  props: PropsType;
  notificationSystem: ?any;

  @observable likeCounter = null;
  @observable superlikeCounter = null;
  @observable distance = this.props.currentUser.distanceKm;
  @observable ageRange = {
    min: this.props.currentUser.age_filter_min,
    max: this.props.currentUser.age_filter_max,
  };

  componentWillUnmount() {
    counterService.unsubscribe(this.handleLikeCounter);
    counterService.unsubscribe(this.handleSuperlikeCounter);
  }

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser.likeReset.seconds > 0) {
      counterService.subscribe({ handler: this.handleLikeCounter });
    }

    if (currentUser.superlikeReset.seconds > 0 && currentUser.superlike_remaining === 0) {
      counterService.subscribe({ handler: this.handleSuperlikeCounter });
    }
    recsStore.fetchCore();

    ReactTooltip.rebuild();
  }

  handleMatch = (person: Person) => {
    if (this.notificationSystem) {
      this.notificationSystem.addNotification({
        level: 'success',
        position: 'tc',
        autoDismiss: 2,
        children: <MatchNotification person={person} />
      });
    }
  }

  handleLikeCounter = () => {
    const { currentUser } = this.props;

    if (currentUser.likeReset.seconds === 0) {
      counterService.unsubscribe(this.handleLikeCounter);
    }

    this.likeCounter = currentUser.likeReset.formatted;
  }

  handleSuperlikeCounter = () => {
    const { currentUser } = this.props;

    if (currentUser.superlikeReset.seconds === 0) {
      counterService.unsubscribe(this.handleSuperlikeCounter);
    }

    this.superlikeCounter = currentUser.superlikeReset.formatted;
  }

  handleError = (reason: Object) => {
    const { currentUser } = this.props;

    if (reason.type === 'like') {
      currentUser.like_limit_reset = reason.resetsAt;
      this.likeCounter = currentUser.likeResetFormatted;

      counterService.subscribe({
        handler: this.handleLikeCounter,
      });
    } else {
      currentUser.superlike_limit_reset = reason.resetsAt;
    }
  }

  handleSuperlike = (remaining: number) => {
    const { currentUser } = this.props;

    currentUser.superlike_remaining = remaining;
  }

  handleLoadMoreClick = () => {
    recsStore.fetchCore(true);
  }

  handleRefresh = () => {
    recsStore.fetchCore();
  }

  handleAction = (payload: Object) => {
    if (this.notificationSystem) {
      this.notificationSystem.addNotification({
        level: NOTIF_LEVELS_MAP[payload.type],
        position: 'bl',
        autoDismiss: 3,
        children: <ActionNotification payload={payload} />
      });
    }
  }

  handleDistanceChange = (distance: number) => {
    this.props.currentUser.updateProfile({
      distance_filter: distance,
    })
  };

  handleAgeChange = ({ min, max }: { min: number, max: number }) => {
    this.ageRange = {
      min, max,
    };

    this.props.currentUser.updateProfile({
      age_filter_min: min,
      age_filter_max: max,
    });
  }

  renderBody() {
    const { currentUser } = this.props;

    if (recsStore.is_fetching || recsStore.areRecsExhaust || (recsStore.is_fetching && recsStore.allVisible.length === 0)) {
      return (
        <SearchingLoader
          noAnimation={recsStore.areRecsExhaust}
          photoUrl={currentUser.avatarUrl}
        >
          {
            recsStore.is_fetching ? 'Finding people near you...' : (
              <div>
                {'There\'s no one new around you.'}<br />
              (TIP: Try to change distance filter <i className="fa fa-arrow-up" />) <br />
                <button
                  onClick={this.handleRefresh}
                  className="home__refresh-button"
                >
                  <i className="fa fa-refresh" />
                </button>
              </div>
          )}
        </SearchingLoader>
      );
    }

    return (
      <div className="home__persons-cards">
        {recsStore.allVisible.map((person, i) => (
          <div key={person._id} className={cx({ 'home__persons-cards--main': i === 0 })}>
            <PersonCard
              person={person}
              small={i !== 0}
              onMatch={this.handleMatch}
              onError={this.handleError}
              onSuperlike={this.handleSuperlike}
              handleAction={this.handleAction}
              allowHotkeys={i === 0}
              limitations={{
                superlikeRemaining: currentUser.superlike_remaining,
                superlikeResetsAt: this.superlikeCounter,
                likeResetsAt: this.likeCounter,
              }}
            />
          </div>
        ))}
        {
          recsStore.allVisible.length > 0 &&
          <LoadMoreCard
            onClick={this.handleLoadMoreClick}
            loading={recsStore.is_loading_more}
          />
        }

        {recsStore.areRecsExhaust && <h2>There is no one new</h2>}
      </div>
    );
  }

  render() {
    return (
      <div className="home">
        <NotificationSystem ref={ref => { this.notificationSystem = ref; }} />
        <SideMenu>
          <SideMenu.Item className="home__sidebar-item home__sidebar-cuts">
            <label>Keyboard shortcuts</label>
            <ShortcutIcon text="a" tooltipText="Pass" />
            <ShortcutIcon text="s" tooltipText="Superlike" />
            <ShortcutIcon text="d" tooltipText="Like" />
          </SideMenu.Item>
          <SideMenu.Separator />
          <SideMenu.Item className="home__sidebar-item home__sidebar-item-distance">
            <label>Distance</label>
            <InputRange
              formatLabel={value => `${value} km`}
              maxValue={MAX_DISTANCE}
              value={this.distance}
              onChange={value => this.distance = value}
              onChangeComplete={this.handleDistanceChange}
            />
          </SideMenu.Item>
          <SideMenu.Item className="home__sidebar-item home__sidebar-item-distance">
            <label>Age</label>
            <InputRange
              minValue={MIN_AGE}
              maxValue={MAX_AGE}
              value={this.ageRange}
              onChange={value => this.ageRange = value}
              onChangeComplete={this.handleAgeChange}
            />
          </SideMenu.Item>
          <SideMenu.Separator />
          <SideMenu.Item className="home__sidebar-item">
            <label>Autolike</label>
            <span>(soon)</span>
          </SideMenu.Item>
        </SideMenu>
        <SideMenu.Right>
          <div className="home__content">
            {this.renderBody()}
          </div>
        </SideMenu.Right>
      </div>
    );
  }
}

export default Home;
