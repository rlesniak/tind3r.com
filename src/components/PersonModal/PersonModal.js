import './PersonModal.scss';
import 'rodal/lib/rodal.css';

import React, { Component } from 'react';
import Rodal from 'rodal';
import { observable } from 'mobx';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { observer } from 'mobx-react';

import Gallery from 'components/Gallery';
import ActionButtons from 'components/ActionButtons';
import Bio from 'components/Bio';
import Person from 'models/Person';

import recsStore from 'stores/RecsStore';

import type { ActionsType } from 'types/person';

type PropsType = {
  location: Object,
  history: Object,
}

@observer
class PersonModal extends Component {
  props: PropsType;

  person: Person = new Person({}, this.props.location.state.person);

  componentDidMount() {
    this.person.fetch();
  }

  back = (e) => {
    const { history } = this.props;
    e.stopPropagation();
    history.goBack();
  };

  handleActionClick = (type: ActionsType) => {
    const { history } = this.props;
    const pero = recsStore.persons.find(person => person._id === this.person._id);

    if (pero) {
      pero.callAction(type);
    }

    history.goBack();
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
        <ul className="person-modal__connections">
          {this.person.common_connections.map(c => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )
    }

    return null;
  }

  render() {
    const { person } = this;
    const width = 500;
    console.log(this.person);

    return (
      <div className="person-modal">
        <Rodal
          visible
          onClose={this.back}
          height={550}
          width={780}
        >
          <div className="person-modal__left">
            <div className="person-modal__info">
              <div className="person-modal__name">{person.name}, {person.age}</div>
              <div className="person-modal__distance">{person.distanceKm}</div>
              <div className="person-modal__lists">
                {this.renderSchools()}
                {this.renderJobs()}
              </div>
              <div className="person-modal__bio">
                <Bio text={person.bio} />
              </div>
              {this.renderConnections()}
            </div>
            <div className="person-modal__buttons">
              <ActionButtons
                liked={person.isLiked}
                superliked={person.isSuperlike}
                onButtonClick={this.handleActionClick}
                hideTimer={false}
                size={'large'}
              />
            </div>
          </div>
          <div className="person-modal__gallery" style={{ width: `${width}px` }}>
            <Gallery
              delay={200}
              scrolling={false}
              images={person.photos}
              width={width}
            />
          </div>
        </Rodal>
      </div>
    );
  }
}

export default PersonModal;
