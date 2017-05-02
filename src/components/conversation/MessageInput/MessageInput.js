// @flow

import './MessageInput.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';

import MessageControls from '../MessageControls';

type PropsType = {
  onSubmit: (text: string) => void,
  onFocus?: () => void,
}

@observer
class MessageInput extends Component {
  @observable text = '';

  props: PropsType;
  inputRef: ?HTMLElement;

  componentDidUpdate() {
    if (this.inputRef) {
      this.inputRef.focus();
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

  handleFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  handleEmojiSelect = (emoji: string) => {
    this.text += emoji;
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
            ref={ref => { this.inputRef = ref; }}
            onFocus={this.handleFocus}
            onChange={this.handleMessageChange}
            onKeyPress={this.handleKeyPress}
            value={this.text}
            placeholder="Type your message..."
          />
        </div>
        <div className="message-input__controls">
          <MessageControls
            onEmojiSelect={this.handleEmojiSelect}
          />
        </div>
      </div>
    );
  }
}

export default MessageInput;
