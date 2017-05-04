// @flow

import './Home.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';

import PersonCard from 'components/PersonCard';
import LoadMoreCard from 'components/LoadMoreCard';
import SearchingLoader from 'components/SearchingLoader';
import SideMenu from 'components/SideMenu';
import ShortcutIcon from 'components/ShortcutIcon';

import counterService from 'services/counterService';
import recsStore from 'stores/RecsStore';

@inject('currentUser') @observer
class Home extends Component {
  @observable likeCounter = null;
  @observable superlikeCounter = null;

  componentWillUnmount() {
    counterService.unsubscribe(this.handleLikeCounter);
    counterService.unsubscribe(this.handleSuperlikeCounter);
  }

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser.likeReset.seconds > 0) {
      counterService.createSubscriber({ handler: this.handleLikeCounter });
    }

    if (currentUser.superlikeReset.seconds > 0 && currentUser.superlike_remaining === 0) {
      counterService.createSubscriber({ handler: this.handleSuperlikeCounter });
    }
    recsStore.fetchCore();

    ReactTooltip.rebuild();
  }

  @autobind
  handleMatch(match: Object) {
    alert('Match');
  }

  @autobind
  handleLikeCounter() {
    const { currentUser } = this.props;

    if (currentUser.likeReset.seconds === 0) {
      counterService.unsubscribe(this.handleLikeCounter);
    }

    this.likeCounter = currentUser.likeReset.formatted;
  }

  @autobind
  handleSuperlikeCounter() {
    const { currentUser } = this.props;

    if (currentUser.superlikeReset.seconds === 0) {
      counterService.unsubscribe(this.handleSuperlikeCounter);
    }

    this.superlikeCounter = currentUser.superlikeReset.formatted;
  }

  @autobind
  handleError(reason: Object) {
    const { currentUser } = this.props;

    if (reason.type === 'like') {
      currentUser.like_limit_reset = reason.resetsAt;
      this.likeCounter = currentUser.likeResetFormatted;

      counterService.createSubscriber({
        handler: this.handleLikeCounter,
      });
    } else {
      currentUser.superlike_limit_reset = reason.resetsAt;
    }
  }

  @autobind
  handleSuperlike(remaining: number) {
    const { currentUser } = this.props;

    currentUser.superlike_remaining = remaining;
  }

  @autobind
  handleLoadMoreClick() {
    const { recsStore } = this.props;

    recsStore.fetchCore(true);
  }

  handleRefresh = () => {
    const { recsStore } = this.props;

    recsStore.fetchCore();
  }

  renderNooneNew() {
    return (
      <h2>There is no one new</h2>
    );
  }

  renderBody() {
    const { recsStore, currentUser } = this.props;

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

        {recsStore.areRecsExhaust && this.renderNooneNew()}
      </div>
    );
  }

  render() {
    const { recsStore } = this.props;

    return (
      <div className="home">
        <SideMenu>
          <SideMenu.Item>
            <label>Distance</label>
            <span>asd</span>
          </SideMenu.Item>
          <SideMenu.Item>
            <label>Keyboard shortcuts</label>
            <ShortcutIcon text="a" tooltipText="Pass" />
            <ShortcutIcon text="s" tooltipText="Superlike" />
            <ShortcutIcon text="d" tooltipText="Like" />
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
