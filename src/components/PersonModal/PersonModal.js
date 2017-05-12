import './PersonModal.scss';
import 'rodal/lib/rodal.css';

import React, { Component } from 'react';
import Rodal from 'rodal';

import PersonView from 'components/PersonView';

type PropsType = {
  location: Object,
  history: Object,
  person: Object,
}

class PersonModal extends Component {
  props: PropsType;

  back = e => {
    const { history } = this.props;
    e.stopPropagation();
    history.goBack();
  };

  handleActionClick = () => {
    const { history } = this.props;

    history.goBack();
  }

  render() {
    const { person } = this;
    const width = 500;

    return (
      <div className="person-modal">
        <Rodal
          visible
          onClose={this.back}
          height={570}
          width={780}
        >
          <PersonView
            person={this.props.location.state.person}
            onActionClick={this.handleActionClick}
          />
        </Rodal>
      </div>
    );
  }
}

export default PersonModal;
