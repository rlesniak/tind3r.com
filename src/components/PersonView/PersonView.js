import './PersonView.scss';

import React, { Component } from 'react';
import Rodal from 'rodal';
import { observable } from 'mobx';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip';

import Gallery from 'components/Gallery';
import Loader from 'components/Loader';
import ActionButtons from 'components/ActionButtons';
import Bio from 'components/Bio';

import Person from 'models/Person';
import currentUser from 'models/CurrentUser';
import recsStore from 'stores/RecsStore';

import { fbUserSearchUrl } from 'utils';
import { getMatchByPerson, getActions } from 'utils/database.v2';

import type { ActionsType } from 'types/person';
import type { MatchType } from 'types/match';

type PropsType = {
  personId: string,
  onActionClick: () => void,
  person: Person,
};

@observer
class PersonView extends Component {
  props: PropsType;

  match: MatchType;
  person: Person;

  constructor(props: PropsType) {
    super(props);
    const json = this.props.person || { _id: this.props.personId };

    this.match = getMatchByPerson(json._id);
    this.person = new Person({}, json);
  }

  componentDidMount() {
    this.person.fetch();

    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  handleActionClick = (type: ActionsType) => {
    const { onActionClick } = this.props;
    const pero = recsStore.persons.find(person => person._id === this.person._id);
    const person = pero || this.person;

    if (person) {
      person.callAction(type);
    }

    if (onActionClick) {
      onActionClick();
    }
  }

  checkIsSuperliked() {
    if (this.match) {
      return this.match.is_super_like;
    }
    const action = getActions(this.person._id)[0];
    return action && action.action_type === 'superlike';
  }

  checkIsLiked() {
    if (this.match) {
      return !this.match.is_super_like;
    }
    const action = getActions(this.person._id)[0];
    return action && action.action_type === 'like';
  }

  checkIsPassed() {
    if (!this.checkIsLiked()) {
      const action = getActions(this.person._id)[0];
      return action && action.action_type === 'pass';
    }

    return false;
  }

  renderSchools() {
    if (this.person.schools && this.person.schools.length) {
      return (
        <ul>
          {this.person.schools.map(p => (
            <li key={p.id}>
              <a
                href={fbUserSearchUrl(p.name, this.person.name)}
                target="_blank"
                rel="noreferrer noopener"
                data-tip="Do Facebook search based on school and name. <br />
                Tinder user has to have at least one Facebook photo <br />
                so you can compare and find right person."
                data-for="main"
                data-offset="{'top': -10, 'left': -12}"
                className="person-view__fb-search"
              >
                <i className="fa fa-eye" />
              </a>
              {p.name}
            </li>
          ))}
        </ul>
      );
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
      );
    }

    return null;
  }

  renderConnections() {
    if (this.person.common_connections && this.person.common_connections.length) {
      return (
        <ul className="person-view__connections">
          <li className="person-view__connections-header">Common connections:</li>
          {this.person.common_connections.map(c => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      );
    }

    return null;
  }

  renderInterests() {
    if (this.person.common_interests && this.person.common_interests.length) {
      return (
        <ul className="person-view__connections">
          <li className="person-view__connections-header">Common interests:</li>
          {this.person.common_interests.map(c => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      );
    }

    return null;
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
            {this.renderInterests()}
          </div>
          <div className="person-view__buttons">
            {person._id !== currentUser._id && <ActionButtons
              passed={this.checkIsPassed()}
              liked={this.checkIsLiked()}
              superliked={this.checkIsSuperliked()}
              onButtonClick={this.handleActionClick}
              hideTimer={false}
              size={'large'}
            />}
          </div>
        </div>
        <div className="person-view__gallery" style={{ width: `${width}px` }}>
          <Gallery
            delay={200}
            scrolling={false}
            images={person.photos}
            width={width}
            withArrowNav
          />
        </div>
      </div>
    );
  }
}

export default PersonView;
