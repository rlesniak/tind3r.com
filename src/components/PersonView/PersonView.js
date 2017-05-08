import './PersonView.scss';

import React, { Component } from 'react';
import Rodal from 'rodal';
import { observable } from 'mobx';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { observer } from 'mobx-react';

import Gallery from 'components/Gallery';
import Loader from 'components/Loader';
import ActionButtons from 'components/ActionButtons';
import Bio from 'components/Bio';
import Person from 'models/Person';
import { getMatchByPerson, getActions } from 'utils/database.v2';

import recsStore from 'stores/RecsStore';

import type { ActionsType } from 'types/person';
import type { MatchType } from 'types/match';

type PropsType = {
  location: Object,
  history: Object,
  personId: string,
  onActionClick: () => void,
};

@observer
class PersonView extends Component {
  props: PropsType;

  match: MatchType;
  person: Person;

  constructor(props) {
    super(props);
    const json = this.props.person || { _id: this.props.personId };

    this.match = getMatchByPerson(json._id);
    this.person= new Person({}, json)
  }

  componentDidMount() {
    this.person.fetch();
  }

  handleActionClick = (type: ActionsType) => {
    const { history, onActionClick } = this.props;
    const pero = recsStore.persons.find(person => person._id === this.person._id);

    if (pero) {
      pero.callAction(type);
    }

    if (onActionClick) {
      onActionClick();
    }
  }

  renderSchools() {
    if (this.person.schools && this.person.schools.length) {
      return (
        <ul>
          {this.person.schools.map(p => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )
    }

    return null;
  }

  renderJobs() {
    if (this.person.jobs && this.person.jobs.length) {
      return (
        <ul>
          {this.person.jobs.map(j => (
            <li key={uniqueId()}>{get(j, 'company.name', null)}</li>
          ))}
        </ul>
      )
    }

    return null;
  }

  renderConnections() {
    if (this.person.common_connections && this.person.common_connections.length) {
      return (
        <ul className="person-view__connections">
          {this.person.common_connections.map(c => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )
    }

    return null;
  }

  checkIsSuperliked() {
    if (this.match) {
      return this.match.is_super_like;
    } else {
      const action = getActions(this.person._id)[0];
      return action && action.action_type === 'superlike';
    }
  }

  checkIsLiked() {
    if (this.match) {
      return !this.match.is_super_like;
    } else {
      const action = getActions(this.person._id)[0];
      return action && action.action_type === 'like';
    }
  }

  checkIsPassed() {
    if (!this.checkIsLiked()) {
      const action = getActions(this.person._id)[0];
      return action && action.action_type === 'pass';
    }

    return false;
  }

  render() {
    const { person } = this;
    const width = 500;

    if (!person.distanceKm) {
      return <Loader />;
    }

    return (
      <div className="person-view">
        <div className="person-view__left">
          <div className="person-view__info">
            <div className="person-view__name">{person.name}, {person.age}</div>
            <div className="person-view__distance">{person.distanceKm}</div>
            <div className="person-view__lists">
              {this.renderSchools()}
              {this.renderJobs()}
            </div>
            <div className="person-view__bio">
              <Bio text={person.bio} />
            </div>
            {this.renderConnections()}
          </div>
          <div className="person-view__buttons">
            <ActionButtons
              passed={this.checkIsPassed()}
              liked={this.checkIsLiked()}
              superliked={this.checkIsSuperliked()}
              onButtonClick={this.handleActionClick}
              hideTimer={false}
              size={'large'}
            />
          </div>
        </div>
        <div className="person-view__gallery" style={{ width: `${width}px` }}>
          <Gallery
            delay={200}
            scrolling={false}
            images={person.photos}
            width={width}
          />
        </div>
      </div>
    );
  }
}

export default PersonView;
