import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import PersonCard from 'Components/PersonCard';

@inject('currentUser')
@observer
class PersonCardContainer extends Component {
  render() {
    const { currentUser } = this.props;

    return (
      <PersonCard
        person={currentUser}
      />
    )
  }
}

export default PersonCardContainer;
