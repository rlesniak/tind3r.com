// @flow

import './ActionButtons.scss';

import React from 'react';
import { compose, withHandlers, withState, pure } from 'recompose';
import cx from 'classnames';

import Button from '../actions/Button';
import { ACTION_TYPES } from '../../const';

import type { ActionsType } from 'types/person';

const enhance = compose(
  withState('activeActionType', 'setActionType', props => props.activeActionType),
  withHandlers({
    handleLike: (props) => (e) => {
      props.onButtonClick(ACTION_TYPES.LIKE)
    },
    handleSuperlike: (props) => () => {
      props.onButtonClick(ACTION_TYPES.SUPERLIKE)
    },
    handleDislike: (props) => () => {
      props.onButtonClick(ACTION_TYPES.DISLIKE)
    },
  }),
  pure,
);

type PropsType = {
  handleLike: () => void,
  handleDislike: () => void,
  handleSuperlike: () => void,
  onButtonClick: (type: ActionsType) => void,
  size: 'small' | 'large',
  superLikeTimeout?: string,
  likeTimeout?: string,
  disliked?: boolean,
  liked?: boolean,
  superliked?: boolean,
  hideTimer?: boolean,
}

const ActionButtons = ({
  handleLike, handleDislike, handleSuperlike, activeActionType, superLikeTimeout, likeTimeout,
  disliked, liked, superliked, hideTimer, size = 'small',
}: PropsType) => (
  <div className={cx('action-buttons', `action-buttons--${size}`)}>
    {
      !superliked && !liked &&
      <div className="action-buttons__button">
        <Button
          color="red"
          active={disliked}
          onClick={handleDislike}
        >
          <i className="fa fa-thumbs-o-down" />
        </Button>
      </div>
    }
    {
      !disliked && !liked &&
      <div className="action-buttons__button">
        <Button
          color="blue"
          active={superliked}
          disabled={!!superLikeTimeout}
          onClick={handleSuperlike}
        >
          <i className="fa fa-star" />
          {!hideTimer && !!superLikeTimeout && !superliked &&
            <span className="action-buttons__timer">{superLikeTimeout}</span>}
        </Button>
      </div>
    }
    {
      !disliked && !superliked &&
      <div className="action-buttons__button">
        <Button
          color="green"
          active={liked}
          disabled={!!likeTimeout}
          onClick={handleLike}
        >
          <i className="fa fa-heart" />
          {!hideTimer && !!likeTimeout && !liked &&
            <span className="action-buttons__timer">{likeTimeout}</span>}
        </Button>
      </div>
    }
  </div>
);

export default enhance(ActionButtons);
