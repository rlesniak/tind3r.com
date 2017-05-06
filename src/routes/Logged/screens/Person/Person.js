// @flow

import './Person.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Loader from 'components/Loader';
import PersonView from 'components/PersonView';

import Person from 'models/Person';

type PropsType = {
  match: Object,
}

@observer
class PersonComponent extends Component {
  props: PropsType;
  person: Person = new Person({}, {
    _id: this.props.match.params.id,
  });

  componentDidMount() {
    this.person.fetch();
  }

  render() {

    if (this.person.is_loading) {
      return <Loader />;
    }

    return (
      <div className="person">
        <PersonView personId={this.props.match.params.id} />
      </div>
    );
  }
}

export default PersonComponent;
