import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import ReactGA from 'react-ga'
import _ from 'lodash'
import { Link } from 'react-router'
import Select from 'react-basic-dropdown'
import cx from 'classnames'
import { observer } from 'mobx-react'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import Spinner from '../Spinner'
import styles from './gif-input.scss'
import Data from '../../data'
import giphy from '../../giphy'

@observer
@CSSModules(styles)
export default class GifInput extends Component {
  @observable isTryingToSend = false
  @observable messageTxt = ''
  @observable gifs = []
  @observable gifsWidth = 0

  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.inputRef) {
      this.inputRef.focus()
    }
  }

  processSubmit(msg) {
    const { messageStore } = this.props
    messageStore.create(msg)
    this.messageTxt = ''
  }

  @autobind
  onKeydown(e) {
    if (e.keyCode === 13) {
      giphy.fetch(this.messageTxt).then(resp => {
        const { data } = resp.data

        this.gifs = _.map(data, g => ({
          id: g.id,
          url: g.images.downsized.url,
          fixedHeight: g.images.fixed_height,
        }))

        this.gifsWidth = data.length * 150
      })
    }

    if (e.keyCode === 27) {
      this.props.onClose()
    }
  }

  @autobind
  handleSubmit(gif) {
    const url = `${gif.fixedHeight.url}?width=${gif.fixedHeight.width}&height=${gif.fixedHeight.height}`

    this.props.onSubmit(url, {
      type: 'GIF',
      gif_id: gif.id,
    })
  }

  @autobind
  handleMessageChange(e) {
    this.messageTxt = e.target.value
  }

  @autobind
  close() {
    this.props.onClose()
  }

  render() {
    const { user, match } = this.props

    const sendStyle = cx({
      disabled: _.trim(this.messageTxt).length === 0
    })

    const inputWrapperStyle = cx({
      trying: this.isTryingToSend && this.sendDelaySec > 0,
    })

    const options = [
      { label: '0s', value: '0', },
      { label: '1s', value: '1' },
      { label: '2s', value: '2' },
      { label: '3s', value: '3' },
    ]

    return (
      <div styleName="gif-wrapper" className={inputWrapperStyle}>
        <input
          autoFocus
          type="text"
          ref={ref => { this.inputRef = ref }}
          onChange={this.handleMessageChange}
          onKeyDown={this.onKeydown}
          value={this.messageTxt}
          placeholder="Search..."
          disabled={this.isTryingToSend}
        />
        <button onClick={this.close}>Close</button>
        <div styleName="gifs">
          <div styleName="main-wrapper" style={{width: this.gifsWidth}}>
            {_.map(this.gifs, gif => {
              const submit = this.handleSubmit.bind(this, gif)
              return <div styleName="gif" key={gif.id} onClick={submit}><img src={gif.url} /></div>
            })}
          </div>
        </div>
      </div>
    );
  }
}
