// @flow

import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import each from 'lodash/each';
import map from 'lodash/map';
import axios from 'axios';

import './MessageGif.scss';

const fetchGipy = query => axios.get(`http://api.giphy.com/v1/gifs/search?q=${encodeURI(query)}&api_key=dc6zaTOxFJmzC`);

type PropsType = {
  onSelect: (body: string, data: Object) => void,
  onToggle: (state: boolean) => void,
}

@observer
class MessageGif extends Component {
  componentDidMount() {
    if (this.inputRef) {
      this.inputRef.focus();
    }

    document.addEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (e: any) => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.props.onToggle(false);
    }
  }

  props: PropsType;
  inputRef: ?any;
  wrapperRef: ?any;

  @observable text: string = '';
  @observable gifs: Array<Object> = [];

  handleChange = (e: SyntheticInputEvent) => {
    this.text = e.target.value;
  }

  handleKeydown = async (e: SyntheticInputEvent) => {
    if (e.keyCode === 13) {
      const { data } = await fetchGipy(this.text);
      this.gifs = [];

      each(data.data, action((gif) => {
        this.gifs.push({
          id: gif.id,
          url: gif.images.downsized.url,
          fixedHeight: gif.images.fixed_height,
        });
      }));
    }
  }

  handleSelect = (gif: Object) => {
    const url = `${gif.fixedHeight.url}?width=${gif.fixedHeight.width}&height=${gif.fixedHeight.height}`;

    this.props.onSelect(url, {
      type: 'GIF',
      gif_id: gif.id,
    });

    this.props.onToggle(false);
  }

  render() {
    return (
      <div
        className={cx('message-gif')}
        ref={(ref) => { this.wrapperRef = ref; }}
      >
        <div className="message-gif__input">
          <input
            ref={(ref) => { this.inputRef = ref; }}
            onChange={this.handleChange}
            onKeyDown={this.handleKeydown}
            placeholder="Search here"
            className="pt-input pt-intent-primary"
          />
        </div>
        <div className="message-gif__list">
          {map(this.gifs, gif => (
            <div key={gif.id} className="message-gif__list-item" onClick={() => this.handleSelect(gif)}>
              <img alt="gif" src={gif.url} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MessageGif;
