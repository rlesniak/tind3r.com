// @flow

import './MessageControls.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import cx from 'classnames';

type PropsTypes = {
}

class MessageControls extends Component {

  render() {
    return (
      <div className={cx('message-controls')}>
        <div className="message-controls__item">
          <i className="fa fa-smile-o" />
        </div>
        <div className="message-controls__item">
          <i className="fa fa-video-camera" />
        </div>
      </div>
    );
  }
}

export default MessageControls;
