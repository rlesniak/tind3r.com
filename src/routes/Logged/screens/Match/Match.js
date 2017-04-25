// @flow

import './Match.scss';

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';

import MessageStore from 'stores/MessageStore';
import { MatchStore } from 'stores/MatchStore';

import { CurrentUser } from 'models/CurrentUser';
import Match from 'models/Match';

import MessageList from 'components/conversation/MessageList';
import MessageInput from 'components/conversation/MessageInput';
import Gallery from 'components/Gallery';

type PropsTypes = {
  currentUser: CurrentUser,
  match: Object,
  matchStore: MatchStore,
}

@inject('currentUser')
@observer
class MatchComponent extends Component {
  props: PropsTypes;
  personWrapperRef: HTMLElement;
  messageStore: MessageStore = new MessageStore(null);

  @observable match: ?Match;

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

  renderPerson() {
    if (this.match) {
      const getWidth = this.personWrapperRef.getBoundingClientRect().width;
      const { person } = this.match;

      return (
        <div>
          <Gallery width={getWidth - 20} images={person.photos} />
          <div className="match__person-details">
            <h1>{person.name}, {person.age}</h1>
            {person.distanceKm && <div className="match__person-distance">
              {person.distanceKm}
            </div>}
            <div className="match__person-bio">
              {person.bio}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="match">
        <div className="match__messages">
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
        <div className="match__person" ref={ref => this.personWrapperRef = ref}>
          {this.renderPerson()}
        </div>
      </div>
    );
  }
}

export default MatchComponent;
