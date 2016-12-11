import React, { Component } from 'react';
import autobind from 'autobind-decorator'
import _ from 'lodash'
import { getFacebookToken } from '../runtime'

export default class FbConnect extends Component {

  @autobind
  connect() {
    getFacebookToken()
  }

  render() {
    return (
      <div>
        <h1>Connect with FC Clik:</h1>
        <button onClick={this.connect}>Click</button>
      </div>
    );
  }
}
