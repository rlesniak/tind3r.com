import './PersonCard.scss';

import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { compose, withHandlers, withState, pure } from 'recompose';
import cx from 'classnames';

import Gallery from 'Components/Gallery';
import ActionButtons from 'Components/ActionButtons';

const enhance = compose(
  withState('counter', 'setCounter', 0),
  withHandlers({
    startCount: props => () => {
      console.log(props);
      setInterval(() => {
        props.setCounter(n => n + 1);
      }, 1000);
    },
    onActionClick: props => (actionType) => {
      props.person.callAction(actionType);
    },
  }),
  pure,
);

const renderInstagramLink = (link, name, small) => (
  <a href={link} target="_blank" title={name}>
    <i className="fa fa-instagram" />
    {!small && <div className="instaname">{name}</div>}
  </a>
);

const PersonCard = ({
  person, small, counter, startCount, onActionClick,
}) => (
  <div className={cx('person-card', { 'person-card--large': !small })}>
    <div className="person-card__gallery">
      <Gallery
        scrolling={!small}
        images={person.photos}
        width={small ? 220 : 400}
      />
    </div>
    <div className="person-card__content">
      <div className="person-card__name">
        <Link to={`/user/${person._id}`}>{person.name}, {person.age}</Link>
      </div>
      <div className="person-card__seen-min">{person.seenMin}</div>
      <div className="person-card__bio" onClick={startCount}>{person.bio || '&nbsp;'}</div>

      {!small && <div className="person-card__school">
        <span>{person.school}</span>
      </div>}
      <div className="person-card__employ">
        <span>{person.school}</span>
        <div className="person-card__employ__actions">
          <ActionButtons
            liked={person.is_liked}
            superLikeTimeout={counter}
            onButtonClick={onActionClick}
            hideTimer={small}
            size={small ? 'small' : 'large'}
          />
        </div>
      </div>

      <div className="person-card__footer">
        <div className="person-card__footer--distance">{person.distanceKm}</div>
        <div className="person-card__footer--instagram">
          {
            person.instagramProfileLink ?
            renderInstagramLink(person.instagramProfileLink, person.instagramUsername, small) :
            <i className="fa fa-instagram" />
          }
        </div>
      </div>
    </div>
  </div>
);

export default enhance(observer(PersonCard));
