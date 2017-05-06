// @flow

import React from 'react';
import { compose, withHandlers, withState, pure } from 'recompose';
import cx from 'classnames';

import { ACTION_TYPES } from 'const';
import Button from '../actions/Button';

import type { ActionsType } from 'types/person';

import './ActionButtons.scss';

const enhance = compose(
  withState('activeActionType', 'setActionType', props => props.activeActionType),
  withHandlers({
    handleLike: props => () => {
      if (props.liked) return;

      props.onButtonClick(ACTION_TYPES.LIKE);
    },
    handleSuperlike: props => () => {
      if (props.superliked) return;

      props.onButtonClick(ACTION_TYPES.SUPERLIKE);
    },
    handlePass: props => () => {
      props.onButtonClick(ACTION_TYPES.PASS);
    },
  }),
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
  passed?: boolean,
  liked?: boolean,
  superliked?: boolean,
  hideTimer?: boolean,
}

const ActionButtons = ({
  handleLike, handlePass, handleSuperlike, superLikeResetsAt, likeResetsAt,
  passed, liked, superliked, hideTimer, size = 'small', superlikeRemaining,
}: PropsType) => {
  const isSuperlikeDisabled = !!superLikeResetsAt && superlikeRemaining === 0;

  return (
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
            disabled={isSuperlikeDisabled}
            onClick={handleSuperlike}
          >
            <i className="fa fa-star" />
            {!hideTimer && isSuperlikeDisabled && !superliked &&
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
            disabled={!!likeResetsAt}
            onClick={handleLike}
          >
            <i className="fa fa-heart" />
            {!hideTimer && !!likeResetsAt && !liked &&
              <span className="action-buttons__timer">{likeResetsAt}</span>}
          </Button>
        </div>
      }
    </div>
  );
};

export default enhance(ActionButtons);
