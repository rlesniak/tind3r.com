import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import { observer } from 'mobx-react'
import styles from './message.scss'

@observer
@CSSModules(styles)
export default class Message extends Component {
  scrollIntoView() {
    this.wrapper.scrollIntoView()
  }

  render() {
    const { message } = this.props

    return (
      <div styleName="wrapper" ref={ref => this.wrapper = ref}>
        {message.message}
      </div>
    );
  }
}
