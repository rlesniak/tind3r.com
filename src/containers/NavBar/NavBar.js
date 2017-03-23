import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import NavBar from 'Components/NavBar';

@inject('currentUser')
@observer
class NavBarContainer extends Component {
  render() {
    const { currentUser } = this.props;

    return (
      <NavBar
        unreadCount={3}
        currentPerson={currentUser}
      />
    )
  }
}

export default NavBarContainer;
