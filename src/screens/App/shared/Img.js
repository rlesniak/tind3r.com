import React, { Component } from 'react'
import './Img.scss'

export default class Img extends Component {
  constructor(props) {
    super(props)
    this.state = {
      failed: false,
    }

    this.fallback = this.fallback.bind(this)
  }

  fallback() {
    this.setState({ failed: true })
  }

  render() {
    const { style, src } = this.props

    if (this.state.failed) {
      return (
        <div
          className="image-fallback"
          style={{ width: style.width, height: style.width, lineHeight: `${style.width}px` }}
        >
          Image broken :(
        </div>
      )
    }

    return <img src={src} onError={this.fallback} {...this.props} />
  }
}
