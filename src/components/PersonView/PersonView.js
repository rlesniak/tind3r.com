// @flow

import React, { Component } from 'react';
import { reaction, observable } from 'mobx';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { observer, inject } from 'mobx-react';
import ReactTooltip from 'react-tooltip';

import Gallery from 'components/Gallery';
import ActionButtons from 'components/ActionButtons';
import Bio from 'components/Bio';

import Person from 'models/Person';
import recsStore from 'stores/RecsStore';

import withLikeCounter from 'hoc/withLikeCounter';

import { fbUserSearchUrlBySchool, fbUserSearchUrlByInterests } from 'utils';
import { getMatchByPerson, getActions } from 'utils/database.v2';

import type { ActionsType } from 'types/person';
import type { MatchType } from 'types/match';
import type { WithLikeCounterPropsType } from 'hoc/withLikeCounter';

import './PersonView.scss';

type PropsType = WithLikeCounterPropsType & {
  personId: ?string,
  onActionClick?: () => void,
  person: Person,
  withoutFetch: boolean,
};

@inject('currentUser')
@withLikeCounter
@observer
class PersonView extends Component {
  constructor(props: PropsType) {
    super(props);
    const json = this.props.person || { _id: this.props.personId };

    this.match = getMatchByPerson(json._id);
    this.person = new Person({}, json);

    this.reactionDispose = reaction(
      () => this.person.is_loading,
      (state) => {
        if (this.props.person && state === false) {
          this.forceUpdate();
        }
      },
    );
  }

  componentDidMount() {
    this.checkAction();

    if (this.props.withoutFetch) return;

    this.person.fetch();

    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentWillUnmount() {
    this.reactionDispose();
  }

  props: PropsType;

  match: MatchType;
  person: Person;
  reactionDispose: () => void = n => n;

  @observable activeAction: ?ActionsType;

  handleActionClick = (type: ActionsType) => {
    const { onActionClick, handleSuperlike, handleError } = this.props;

    const pero = recsStore.persons.find(person => person._id === this.person._id);
    const person = pero || this.person;

    this.activeAction = type;

    if (person) {
      person.callAction(type, handleSuperlike, n => n, handleError);
    }

    if (onActionClick) {
      onActionClick();
    }
  };

  checkAction() {
    const { match } = this;

    if (match) {
      this.activeAction = match.is_super_like ? 'superlike' : (!match.is_super_like ? 'like' : null); // eslint-disable-line
    }

    if (!this.activeAction) {
      this.activeAction = get(getActions(this.person._id), '0.action_type', null);
    }
  }

  renderSchools() {
    if (this.person.schools && this.person.schools.length) {
      return (
        <ul>
          {this.person.schools.map(school => (
            <li key={school.id}>
              <a
                href={fbUserSearchUrlBySchool(school.id, this.person.name)}
                target="_blank"
                rel="noreferrer noopener"
                data-tip="Do Facebook search based on school and name. <br />
                Tinder user has to have at least one Facebook photo <br />
                so you can compare and find right person."
                data-for="main"
                data-offset="{'top': -10, 'left': -12}"
                className="person-view__fb-search"
              >
                <i className="fa fa-eye" />
              </a>
              {school.name}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  }

  renderJobs() {
    if (this.person.jobs && this.person.jobs.length) {
      return (
        <ul>
          {this.person.jobs.map(j => <li key={uniqueId()}>{get(j, 'company.name', null)}</li>)}
        </ul>
      );
    }

    return null;
  }

  renderConnections() {
    if (this.person.common_connections && this.person.common_connections.length) {
      return (
        <ul className="person-view__connections">
          <li className="person-view__connections-header">Common connections:</li>
          {this.person.common_connections.map(c => <li key={c.id}>{c.name}</li>)}
        </ul>
      );
    }

    return null;
  }

  renderInterests() {
    if (this.person.common_interests && this.person.common_interests.length) {
      return (
        <ul className="person-view__connections">
          <li className="person-view__connections-header">Common interests:</li>
          {this.person.common_interests.map(c => (
            <li key={c.id}>
              <a
                href={fbUserSearchUrlByInterests(c.id, this.person.name)}
                target="_blank"
                rel="noreferrer noopener"
                data-tip="Do Facebook search based on interest and name. <br />
                Tinder user has to have at least one Facebook photo <br />
                so you can compare and find right person."
                data-for="main"
              >
                {c.name}
              </a>
            </li>))}
          <li key="ALL">
            <a
              href={fbUserSearchUrlByInterests(this.person.common_interests.map(c => c.id), this.person.name)}
              target="_blank"
              rel="noreferrer noopener"
              data-tip="Do Facebook search based on all interests and name. <br />
                Tinder user has to have at least one Facebook photo <br />
                so you can compare and find right person."
              data-for="main"
            >
                ALL
              </a>
          </li>
        </ul>
      );
    }

    return null;
  }

  render() {
    const { person } = this;
    const width = 500;

    const { currentUser, superlikeResetRemaining, likeResetRemaining } = this.props;

    const instagramPhotos = (person.instagram && person.instagram.photos) || [];
    const photos = person.photos.concat(instagramPhotos.map(photo => ({ id: photo.ts, url: photo.image })));

    return (
      <div className="person-view">
        <div className="person-view__left">
          <div className="person-view__info">
            <div className="person-view__name">{person.name}, {person.age}</div>
            <div className="person-view__distance">{person.distanceKm}</div>
            <div className="person-view__lists">
              {this.renderSchools()}
              {this.renderJobs()}
            </div>
            <div className="person-view__bio">
              <Bio text={person.bio} />
            </div>

            {person.instagramUsername &&
              <div className="person-view__insta">
                <a href={person.instagramProfileLink} target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-instagram" />
                  <span>{person.instagramUsername}</span>
                </a>
              </div>}

            {this.renderConnections()}
            {this.renderInterests()}
          </div>
          <div className="person-view__buttons">
            {person._id !== currentUser._id &&
              <ActionButtons
                superLikeResetsAt={superlikeResetRemaining}
                superlikeRemaining={currentUser.superlike_remaining}
                superlikeDisabled={currentUser.superlike_remaining === 0}
                likeResetsAt={likeResetRemaining}
                likeDisabled={!!likeResetRemaining}
                onButtonClick={this.handleActionClick}
                hideTimer={false}
                size="large"
                activeAction={this.activeAction}
              />}
          </div>
        </div>
        <div className="person-view__gallery" style={{ width: `${width}px` }}>
          <Gallery delay={200} scrolling={false} images={photos} width={width} withArrowNav lazyLoad={false} />
        </div>
      </div>
    );
  }
}

export default PersonView;
