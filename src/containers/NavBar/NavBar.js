import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import NavBar from 'Components/NavBar';

@inject('currentUser', 'matchStore')
@observer
class NavBarContainer extends Component {
  render() {
    const { currentUser, matchStore } = this.props;

    return (
      <NavBar
        unreadCount={matchStore.unreadCount}
        currentPerson={currentUser}
      />
    )
  }
}

export default NavBarContainer;
