import './Logged.scss';

import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import NavBar from 'Components/NavBar';

import NotFound from '../NotFound';
import Matches from '../Matches';
import Home from './screens/Home';

import RecsStore from 'stores/RecsStore';

@observer
class Welcome extends Component {
  constructor(props) {
    super(props);

    this.recsStore = new RecsStore();
  }

  componentDidMount() {
    this.recsStore.fetchCore();
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="logged">
          <Switch>
            <Route exact path="/" render={() => <Home recsStore={this.recsStore} />} />
            <Route exact path="/home" render={() => <Home recsStore={this.recsStore} />} />
            <Route path="/matches" component={Matches} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Welcome;
