// @flow

import './ActionButtons.scss';

import React from 'react';
import { compose, withHandlers, withState, pure } from 'recompose';

import Button from '../actions/Button';
import { ACTION_TYPES } from 'const';

import type { ActionsType } from 'types/person';

const enhance = compose(
  withState('activeActionType', 'setActionType', props => props.activeActionType),
  withHandlers({
    handleLike: (props) => () => {
      console.log(props)
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

const isDisliked = type => type === ACTION_TYPES.DISLIKE;
const isLiked = type => type === ACTION_TYPES.LIKE;
const isSuperlike = type => type === ACTION_TYPES.SUPERLIKE;

type PropsType = {
  handleLike: () => void,
  handleDislike: () => void,
  handleSuperlike: () => void,
  activeActionType: ActionsType,
  superLikeTimeout?: string,
  likeTimeout?: string,
}

const ActionButtons = ({
  handleLike, handleDislike, handleSuperlike, activeActionType, superLikeTimeout, likeTimeout
}: PropsType) => (
  <div className="action-buttons">
    {
      !isSuperlike(activeActionType) && !isLiked(activeActionType) &&
      <div className="action-buttons__button">
        <Button
          color="red"
          active={isDisliked(activeActionType)}
          onClick={handleDislike}
        >
          <i className="fa fa-thumbs-o-down" />
        </Button>
      </div>
    }
    {
      !isDisliked(activeActionType) && !isLiked(activeActionType) &&
      <div className="action-buttons__button">
        <Button
          color="blue"
          active={isSuperlike(activeActionType)}
          disabled={superLikeTimeout}
          onClick={handleSuperlike}
        >
          <i className="fa fa-star" />
          {!!superLikeTimeout && isSuperlike(activeActionType) &&
            <span className="action-buttons__timer">{superLikeTimeout}</span>}
        </Button>
      </div>
    }
    {
      !isDisliked(activeActionType) && !isSuperlike(activeActionType) &&
      <div className="action-buttons__button">
        <Button
          color="green"
          active={isLiked(activeActionType)}
          disabled={likeTimeout}
          onClick={handleLike}
        >
          <i className="fa fa-heart" />
          {!!likeTimeout && !isLiked(activeActionType) &&
            <span className="action-buttons__timer">{likeTimeout}</span>}
        </Button>
      </div>
    }
  </div>
);

export default enhance(ActionButtons);
