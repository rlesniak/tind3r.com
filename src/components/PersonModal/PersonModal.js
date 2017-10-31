// @flow

import 'rodal/lib/rodal.css';

import React, { Component } from 'react';
import Rodal from 'rodal';

import PersonView from 'components/PersonView';

import './PersonModal.scss';

type PropsType = {
  location: Object,
  history: Object,
  person: Object,
}

class PersonModal extends Component {
  props: PropsType;

  back = (e) => {
    const { history } = this.props;
    e.stopPropagation();
    history.goBack();
  };

  handleActionClick = () => {
    const { history } = this.props;

    history.goBack();
  }

  render() {
    return (
      <div className="person-modal">
        <Rodal
          visible
          onClose={this.back}
          height={570}
          width={830}
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
