// @flow

import './Home.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import cx from 'classnames';

import PersonCard from 'Components/PersonCard';
import LoadMoreCard from 'Components/LoadMoreCard';
import SearchingLoader from 'Components/SearchingLoader';

@inject('currentUser')
@observer
class Home extends Component {
  interval: number = 0;

  @observable likeCounter = null;

  startCounter() {
    const { currentUser } = this.props;

    clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (currentUser.likeResetSeconds === 0) {
        clearInterval(this.interval);
      }
      this.likeCounter = currentUser.likeResetFormatted
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.startCounter();
  }

  @autobind
  handleMatch(match: Object) {
    alert('Match');
  }

  @autobind
  handleError(reason: Object) {
    const { currentUser } = this.props;

    if (reason.type === 'like') {
      currentUser.like_limit_reset = reason.resetsAt;
      this.likeCounter = currentUser.likeResetFormatted
      this.startCounter();
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

  renderNooneNew() {
    return (
      <h2>There is no one new</h2>
    )
  }

  render() {
    const { recsStore, currentUser } = this.props;

    if (recsStore.is_fetching || recsStore.areRecsExhaust) {
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
                onClick={this.refresh}
                className="home__refresh-button"
              >
                <i className="fa fa-refresh" />
              </button>
            </div>
          )}
        </SearchingLoader>
      )
    }

    return (
      <div className="home">
        <div className="home__settings">
          <div className="home__settings__wrapper">Wrapper</div>
          <div className="home__settings__trigger">
            <i className="fa fa-cog" onClick={this.showSettings} />
          </div>
        </div>
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
                  superlikeResetsAt: currentUser.superlikeResetDate,
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
      </div>
    );
  }
}

export default Home;
