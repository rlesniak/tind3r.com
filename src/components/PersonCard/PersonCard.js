import './PersonCard.scss';

import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { compose, withHandlers, withState, pure } from 'recompose';

import Gallery from 'Components/Gallery';
import ActionButtons from 'Components/ActionButtons';

const enhance = compose(
  withState('counter', 'setCounter', 0),
  withHandlers({
    startCount: props => () => {
      console.log(props)
      setInterval(() => {
        props.setCounter(n => n + 1)
      }, 1000)
    }
  })
)

const renderInstagramLink = (link, name, small) => (
  <a href={link} target="_blank" title={name}>
    <i className="fa fa-instagram" />
    {!small && <div className="instaname">{name}</div>}
  </a>
)

const renderEmployOrActions = (person, counter) => (
  <div className="person-card__employ">
    <span>{person.school}</span>
    <div className="person-card__employ__actions">
      <ActionButtons
        activeActionType="superlike"
        superLikeTimeout={counter}
        onButtonClick={console.log}
      />
    </div>
  </div>
)

const PersonCard = ({
  person, small, counter, startCount,
}) => (
  <div className="person-card">
    <Gallery key={person._id} images={person.photos} width={220} />
    <div className="person-card__content">
      <div className="person-card__name">
        <Link to={`/user/${person._id}`}>{person.name}, {person.age}</Link>
      </div>
      <div className="person-card__seen-min">{person.seenMin}</div>
      <div className="person-card__bio" onClick={startCount}>{person.bio}</div>

      {renderEmployOrActions(person, counter)}

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
)

PersonCard.propTypes = {
  person: PropTypes.object.isRequired,
  small: PropTypes.bool,
};

export default enhance(PersonCard);
