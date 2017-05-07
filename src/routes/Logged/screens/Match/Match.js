// @flow

import './Match.scss';

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';

import MessageStore from 'stores/MessageStore';
import { MatchStore } from 'stores/MatchStore';

import { CurrentUser } from 'models/CurrentUser';
import Match from 'models/Match';
import { removeMatch } from 'utils/database.v2';

import MessageList from 'components/conversation/MessageList';
import MessageInput from 'components/conversation/MessageInput';
import Gallery from 'components/Gallery';

type PropsTypes = {
  currentUser: CurrentUser,
  match: Object,
  history: Object,
  matchStore: MatchStore,
}

@inject('currentUser', 'matchStore')
@observer
class MatchComponent extends Component {
  props: PropsTypes;
  personWrapperRef: HTMLElement;
  messageStore: MessageStore = new MessageStore(null);

  @observable match: ?Match;

  componentDidMount() {
    const { match: { params } } = this.props;
    this.fetchMessages(params.id);
    ReactTooltip.rebuild();
  }

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchMessages(nextProps.match.params.id);
    }
  }

  fetchMessages(matchId: string) {
    this.match = this.props.matchStore.find(matchId);

    this.messageStore = new MessageStore(null);
    this.messageStore.fetch(matchId);

    if (this.match) {
      this.match.setMessageStore(this.messageStore);

      this.setAsRead();
    }
  }

  setAsRead = () => {
    if (this.match && this.match.is_new) {
      this.match.setAsRead();
    }
  }

  handleMessageSubmit = (text: string) => {
    const { match: { params }, currentUser } = this.props;
    this.messageStore.submit(text, params.id, currentUser._id);
  }

  handleUnmatch = () => {
    if (this.match && confirm('Are you sure?')) {
      this.match.unmatch();
    }
  }

  handleRemove = () => {
    if (this.match) {
      const { history, matchStore } = this.props;

      removeMatch(this.match._id);

      matchStore.remove(this.match);
      history.replace('/matches');
    }
  }

  renderPerson() {
    const match = this.match;

    if (match) {
      const getWidth = this.personWrapperRef.getBoundingClientRect().width;
      const { person } = match;

      return (
        <div className="match__person-wrapper">
          <Gallery width={getWidth - 20} images={person.photos} />
          <div className="match__person-details">
            <Link to={{
              pathname: `/user/${person._id}`,
              state: {
                modal: true,
                person: person.toJSON,
              },
            }}
            >
              <h1>{person.name}, {person.age}</h1>
            </Link>
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
    const match = this.match;
    const isBlocked = match && match.is_blocked;

    return (
      <div className="match">
        <div className="match__messages">
          <div className="match__options">
            <div className="match__option">
              <i className="fa fa-star" />
            </div>
            {!isBlocked && <div
              className={cx('match__option')}
              onClick={this.handleUnmatch}
              data-tip="Unmatch"
              data-for="main"
            >
              <i className="fa fa-ban" />
            </div>}

            {isBlocked && <div
              className={cx('match__option', 'match__option--active')}
              onClick={this.handleRemove}
              data-tip="Remove"
              data-for="main"
            >
              <i className="fa fa-trash" />
            </div>}
          </div>
          <div className="match__content">
            <div className="match__message-list">
              <Scrollbars>
                <MessageList messageStore={this.messageStore} />
              </Scrollbars>
            </div>
            {!isBlocked && <div className="match__new-message">
              <MessageInput
                onFocus={this.setAsRead}
                onSubmit={this.handleMessageSubmit}
              />
            </div>}
          </div>
        </div>
        <div className="match__person" ref={ref => this.personWrapperRef = ref}>
          <Scrollbars>
            {this.renderPerson()}
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default MatchComponent;
