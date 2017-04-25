// @flow

import './Match.scss';

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import MessageStore from 'stores/MessageStore';
import { MatchStore } from 'stores/MatchStore';

import { CurrentUser } from 'models/CurrentUser';

import MessageList from 'Components/conversation/MessageList';
import MessageInput from 'Components/conversation/MessageInput';

type PropsTypes = {
  currentUser: CurrentUser,
  match: Object,
  matchStore: MatchStore,
}

@inject('currentUser')
@observer
class Match extends Component {
  props: PropsTypes;

  messageStore: MessageStore = new MessageStore(null);

  componentDidMount() {
    const { match: { params }} = this.props;
    this.fetchMessages(params.id)
  }

  componentWillReceiveProps(nextProps: Object) {
    this.fetchMessages(nextProps.match.params.id)
  }

  fetchMessages(matchId: string) {
    const match = this.props.matchStore.find(matchId);

    if (match) {
      match.setMessageStore(this.messageStore);
    }

    this.messageStore.fetch(matchId);
  }

  handleMessageSubmit = (text: string) => {
    const { match: { params }, currentUser} = this.props;
    this.messageStore.submit(text, params.id, currentUser._id);
  }

  render() {
    return (
      <div className="match">
        <div className="match__message-list">
          <MessageList messageStore={this.messageStore} />
        </div>
        <div className="match__new-message">
          <MessageInput
            onSubmit={this.handleMessageSubmit}
          />
        </div>
      </div>
    );
  }
}

export default Match;
