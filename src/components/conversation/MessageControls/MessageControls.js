// @flow

import './MessageControls.scss';
import 'emoji-mart/css/emoji-mart.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { Picker } from 'emoji-mart';


type PropsType = {
  onEmojiSelect: (emoji: string) => void,
}
@observer
class MessageControls extends Component {
  props: PropsType;
  pickerRef: ?HTMLElement;

  @observable isEmojiOpened: boolean = false;

  onMouseDown = (e: any) => {
    const picker = ReactDOM.findDOMNode(this.pickerRef); // eslint-disable-line

    if (picker && !picker.contains(e.target)) {
      this.closeEmoji();
    }
  }

  openEmoji() {
    document.addEventListener('mousedown', this.onMouseDown);
    this.isEmojiOpened = true;
  }

  closeEmoji() {
    document.removeEventListener('mousedown', this.onMouseDown);
    this.isEmojiOpened = false;
  }

  toggleEmoji = () => {
    this.isEmojiOpened ? this.closeEmoji() : this.openEmoji();
  }

  emojiSelected = (emoji: Object) => {
    this.props.onEmojiSelect(emoji.native);
    this.closeEmoji();
  }

  render() {
    return (
      <div className={cx('message-controls')}>
        <div className="message-controls__item">
          {this.isEmojiOpened && <div className="message-controls__emots">
            <Picker
              emojiSize={24}
              perLine={9}
              skin={1}
              set="google"
              title="Pick your Emoji!"
              style={{ position: 'absolute', bottom: '4px' }}
              onClick={this.emojiSelected}
              ref={ref => { this.pickerRef = ref; }}
            />
          </div>}
          <i className="fa fa-smile-o" onClick={this.toggleEmoji} />
        </div>
      </div>
    );
  }
}

export default MessageControls;
