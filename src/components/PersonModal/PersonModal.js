import './PersonModal.scss';
import 'rodal/lib/rodal.css';

import React, { Component } from 'react';
import Rodal from 'rodal';

import Gallery from 'components/Gallery';
import ActionButtons from 'components/ActionButtons';
import Person from 'models/Person';

import recsStore from 'stores/RecsStore';

import type { ActionsType } from 'types/person';

type PropsType = {
  location: Object,
  history: Object,
}

class PersonModal extends Component {
  props: PropsType;

  person: Person = new Person({}, this.props.location.state.person);

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

  render() {
    const { person } = this;
    const width = 600;

    return (
      <div className="person-modal">
        <Rodal
          visible
          onClose={this.back}
          height={650}
          customStyles={{ width: '80%' }}
        >
          <div className="person-modal__left">
            <div className="person-modal__name">{person.name}, {person.age}</div>
            <div className="person-modal__distance">{person.distance}</div>
            <div className="person-modal__bio">{person.bio}</div>
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
