// @flow

import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { observer } from 'mobx-react';
import cx from 'classnames';

import { ACTION_TYPES } from 'const';
import Button from '../actions/Button';

import type { ActionsType } from 'types/person';

import './ActionButtons.scss';

const enhance = compose(
  withState('activeActionType', 'setActionType', props => props.activeActionType),
  withHandlers({
    handleLike: props => () => {
      if (props.liked || props.likeDisabled) return;

      props.onButtonClick(ACTION_TYPES.LIKE);
    },
    handleSuperlike: props => () => {
      if (props.superliked || props.superlikeDisabled) return;

      props.onButtonClick(ACTION_TYPES.SUPERLIKE);
    },
    handlePass: props => () => {
      props.onButtonClick(ACTION_TYPES.PASS);
    },
  }),
);

type PropsType = {
  handleLike: () => void,
  handlePass: () => void,
  handleSuperlike: () => void,
  size: 'small' | 'large',
  superLikeResetsAt?: string,
  superlikeRemaining?: number,
  likeResetsAt?: string,
  passed?: boolean,
  liked?: boolean,
  superliked?: boolean,
  hideTimer?: boolean,
  superlikeDisabled: boolean,
  likeDisabled: boolean,
}

const ActionButtons = ({
  handleLike, handlePass, handleSuperlike, superLikeResetsAt, likeResetsAt,
  passed, liked, superliked, hideTimer, size = 'small', superlikeRemaining,
  superlikeDisabled, likeDisabled,
}: PropsType) => (
  <div className={cx('action-buttons', `action-buttons--${size}`)}>
    {
      !superliked && !liked &&
      <div className="action-buttons__button">
        <Button
          color="red"
          active={passed}
          onClick={handlePass}
        >
          <i className="fa fa-thumbs-o-down" />
        </Button>
      </div>
    }
    {
      !passed && !liked &&
      <div className="action-buttons__button">
        <Button
          color="blue"
          active={superliked}
          disabled={superlikeDisabled}
          onClick={handleSuperlike}
        >
          <i className="fa fa-star" />
          {!hideTimer && superlikeDisabled && !superliked &&
            <span className="action-buttons__timer">{superLikeResetsAt}</span>}
          <span className="action-buttons__likes-remaining">{superlikeRemaining}</span>
        </Button>
      </div>
    }
    {
      !passed && !superliked &&
      <div className="action-buttons__button">
        <Button
          color="green"
          active={liked}
          disabled={likeDisabled}
          onClick={handleLike}
        >
          <i className="fa fa-heart" />
          {!hideTimer && likeDisabled && !liked &&
            <span className="action-buttons__timer">{likeResetsAt}</span>}
        </Button>
      </div>
    }
  </div>
);

export default enhance(observer(ActionButtons));
