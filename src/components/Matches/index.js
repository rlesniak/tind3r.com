import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import { observer } from 'mobx-react'
import styles from './styles.scss'

@observer
@CSSModules(styles)
export default class Matches extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="wrapper">
        <div styleName="coversations">conv</div>
      </div>
    );
  }
}
