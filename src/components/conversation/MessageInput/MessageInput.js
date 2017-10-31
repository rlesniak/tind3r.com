// @flow

import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';

import LS from 'utils/localStorage';

import MessageEmoji from '../MessageEmoji';
import MessageGif from '../MessageGif';

import './MessageInput.scss';


type PropsType = {
  onSubmit: (text: string) => void,
  onFocus?: () => void,
  handleMessageSubmit: (body: string, payload: Object) => void,
  personName: ?string,
}

@observer
class MessageInput extends Component {
  componentDidUpdate() {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }

  @observable text = '';
  @observable isGifOpen: boolean = false;
  @observable isEmojiOpen: boolean = false;

  props: PropsType;
  inputRef: ?HTMLElement;

  handleMessageChange = ({ target }: SyntheticInputEvent) => {
    this.text = target.value;
  }

  handleKeyPress = (e: Event) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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

    ReactGA.event({
      category: 'Message',
      action: 'Select EMOJI',
    });
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

    ReactGA.event({
      category: 'Message',
      action: 'Submit GIF',
    });
  }

  handleTemplateChange = ({ target: { value } }: SyntheticInputEvent) => {
    if (value === '-1') return;

    this.text = value;

    if (this.inputRef) {
      this.inputRef.focus();
    }

    if (window.hj) window.hj('tagRecording', ['Template', 'Send']);

    ReactGA.event({
      category: 'Message',
      action: 'Template use',
    });
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
                ref={(ref) => { this.inputRef = ref; }}
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
          <div className="message-input__controls-item message-input__controls-item-select">
            <div className="pt-select pt-minimal">
              <select value="-1" onChange={this.handleTemplateChange}>
                <option value="-1">Select a message template...</option>
                {LS.templates.map((tmpl, i) => {
                  const replaced = tmpl.replace('{{name}}', this.props.personName || '');
                  return <option key={i} value={replaced}>{replaced.substr(0, 30)}</option>;
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageInput;
