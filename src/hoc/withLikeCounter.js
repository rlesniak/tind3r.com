// @flow

import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { CurrentUser } from 'models/CurrentUser';

import counterService from 'services/counterService';

type PropsType = {
  currentUser: CurrentUser,
};

export type WithLikeCounterPropsType = {
  currentUser: CurrentUser,
  likeResetRemaining: string,
  superlikeResetRemaining: string,
  handleSuperlike: (remaining: number) => void,
  handleError: (reason: Object) => void,
}

const withLikeCounter = (BaseComponent: any) => (
  observer(class extends Component {
    componentDidMount() {
      const { currentUser } = this.props;

      if (currentUser.likeReset.seconds > 0) {
        counterService.subscribe({ handler: this.handleLikeCounter });
      }

      if (currentUser.superlikeReset.seconds > 0 && currentUser.superlike_remaining === 0) {
        counterService.subscribe({ handler: this.handleSuperlikeCounter });
      }
    }

    componentWillUnmount() {
      counterService.unsubscribe(this.handleLikeCounter);
      counterService.unsubscribe(this.handleSuperlikeCounter);
    }

    props: PropsType;

    @observable likeResetRemaining: ?string = null;
    @observable superlikeResetRemaining: ?string = null;

    @action handleLikeCounter = () => {
      const { currentUser } = this.props;

      if (currentUser.likeReset.seconds === 0) {
        counterService.unsubscribe(this.handleLikeCounter);
      }

      this.likeResetRemaining = currentUser.likeReset.formatted;
    };

    @action handleSuperlikeCounter = () => {
      const { currentUser } = this.props;

      if (currentUser.superlikeReset.seconds === 0) {
        counterService.unsubscribe(this.handleSuperlikeCounter);
      }

      this.superlikeResetRemaining = currentUser.superlikeReset.formatted;
    };

    @action handleError = (reason: Object) => {
      const { currentUser } = this.props;

      if (reason.type === 'like') {
        currentUser.like_limit_reset = reason.resetsAt;
        this.likeResetRemaining = currentUser.likeReset.formatted;

        counterService.subscribe({
          handler: this.handleLikeCounter,
        });
      } else if (reason.type === 'superlike') {
        currentUser.superlike_remaining = 0;
        currentUser.superlike_limit_reset = reason.resetsAt;

        counterService.subscribe({
          handler: this.handleSuperlikeCounter,
        });
      }
    };

    handleSuperlike = (remaining: number) => {
      const { currentUser } = this.props;

      currentUser.superlike_remaining = remaining;
    };

    render() {
      const { currentUser } = this.props;

      return (
        <BaseComponent
          {...this.props}
          currentUser={currentUser}
          likeResetRemaining={this.likeResetRemaining}
          superlikeResetRemaining={this.superlikeResetRemaining}
          handleSuperlike={this.handleSuperlike}
          handleError={this.handleError}
        />
      );
    }
  })
);

export default withLikeCounter;
