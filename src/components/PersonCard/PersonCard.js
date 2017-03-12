import './PersonCard.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import Gallery from 'Components/Gallery';

const renderInstagramLink = (link, name, small) => (
  <a href={link} target="_blank" title={name}>
    <i className="fa fa-instagram" />
    {!small && <div className="instaname">{name}</div>}
  </a>
)

const renderEmployOrActions = (person) => (
  <div className="person-card__employ">
    {person.school}
    <div className="person-card__employ__actions">
      actions
    </div>
  </div>
)

const PersonCard = ({ person, small }) => (
  <div className="person-card">
    <Gallery key={person._id} images={person.photos} width={220} />
    <div className="person-card__content">
      <div className="person-card__name">
        <Link to={`/user/${person._id}`}>{person.name}, {person.age}</Link>
      </div>
      <div className="person-card__seen-min">{person.seenMin}</div>
      <div className="person-card__bio">{person.bio}</div>

      {renderEmployOrActions(person)}

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

export default PersonCard;
