// @flow

import React, { Component } from 'react';
import { Button, Classes } from '@blueprintjs/core';
import DocumentTitle from 'react-document-title';

import Login from 'components/Login';

import './Welcome.scss';

type PropsType = {
  isInstalled: boolean,
  handleConnect: () => void,
}

export default class Welcome extends Component {
  state = {
    isButtonVisible: true,
  }
  props: PropsType;

  handleInstall = () => {
    this.setState({ isButtonVisible: false });

    window.chrome.webstore.install('https://chrome.google.com/webstore/detail/olicollicgbjgnialpnmnolopimdccon', () => {
      location.reload();
    }, () => {
      this.setState({ isButtonVisible: true });
    });
  }

  renderButton() {
    const isChrome = window.chrome && window.chrome.webstore;

    if (isChrome) {
      if (this.props.isInstalled) {
        return (
          <Login onClick={this.props.handleConnect} />
        );
      }

      if (this.state.isButtonVisible) {
        return (
          <Button
            onClick={this.handleInstall}
            className={Classes.LARGE}
            text="Get the extension"
          />
        );
      }

      return (
        <Button
          disabled
          className={Classes.LARGE}
          text="Installing..."
        />
      );
    }

    return (
      <span className="welcome__chrome">
        Only on Google Chrome <img alt="Chrome" src="/assets/img/chrome.png" />
      </span>
    );
  }

  render() {
    return (
      <DocumentTitle title="Tind3r.com - Unofficial Tinder client">
        <div className="welcome">
          <div className="welcome__left">
            <div className="welcome__name">
              tind<b>3</b>r.com
              <div className="welcome__slogan">unofficial Tinder web client</div>
            </div>
            <div className="welcome__image" />
          </div>
          <div className="welcome__right">
            <div className="welcome__info">
              <div className="welcome__cell">
                <h1>Great things <br /> are coming</h1>

                {this.renderButton()}
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
