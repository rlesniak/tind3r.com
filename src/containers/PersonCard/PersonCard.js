import React, { Component } from 'react';

import NavBar from 'Components/NavBar';

export default class NavBarContainer extends Component {
  render() {
    return (
      <NavBar
        newCount={2}
        user={
          { _id: 2, full_name: 'Rafal'}
        }
      />
    )
  }
}