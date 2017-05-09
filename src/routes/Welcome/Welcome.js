import './Welcome.scss';

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';

export default class Welcome extends Component {
  render() {
    return (
      <div className="welcome">
        <h1>"Completely new experience"</h1>

        <div className="welcome__sneak-peek">
          <img src="/assets/img/img1.png" />
        </div>

        <h2>
          <a href="/assets/tind3r-chrome.crx" target="_blank">Get the extension!</a>
        </h2>

        <div className="welcome__gif"><iframe src='https://gfycat.com/ifr/RealisticTornAddax' frameborder='0' scrolling='no' width='100%' height='100%' style={{position:'absolute',top:0,left:0}} allowfullscreen></iframe></div>
      </div>
    );
  }
}
