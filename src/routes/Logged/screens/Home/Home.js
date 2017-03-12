import React, { Component } from 'react';
import { observer } from 'mobx-react';

import PersonCard from 'Components/PersonCard';

@observer
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  render() {
    return (
      <h2>
        {this.props.recsStore.persons.map(person => (
          <PersonCard key={person._id} person={person} small />
        ))}
      </h2>
    );
  }
}

export default Counter;
