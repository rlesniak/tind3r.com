// @flow

import 'emoji-mart/css/emoji-mart.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { Picker } from 'emoji-mart';

import './MessageEmoji.scss';

type PropsType = {
  onEmojiSelect: (emoji: string) => void,
  onClose: () => void,
}

@observer
class MessageEmoji extends Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (e: any) => {
    const picker = ReactDOM.findDOMNode(this.pickerRef); // eslint-disable-line

    if (picker && !picker.contains(e.target)) {
      this.closeEmoji();
    }
  }

  props: PropsType;
  pickerRef: ?HTMLElement;

  closeEmoji() {
    this.props.onClose();
  }

  emojiSelected = (emoji: Object) => {
    this.props.onEmojiSelect(emoji.native);
    this.props.onClose();
  }

  render() {
    return (
      <div className={cx('message-emoji')}>
        <div className="message-emoji__emots">
          <Picker
            emojiSize={24}
            perLine={9}
            skin={1}
            set="google"
            title="Pick your Emoji!"
            style={{ position: 'absolute', bottom: '4px' }}
            onClick={this.emojiSelected}
            ref={(ref) => { this.pickerRef = ref; }}
          />
        </div>
      </div>
    );
  }
}

export default MessageEmoji;
