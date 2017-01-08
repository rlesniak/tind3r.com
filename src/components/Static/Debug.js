import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import autobind from 'autobind-decorator'
import _ from 'lodash'

export default class Debbug extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bug: 1,
    }
  }

  @autobind
  error() {
    const obj = undefined
    obj.asd.ds = 12
  }

  @autobind
  reacterror() {
    this.state.bug.map()
  }

  render() {
    return (
      <div>
        <button onClick={this.reacterror}>Tirgger react error</button>
        <button onClick={this.error}>Tirgger error</button>
      </div>
    );
  }
}
