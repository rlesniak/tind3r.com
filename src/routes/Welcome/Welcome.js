import './Welcome.scss';

import React, { Component } from 'react';

export default class Welcome extends Component {
  handleInstall = () => {
    chrome.webstore.install('https://chrome.google.com/webstore/detail/olicollicgbjgnialpnmnolopimdccon', () => {
      location.reload();
    });
  }

  render() {
    const isChrome = window.chrome && window.chrome.webstore;

    return (
      <div className="welcome">
        <h1>"Completely new experience" - tind3r.com</h1>

        <div className="welcome__sneak-peek">
          <img src="/assets/img/img1.png" />
        </div>

        <h2>
          {isChrome && <button onClick={this.handleInstall}>Install extension!</button>}
          {!isChrome && <span>Only on Google Chrome</span>}
        </h2>
      </div>
    );
  }
}
