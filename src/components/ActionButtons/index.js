import React, { Component } from 'react';
import autobind from 'autobind-decorator'
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import styles from './styles.scss'

@CSSModules(styles)
export default class ActionButtons extends Component {
  constructor(props) {
    super(props)

    this.state = {
      liked: false,
    }
  }

  @autobind
  handleLike() {
    this.setState({
      liked: true,
    })
  }

  render() {
    return (
      <div styleName="buttons">
        {!this.state.liked &&
        <div>
          <i className="fa fa-thumbs-o-down" />
        </div>}
        {!this.state.liked &&
        <div>
          <i className="fa fa-star" />
        </div>}
        <div onClick={this.handleLike}>
          <i className="fa fa-heart" />
        </div>
      </div>
    );
  }
}
