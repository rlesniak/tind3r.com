import './Home.scss';

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import PersonCard from 'Components/PersonCard';

@inject('currentUser')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  @autobind
  handleMatch() {
    alert('Match')
  }

  @autobind
  handleError(reason) {
    const { currentUser } = this.props;

    if (reason.type === 'like') {
      currentUser.like_limit_reset = reason.resetsAt;
    } else {
      currentUser.superlike_limit_reset = reason.resetsAt;
    }
  }

  @autobind
  handleSuperlike(remaining: number) {
    console.log(remaining);

    currentUser.superlike_remaining = remaining;
  }

  render() {
    const { recsStore } = this.props;

    if (recsStore.is_fetching) {
      return <h1>Searching</h1>
    }

    return (
      <div className="home">
        <div className="home__settings">
          <div className="home__settings__wrapper">Wrapper</div>
          <div className="home__settings__trigger">
            <i className="fa fa-cog" onClick={this.showSettings} />
          </div>
        </div>
        {this.props.recsStore.allVisible.map((person, i) => (
          <PersonCard
            key={person._id}
            person={person}
            small={i !== 0}
            onMatch={this.handleMatch}
            onError={this.handleError}
            onSuperlike={this.handleSuperlike}
          />
        ))}
      </div>
    );
  }
}

export default Home;
