// @flow

import React from 'react';
import { compose, withHandlers, withState, pure } from 'recompose';
import { observer } from 'mobx-react';
import cx from 'classnames';

import type { ActionsType } from 'types/person';

import { ACTION_TYPES } from '../../const/index.js';
import Button from '../actions/Button';

import './ActionButtons.scss';

const enhance = compose(
  withState('activeActionType', 'setActionType', props => props.activeActionType),
  withHandlers({
    handleLike: props => () => {
      if (props.activeAction === ACTION_TYPES.LIKE || props.likeDisabled) return;

      props.onButtonClick(ACTION_TYPES.LIKE);
    },
    handleSuperlike: props => () => {
      if (props.activeAction === ACTION_TYPES.SUPERLIKE || props.superlikeDisabled) return;

      props.onButtonClick(ACTION_TYPES.SUPERLIKE);
    },
    handlePass: props => () => {
      props.onButtonClick(ACTION_TYPES.PASS);
    },
  }),
  observer,
  pure,
);

type PropsType = {
  handleLike: () => void,
  handlePass: () => void,
  handleSuperlike: () => void,
  size: 'small' | 'large',
  superLikeResetsAt?: string,
  superlikeRemaining?: number,
  likeResetsAt?: string,
  hideTimer?: boolean,
  superlikeDisabled?: boolean,
  likeDisabled?: boolean,
  activeAction?: ActionsType,
};

const passButton = (handlePass: () => void) => (passed: ?boolean) => (
  <div className="action-buttons__button">
    <Button color="red" active={passed} onClick={handlePass}>
      <i className="fa fa-thumbs-o-down" />
    </Button>
  </div>
);

const superButton = (
  superlikeDisabled: ?boolean,
  handleSuperlike: () => void,
  superlikeRemaining: ?number,
  hideTimer: ?boolean,
  superLikeResetsAt: ?string,
) => (superliked: ?boolean) => (
  <div className="action-buttons__button">
    <Button color="blue" active={superliked} disabled={superlikeDisabled} onClick={handleSuperlike}>
      <i className="fa fa-star" />
      {!hideTimer &&
        superlikeDisabled &&
        !superliked &&
        <span className="action-buttons__timer">{superLikeResetsAt}</span>}
      <span className="action-buttons__likes-remaining">{superlikeRemaining}</span>
    </Button>
  </div>
);

const likeButton = (likeDisabled: ?boolean, handleLike: () => void, hideTimer: ?boolean, likeResetsAt: ?string) => (
  liked: ?boolean,
) => (
  <div className="action-buttons__button">
    <Button color="green" active={liked} disabled={likeDisabled} onClick={handleLike}>
      <i className="fa fa-heart" />
      {!hideTimer && likeDisabled && !liked && <span className="action-buttons__timer">{likeResetsAt}</span>}
    </Button>
  </div>
);

const ActionButtons = ({
  handleLike,
  handlePass,
  handleSuperlike,
  superLikeResetsAt,
  likeResetsAt,
  hideTimer,
  size = 'small',
  superlikeRemaining,
  superlikeDisabled,
  likeDisabled,
  activeAction,
}: PropsType) => {
  const pass = passButton(handlePass);
  const superlike = superButton(superlikeDisabled, handleSuperlike, superlikeRemaining, hideTimer, superLikeResetsAt);
  const like = likeButton(likeDisabled, handleLike, hideTimer, likeResetsAt);
  let component = null;

  switch (activeAction) {
    case ACTION_TYPES.PASS:
      component = pass(true);
      break;
    case ACTION_TYPES.SUPERLIKE:
      component = superlike(true);
      break;
    case ACTION_TYPES.LIKE:
      component = like(true);
      break;
    default:
      return (
        <div className={cx('action-buttons', `action-buttons--${size}`)}>
          {pass()}
          {superlike()}
          {like()}
        </div>
      );
  }

  return (
    <div className={cx('action-buttons', `action-buttons--${size}`)}>
      {component}
    </div>
  );
};

export default enhance(ActionButtons);
