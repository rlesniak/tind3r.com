// @flow

import './Match.scss';

import React, { Component } from 'react';
import { observer } from 'mobx-react';

import MessageStore from 'stores/MessageStore';

import MessageList from 'Components/conversation/MessageList';

type PropsTypes = {
  handleMatchClick: (matchId: string) => void,
};

@observer
class Match extends Component {
  messageStore: MessageStore = new MessageStore(null);

  componentDidMount() {
    const { match: { params }} = this.props;
    this.fetchMessages(params.id)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchMessages(nextProps.match.params.id)
  }

  fetchMessages(matchId: string) {
    this.messageStore.fetch(matchId);
  }

  render() {
    return (
      <div className="match">
        <MessageList messageStore={this.messageStore} />
      </div>
    );
  }
}

export default Match;
