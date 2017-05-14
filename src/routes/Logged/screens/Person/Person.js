// @flow

import './Person.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import DocumentTitle from 'react-document-title';

import Loader from 'components/Loader';
import PersonView from 'components/PersonView';

import { pageTitle } from 'utils';

import Person from 'models/Person';

type PropsType = {
  match: Object,
  history: Object,
}

@observer
class PersonComponent extends Component {
  props: PropsType;
  person: Person = new Person({}, {
    _id: this.props.match.params.id,
  });

  componentDidMount() {
    this.person.fetch(() => {
      this.props.history.replace('/not-found');
    });
  }

  render() {
    if (this.person.is_loading) {
      return <Loader />;
    }

    return (
      <DocumentTitle title={`${this.person.name} - ${pageTitle}`}>
        <div className="person">
          <PersonView personId={this.props.match.params.id} />
        </div>
      </DocumentTitle>
    );
  }
}

export default PersonComponent;
