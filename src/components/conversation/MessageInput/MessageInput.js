// @flow

import './MessageInput.scss';

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';

import MessageEmoji from '../MessageEmoji';
import MessageGif from '../MessageGif';

type PropsType = {
  onSubmit: (text: string) => void,
  onFocus?: () => void,
  handleMessageSubmit: (body: string, payload: Object) => void,
}

@observer
class MessageInput extends Component {
  @observable text = '';
  @observable isGifOpen: boolean = false;
  @observable isEmojiOpen: boolean = false;

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

  handleGifToggle = () => {
    this.isGifOpen = !this.isGifOpen;
  }

  handleEmojiToggle = () => {
    this.isEmojiOpen = !this.isEmojiOpen;
  }

  handleEmojiClose = () => {
    this.isEmojiOpen = false;
  }

  handleGifSubmit = (body: string, payload: Object) => {
    this.props.onSubmit(body, payload);
  }

  render() {
    return (
      <div
        className={cx('message-input')}
      >
        <div className="message-input__input">
          {this.isGifOpen ?
            <MessageGif onToggle={this.handleGifToggle} onSelect={this.handleGifSubmit} /> : (
            <textarea
              autoFocus
              type="text"
              ref={ref => { this.inputRef = ref; }}
              onFocus={this.handleFocus}
              onChange={this.handleMessageChange}
              onKeyPress={this.handleKeyPress}
              value={this.text}
              placeholder="Type your message or select a GIF"
            />
          )}
        </div>
        <div className="message-input__controls">
          {this.isEmojiOpen && <MessageEmoji
            onEmojiSelect={this.handleEmojiSelect}
            onClose={this.handleEmojiClose}
          />}
          <div className="message-input__controls-item">
            <i className="fa fa-smile-o" onClick={this.handleEmojiToggle} />
          </div>
          <div className="message-input__controls-item">
            <i className="fa fa-film" onClick={this.handleGifToggle} />
          </div>
        </div>
      </div>
    );
  }
}

export default MessageInput;
