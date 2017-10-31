// @flow

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DocumentTitle from 'react-document-title';

import Loader from 'components/Loader';
import PersonView from 'components/PersonView';

import { pageTitle } from 'utils';

import Person from 'models/Person';

import './Person.scss';

type PropsType = {
  match: Object,
  history: Object,
}

@observer
class PersonComponent extends Component {
  componentDidMount() {
    this.person.fetch(() => {
      this.props.history.replace('/not-found');
    });
  }

  person: Person = new Person({}, {
    _id: this.props.match.params.id,
  });
  props: PropsType;

  render() {
    if (this.person.is_loading) {
      return <Loader />;
    }

    return (
      <DocumentTitle title={`${this.person.name} - ${pageTitle}`}>
        <div className="person">
          <PersonView person={this.person} withoutFetch />
        </div>
      </DocumentTitle>
    );
  }
}

export default PersonComponent;
