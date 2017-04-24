// @flow

import './MessageInput.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';

import MessageControls from '../MessageControls';

type PropsTypes = {
  onSubmit: (text: string) => void,
}

@observer
class MessageInput extends Component {
  @observable text = '';

  props: PropsTypes;
  inputRef: ?HTMLElement;

  componentDidUpdate() {
    if (this.inputRef) {
      this.inputRef.focus()
    }
  }

  handleMessageChange = ({ target }: SyntheticInputEvent) => {
    this.text = target.value;
  }

  handleKeyPress = (e: Event) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      this.props.onSubmit(this.text);
      this.text = '';
    }
  }

  render() {
    return (
      <div
        className={cx('message-input')}
      >
        <div className="message-input__input">
          <textarea
            autoFocus
            type="text"
            ref={ref => { this.inputRef = ref }}
            onChange={this.handleMessageChange}
            onKeyPress={this.handleKeyPress}
            value={this.text}
            placeholder="Type your message..."
          />
        </div>
        <div className="message-input__controls">
          <MessageControls />
        </div>
      </div>
    );
  }
}

export default MessageInput;
