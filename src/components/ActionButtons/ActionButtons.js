import './ActionButtons.scss';

import React from 'react';
import { compose, withHandlers, withState, pure } from 'recompose';

import Button from '../actions/Button';

const enhance = compose(
  withState('activeActionType', 'setActionType', props => props.activeActionType),
  withHandlers({
    handleLike: (props) => () => {
      console.log(props)
      props.onButtonClick('like')
    },
    handleSuperlike: (props) => () => {
      props.onButtonClick('superlike')
    },
    handleDislike: (props) => () => {
      props.onButtonClick('dislike')
    },
  }),
  pure,
);

const isDisliked = type => type === 'dislike';
const isLiked = type => type === 'like';
const isSuperlike = type => type === 'superlike';

const ActionButtons = ({
  handleLike, handleDislike, handleSuperlike, activeActionType, superLikeTimeout, likeTimeout
}) => (
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
