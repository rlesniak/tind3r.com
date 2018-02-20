// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import recsStore from 'stores/RecsStore';
import PersonCard from 'components/PersonCard';
import withLikeCounter from 'hoc/withLikeCounter';

import type { WithLikeCounterPropsType } from 'hoc/withLikeCounter';

import './FastMatch.scss';

type PropsType = WithLikeCounterPropsType & {
  currentUser: Object,
};

@inject('currentUser')
@withLikeCounter
@observer
class FastMatch extends Component {
  componentDidMount() {
    if (this.props.currentUser.goldAccount) {
      recsStore.fetchFastMatch();
    }
  }

  props: PropsType;

  handleAction = (...rest) => {
    console.log(rest);
  };

  render() {
    const { currentUser, handleSuperlike, handleError, superlikeResetRemaining, likeResetRemaining } = this.props;

    if (recsStore.is_fetching_fast_match) {
      return (
        <div className="fast-match">
          <h1>Loading...</h1>
        </div>
      );
    }

    return (
      <div className="fast-match">
        {currentUser.goldAccount ? (
          recsStore.fastMatchCount === 0 ? (
            <h2>No one has liked you yet :[</h2>
          ) : (
            recsStore.fastMatched.map(person => (
              <div key={person._id} className={cx('fast-match__card')}>
                <PersonCard
                  person={person}
                  small
                  onError={handleError}
                  onSuperlike={handleSuperlike}
                  onButtonClick={this.handleAction}
                  currentUserDistanceSetting={currentUser.distance_filter}
                  limitations={{
                    superlikeRemaining: currentUser.superlike_remaining,
                    superlikeResetsAt: superlikeResetRemaining,
                    likeResetsAt: likeResetRemaining,
                  }}
                />
              </div>
            ))
          )
        ) : (
          <h1>Buy Gold account to see likes!</h1>
        )}
      </div>
    );
  }
}

export default FastMatch;
