// @flow

import React, { Component } from 'react';
import { Button, Classes } from '@blueprintjs/core';
import DocumentTitle from 'react-document-title';

import Login from 'components/Login';

import './Welcome.scss';

type PropsType = {
  isInstalled: boolean,
  isOutdated: boolean,
  handleConnect: () => void,
}

export default class Welcome extends Component {
  state = {
    isButtonVisible: true,
  }
  props: PropsType;

  handleInstall = () => {
    this.setState({ isButtonVisible: false });

    window.open('/assets/tind3r.zip');
  }

  renderButton() {
    const isChrome = window.chrome;

    if (isChrome) {
      if (this.props.isInstalled) {
        if (this.props.isOutdated) {

          return (
            <div>
              <h3 className={Classes.HEADING}>...but you need update firstly, click below to get latest version od Chrome Extension</h3>
              <Button onClick={this.handleInstall}>Get .crx file</Button>

              <div className="welcome__update-explanation">
                Note: after download complete, extract zip file, go to url: <i>chrome://extensions/</i>, then toggle on developer mode
                and just Drag&Drop .crx file. <br/><br/> After that reload the page!
              </div>
            </div>
          );
        }
        return (
          <Login onClick={this.props.handleConnect} />
        );
      }

      if (this.state.isButtonVisible) {
        return (
          <Button
            onClick={this.handleInstall}
            text="Get the extension file"
          />
        );
      }

      return (
        <div className="welcome__update-explanation">
          Note: after download complete, extract zip file, go to url: <i>chrome://extensions/</i>, then toggle on developer mode
          and click "Load unpacked" at the top left and seleft unziped folder. <br/><br/> After that reload the page!
        </div>
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
