// @flow

import { observable, action } from 'mobx';

import { getMessages, getPerson, getMatch } from '../utils/database.v2';
import Message from '../models/Message';
import Person from '../models/Person';

import type { PersonModelType } from '../models/Person';

class MessageStore {
  matchId: ?string;

  @observable interlocutor: PersonModelType = {};
  @observable messages: Array<Message> = [];

  constructor(matchId: ?string) {
    this.matchId = matchId;
  }

  @action fetch(matchId: string) {
    this.messages = [];

    const messages = getMessages(matchId);
    const match = getMatch(matchId);

    this.interlocutor = new Person(this, getPerson(match.person_id));

    messages.forEach(action(message => this.create(message)));
  }

  @action create(data: Message) {
    const message: Message = new Message(this, data);

    this.messages.push(message);
  }
}

export default MessageStore;
