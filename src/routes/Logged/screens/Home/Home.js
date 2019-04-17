// @flow
// eslint-disable jsx-a11y/label-has-for

import 'react-input-range/src/scss/index.scss';

import React, { Component } from 'react';
import ReactGA from 'react-ga';
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

import recsStore from 'stores/RecsStore';
import Person from 'models/Person';

import withLikeCounter from 'hoc/withLikeCounter';

import { kmToMi } from 'utils';
import LS from 'utils/localStorage';

import { MAX_DISTANCE, MIN_AGE, MAX_AGE } from 'models/CurrentUser';

import type { FiltersType } from 'stores/RecsStore';
import type { WithLikeCounterPropsType } from 'hoc/withLikeCounter';

import Autolike from './components/Autolike';

import './Home.scss';

const NOTIF_LEVELS_MAP = {
  like: 'success',
  pass: 'error',
  superlike: 'info',
};

type PropsType = WithLikeCounterPropsType & {
  currentUser: Object,
};

const filterTypesMap: Array<{ text: string, type: FiltersType, handle: string }> = [
  { text: 'All', type: 'all', handle: 'handleAll' },
  { text: 'With instagram', type: 'insta', handle: 'handleInsta' },
  { text: 'With bio', type: 'bio', handle: 'handleBio' },
  { text: 'With common interests', type: 'interests', handle: 'handleInterests' },
  { text: 'With common friends', type: 'friends', handle: 'handleFriends' },
];

const formatAgeRangeLabel = value => (value > 54 ? '55+' : value);

@inject('currentUser') @withLikeCounter @observer
class Home extends Component {
  componentDidMount() {
    recsStore.fetchCore();

    ReactTooltip.rebuild();

    window.cu = this.props.currentUser;
  }

  props: PropsType;
  notificationSystem: ?any;

  @observable distance = (this.props.currentUser.distanceKm ? this.props.currentUser.distanceKm : 100);
  @observable ageRange = {
    min: (this.props.currentUser.age_filter_min ? this.props.currentUser.age_filter_min : 18),
    max: (this.props.currentUser.age_filter_max ? this.props.currentUser.age_filter_max : 50),
  };

  handleAll = () => {
    recsStore.visibilityFilter = 'all';
  }

  handleInsta = () => {
    recsStore.visibilityFilter = 'insta';
  }

  handleBio = () => {
    recsStore.visibilityFilter = 'bio';
  }

  handleInterests = () => {
    recsStore.visibilityFilter = 'interests';
  }

  handleFriends = () => {
    recsStore.visibilityFilter = 'friends';
  }

  handleMatch = (person: Person) => {
    ReactGA.event({
      category: 'Recs',
      action: 'Match',
    });

    if (this.notificationSystem) {
      this.notificationSystem.addNotification({
        level: 'success',
        position: 'tc',
        autoDismiss: 2,
        children: <MatchNotification person={person} />,
      });
    }
  }

  handleLoadMoreClick = () => {
    recsStore.fetchCore(true);
  }

  handleRefresh = () => {
    recsStore.fetchCore();
  }

  handleAction = (payload: Object) => {
    if (this.notificationSystem && LS.get('settings.notifCloudEnabled', true)) {
      this.notificationSystem.addNotification({
        level: NOTIF_LEVELS_MAP[payload.type],
        position: 'bl',
        autoDismiss: 3,
        children: <ActionNotification payload={payload} />,
      });
    }
  }

  handleDistanceChange = (distanceKm: number) => {
    this.props.currentUser.updateProfile({
      distance_filter: kmToMi(distanceKm),
    });

    ReactGA.event({
      category: 'Recs',
      action: 'Distance change',
    });
  };

  handleAgeChange = ({ min, max }: Object) => {
    const maxAge = max === 55 ? 1000 : max;

    this.ageRange = {
      max: maxAge,
      min,
    };

    this.props.currentUser.updateProfile({
      age_filter_min: min,
      age_filter_max: maxAge,
    });

    ReactGA.event({
      category: 'Recs',
      action: 'Age change',
    });
  }

  renderBody() {
    const { currentUser, handleSuperlike, handleError, superlikeResetRemaining, likeResetRemaining } = this.props;

    if (
      recsStore.is_fetching || recsStore.areRecsExhaust || (recsStore.is_fetching && recsStore.allVisible.length === 0)
    ) {
      return (
        <SearchingLoader
          noAnimation={recsStore.areRecsExhaust}
          photoUrl={currentUser.avatarUrl}
        >
          {
            recsStore.is_fetching ? 'Finding people near you...' : (
              <div>
                {'There\'s no one new around you.'}<br />
              (TIP: Try to change distance filter <i className="fa fa-arrow-left" />) <br />
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
              onError={handleError}
              onSuperlike={handleSuperlike}
              onButtonClick={this.handleAction}
              currentUserDistanceSetting={currentUser.distance_filter}
              allowHotkeys={i === 0}
              limitations={{
                superlikeRemaining: currentUser.superlike_remaining,
                superlikeResetsAt: superlikeResetRemaining,
                likeResetsAt: likeResetRemaining,
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
    const { handleError } = this.props;

    return (
      <div className="home">
        <NotificationSystem ref={(ref) => { this.notificationSystem = ref; }} />
        <SideMenu id="home">
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
              minValue={2}
              maxValue={MAX_DISTANCE}
              value={this.distance}
              onChange={(value) => { this.distance = value; }}
              onChangeComplete={this.handleDistanceChange}
            />
          </SideMenu.Item>
          <SideMenu.Item className="home__sidebar-item home__sidebar-item-distance">
            <label>Age</label>
            <InputRange
              minValue={MIN_AGE}
              maxValue={MAX_AGE}
              formatLabel={formatAgeRangeLabel}
              value={this.ageRange}
              onChange={(value) => { this.ageRange = value; }}
              onChangeComplete={this.handleAgeChange}
            />
          </SideMenu.Item>
          <SideMenu.Separator />
          <SideMenu.Item className="home__sidebar-item">
            <Autolike
              recs={recsStore}
              onMatch={this.handleMatch}
              onError={handleError}
              onButtonClick={this.handleAction}
            />
          </SideMenu.Item>
          <SideMenu.Separator />
          <SideMenu.Item className="home__sidebar-item">
            <label>Filters</label>
          </SideMenu.Item>
          {filterTypesMap.map(filter => (
            <SideMenu.Item
              key={filter.text}
              active={recsStore.visibilityFilter === filter.type}
              onClick={this[filter.handle]}
              className="home__sidebar-item"
              asLink
            >
              <span>{filter.text}</span>
            </SideMenu.Item>
          ))}
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
