// @flow

import './Match.scss';

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import MessageStore from 'stores/MessageStore';
import { MatchStore } from 'stores/MatchStore';

import { CurrentUser } from 'models/CurrentUser';
import Match from 'models/Match';

import MessageList from 'Components/conversation/MessageList';
import MessageInput from 'Components/conversation/MessageInput';

type PropsTypes = {
  currentUser: CurrentUser,
  match: Object,
  matchStore: MatchStore,
}

@inject('currentUser')
@observer
class MatchComponent extends Component {
  props: PropsTypes;
  match: ?Match;

  messageStore: MessageStore = new MessageStore(null);

  componentDidMount() {
    const { match: { params }} = this.props;
    this.fetchMessages(params.id)
  }

  componentWillReceiveProps(nextProps: Object) {
    this.fetchMessages(nextProps.match.params.id)
  }

  fetchMessages(matchId: string) {
    this.match = this.props.matchStore.find(matchId);

    if (this.match) {
      this.match.setMessageStore(this.messageStore);
      this.setAsRead();
    }

    this.messageStore.fetch(matchId);
  }

  setAsRead = () => {
    if (this.match && this.match.is_new) {
      this.match.setAsRead();
    }
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
            onFocus={this.setAsRead}
            onSubmit={this.handleMessageSubmit}
          />
        </div>
      </div>
    );
  }
}

export default MatchComponent;
